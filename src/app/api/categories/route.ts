import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/categories - Get all categories
export async function GET() {
    try {
        const categories = await db.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: { select: { apps: true } }
            }
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Get categories error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/categories - Create a new category (Admin only)
export async function POST(req: NextRequest) {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const category = await db.category.create({
            data: { name }
        });

        return NextResponse.json({ category }, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "Category already exists" }, { status: 409 });
        }
        console.error("Create category error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
