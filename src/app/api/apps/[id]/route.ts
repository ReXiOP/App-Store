import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/apps/[id] - Get app by ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const app = await db.app.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true } },
                reviews: {
                    include: {
                        user: { select: { id: true, name: true, image: true } }
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!app) {
            return NextResponse.json({ error: "App not found" }, { status: 404 });
        }

        // Calculate average rating
        const ratings = app.reviews.map(r => r.rating);
        const avgRating = ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 4.5;

        return NextResponse.json({
            app: { ...app, rating: Math.round(avgRating * 10) / 10 }
        });
    } catch (error) {
        console.error("Get app error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT /api/apps/[id] - Update app (Admin only)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, tagline, description, version, downloadUrl, iconUrl, screenshots, categoryId, size } = body;

        const app = await db.app.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(tagline && { tagline }),
                ...(description && { description }),
                ...(version && { version }),
                ...(downloadUrl && { downloadUrl }),
                ...(iconUrl && { iconUrl }),
                ...(screenshots && { screenshots: JSON.stringify(screenshots) }),
                ...(categoryId !== undefined && { categoryId }),
                ...(size !== undefined && { size })
            }
        });

        return NextResponse.json({ app });
    } catch (error) {
        console.error("Update app error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/apps/[id] - Delete app (Admin only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await db.app.delete({ where: { id } });
        return NextResponse.json({ message: "App deleted successfully" });
    } catch (error) {
        console.error("Delete app error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/apps/[id] - Increment download count
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const app = await db.app.update({
            where: { id },
            data: { downloads: { increment: 1 } },
            select: { id: true, downloads: true }
        });

        return NextResponse.json({ downloads: app.downloads });
    } catch (error) {
        console.error("Download increment error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
