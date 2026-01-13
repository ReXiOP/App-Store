"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// --- App Actions ---

export async function getApps(limit = 50, categoryId?: string, search?: string, sort = "newest") {
    try {
        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { tagline: { contains: search } }
            ];
        }

        let orderBy: any = { createdAt: "desc" };
        if (sort === "popular") {
            orderBy = { downloads: "desc" };
        } else if (sort === "oldest") {
            orderBy = { createdAt: "asc" };
        }

        const apps = await (db.app as any).findMany({
            where,
            orderBy,
            take: sort === "top-rated" ? undefined : limit, // Fetch all if sorting by rating in JS
            include: {
                category: true,
                reviews: { select: { rating: true } }
            }
        });

        let result = apps.map((app: any) => {
            const ratings = app.reviews.map((r: any) => r.rating);
            const avgRating = ratings.length > 0
                ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
                : 4.5;
            return { ...app, rating: avgRating };
        });

        if (sort === "top-rated") {
            result.sort((a: any, b: any) => b.rating - a.rating);
            result = result.slice(0, limit);
        }

        return result;
    } catch (error) {
        console.error("Failed to fetch apps:", error);
        return [];
    }
}

export async function getCategories() {
    try {
        return await (db as any).category.findMany({
            orderBy: { name: "asc" }
        });
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export async function getNewArrivals() {
    try {
        const apps = await (db.app as any).findMany({
            take: 6,
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                reviews: { select: { rating: true } }
            }
        });

        return apps.map((app: any) => {
            const ratings = app.reviews.map((r: any) => r.rating);
            const avgRating = ratings.length > 0
                ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
                : 4.5;
            return { ...app, rating: avgRating };
        });
    } catch (error) { return []; }
}

export async function getEditorsChoice() {
    try {
        // In reality this would be a manual selection or 'isFeatured' flag
        // For now, take random or specific ones
        const apps = await (db.app as any).findMany({
            take: 4,
            orderBy: { name: "asc" }, // Just a different sort to mix it up
            include: {
                category: true,
                reviews: { select: { rating: true } }
            }
        });

        return apps.map((app: any) => {
            const ratings = app.reviews.map((r: any) => r.rating);
            const avgRating = ratings.length > 0
                ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
                : 4.5;
            return { ...app, rating: avgRating };
        });
    } catch (error) { return []; }
}

export async function getFeaturedApps() {
    try {
        // In a real scenario, you might have a 'isFeatured' flag
        const apps = await (db.app as any).findMany({
            take: 4,
            orderBy: { downloads: "desc" },
            include: {
                category: true,
                reviews: { select: { rating: true } }
            }
        });

        return apps.map((app: any) => {
            const ratings = app.reviews.map((r: any) => r.rating);
            const avgRating = ratings.length > 0
                ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
                : 4.5;
            return { ...app, rating: avgRating };
        });
    } catch (error) {
        return [];
    }
}

export async function getApp(id: string) {
    try {
        const app = await (db.app as any).findUnique({
            where: { id },
            // Explicitly select fields if prisma client is out of sync
            include: {
                category: true,
                reviews: {
                    include: { user: true },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            },
        });

        // Final fallback: If app exists but size is missing, it might be due to Prisma client cache/sync
        if (app && !app.size) {
            const rawApp = await (db as any).$queryRaw`SELECT size FROM App WHERE id = ${id} LIMIT 1`;
            if (rawApp && rawApp[0]) {
                app.size = rawApp[0].size;
            }
        }

        return app;
    } catch (error) {
        console.error("Failed to fetch app:", error);
        return null;
    }
}

export async function getRelatedApps(categoryId: string, excludeAppId: string, limit = 6) {
    try {
        if (!categoryId) return [];
        const apps = await (db.app as any).findMany({
            where: {
                categoryId,
                NOT: { id: excludeAppId }
            },
            take: limit,
            include: {
                category: true,
                reviews: { select: { rating: true } }
            }
        });

        return apps.map((app: any) => {
            const ratings = app.reviews.map((r: any) => r.rating);
            const avgRating = ratings.length > 0
                ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
                : 4.5;
            return { ...app, rating: avgRating };
        });
    } catch (error) {
        return [];
    }
}

export async function incrementDownloadCount(id: string) {
    try {
        await (db.app as any).update({
            where: { id },
            data: { downloads: { increment: 1 } }
        });
        revalidatePath(`/apps/${id}`);
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to increment downloads:", error);
        return { success: false };
    }
}

import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${randomUUID()}-${file.name}`;
    const path = join(process.cwd(), "public/uploads", filename);
    await writeFile(path, buffer);
    return `/uploads/${filename}`;
}

export async function createApp(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const tagline = formData.get("tagline") as string;
        const description = formData.get("description") as string;
        const categoryId = formData.get("categoryId") as string;
        const version = formData.get("version") as string;

        // File uploads
        const iconFile = formData.get("iconFile") as File;
        const apkFile = formData.get("apkFile") as File;
        const screenshotFiles = formData.getAll("screenshotFiles") as File[];

        // Basic validation
        if (!name || (apkFile && apkFile.size === 0)) {
            return { success: false, message: "Name and APK file are required" };
        }

        let iconUrl = "";
        if (iconFile && iconFile.size > 0) {
            iconUrl = await saveFile(iconFile);
        }

        let downloadUrl = "";
        let size = "";
        if (apkFile && apkFile.size > 0) {
            downloadUrl = await saveFile(apkFile);
            size = formatFileSize(apkFile.size);
        }

        const screenshots: string[] = [];
        for (const file of screenshotFiles) {
            if (file && file.size > 0) {
                const url = await saveFile(file);
                screenshots.push(url);
            }
        }

        await (db.app as any).create({
            data: {
                name,
                tagline,
                description,
                categoryId: categoryId || null,
                version,
                downloadUrl,
                iconUrl,
                size,
                screenshots: JSON.stringify(screenshots),
            },
        });

        revalidatePath("/");
        revalidatePath("/admin/apps");
        return { success: true };
    } catch (error: any) {
        console.error("Create App Error:", error);
        return { success: false, message: error.message || "Failed to create app" };
    }
}

export async function updateApp(id: string, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const tagline = formData.get("tagline") as string;
        const description = formData.get("description") as string;
        const categoryId = formData.get("categoryId") as string;
        const version = formData.get("version") as string;

        const iconFile = formData.get("iconFile") as File;
        const apkFile = formData.get("apkFile") as File;
        const screenshotFiles = formData.getAll("screenshotFiles") as File[];

        const updateData: any = {
            name,
            tagline,
            description,
            categoryId: categoryId || null,
            version,
        };

        if (iconFile && iconFile.size > 0) {
            updateData.iconUrl = await saveFile(iconFile);
        }

        if (apkFile && apkFile.size > 0) {
            updateData.downloadUrl = await saveFile(apkFile);
            updateData.size = formatFileSize(apkFile.size);
        }

        if (screenshotFiles.length > 0 && (screenshotFiles[0] as File).size > 0) {
            const screenshots: string[] = [];
            for (const file of screenshotFiles) {
                if (file && file.size > 0) {
                    const url = await saveFile(file);
                    screenshots.push(url);
                }
            }
            updateData.screenshots = JSON.stringify(screenshots);
        }

        await db.app.update({
            where: { id },
            data: updateData
        });

        revalidatePath("/");
        revalidatePath(`/apps/${id}`);
        revalidatePath("/admin/apps");
        return { success: true };
    } catch (error: any) {
        console.error("Update App Error:", error);
        return { success: false, message: error.message || "Failed to update app" };
    }
}

export async function deleteApp(id: string) {
    await db.app.delete({ where: { id } });
    revalidatePath("/admin/apps");
    revalidatePath("/");
}

// --- Review Actions ---
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addReview(appId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { success: false, message: "You must be logged in to review." };
    }

    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    if (!rating) {
        return { success: false, message: "Rating is required" };
    }

    try {
        await db.review.create({
            data: {
                rating,
                comment,
                appId,
                userId: session.user.id,
            }
        });

        revalidatePath(`/apps/${appId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to add review:", error);
        return { success: false, message: "Failed to add review" };
    }
}

export async function updateReview(reviewId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { success: false, message: "You must be logged in to update a review." };
    }

    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    try {
        const review = await db.review.findUnique({ where: { id: reviewId } });
        if (!review || review.userId !== session.user.id) {
            return { success: false, message: "Unauthorized or review not found." };
        }

        await db.review.update({
            where: { id: reviewId },
            data: { rating, comment }
        });

        revalidatePath(`/apps/${review.appId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to update review" };
    }
}

export async function deleteReview(reviewId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { success: false, message: "You must be logged in." };
    }

    try {
        const review = await db.review.findUnique({ where: { id: reviewId } });
        if (!review) return { success: false, message: "Review not found" };

        if (review.userId !== session.user.id && (session.user as any).role !== "ADMIN") {
            return { success: false, message: "Unauthorized" };
        }

        await db.review.delete({ where: { id: reviewId } });
        revalidatePath(`/apps/${review.appId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to delete review" };
    }
}

// --- Admin Stats ---

export async function getAdminStats() {
    const appsCount = await db.app.count();
    const reviewsCount = await db.review.count();
    // Sum downloads
    const downloadsAgg = await db.app.aggregate({
        _sum: { downloads: true }
    });

    return {
        appsCount,
        reviewsCount,
        downloadsCount: downloadsAgg._sum.downloads || 0
    };
}

export async function getRecentReviews(limit = 10) {
    try {
        return await db.review.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, image: true, email: true } },
                app: { select: { id: true, name: true, iconUrl: true } }
            }
        });
    } catch (error) {
        console.error("Failed to fetch recent reviews:", error);
        return [];
    }
}

