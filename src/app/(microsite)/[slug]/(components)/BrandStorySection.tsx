
'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { SiteSettings } from '@/lib/types';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { useMediaAsset } from '@/lib/media';
import { Skeleton } from '@/components/ui/skeleton';

interface BrandStorySectionProps {
  settings: SiteSettings;
}

export default function BrandStorySection({ settings }: BrandStorySectionProps) {
  const founder1 = settings.founders?.[0];
  const { asset: founderImage, isLoading } = useMediaAsset(founder1?.imageId || '');

  const story = {
      title: "Antara Warisan & Artisan",
      content: [
          "Kopi Dua Darjat was born from a simple vision: to honour the rich legacy of Malaysian Kopi Kampung while embracing the meticulous craft of artisan coffee. We bridge generations, serving nostalgic flavours with a modern touch.",
          "Our journey began with a single stall and a passion for authentic taste. Today, with over 50 outlets, we continue to share the warmth of community and the joy of a perfect cup, brewed with heritage and heart."
      ],
      tagline: "Brewed with heritage and heart."
  }

  return (
    <section id="about" className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <AnimateOnScroll animationType="slideInFromLeft">
            <div className="relative aspect-square rounded-lg overflow-hidden">
                {isLoading ? <Skeleton className="w-full h-full" /> : (founderImage && 
                    <Image
                      src={founderImage.imageUrl}
                      alt={founder1?.name || 'Founder'}
                      fill
                      className="object-cover"
                      data-ai-hint={founderImage.imageHint}
                    />
                )}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animationType="fadeIn" delay={0.2}>
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-black leading-tight">
                {story.title}
              </h2>
              <div className="mt-6 space-y-4 text-lg text-neutral-600">
                {story.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-8 text-2xl font-serif italic text-black">
                “{story.tagline}”
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
