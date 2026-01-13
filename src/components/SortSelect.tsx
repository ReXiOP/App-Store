"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowDownWideNarrow } from "lucide-react";

export function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        router.push(`/apps?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground shrink-0">
                <ArrowDownWideNarrow className="h-4 w-4" /> Sort by:
            </div>
            <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[160px] rounded-full bg-background/50 backdrop-blur-sm border-border/40 hover:bg-muted/50 transition-all font-medium h-9">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/40 shadow-xl overflow-hidden">
                    <SelectItem value="newest" className="cursor-pointer">Newest First</SelectItem>
                    <SelectItem value="popular" className="cursor-pointer">Most Popular</SelectItem>
                    <SelectItem value="top-rated" className="cursor-pointer">Highest Rated</SelectItem>
                    <SelectItem value="oldest" className="cursor-pointer">Oldest First</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
