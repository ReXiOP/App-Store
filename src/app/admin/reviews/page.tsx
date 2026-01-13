import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentReviews } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
    const reviews = await getRecentReviews(50);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Reviews</h1>
                    <p className="text-muted-foreground">Complete history of user feedback across all apps.</p>
                </div>
            </div>

            <Card className="rounded-2xl border-border/40">
                <CardHeader>
                    <CardTitle>Review History ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {reviews.length > 0 ? (
                        <div className="divide-y">
                            {reviews.map((review) => (
                                <div key={review.id} className="py-4 flex gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={review.user?.image || ""} />
                                        <AvatarFallback>{review.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{review.user?.name || "Anonymous"}</span>
                                                <span className="text-muted-foreground text-sm">on</span>
                                                <Link href={`/apps/${(review.app as any).id}`} className="font-semibold text-primary hover:underline">
                                                    {(review.app as any).name}
                                                </Link>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex text-amber-500 gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current" : "text-muted-foreground/20"}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-12">No reviews yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
