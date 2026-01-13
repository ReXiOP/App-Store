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
import { createApp } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateAppFormProps {
    categories: any[];
}

export function CreateAppForm({ categories }: CreateAppFormProps) {
    const [isPending, startTransition] = useTransition();
    const [categoryId, setCategoryId] = useState<string>("");
    const router = useRouter();

    const onSubmit = async (formData: FormData) => {
        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        formData.set("categoryId", categoryId);

        startTransition(async () => {
            const res = await createApp(formData);
            if (res.success) {
                toast.success("App published successfully!");
                router.push("/admin/apps");
            } else {
                toast.error(res.message || "Failed to create app");
            }
        });
    };

    return (
        <Card className="max-w-2xl mx-auto border-none shadow-none bg-transparent lg:bg-card lg:border lg:shadow-sm">
            <CardHeader className="px-0 lg:px-6">
                <CardTitle>Add New App</CardTitle>
                <CardDescription>Upload a new application to the store.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6">
                <form action={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">App Name</Label>
                            <Input id="name" name="name" placeholder="e.g. PhotoMaster" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="version">Version</Label>
                            <Input id="version" name="version" placeholder="1.0.0" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input id="tagline" name="tagline" placeholder="Short catchy description" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Full Description</Label>
                        <Textarea id="description" name="description" placeholder="Describe your app... (Markdown/BBCode supported)" className="min-h-[150px]" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select onValueChange={setCategoryId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="new" className="font-semibold text-primary" disabled>
                                        + Use Category Manager
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apkFile">APK File</Label>
                            <Input id="apkFile" name="apkFile" type="file" accept=".apk" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="iconFile">App Icon</Label>
                        <Input id="iconFile" name="iconFile" type="file" accept="image/*" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="screenshotFiles">Screenshots</Label>
                        <Input
                            id="screenshotFiles"
                            name="screenshotFiles"
                            type="file"
                            accept="image/*"
                            multiple
                            required
                        />
                        <p className="text-xs text-muted-foreground">Select multiple images.</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Uploading..." : "Publish App"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
