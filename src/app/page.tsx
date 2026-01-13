import { AppCard } from "@/components/AppCard";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Gamepad2, Briefcase, Zap, TrendingUp, Star, ShieldCheck } from "lucide-react";
import { getFeaturedApps, getNewArrivals, getEditorsChoice, getCategories } from "@/lib/actions";
import Link from "next/link";
import { HorizontalScroller } from "@/components/HorizontalScroller";
import { TopChartSection } from "@/components/TopChartSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featuredApps, newArrivals, editorsChoice, dbCategories] = await Promise.all([
    getFeaturedApps(),
    getNewArrivals(),
    getEditorsChoice(),
    getCategories()
  ]);

  return (
    <div className="flex flex-col pb-32 overflow-hidden">
      <Hero />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-6 space-y-20 md:space-y-32">
        {/* Categories Bar - Professional Glass Dock */}
        <div className="sticky top-[72px] z-30 -mt-10 py-6 pointer-events-none">
          <div className="flex justify-center w-full">
            <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth glass p-2 rounded-2xl shadow-xl border border-white/20 pointer-events-auto max-w-full">
              {dbCategories.map((cat: any) => (
                <Button
                  key={cat.id}
                  variant="ghost"
                  className="rounded-xl flex-shrink-0 gap-2 h-10 px-6 font-semibold hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Apps Scroller */}
        <section>
          <HorizontalScroller
            title="Recommended For You"
            subtitle="Based on design and performance"
            href="/apps"
          >
            {featuredApps.map((app: any) => (
              <div key={app.id} className="snap-start">
                <AppCard {...app} variant="compact" />
              </div>
            ))}
          </HorizontalScroller>
        </section>

        {/* Top Charts Section */}
        <section className="bg-muted/30 -mx-4 md:-mx-6 px-4 md:px-6 py-16 md:py-24 rounded-[3rem]">
          <TopChartSection
            title="Top Charts"
            apps={newArrivals}
          />
        </section>

        {/* New Arrivals Scroller */}
        <section>
          <HorizontalScroller
            title="New & Noteworthy"
            subtitle="The latest additions to our store"
            href="/apps"
          >
            {newArrivals.map((app: any) => (
              <div key={app.id} className="snap-start">
                <AppCard {...app} variant="compact" />
              </div>
            ))}
          </HorizontalScroller>
        </section>

        {/* Editors Choice */}
        <section>
          <HorizontalScroller
            title="Editors' Choice"
            subtitle="The absolute best of the best"
            href="/apps"
          >
            {editorsChoice.map((app: any) => (
              <div key={app.id} className="snap-start">
                <AppCard {...app} variant="compact" />
              </div>
            ))}
          </HorizontalScroller>
        </section>

        {/* Immersive CTA */}
        <section className="py-12">
          <div className="rounded-[3rem] bg-indigo-600 p-8 md:p-20 text-white overflow-hidden relative shadow-2xl shadow-indigo-500/30 border border-white/10">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">The Marketplace <br /> <span className="text-secondary/50 italic font-medium">Reimagined.</span></h2>
                <p className="text-indigo-100 text-lg md:text-2xl opacity-80 leading-relaxed font-medium">Join a community built on beautiful design and absolute security.</p>
              </div>
              <Button size="lg" variant="secondary" className="rounded-3xl px-12 h-20 text-xl text-indigo-700 font-extrabold hover:bg-white hover:scale-105 transition-all shadow-2xl">
                Get Started Now <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-[100px]" />
          </div>
        </section>
      </div>
    </div>
  );
}
