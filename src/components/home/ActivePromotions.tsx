"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function LatestBlog() {
  const communityImage = PlaceHolderImages.find((img) => img.id === 'community-event-1');
  const parallaxBg = PlaceHolderImages.find((img) => img.id === 'parallax-promo-bg');


  return (
    <section className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <AnimateOnScroll animationType="slideInFromLeft" className="lg:ml-8">
            <h2 className="text-5xl md:text-7xl font-headline font-bold text-primary leading-tight">
              Sip Smart. <br /> <span className="text-accent">Stay Sharp.</span>
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animationType="slideInFromRight">
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              We know your day is challenging. Kopi Dua Darjat is more than just coffee; it's a daily ritual that connects you to a vibrant community and rich heritage. We're here to elevate your day.
            </p>
          </AnimateOnScroll>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Large with video background */}
          <AnimateOnScroll animationType="slideInFromLeft" amount={0.2}>
            <Card className="bg-background shadow-lg rounded-3xl p-8 relative overflow-hidden min-h-[450px] flex flex-col justify-between text-primary-foreground col-span-1 lg:col-span-1">
              <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  src="/video/bg1.mp4"
              />
              <div className="absolute inset-0 bg-foreground/70 z-10"></div>
              <div className="z-20 relative flex flex-col h-full">
                  <div>
                      <h3 className="font-headline text-3xl font-bold">The Kopi Dua Darjat Story</h3>
                      <p className="text-primary-foreground/80 mt-2 max-w-prose">
                          Our approach to coffee is unique, blending artisan methods with rich heritage. Our story is crafted by our founders, for coffee lovers of any level.
                      </p>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-4">
                      <Button asChild variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-accent-foreground">
                          <Link href="/about">Our Story <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                      <Button asChild variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-accent-foreground">
                          <Link href="/about">Our Heritage <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                  </div>
              </div>
            </Card>
          </AnimateOnScroll>
          
          <div className="space-y-8">
            {/* Card 2: Refine Strategy */}
            <AnimateOnScroll animationType="slideInFromRight" amount={0.5} delay={0.1}>
              <Card className="bg-background shadow-lg rounded-3xl p-8 flex flex-col justify-between min-h-[210px]">
                  <div>
                      <h3 className="font-headline text-2xl font-bold text-primary">Latest Promos & Offers</h3>
                      <p className="text-muted-foreground mt-2">
                          Stay ahead with our latest deals, new drink alerts, and exclusive offers for our community.
                      </p>
                  </div>
                  <div className="flex gap-4 mt-4">
                      <Button asChild variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary">
                          <Link href="/promotions">Weekday Specials <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                      <Button asChild variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary">
                          <Link href="/menu">New Drinks <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                  </div>
              </Card>
            </AnimateOnScroll>

            {/* Card 3: Stay Informed */}
            <AnimateOnScroll animationType="slideInFromRight" amount={0.5} delay={0.2}>
              <Card className="bg-background shadow-lg rounded-3xl p-8 flex flex-col justify-between min-h-[210px] relative overflow-hidden">
                  {communityImage && (
                      <div className="absolute bottom-0 right-0 h-3/4 w-1/2">
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-transparent"></div>
                          <Image
                              src={communityImage.imageUrl}
                              alt={communityImage.description}
                              fill
                              className="object-cover object-center z-[-1]"
                              data-ai-hint={communityImage.imageHint}
                          />
                      </div>
                  )}
                  <div className='relative z-10'>
                      <h3 className="font-headline text-2xl font-bold text-primary">Join The Community</h3>
                      <p className="text-muted-foreground mt-2 max-w-[60%]">
                        Get daily updates, news, and see what's brewing in our vibrant community.
                      </p>
                  </div>
                  <div className="flex gap-4 mt-4 relative z-10">
                      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                          <Link href="#">Follow on Instagram <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
