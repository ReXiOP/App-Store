import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/users/[id] - Get user by ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const user = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        app: { select: { id: true, name: true, iconUrl: true } }
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT /api/users/[id] - Update user
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const authUser = await getAuthUser();

    // Users can update themselves, admins can update anyone
    if (!authUser || (authUser.id !== id && authUser.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, image, role } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (image !== undefined) updateData.image = image;
        // Only admins can change roles
        if (role !== undefined && authUser.role === "ADMIN") {
            updateData.role = role;
        }

        const user = await db.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, image: true, role: true }
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await db.user.delete({ where: { id } });
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
