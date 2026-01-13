"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, User, ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileFormProps {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
    const router = useRouter();
    const [name, setName] = useState(user.name || "");
    const [image, setImage] = useState(user.image || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        try {
            const result = await updateUserProfile(formData);
            if (result.success) {
                toast.success("Profile updated successfully!");
                router.push("/profile");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="rounded-[2.5rem] border-none shadow-premium overflow-hidden">
                <CardHeader className="bg-primary/5 pb-8">
                    <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
                    <CardDescription>Update your personal information and how you appear on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="pt-10 space-y-8">
                    {/* Appearance Preview */}
                    <div className="flex flex-col items-center gap-4 pb-4">
                        <div className="relative h-24 w-24 squircle overflow-hidden bg-white shadow-xl border-4 border-background ring-2 ring-primary/10">
                            <Avatar className="h-full w-full rounded-none">
                                <AvatarImage src={image} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                    {name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Profile Preview</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" /> Display Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="rounded-2xl h-12 bg-muted/50 border-border/40 focus:bg-background transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-sm font-bold flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-primary" /> Avatar URL
                            </Label>
                            <Input
                                id="image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://example.com/avatar.jpg"
                                className="rounded-2xl h-12 bg-muted/50 border-border/40 focus:bg-background transition-all"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium pl-1">
                                Provide a direct link to an image file (JPG, PNG).
                            </p>
                        </div>

                        <div className="space-y-2 opacity-60">
                            <Label className="text-sm font-bold flex items-center gap-2">
                                Email Address
                            </Label>
                            <Input
                                value={user.email || ""}
                                disabled
                                className="rounded-2xl h-12 bg-muted cursor-not-allowed border-border/40"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium pl-1 italic">
                                Email address cannot be changed at this time.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-8 flex gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex-1 rounded-2xl h-12 font-bold"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-3 rounded-2xl h-12 font-bold shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
