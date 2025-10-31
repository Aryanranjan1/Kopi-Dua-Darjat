"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { featuredDrinks } from '@/lib/data';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Card } from '@/components/ui/card';

export default function FeaturedDrinks() {
  const mainDrink = featuredDrinks[0];
  const secondaryDrink = featuredDrinks[1];
  const tertiaryDrink = featuredDrinks[2];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-12">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">Signature Selections</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Crafted with passion, our featured drinks represent the heart of Kopi Dua Darjat—a perfect fusion of heritage and modern artisanry.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Drink Card */}
          <AnimateOnScroll animationType="slideInFromLeft" amount={0.2} className="h-full">
            {mainDrink && (
              <Card className="relative flex flex-col justify-between p-8 rounded-2xl shadow-lg group overflow-hidden h-full bg-card">
                <div className="relative z-10">
                  <div className="inline-block bg-accent/20 text-accent font-bold text-sm px-3 py-1 rounded-full mb-4">
                    Signature Blend
                  </div>
                  <h3 className="text-4xl font-headline text-foreground">{mainDrink.name}</h3>
                  <p className="mt-2 text-muted-foreground max-w-xs">{mainDrink.description}</p>
                  <ul className="mt-6 space-y-2 text-muted-foreground">
                    {mainDrink.tags.map(tag => (
                       <li key={tag} className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-accent mr-2" />
                          <span>{tag}</span>
                       </li>
                    ))}
                  </ul>
                </div>
                <div className="relative z-0 lg:absolute lg:right-[-5rem] lg:bottom-[-2rem] lg:w-[26rem] h-64 lg:h-auto mt-8 lg:mt-0">
                   <Image
                    src={mainDrink.image}
                    alt={mainDrink.name}
                    width={450}
                    height={450}
                    className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Card>
            )}
          </AnimateOnScroll>

          {/* Secondary and Tertiary Drink Cards */}
          <div className="flex flex-col gap-8">
            <AnimateOnScroll animationType="slideInFromRight" amount={0.4}>
              {secondaryDrink && (
                <Card className="relative flex items-center p-8 rounded-2xl shadow-lg group overflow-hidden bg-card">
                  <div className="flex-1 z-10">
                    <div className="inline-block bg-accent/20 text-accent font-bold text-sm px-3 py-1 rounded-full mb-4">
                      Artisan Series
                    </div>
                    <h3 className="text-3xl font-headline text-foreground">{secondaryDrink.name}</h3>
                     <ul className="mt-4 space-y-1 text-muted-foreground">
                        {secondaryDrink.tags.map(tag => (
                          <li key={tag} className="flex items-center text-sm">
                              <ChevronRight className="h-4 w-4 text-accent mr-2" />
                              <span>{tag}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="relative w-40 h-40 mr-[-3rem] z-0">
                     <Image
                      src={secondaryDrink.image}
                      alt={secondaryDrink.name}
                      fill
                      className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Card>
              )}
            </AnimateOnScroll>
            <AnimateOnScroll animationType="slideInFromRight" amount={0.4} delay={0.1}>
              {tertiaryDrink && (
                <Card className="relative flex items-center p-8 rounded-2xl shadow-lg group overflow-hidden bg-card">
                  <div className="flex-1 z-10">
                    <div className="inline-block bg-accent/20 text-accent font-bold text-sm px-3 py-1 rounded-full mb-4">
                      On-the-Go
                    </div>
                    <h3 className="text-3xl font-headline text-foreground">{tertiaryDrink.name}</h3>
                    <ul className="mt-4 space-y-1 text-muted-foreground">
                        {tertiaryDrink.tags.map(tag => (
                          <li key={tag} className="flex items-center text-sm">
                              <ChevronRight className="h-4 w-4 text-accent mr-2" />
                              <span>{tag}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="relative w-40 h-40 mr-[-3rem] z-0">
                    <Image
                      src={tertiaryDrink.image}
                      alt={tertiaryDrink.name}
                      fill
                      className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Card>
              )}
            </AnimateOnScroll>
          </div>
        </div>

        <AnimateOnScroll animationType="fadeIn" delay={0.3} className="mt-16 text-center">
            <Button asChild size="lg">
                <Link href="/menu">
                    View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
