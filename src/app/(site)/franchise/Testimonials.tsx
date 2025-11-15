
'use client';

import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { Testimonial } from '@/lib/types';
import { useMediaAsset } from '@/lib/media';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, MessageSquare } from 'lucide-react';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const { asset: image, isLoading: isLoadingImage } = useMediaAsset(testimonial.image);
  const { asset: companyLogo, isLoading: isLoadingLogo } = useMediaAsset('logo-symbol');

  const isLoading = isLoadingImage || isLoadingLogo;
  
  return (
      <Card className="bg-white border-zinc-200 rounded-3xl h-full shadow-sm flex flex-col">
          <CardContent className="p-8 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    {isLoading ? <Skeleton className="w-full h-full rounded-full" /> : image && (
                        <Image
                            src={image.imageUrl}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                    )}
                </div>
                 <div className="relative w-16 h-10">
                    <MessageSquare className="w-16 h-16 text-zinc-200" strokeWidth={1} />
                </div>
              </div>
               <div className="flex items-center gap-2 border rounded-full px-3 py-1 text-sm">
                 <div className="w-12 h-12 relative">
                  {isLoading ? <Skeleton className="w-full h-full rounded-full" /> : companyLogo && (
                    <Image src={companyLogo.imageUrl} alt="Company Logo" fill className="object-contain p-2 filter grayscale" data-ai-hint={companyLogo.imageHint} />
                  )}
                 </div>
                 <span className="font-semibold text-zinc-600">{testimonial.company || 'KDD Franchise'}</span>
               </div>
            </div>

            <blockquote className="text-xl font-medium text-zinc-800 flex-grow my-4">
            “{testimonial.quote}”
            </blockquote>
            
            <div className="border-t border-zinc-200 pt-4">
              <p className="font-bold text-zinc-900 text-lg">{testimonial.name}</p>
              <p className="text-zinc-600">{testimonial.designation}</p>
            </div>
          </CardContent>
      </Card>
  );
}

export default function Testimonials() {
  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'testimonials'), limit(6)) : null, [firestore]);
  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);
  
  if (isLoading) {
      return (
          <section className="py-24 sm:py-32 bg-white">
              <div className="container mx-auto px-4">
                  <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
              </div>
          </section>
      )
  }

  if (!testimonials || testimonials.length === 0) {
      return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-left max-w-4xl mb-12">
          <p className="font-semibold text-zinc-500 uppercase">Our Reviews</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mt-2">
            What Our <span className="text-zinc-400">Clients Say</span>
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials?.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
            </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
