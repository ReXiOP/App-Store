import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";

// GET /api/auth/sm40-callback - Handle SM40 OAuth callback
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/auth/signin?error=missing_token", req.url));
    }

    try {
        // Decode the base64 user data from our PHP script
        const userData = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

        if (!userData.email || !userData.id) {
            return NextResponse.redirect(new URL("/auth/signin?error=invalid_user_data", req.url));
        }

        // Find or create the user
        let user = await db.user.findUnique({
            where: { email: userData.email }
        });

        if (!user) {
            user = await db.user.create({
                data: {
                    email: userData.email,
                    name: userData.name,
                    image: userData.image,
                    role: "USER"
                }
            });
        } else {
            user = await db.user.update({
                where: { email: userData.email },
                data: {
                    name: userData.name,
                    image: userData.image
                }
            });
        }

        // Create an Account link if it doesn't exist
        const existingAccount = await db.account.findFirst({
            where: {
                userId: user.id,
                provider: "sm40"
            }
        });

        if (!existingAccount) {
            await db.account.create({
                data: {
                    userId: user.id,
                    type: "oauth",
                    provider: "sm40",
                    providerAccountId: userData.id
                }
            });
        }

        // Create a session token
        const sessionToken = await encode({
            token: {
                sub: user.id,
                name: user.name,
                email: user.email,
                picture: user.image,
                role: user.role
            },
            secret: process.env.NEXTAUTH_SECRET || "fallback-secret"
        });

        // Set the session cookie
        const cookieStore = await cookies();
        cookieStore.set("next-auth.session-token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60
        });

        return NextResponse.redirect(new URL("/", req.url));
    } catch (error) {
        console.error("SM40 Callback Error:", error);
        return NextResponse.redirect(new URL("/auth/signin?error=callback_failed", req.url));
    }
}
