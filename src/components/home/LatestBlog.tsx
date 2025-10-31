
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Instagram, Facebook, Youtube } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '../ui/input';
import { blogPosts } from '@/lib/data';
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function LatestBlog() {
  const eventImage1 = PlaceHolderImages.find((img) => img.id === 'community-event-1');
  const eventImage2 = PlaceHolderImages.find((img) => img.id === 'community-event-2');
  const eventImage3 = PlaceHolderImages.find((img) => img.id === 'community-event-3');

  const articles = blogPosts.slice(0, 2);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const eventImages = [eventImage1, eventImage2, eventImage3].filter(Boolean);

  return (
    <section className="py-24 sm:py-32 bg-primary/65">
      <div className="container mx-auto px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <AnimateOnScroll animationType='slideInFromLeft' className="lg:ml-8">
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-foreground leading-tight">
              Join the <br /> <span className="text-accent">Community</span>
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animationType='slideInFromRight'>
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              More than just great coffee, we're a community of flavor-chasers and story-tellers. Dive into our latest articles, join the conversation on social media, and become part of the Kopi Dua Darjat family.
            </p>
          </AnimateOnScroll>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            <AnimateOnScroll animationType='slideInFromLeft' amount={0.2}>
              <Card className="bg-background overflow-hidden shadow-lg rounded-3xl">
                <Carousel 
                  plugins={[plugin.current]}
                  className="w-full"
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                  opts={{ loop: true }}
                >
                  <CarouselContent>
                    {eventImages.map((image) => (
                      image && (
                        <CarouselItem key={image.id}>
                          <Link href={image.linkUrl || '#'} target="_blank" rel="noopener noreferrer">
                            <div className="relative aspect-video cursor-pointer">
                              <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                className="object-cover"
                                data-ai-hint={image.imageHint}
                              />
                            </div>
                          </Link>
                        </CarouselItem>
                      )
                    ))}
                  </CarouselContent>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <CarouselPrevious className="relative -left-0 -bottom-0 transform-none static" />
                    <CarouselNext className="relative -right-0 -bottom-0 transform-none static" />
                  </div>
                </Carousel>
              </Card>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {articles.map((article, index) => (
                <AnimateOnScroll key={article.id} animationType='fadeIn' delay={index * 0.1}>
                  <Card className="bg-background shadow-lg rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl transition-shadow h-full">
                    <div>
                      <h3 className="font-headline text-xl font-bold text-foreground">{article.title}</h3>
                    </div>
                    <Button asChild variant="link" className="p-0 mt-4 self-start text-accent">
                      <Link href={`/blog/${article.slug}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </Card>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <AnimateOnScroll animationType='slideInFromRight' delay={0.1}>
              <Card className="bg-background shadow-lg rounded-3xl p-8 flex flex-col justify-between">
                  <div>
                      <h3 className="font-headline text-2xl font-bold text-foreground">Join our Socials</h3>
                      <p className="text-muted-foreground mt-2">
                          Network online and stay on top of updates, events, and trading trends.
                      </p>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                      <Button variant="outline" size="icon" className="rounded-full w-12 h-12">
                          <Instagram className="w-6 h-6" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-12 h-12">
                          <Facebook className="w-6 h-6" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-12 h-12">
                          <Youtube className="w-6 h-6" />
                      </Button>
                  </div>
              </Card>
            </AnimateOnScroll>
            
            <AnimateOnScroll animationType='slideInFromRight' delay={0.2}>
              <Card className="bg-background shadow-lg rounded-3xl p-8 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src="/video/bg1.mp4"
                  />
                  <div className="absolute inset-0 bg-black/60 z-10"></div>
                  <div className="z-20 relative flex flex-col h-full">
                      <div>
                          <p className="text-sm text-white/80">Newsletter</p>
                          <h3 className="font-headline text-2xl text-white font-bold mt-2">
                              Get Exclusive Promos
                          </h3>
                          <p className="text-white/80 mt-1 text-sm">Be the first to know about our special offers and new drinks.</p>
                      </div>
                      <div className="mt-auto pt-8">
                          <div className="flex gap-2">
                              <Input placeholder="Enter your email" className="bg-white/90 text-foreground placeholder:text-muted-foreground" />
                              <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                  Subscribe
                              </Button>
                          </div>
                      </div>
                  </div>
              </Card>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