// --- User Actions ---
import { hash } from "bcryptjs";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hash(password, 12);

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        } as any,
    });

    return { success: true };
}

export async function updateUserProfile(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { success: false, message: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const image = formData.get("image") as string;

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { name, image }
        });

        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Update Profile Error:", error);
        return { success: false, message: "Failed to update profile" };
    }
}

export async function getUserWithReviews(userId: string) {
    try {
        return await db.user.findUnique({
            where: { id: userId },
            include: {
                reviews: {
                    include: { app: true },
                    orderBy: { createdAt: "desc" }
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        return null;
    }
}

export async function getUsers() {
    try {
        const users = await db.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        return users;
    } catch (error) {
        return [];
    }
}

export async function deleteUser(id: string) {
    try {
        await db.user.delete({ where: { id } });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to delete user" };
    }
}

// --- Category Actions ---

export async function createCategory(name: string) {
    try {
        await (db as any).category.create({ data: { name } });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to create category" };
    }
}

export async function updateCategory(id: string, name: string) {
    try {
        await (db as any).category.update({
            where: { id },
            data: { name }
        });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update category" };
    }
}

export async function deleteCategory(id: string) {
    try {
        await (db as any).category.delete({ where: { id } });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error: any) {
        return { success: false, message: "Failed to delete category" };
    }
}
