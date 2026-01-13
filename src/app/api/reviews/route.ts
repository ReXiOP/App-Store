import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/reviews - Get reviews with optional filtering
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const appId = searchParams.get("appId");
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");

    try {
        const where: any = {};
        if (appId) where.appId = appId;
        if (userId) where.userId = userId;

        const reviews = await db.review.findMany({
            where,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, image: true, email: true } },
                app: { select: { id: true, name: true, iconUrl: true } }
            }
        });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Get reviews error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/reviews - Create a new review (Authenticated users)
export async function POST(req: NextRequest) {
    const authUser = await getAuthUser();

    if (!authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { appId, rating, comment } = body;

        if (!appId || !rating) {
            return NextResponse.json({ error: "App ID and rating are required" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        // Check if user already reviewed this app
        const existingReview = await db.review.findFirst({
            where: { appId, userId: authUser.id }
        });

        if (existingReview) {
            return NextResponse.json({ error: "You have already reviewed this app" }, { status: 409 });
        }

        const review = await db.review.create({
            data: {
                appId,
                userId: authUser.id,
                rating,
                comment
            },
            include: {
                user: { select: { id: true, name: true, image: true } }
            }
        });

        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        console.error("Create review error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
