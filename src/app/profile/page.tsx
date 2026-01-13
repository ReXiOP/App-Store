import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserWithReviews } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Mail, Shield, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/signin");
    }

    const userProfile = await getUserWithReviews(session.user.id);

    if (!userProfile) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-2xl font-bold">Profile not found</h1>
                <p className="text-muted-foreground mt-2">There was an error loading your profile data.</p>
                <Link href="/">
                    <Button className="mt-6">Back to Home</Button>
                </Link>
            </div>
        );
    }

    const reviewsCount = userProfile.reviews.length;
    const joinedDate = new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header / Hero */}
            <div className="bg-muted/30 border-b border-border/40 pb-20 pt-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="relative h-32 w-32 md:h-40 md:w-40 squircle overflow-hidden bg-white shadow-2xl border-4 border-background">
                            <Avatar className="h-full w-full rounded-none">
                                <AvatarImage src={userProfile.image || ""} />
                                <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                                    {userProfile.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="space-y-1">
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{userProfile.name}</h1>
                                <p className="text-lg text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="h-4 w-4" /> {userProfile.email}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                    <Shield className="h-3.5 w-3.5" /> {userProfile.role}
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider border border-border/40" suppressHydrationWarning>
                                    <Calendar className="h-3.5 w-3.5" /> Joined {joinedDate}
                                </div>
                            </div>
                        </div>
                        <div className="md:ml-auto">
                            <Link href="/profile/settings">
                                <Button variant="outline" className="rounded-2xl font-bold bg-background/50 backdrop-blur-sm border-border/40 hover:bg-primary/10 hover:text-primary transition-all">
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats & Activity */}
            <div className="container mx-auto px-4 md:px-6 py-12 -mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="rounded-[2rem] border-none shadow-xl bg-card overflow-hidden">
                            <CardHeader className="bg-primary/5 pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <span className="font-bold text-sm">Total Reviews</span>
                                    </div>
                                    <span className="text-xl font-black">{reviewsCount}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content: Review History */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Review History</h2>
                        </div>

                        {reviewsCount > 0 ? (
                            <div className="grid gap-6">
                                {userProfile.reviews.map((review: any) => (
                                    <Card key={review.id} className="rounded-[2.5rem] border-none shadow-premium hover:shadow-2xl transition-all group">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-border/40">
                                                {/* App Info Sidebar */}
                                                <div className="p-8 md:w-64 flex-shrink-0 bg-muted/20 flex flex-col items-center justify-center text-center gap-4">
                                                    <div className="relative h-20 w-20 squircle overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                                                        {review.app.iconUrl ? (
                                                            <Image src={review.app.iconUrl} alt={review.app.name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                                                {review.app.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">{review.app.name}</h3>
                                                        <Link href={`/apps/${review.app.id}`} className="text-xs font-bold text-primary flex items-center gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            View Page <ArrowRight className="h-3 w-3" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Review Content */}
                                                <div className="p-8 flex-1 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex text-amber-500 gap-0.5">
                                                            {[...Array(5)].map((_, k) => (
                                                                <Star key={k} className={`h-4 w-4 ${k < review.rating ? "fill-current" : "text-muted-foreground/20"}`} />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground font-mono" suppressHydrationWarning>
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-lg text-muted-foreground italic leading-relaxed">
                                                        "{review.comment}"
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-muted/30 border-2 border-dashed rounded-[3rem] p-20 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="p-6 rounded-full bg-muted shadow-inner">
                                    <MessageSquare className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">No reviews yet</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        Your activity feed is empty. Start exploring apps and share your feedback with the community!
                                    </p>
                                </div>
                                <Link href="/apps">
                                    <Button className="rounded-2xl px-8 h-12 font-bold shadow-lg shadow-primary/20">Explore Apps</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
