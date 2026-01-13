import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Users, AppWindow, Star, Settings, MessageSquare, TrendingUp, Clock, User } from "lucide-react";
import { getAdminStats, getRecentReviews } from "@/lib/actions";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const [stats, recentReviews] = await Promise.all([
        getAdminStats(),
        getRecentReviews(5)
    ]);

    return (
        <div className="space-y-10 pb-10">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Platform Overview</h1>
                <p className="text-muted-foreground font-medium">Real-time stats and activity across the store.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Downloads"
                    value={stats.downloadsCount.toLocaleString()}
                    icon={Download}
                    description="Total across all apps"
                    trend="+12%"
                    trendColor="text-emerald-500"
                />
                <StatsCard
                    title="Active Users"
                    value="-"
                    icon={Users}
                    description="Analytics pending"
                    trend="N/A"
                    trendColor="text-muted-foreground"
                />
                <StatsCard
                    title="Applications"
                    value={stats.appsCount.toString()}
                    icon={AppWindow}
                    description="Published on store"
                    trend="+2"
                    trendColor="text-emerald-500"
                />
                <StatsCard
                    title="Reviews"
                    value={stats.reviewsCount.toString()}
                    icon={Star}
                    description="Community feedback"
                    trend="+8"
                    trendColor="text-emerald-500"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Activity Feed */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-premium overflow-hidden bg-card">
                    <CardHeader className="bg-primary/5 pb-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Recent Community Activity
                                </CardTitle>
                                <CardDescription>Latest reviews submitted by users.</CardDescription>
                            </div>
                            <Link href="/admin/reviews" className="text-xs font-bold text-primary hover:underline">
                                View full history
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {recentReviews.length > 0 ? (
                            <div className="space-y-6">
                                {recentReviews.map((review) => (
                                    <div key={review.id} className="flex gap-4 group p-3 rounded-2xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/40">
                                        <div className="relative h-12 w-12 squircle overflow-hidden shrink-0 shadow-md">
                                            <Avatar className="h-full w-full rounded-none">
                                                <AvatarImage src={review.user?.image || ""} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {review.user?.name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold uppercase tracking-tight truncate max-w-[150px]">
                                                    {review.user?.name || "Anonymous User"}
                                                </h4>
                                                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Reviewed <span className="font-bold text-foreground">{(review.app as any).name}</span>
                                            </p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <div className="flex text-amber-500 gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted-foreground/20"}`} />
                                                    ))}
                                                </div>
                                                <p className="text-sm italic text-foreground/80 line-clamp-1">"{review.comment}"</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center space-y-4">
                                <div className="p-4 rounded-full bg-muted w-fit mx-auto">
                                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground font-medium">No reviews yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                        Management Hub
                    </h3>
                    <div className="grid gap-4">
                        <AdminActionCard
                            href="/admin/apps"
                            title="Manage Apps"
                            subtitle="View and edit store items"
                            icon={AppWindow}
                            color="indigo"
                        />
                        <AdminActionCard
                            href="/admin/users"
                            title="Users & Permissions"
                            subtitle="Control user accounts"
                            icon={Users}
                            color="emerald"
                        />
                        <AdminActionCard
                            href="/admin/settings"
                            title="Store Config"
                            subtitle="Marketplace settings"
                            icon={Settings}
                            color="slate"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, description, trend, trendColor }: any) {
    return (
        <Card className="rounded-[2rem] border-none shadow-xl bg-card overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black mb-1">{value}</div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-muted-foreground font-bold">
                        {description}
                    </p>
                    <span className={`text-[10px] font-black ${trendColor} bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full`}>
                        {trend}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

function AdminActionCard({ href, title, subtitle, icon: Icon, color }: any) {
    const colors: any = {
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        slate: "text-slate-500 bg-slate-500/10 border-slate-500/20",
    };

    return (
        <Link href={href}>
            <Card className="rounded-[1.5rem] border-border/40 shadow-sm hover:shadow-md hover:translate-x-1 transition-all group overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${colors[color]} transition-colors group-hover:scale-110 duration-300`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="font-bold text-sm">{title}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
