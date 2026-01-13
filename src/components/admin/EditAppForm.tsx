"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateApp } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditAppFormProps {
    app: any;
    categories: any[];
}

export function EditAppForm({ app, categories }: EditAppFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [categoryId, setCategoryId] = useState<string>(app.categoryId || "");

    const onSubmit = async (formData: FormData) => {
        formData.set("categoryId", categoryId);

        startTransition(async () => {
            const res = await updateApp(app.id, formData);
            if (res.success) {
                toast.success("App updated successfully!");
                router.push("/admin/apps");
                router.refresh();
            } else {
                toast.error(res.message || "Failed to update app");
            }
        });
    };

    return (
        <Card className="max-w-2xl mx-auto border-none shadow-none bg-transparent lg:bg-card lg:border lg:shadow-sm">
            <CardHeader className="px-0 lg:px-6">
                <CardTitle>Edit App: {app.name}</CardTitle>
                <CardDescription>Update application details and files.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6">
                <form action={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">App Name</Label>
                            <Input id="name" name="name" defaultValue={app.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="version">Version</Label>
                            <Input id="version" name="version" defaultValue={app.version} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input id="tagline" name="tagline" defaultValue={app.tagline} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Full Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={app.description}
                            placeholder="Describe your app..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select onValueChange={setCategoryId} defaultValue={categoryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apkFile">APK File (Leave blank to keep current)</Label>
                            <Input id="apkFile" name="apkFile" type="file" accept=".apk" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="iconFile">App Icon (Leave blank to keep current)</Label>
                            <Input id="iconFile" name="iconFile" type="file" accept="image/*" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="screenshotFiles">Screenshots (Overwrites current if selected)</Label>
                            <Input
                                id="screenshotFiles"
                                name="screenshotFiles"
                                type="file"
                                accept="image/*"
                                multiple
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Updating..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
