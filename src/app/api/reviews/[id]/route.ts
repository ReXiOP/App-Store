import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/reviews/[id] - Get review by ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const review = await db.review.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, image: true } },
                app: { select: { id: true, name: true, iconUrl: true } }
            }
        });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({ review });
    } catch (error) {
        console.error("Get review error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT /api/reviews/[id] - Update review (Owner or Admin)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const authUser = await getAuthUser();

    if (!authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const review = await db.review.findUnique({ where: { id } });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // Check ownership or admin
        if (review.userId !== authUser.id && authUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { rating, comment } = body;

        const updatedReview = await db.review.update({
            where: { id },
            data: {
                ...(rating !== undefined && { rating }),
                ...(comment !== undefined && { comment })
            },
            include: {
                user: { select: { id: true, name: true, image: true } }
            }
        });

        return NextResponse.json({ review: updatedReview });
    } catch (error) {
        console.error("Update review error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/reviews/[id] - Delete review (Owner or Admin)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const authUser = await getAuthUser();

    if (!authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const review = await db.review.findUnique({ where: { id } });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        if (review.userId !== authUser.id && authUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await db.review.delete({ where: { id } });
        return NextResponse.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete review error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
