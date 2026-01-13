import { AppCard } from "@/components/AppCard";
import { getApps, getCategories } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Grid3X3, ListFilter } from "lucide-react";
import { SortSelect } from "@/components/SortSelect";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function AppsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
    const { category: categoryId, q: search, sort } = await searchParams;
    const [apps, categories] = await Promise.all([
        getApps(100, categoryId, search, sort),
        getCategories(),
    ]);

    const activeCategory = categories.find((c: any) => c.id === categoryId);

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 space-y-12">
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-primary shadow-sm border border-primary/20">
                    <Grid3X3 className="h-4 w-4" />
                    <span>App Library</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    Explore All <span className="text-primary">Applications</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Browse our curated collection of high-quality Android apps across all categories.
                </p>
            </div>

            {/* category Filter Bar */}
            <div className="sticky top-[72px] z-30 py-4 bg-background/80 backdrop-blur-md border-b border-border/40 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mr-2 shrink-0">
                        <ListFilter className="h-4 w-4" /> Filter:
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1">
                        <Link href="/apps">
                            <Button
                                variant={!categoryId ? "default" : "outline"}
                                size="sm"
                                className="rounded-full px-5 transition-all"
                            >
                                All Apps
                            </Button>
                        </Link>
                        {categories.map((cat: any) => (
                            <Link key={cat.id} href={`/apps?category=${cat.id}`}>
                                <Button
                                    variant={categoryId === cat.id ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full px-5 transition-all"
                                >
                                    {cat.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                    <div className="ml-auto shrink-0 pl-4 border-l border-border/40">
                        <Suspense fallback={<div className="w-32 h-9 bg-muted animate-pulse rounded-full" />}>
                            <SortSelect />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {apps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {apps.map((app: any) => (
                        <div key={app.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <AppCard
                                {...app}
                                rating={app.rating || 0}
                                downloads={app.downloads?.toString()}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
                    <div className="p-4 rounded-full bg-muted">
                        <Sparkles className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">No apps found</h2>
                        <p className="text-muted-foreground max-w-xs">
                            {search
                                ? `We couldn't find any results for "${search}". Try checking your spelling or use different keywords.`
                                : activeCategory
                                    ? `We couldn't find any apps in the "${activeCategory.name}" category yet.`
                                    : "The app library is currently empty. Check back soon!"}
                        </p>
                    </div>
                    <Link href="/apps">
                        <Button variant="outline" className="rounded-2xl">
                            View All Apps
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
