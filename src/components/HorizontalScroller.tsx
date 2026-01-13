"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface HorizontalScrollerProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    href?: string;
}

export function HorizontalScroller({ title, subtitle, children, href }: HorizontalScrollerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="space-y-4 py-4">
            <div className="flex items-center justify-between px-4 md:px-0">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
                {href && (
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 group">
                        See all
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                )}
            </div>

            <div className="relative group/scroller">
                {/* Navigation Arrows (Visible on hover on desktop) */}
                <AnimatePresence>
                    {showLeftArrow && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
                        >
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full shadow-xl glass -ml-5"
                                onClick={() => scroll("left")}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    )}

                    {showRightArrow && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
                        >
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full shadow-xl glass -mr-5"
                                onClick={() => scroll("right")}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-4 overflow-x-auto pb-4 px-4 md:px-0 no-scrollbar snap-x snap-mandatory scroll-smooth"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
