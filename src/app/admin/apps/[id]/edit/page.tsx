import { getApp, getCategories } from "@/lib/actions";
import { EditAppForm } from "@/components/admin/EditAppForm";
import { notFound } from "next/navigation";

export default async function EditAppPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [app, categories] = await Promise.all([
        getApp(id),
        getCategories()
    ]);

    if (!app) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit App</h1>
            </div>
            <EditAppForm app={app} categories={categories} />
        </div>
    );
}
