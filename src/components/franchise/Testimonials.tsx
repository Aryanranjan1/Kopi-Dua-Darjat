
'use client';

import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Testimonial } from '@/lib/types';
import { useMediaAsset } from '@/lib/media';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { Loader2, Star } from 'lucide-react';
import React, { useState } from 'react';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const { asset: image, isLoading } = useMediaAsset(testimonial.image);
  
  return (
    <Card className="bg-background/80 border-black/10 rounded-3xl shadow-lg p-6">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            {isLoading ? <Skeleton className="w-full h-full" /> : image && (
              <Image
                src={image.imageUrl}
                alt={testimonial.name}
                fill
                sizes="48px"
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            )}
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
        </div>
        <blockquote className="text-base text-foreground/80 leading-relaxed">
          “{testimonial.quote}”
        </blockquote>
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'testimonials')) : null, [firestore]);
  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);

  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };
  
  return (
    <section className="py-24 sm:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-foreground">What Our Partners Say</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real stories from entrepreneurs who are brewing success with Kopi Dua Darjat.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-16">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-foreground" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials?.slice(0, visibleCount).map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
              {testimonials && visibleCount < testimonials.length && (
                 <div className="text-center mt-12">
                    <Button onClick={handleLoadMore} size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        Load More Reviews
                    </Button>
                </div>
              )}
            </>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
}
