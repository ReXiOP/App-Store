import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getApps, deleteApp } from "@/lib/actions";
import { Plus, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminAppsPage() {
    const apps = await getApps();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Apps</h2>
                    <p className="text-muted-foreground text-sm">Create, edit, and keep your apps updated.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/categories">
                        <Button variant="outline">
                            Manage Categories
                        </Button>
                    </Link>
                    <Link href="/admin/apps/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add New App
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="border rounded-xl bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Downloads</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    No apps found. Create your first one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            apps.map((app: any) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {app.iconUrl && <img src={app.iconUrl} alt={app.name} className="h-8 w-8 rounded-lg object-cover border" />}
                                            <span className="font-semibold">{app.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border">
                                            {app.category?.name || app.categoryName || "Uncategorized"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{app.version}</TableCell>
                                    <TableCell className="font-mono text-sm">{app.downloads.toLocaleString()}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Link href={`/admin/apps/${app.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            "use server";
                                            await deleteApp(app.id);
                                        }} className="inline-block">
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
