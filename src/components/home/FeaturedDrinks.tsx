import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { featuredDrinks } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export default function FeaturedDrinks() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-headline font-bold text-primary">
          Our Signature Selections
        </h2>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Crafted with passion, our featured drinks represent the heart of Kopi Dua Darjat.
        </p>
        <div className="mt-10">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredDrinks.map((drink) => {
                const drinkImage = PlaceHolderImages.find(
                  (img) => img.id === drink.image
                );
                return (
                  <CarouselItem key={drink.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-xl">
                        <CardHeader className="p-0">
                          {drinkImage && (
                            <div className="aspect-[4/5] relative w-full">
                              <Image
                                src={drinkImage.imageUrl}
                                alt={drink.name}
                                fill
                                className="object-cover"
                                data-ai-hint={drinkImage.imageHint}
                              />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-6">
                          <CardTitle className="font-headline text-2xl text-primary">{drink.name}</CardTitle>
                          <CardDescription className="mt-2 h-10">{drink.description}</CardDescription>
                           <p className="text-lg font-semibold text-primary mt-2">RM{drink.price.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
        <div className="mt-8">
            <Button asChild size="lg">
                <Link href="/menu">
                    See Full Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}