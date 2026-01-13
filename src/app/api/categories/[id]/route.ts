import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/categories/[id] - Get category by ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const category = await db.category.findUnique({
            where: { id },
            include: {
                apps: {
                    select: {
                        id: true,
                        name: true,
                        tagline: true,
                        iconUrl: true,
                        downloads: true
                    },
                    orderBy: { downloads: "desc" }
                }
            }
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ category });
    } catch (error) {
        console.error("Get category error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT /api/categories/[id] - Update category (Admin only)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
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

        const category = await db.category.update({
            where: { id },
            data: { name }
        });

        return NextResponse.json({ category });
    } catch (error) {
        console.error("Update category error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/categories/[id] - Delete category (Admin only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await db.category.delete({ where: { id } });
        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Delete category error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
