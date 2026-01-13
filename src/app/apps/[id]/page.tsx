import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getApp, getRelatedApps } from "@/lib/actions";
import { AppDetailsClient } from "@/components/AppDetailsClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const app = await getApp(id);
    if (!app) return { title: "App Not Found" };

    return {
        title: `${app.name} - Download APK`,
        description: app.tagline,
    };
}

export default async function AppPage({ params }: { params: Promise<{ id: string }> }) {
    const id = await params.then(p => p.id);
    const app = await getApp(id);
    if (!app) notFound();

    const relatedApps = app.categoryId ? await getRelatedApps(app.categoryId, id) : [];

    return (
        <AppDetailsClient app={app} id={id} relatedApps={relatedApps} />
    );
}
