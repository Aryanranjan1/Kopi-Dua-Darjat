
'use client';

import Image from 'next/image';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import TiltedCard from '../animations/TiltedCard';
import { Skeleton } from '../ui/skeleton';
import { siteContentData } from '@/lib/site-content';

export default function WhoAreWe() {
  const { title, subtitle, content } = siteContentData.about.whoAreWe;
  
  // Temporary placeholder data
  const image = {
      imageUrl: "https://images.unsplash.com/photo-1627902520211-73c980850fe8?w=800",
      description: "Image showing traditional coffee brewing.",
      imageHint: "coffee brewing"
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimateOnScroll animationType="slideInFromLeft">
            <div className="relative aspect-video rounded-2xl overflow-hidden group">
                <TiltedCard 
                  imageSrc={image.imageUrl}
                  altText={image.description}
                  containerHeight="100%"
                  imageWidth="100%"
                  imageHeight="100%"
                  captionText={image.description}
                />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animationType="slideInFromRight" className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground inline-block underline decoration-primary decoration-4 underline-offset-8">
              {title}
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              {subtitle}
            </p>
            <p className="mt-4 text-muted-foreground">
              {content}
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
