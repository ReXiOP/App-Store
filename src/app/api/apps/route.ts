import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/apps - Get all apps with optional filtering
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort") || "newest";
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    try {
        const where: any = {};

        if (category) {
            where.categoryId = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { tagline: { contains: search } },
                { description: { contains: search } }
            ];
        }

        let orderBy: any = { createdAt: "desc" };
        if (sort === "popular") orderBy = { downloads: "desc" };
        if (sort === "oldest") orderBy = { createdAt: "asc" };

        const [apps, total] = await Promise.all([
            db.app.findMany({
                where,
                orderBy,
                take: limit,
                skip,
                include: {
                    category: { select: { id: true, name: true } },
                    reviews: { select: { rating: true } }
                }
            }),
            db.app.count({ where })
        ]);

        // Calculate average ratings
        const appsWithRatings = apps.map(app => {
            const ratings = app.reviews.map(r => r.rating);
            const avgRating = ratings.length > 0
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : 4.5;
            return { ...app, rating: Math.round(avgRating * 10) / 10, reviews: undefined };
        });

        return NextResponse.json({
            apps: appsWithRatings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get apps error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/apps - Create a new app (Admin only)
export async function POST(req: NextRequest) {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, tagline, description, version, downloadUrl, iconUrl, screenshots, categoryId, size } = body;

        if (!name || !tagline || !description || !version || !downloadUrl || !iconUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const app = await db.app.create({
            data: {
                name,
                tagline,
                description,
                version,
                downloadUrl,
                iconUrl,
                screenshots: JSON.stringify(screenshots || []),
                categoryId,
                size
            }
        });

        return NextResponse.json({ app }, { status: 201 });
    } catch (error) {
        console.error("Create app error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
