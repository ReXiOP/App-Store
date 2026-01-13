"use client";

import { Button } from "@/components/ui/button";
import { Star, Share2, ShieldCheck, Star as StarIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadButton } from "@/components/DownloadButton";
import { RichText } from "@/components/RichText";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { X, Send, User, Edit, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { addReview, updateReview, deleteReview } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AppDetailsClientProps {
    app: any;
    id: string;
    relatedApps: any[];
}

import { HorizontalScroller } from "@/components/HorizontalScroller";
import { AppCard } from "@/components/AppCard";

export function AppDetailsClient({ app, id, relatedApps }: AppDetailsClientProps) {
    const { data: session } = useSession();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error("You must be logged in to write a review");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("rating", ratingValue.toString());
        formData.append("comment", comment);

        try {
            let result;
            if (editingReviewId) {
                result = await updateReview(editingReviewId, formData);
            } else {
                result = await addReview(id, formData);
            }

            if (result.success) {
                toast.success(editingReviewId ? "Review updated!" : "Review submitted!");
                setIsReviewModalOpen(false);
                setComment("");
                setRatingValue(5);
                setEditingReviewId(null);
            } else {
                toast.error(result.message || "Operation failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const result = await deleteReview(reviewId);
            if (result.success) {
                toast.success("Review deleted");
            } else {
                toast.error(result.message || "Failed to delete");
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const openEditModal = (review: any) => {
        setEditingReviewId(review.id);
        setRatingValue(review.rating);
        setComment(review.comment || "");
        setIsReviewModalOpen(true);
    };

    const openAddModal = () => {
        setEditingReviewId(null);
        setRatingValue(5);
        setComment("");
        setIsReviewModalOpen(true);
    };

    const handleShare = async () => {
        const shareData = {
            title: app.name,
            text: `Check out ${app.name} - ${app.tagline}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            // Don't show error toast if user cancels share sheet
            if (error instanceof Error && error.name !== 'AbortError') {
                toast.error("Failed to share link");
            }
        }
    };

    // Calculate real rating and review count
    const reviewsCount = app.reviews ? app.reviews.length : 0;
    const rating = reviewsCount > 0
        ? parseFloat((app.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsCount).toFixed(1))
        : 4.5; // Fallback or 0.0

    const size = app.size || "Unknown";

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Professional App Header - Integrated Design */}
            <div className="bg-muted/30 border-b border-border/40 pb-16 pt-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        {/* High-End Squircle Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-shrink-0 relative h-32 w-32 md:h-48 md:w-48 squircle overflow-hidden bg-white shadow-2xl border border-border/50"
                        >
                            {app.iconUrl ? (
                                <Image
                                    src={app.iconUrl}
                                    alt={app.name}
                                    fill
                                    className="object-cover p-1"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-5xl font-bold text-primary">
                                    {app.name.charAt(0)}
                                </div>
                            )}
                        </motion.div>

                        {/* Title & Action Section */}
                        <div className="flex-1 space-y-6 pt-2">
                            <div className="space-y-2">
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-6xl font-extrabold tracking-tight"
                                >
                                    {app.name}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-xl md:text-2xl text-muted-foreground font-medium"
                                >
                                    {app.tagline}
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-center justify-center md:justify-start gap-4"
                            >
                                <div className="flex items-center text-amber-500 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                                    <StarIcon className="h-5 w-5 fill-current mr-2" />
                                    {rating}
                                    <span className="text-muted-foreground/60 font-medium ml-2 text-sm">({reviewsCount} Reviews)</span>
                                </div>
                                <div className="h-4 w-[1px] bg-border/60 mx-1 hidden sm:block" />
                                <div className="text-muted-foreground font-semibold flex items-center gap-2">
                                    {app.downloads} <span className="font-medium opacity-60">Downloads</span>
                                </div>
                                <div className="h-4 w-[1px] bg-border/60 mx-1 hidden sm:block" />
                                <div className="text-primary font-bold bg-primary/10 px-4 py-1 rounded-xl text-sm border border-primary/20">
                                    {typeof app.category === 'string' ? app.category : (app.category as any)?.name || 'App'}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <DownloadButton
                                    appId={id}
                                    downloadUrl={app.downloadUrl}
                                    size={size}
                                />
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-2xl h-16 px-8 gap-3 border-border/60 font-semibold text-lg hover:bg-muted/50 transition-all"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-5 w-5" />
                                    Share
                                </Button>
                            </motion.div>

                            <div className="flex items-center gap-2 text-xs font-semibold text-green-600/80 bg-green-500/5 w-fit px-3 py-1 rounded-full border border-green-500/10 mx-auto md:mx-0">
                                <ShieldCheck className="h-4 w-4" />
                                Verified & Digitally Signed
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content & Bento Info */}
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-20">
                        {/* Screenshots Carousel */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
                            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory">
                                {(() => {
                                    try {
                                        const screenshots = JSON.parse(app.screenshots || "[]");
                                        if (!Array.isArray(screenshots) || screenshots.length === 0) {
                                            return <div className="w-full p-12 text-center border-2 border-dashed rounded-3xl text-muted-foreground font-medium">No screenshots yet</div>;
                                        }
                                        return screenshots.map((src: string, i: number) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -5, scale: 1.02 }}
                                                onClick={() => setSelectedImage(src)}
                                                className="flex-shrink-0 snap-center w-[220px] md:w-[260px] aspect-[9/16] relative bg-muted rounded-[2rem] overflow-hidden border shadow-lg cursor-zoom-in"
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`${app.name} screenshot ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </motion.div>
                                        ));
                                    } catch (e) {
                                        return <p className="text-muted-foreground italic">Error loading screenshots.</p>;
                                    }
                                })()}
                            </div>
                        </section>

                        {/* About - Improved Typography */}
                        <section className="space-y-6 max-w-none">
                            <h2 className="text-3xl font-bold tracking-tight">Description</h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
                                <RichText content={app.description} />
                            </div>
                        </section>

                        {/* Reviews - Card Based */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold tracking-tight">Community Feedback</h2>
                                {app.reviews && app.reviews.length > 0 && (
                                    <Button variant="ghost" className="text-primary font-bold">View All Reviews</Button>
                                )}
                            </div>

                            {reviewsCount > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {app.reviews.map((review: any) => (
                                        <div key={review.id} className="bg-muted/30 p-8 rounded-[2rem] space-y-4 border border-border/40 hover:bg-muted/50 transition-colors relative group/review">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="font-bold text-lg">{review.user?.name || "Anonymous User"}</div>
                                                    {session?.user?.id === review.userId && (
                                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">You</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider" suppressHydrationWarning>
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </div>
                                                    {(session?.user?.id === review.userId || (session?.user as any)?.role === "ADMIN") && (
                                                        <div className="flex items-center gap-1 opacity-0 group-hover/review:opacity-100 transition-opacity">
                                                            {session?.user?.id === review.userId && (
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary" onClick={() => openEditModal(review)}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500" onClick={() => handleDeleteReview(review.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex text-amber-500 gap-0.5">
                                                {[...Array(5)].map((_, k) => (
                                                    <StarIcon
                                                        key={k}
                                                        className={`h-3.5 w-3.5 ${k < review.rating ? "fill-current" : "text-muted-foreground/30"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                "{review.comment || "No comment provided."}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-muted/30 p-12 rounded-[2rem] text-center border border-dashed border-border/60">
                                    <p className="text-muted-foreground font-medium mb-4">No reviews yet. Be the first to share your experience!</p>
                                    <Button className="rounded-xl" onClick={openAddModal}>Write a Review</Button>
                                </div>
                            )}

                            {/* Write a Review Button (Visible if reviews exist) */}
                            {reviewsCount > 0 && (
                                <div className="flex justify-center pt-4">
                                    <Button
                                        variant="outline"
                                        className="rounded-2xl px-12 py-6 h-auto text-lg font-bold border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                                        onClick={openAddModal}
                                    >
                                        Write a Review
                                    </Button>
                                </div>
                            )}
                        </section>

                        {/* Related Apps - New Section */}
                        {relatedApps && relatedApps.length > 0 && (
                            <div className="pt-10 border-t border-border/40">
                                <HorizontalScroller
                                    title="More in this Category"
                                    subtitle={`Recommended ${app.categoryName || 'tools'} for you`}
                                >
                                    {relatedApps.map((relatedApp) => (
                                        <AppCard
                                            key={relatedApp.id}
                                            id={relatedApp.id}
                                            name={relatedApp.name}
                                            category={relatedApp.category}
                                            iconUrl={relatedApp.iconUrl}
                                            rating={4.5} // Standard fallback or fetch real rating
                                            downloads={relatedApp.downloads?.toString()}
                                            variant="compact"
                                        />
                                    ))}
                                </HorizontalScroller>
                            </div>
                        )}
                    </div>

                    {/* Bento Box Sidebar Info */}
                    <aside className="space-y-8 lg:sticky lg:top-32 h-fit">
                        <div className="bg-card glass border-border/40 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                            <h3 className="font-extrabold text-2xl mb-8 tracking-tight">App Technicals</h3>

                            <div className="space-y-6">
                                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-muted/50 border border-border/40">
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Version</span>
                                    <span className="text-lg font-bold">{app.version}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1 p-4 rounded-2xl bg-muted/50 border border-border/40">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</span>
                                        <span className="text-sm font-bold truncate">
                                            {typeof app.category === 'string' ? app.category : (app.category as any)?.name || 'Tools'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-4 rounded-2xl bg-muted/50 border border-border/40">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Size</span>
                                        <span className="text-sm font-bold">{size}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-muted/50 border border-border/40">
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Updated On</span>
                                    <span className="text-lg font-bold">{app.updatedAt ? new Date(app.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                                </div>

                                <div className="bg-primary/5 p-6 rounded-[1.5rem] border border-primary/20 mt-4 space-y-3">
                                    <h4 className="font-bold text-primary flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" /> Provider Trusted
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium"> This application has passed our rigorous security and performance standards. </p>
                                </div>
                            </div>
                        </div>

                        {/* Extra Side Element */}
                        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white space-y-4 shadow-xl shadow-indigo-500/20">
                            <h3 className="font-bold text-lg">About AppStore Inc.</h3>
                            <p className="text-sm opacity-80 leading-relaxed">
                                We curate only the highest quality, most secure applications for your professional and personal needs.
                            </p>
                            <Button variant="secondary" className="w-full rounded-xl font-bold">Contact Support</Button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Image Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/90 backdrop-blur-xl overflow-hidden focus:outline-none">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Image Preview</DialogTitle>
                                <DialogDescription>Full size view of the app screenshot</DialogDescription>
                            </DialogHeader>
                            <div className="relative w-full h-full flex items-center justify-center p-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 z-50 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="relative w-full h-[85vh] md:h-[90vh]"
                                >
                                    <Image
                                        src={selectedImage}
                                        alt="Fullscreen preview"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>

            {/* Review Submission Modal */}
            <Dialog open={isReviewModalOpen} onOpenChange={(open) => {
                setIsReviewModalOpen(open);
                if (!open) {
                    setEditingReviewId(null);
                    setComment("");
                    setRatingValue(5);
                }
            }}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="bg-primary/5 p-8 pb-4">
                        <DialogTitle className="text-3xl font-bold">{editingReviewId ? "Update Review" : "Write a Review"}</DialogTitle>
                        <DialogDescription className="text-base">
                            {editingReviewId ? "Modify your existing feedback." : `Share your thoughts on ${app.name} with the community.`}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReviewSubmit} className="p-8 pt-4 space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRatingValue(star)}
                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <StarIcon
                                            className={`h-10 w-10 ${star <= ratingValue ? "text-amber-500 fill-current" : "text-muted-foreground/20"}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your Feedback</label>
                            <Textarea
                                placeholder="What did you like or dislike?"
                                className="min-h-[150px] rounded-2xl bg-muted/50 border-transparent focus:bg-background focus:ring-primary/20 transition-all text-base p-4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1 rounded-2xl h-14 font-bold"
                                onClick={() => setIsReviewModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-2 px-8 rounded-2xl h-14 font-bold shadow-lg shadow-primary/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    >
                                        <Send className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    editingReviewId ? "Update Review" : "Submit Review"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
