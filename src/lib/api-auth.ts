import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { decode } from "next-auth/jwt";
import { headers } from "next/headers";
import { db } from "@/lib/db";

interface AuthUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
}

/**
 * Get authenticated user from either session cookies or Bearer token
 * Works for both browser (session) and API clients (token)
 */
export async function getAuthUser(): Promise<AuthUser | null> {
    // First, try session-based auth (for browser)
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        return {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            role: session.user.role || "USER"
        };
    }

    // Second, try Bearer token auth (for API clients like Postman)
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);

        try {
            const decoded = await decode({
                token,
                secret: process.env.NEXTAUTH_SECRET || "fallback-secret"
            });

            if (decoded?.sub) {
                // Fetch user from database to get latest role
                const user = await db.user.findUnique({
                    where: { id: decoded.sub },
                    select: { id: true, name: true, email: true, image: true, role: true }
                });

                if (user) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role
                    };
                }
            }
        } catch (error) {
            console.error("Token decode error:", error);
        }
    }

    return null;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const user = await getAuthUser();
    return user?.role === "ADMIN";
}
