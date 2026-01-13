import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/users - Get all users (Admin only)
export async function GET() {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                _count: { select: { reviews: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Get users error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/users - Create a new user (Admin only)
export async function POST(req: NextRequest) {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    try {
        const body = await req.json();
        const { name, email, role, image } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await db.user.create({
            data: { name, email, role: role || "USER", image },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        });

        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
