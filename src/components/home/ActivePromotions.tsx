
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useMediaAsset } from '@/lib/media';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Skeleton } from '../ui/skeleton';
import { siteContentData } from '@/lib/site-content';

export default function ActivePromotions() {
  const { asset: communityImage, isLoading: isLoadingCommunity } = useMediaAsset('community-event-1');
  const { asset: parallaxBg, isLoading: isLoadingParallax } = useMediaAsset('parallax-promo-bg');

  const content = siteContentData.home.activePromotions;

  return (
    <section className="py-24 sm:py-32 bg-black">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 lg:mb-16">
          <AnimateOnScroll animationType="slideInFromLeft" className="lg:ml-8">
            <h2 className="text-5xl md:text-7xl font-headline font-bold text-primary leading-tight" dangerouslySetInnerHTML={{ __html: content.title }} />
          </AnimateOnScroll>
          <AnimateOnScroll animationType="slideInFromRight">
            <p className="mt-4 text-base sm:text-lg text-white max-w-prose">
              {content.subtitle}
            </p>
          </AnimateOnScroll>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Large with video background */}
          <AnimateOnScroll animationType="slideInFromLeft" amount={0.2}>
            <Card className="bg-zinc-900 shadow-lg rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[350px] sm:min-h-[450px] flex flex-col justify-between text-primary-foreground col-span-1">
              <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  src="/video/bg1.mp4"
              />
              <div className="z-20 relative flex flex-col h-full">
                  {/* Content can be added here if needed */}
              </div>
            </Card>
          </AnimateOnScroll>
          
          <div className="space-y-8">
            {/* Card 2: Refine Strategy */}
            <AnimateOnScroll animationType="slideInFromRight" amount={0.5} delay={0.1}>
              <Card className="bg-zinc-900 shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[210px]">
                  <div>
                      <h3 className="font-headline text-2xl font-bold text-white">{content.promoCard.title}</h3>
                      <p className="text-white/80 mt-2 text-sm sm:text-base">
                          {content.promoCard.subtitle}
                      </p>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                      <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white bg-transparent rounded-full">
                          <Link href={content.promoCard.button1Link}>{content.promoCard.button1Text} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                      <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white bg-transparent rounded-full">
                          <Link href={content.promoCard.button2Link}>{content.promoCard.button2Text} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                  </div>
              </Card>
            </AnimateOnScroll>

            {/* Card 3: Stay Informed */}
            <AnimateOnScroll animationType="slideInFromRight" amount={0.5} delay={0.2}>
              <Card className="bg-zinc-900 shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[210px] relative overflow-hidden">
                  {isLoadingCommunity ? <Skeleton className="absolute bottom-0 right-0 h-full w-1/2"/> : communityImage && (
                      <div className="absolute bottom-0 right-0 h-full w-1/2">
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent"></div>
                          <Image
                              src={communityImage.imageUrl}
                              alt={communityImage.description}
                              fill
                              sizes="(max-width: 1024px) 50vw, 25vw"
                              className="object-cover object-center z-[-1]"
                              data-ai-hint={communityImage.imageHint}
                          />
                      </div>
                  )}
                  <div className='relative z-10'>
                      <h3 className="font-headline text-2xl font-bold text-white">{content.communityCard.title}</h3>
                      <p className="text-white/80 mt-2 max-w-[60%] text-sm sm:text-base">
                        {content.communityCard.subtitle}
                      </p>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 relative z-10">
                      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                          <Link href={content.communityCard.buttonLink}>{content.communityCard.buttonText} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                  </div>
              </Card>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
