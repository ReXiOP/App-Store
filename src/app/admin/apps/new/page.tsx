import { CreateAppForm } from "@/components/admin/CreateAppForm";
import { getCategories } from "@/lib/actions";

export default async function NewAppPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Create App</h1>
            </div>
            <CreateAppForm categories={categories} />
        </div>
    );
}
