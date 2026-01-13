"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative h-[550px] md:h-[650px] flex items-center justify-center pt-16 overflow-hidden">
            {/* Dynamic Abstract Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary),transparent_60%),radial-gradient(circle_at_bottom_left,var(--color-accent),transparent_70%)] opacity-20 z-0" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 bg-[length:40px_40px]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs md:text-sm font-semibold text-primary shadow-sm border border-primary/20"
                >
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    <span>Discover the Best Apps</span>
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl max-w-5xl"
                    >
                        Next-Gen Store. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-accent">Beautifully Built.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-[700px] text-muted-foreground md:text-xl leading-relaxed mx-auto"
                    >
                        A curated collection of professional applications with focus on design and security.
                        Safe, fast, and remarkably smooth.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                    <Link href="/apps">
                        <Button size="lg" className="rounded-2xl h-14 px-10 text-lg bg-primary text-white hover:scale-105 transition-all shadow-xl shadow-primary/20 flex gap-2">
                            Browse Collection <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/auth/signin">
                        <Button size="lg" variant="outline" className="rounded-2xl h-14 px-10 text-lg border-primary/20 hover:bg-primary/5 transition-all">
                            Get Started
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-6 pt-6 text-sm text-muted-foreground/60 font-medium"
                >
                    <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Secure</div>
                    <div className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Fast</div>
                    <div className="flex items-center gap-1.5"><Star className="h-4 w-4" /> Curated</div>
                </motion.div>
            </div>
        </section>
    );
}
