import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// GET /api/admin/stats - Get Admin Statistics
export async function GET() {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [
            usersCount,
            appsCount,
            reviewsCount,
            categoriesCount,
            downloadsAgg,
            recentUsers,
            recentReviews,
            topApps
        ] = await Promise.all([
            db.user.count(),
            db.app.count(),
            db.review.count(),
            db.category.count(),
            db.app.aggregate({ _sum: { downloads: true } }),
            db.user.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                select: { id: true, name: true, email: true, createdAt: true }
            }),
            db.review.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true } },
                    app: { select: { name: true } }
                }
            }),
            db.app.findMany({
                take: 5,
                orderBy: { downloads: "desc" },
                select: { id: true, name: true, downloads: true, iconUrl: true }
            })
        ]);

        return NextResponse.json({
            stats: {
                users: usersCount,
                apps: appsCount,
                reviews: reviewsCount,
                categories: categoriesCount,
                totalDownloads: downloadsAgg._sum.downloads || 0
            },
            recentUsers,
            recentReviews,
            topApps
        });
    } catch (error) {
        console.error("Get admin stats error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
