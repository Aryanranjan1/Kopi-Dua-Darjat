
'use client';

import { useState } from 'react';
import type { Review, ReviewDocument } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Timestamp } from 'firebase/firestore';

interface CustomerReviewsProps {
    reviewData: ReviewDocument;
}

const ReviewCard = ({ review }: { review: Review }) => {
    const isGoogleReview = review.source === 'google';

    // Handle both Firestore Timestamp object and raw seconds number
    const reviewDate = review.time instanceof Timestamp
      ? review.time.toDate()
      : typeof review.time === 'number'
      ? fromUnixTime(review.time)
      : new Date(); // Fallback to now if format is unexpected


    return (
        <Card className="bg-background/50 border-border rounded-xl h-full flex flex-col">
            <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "w-5 h-5",
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
                                )}
                            />
                        ))}
                    </div>
                    {isGoogleReview && (
                        <span className="text-xs text-muted-foreground italic">via Google</span>
                    )}
                </div>
                <blockquote className="text-foreground/90 flex-grow my-2">
                    “{review.text}”
                </blockquote>
                <div className="border-t border-border pt-4 mt-auto">
                    <p className="font-semibold text-foreground text-sm">{review.author_name}</p>
                    <p className="text-xs text-muted-foreground">{format(reviewDate, 'PPP')}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default function CustomerReviews({ reviewData }: CustomerReviewsProps) {
    const [showAll, setShowAll] = useState(false);

    const { aggregate, reviews } = reviewData;

    // Sort all reviews (manual and Google) by time, newest first
    const sortedReviews = [...reviews].sort((a, b) => {
        const timeA = a.time instanceof Timestamp ? a.time.seconds : typeof a.time === 'number' ? a.time : 0;
        const timeB = b.time instanceof Timestamp ? b.time.seconds : typeof b.time === 'number' ? b.time : 0;
        return timeB - timeA;
    });

    const visibleReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);
    
    return (
        <section className="py-24 sm:py-32 bg-background">
            <div className="container mx-auto px-4">
                <AnimateOnScroll animationType="slideInFromBottom" className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
                        What Our Customers Say
                    </h2>
                    {aggregate && (
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                    key={i}
                                    className={cn(
                                        "w-6 h-6",
                                        i < Math.round(aggregate.ratingValue) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
                                    )}
                                    />
                                ))}
                            </div>
                            <p className="text-lg text-muted-foreground">
                                <strong>{aggregate.ratingValue.toFixed(1)}</strong> average rating from <strong>{aggregate.reviewCount}</strong> reviews.
                            </p>
                        </div>
                    )}
                </AnimateOnScroll>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleReviews.map((review, index) => (
                        <AnimateOnScroll key={`${review.author_name}-${index}`} animationType="fadeIn" delay={index * 0.1}>
                           <ReviewCard review={review} />
                        </AnimateOnScroll>
                    ))}
                </div>

                {sortedReviews.length > 3 && (
                    <div className="mt-12 text-center">
                        <Button onClick={() => setShowAll(!showAll)} variant="outline">
                            {showAll ? 'Show Less' : `Show All ${sortedReviews.length} Reviews`}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
