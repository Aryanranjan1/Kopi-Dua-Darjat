import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Instagram, Facebook, Youtube, Mail } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '../ui/input';

export default function LatestBlog() {
  const eventImage1 = PlaceHolderImages.find((img) => img.id === 'community-event-1');
  const eventImage2 = PlaceHolderImages.find((img) => img.id === 'community-event-2');
  const newsletterImage = PlaceHolderImages.find((img) => img.id === 'newsletter-background');

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-4xl font-headline font-bold text-primary leading-tight">
              Join the <br /> <span className="text-accent">Community</span>
            </h2>
          </div>
          <div>
            <p className="text-lg text-muted-foreground max-w-prose">
              Connect and grow with thousands of coffee enthusiasts and professionals in the Kopi Dua Darjat family.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            <Card className="bg-card overflow-hidden shadow-lg rounded-3xl">
              <Carousel opts={{ loop: true }}>
                <CarouselContent>
                  {eventImage1 && (
                    <CarouselItem>
                      <div className="relative aspect-video">
                        <Image
                          src={eventImage1.imageUrl}
                          alt={eventImage1.description}
                          fill
                          className="object-cover"
                          data-ai-hint={eventImage1.imageHint}
                        />
                      </div>
                    </CarouselItem>
                  )}
                  {eventImage2 && (
                    <CarouselItem>
                       <div className="relative aspect-video">
                        <Image
                          src={eventImage2.imageUrl}
                          alt={eventImage2.description}
                          fill
                          className="object-cover"
                          data-ai-hint={eventImage2.imageHint}
                        />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <CarouselPrevious className="relative -left-0 -bottom-0 transform-none static" />
                  <CarouselNext className="relative -right-0 -bottom-0 transform-none static" />
                </div>
              </Carousel>
            </Card>
             <h3 className="text-2xl font-headline text-primary font-bold">
                We participate in coffee expos and organize special events to engage with our trading community in person.
            </h3>
          </div>

          <div className="space-y-8">
            <Card className="bg-card shadow-lg rounded-3xl p-8 flex flex-col justify-between">
                <div>
                    <h3 className="font-headline text-2xl font-bold text-primary">Join our Socials</h3>
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
            
            <Card className="bg-card shadow-lg rounded-3xl p-8 relative overflow-hidden min-h-[300px] flex flex-col justify-between text-white">
                {newsletterImage && (
                    <Image 
                        src={newsletterImage.imageUrl}
                        alt={newsletterImage.description}
                        fill
                        className="object-cover z-0"
                        data-ai-hint={newsletterImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="z-20 relative flex flex-col h-full">
                    <div>
                        <p className="text-sm text-white/80">Newsletter</p>
                        <h3 className="font-headline text-2xl font-bold mt-2">
                            Get Exclusive Promos
                        </h3>
                        <p className="text-white/80 mt-1 text-sm">Be the first to know about our special offers and new drinks.</p>
                    </div>
                    <div className="mt-auto">
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" className="bg-white/90 text-black placeholder:text-gray-500" />
                            <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

    