import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/signin");
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect("/auth/signin");
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Header/Nav */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile">
                        <Button variant="ghost" size="icon" className="rounded-full bg-background hover:bg-primary/10 hover:text-primary transition-all shadow-sm">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
                        </div>
                        <p className="text-muted-foreground font-medium text-sm">Manage your account and preferences</p>
                    </div>
                </div>

                <EditProfileForm user={user} />
            </div>
        </div>
    );
}
