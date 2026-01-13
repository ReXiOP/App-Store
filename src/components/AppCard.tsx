"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface AppCardProps {
    id: string;
    name: string;
    category: string | { name: string } | null;
    iconUrl: string;
    rating: number;
    downloads?: string;
    variant?: "grid" | "list" | "compact";
    rank?: number;
}

export function AppCard({
    id, name, category, iconUrl, rating = 0, downloads, variant = "grid", rank
}: AppCardProps) {
    const categoryName = typeof category === "string"
        ? category
        : category?.name || "Uncategorized";

    const isList = variant === "list";
    const isCompact = variant === "compact";

    if (isList) {
        return (
            <Link href={`/apps/${id}`}>
                <motion.div
                    whileHover={{ backgroundColor: "var(--accent)" }}
                    className="flex items-center gap-4 p-3 rounded-2xl transition-colors group"
                >
                    {rank && (
                        <span className="text-xl font-bold text-muted-foreground/50 w-6 text-center">
                            {rank}
                        </span>
                    )}
                    <div className="relative h-14 w-14 squircle overflow-hidden bg-muted group-hover:scale-105 transition-transform shadow-sm">
                        {iconUrl ? (
                            <Image src={iconUrl} alt={name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{categoryName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-0.5">
                                {rating.toFixed(1)} <Star className="h-3 w-3 fill-current text-amber-500" />
                            </span>
                            {downloads && (
                                <>
                                    <span>•</span>
                                    <span>{downloads}</span>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </Link>
        );
    }

    if (isCompact) {
        return (
            <Link href={`/apps/${id}`}>
                <motion.div
                    whileHover={{ y: -4 }}
                    className="flex flex-col gap-3 w-[120px] group"
                >
                    <div className="relative h-[120px] w-[120px] squircle overflow-hidden bg-muted shadow-lg group-hover:shadow-primary/20 transition-all border border-border/50">
                        {iconUrl ? (
                            <Image src={iconUrl} alt={name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary/5 flex items-center justify-center text-3xl font-bold text-primary">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{name}</h3>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span>{rating.toFixed(1)}</span>
                            <Star className="h-2.5 w-2.5 fill-current text-amber-500" />
                        </div>
                    </div>
                </motion.div>
            </Link>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Link href={`/apps/${id}`}>
                <Card className="overflow-hidden h-full border-none shadow-sm bg-card/40 hover:bg-card/70 transition-all hover:shadow-xl hover:shadow-primary/5 border border-primary/5">
                    <CardContent className="p-4 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="relative h-20 w-20 squircle overflow-hidden bg-muted shadow-inner border border-border/20">
                                {iconUrl ? (
                                    <Image src={iconUrl} alt={name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                                        {name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    <span>{rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{categoryName}</p>
                        </div>

                        {downloads && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                                <Download className="h-3 w-3" />
                                {downloads} Downloads
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
