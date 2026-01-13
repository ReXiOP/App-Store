"use client";

import { AppCard } from "./AppCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TopChartSectionProps {
    title: string;
    apps: any[];
}

export function TopChartSection({ title, apps }: TopChartSectionProps) {
    if (!apps || apps.length === 0) return null;

    return (
        <div className="space-y-4 py-8">
            <div className="flex items-center justify-between px-4 md:px-0">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 group">
                    See all
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                {apps.slice(0, 9).map((app, index) => (
                    <AppCard
                        key={app.id}
                        id={app.id}
                        name={app.name}
                        category={app.category}
                        iconUrl={app.iconUrl}
                        rating={4.5} // Standard default for charts
                        downloads={app.downloads}
                        variant="list"
                        rank={index + 1}
                    />
                ))}
            </div>
        </div>
    );
}
