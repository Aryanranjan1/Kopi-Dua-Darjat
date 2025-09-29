import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { featuredDrinks } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export default function FeaturedDrinks() {
  return (
    <section className="py-24 sm:py-32 bg-background">
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
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {featuredDrinks.map((drink) => {
                const drinkImage = PlaceHolderImages.find(
                  (img) => img.id === drink.image
                );
                return (
                  <CarouselItem key={drink.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <Card className="overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 rounded-xl bg-secondary border-none">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          {drinkImage && (
                            <div className="relative w-48 h-48 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                              <Image
                                src={drinkImage.imageUrl}
                                alt={drink.name}
                                fill
                                className="object-contain drop-shadow-lg"
                                data-ai-hint={drinkImage.imageHint}
                              />
                            </div>
                          )}
                          <h3 className="font-headline text-2xl text-primary">{drink.name}</h3>
                          <p className="mt-2 text-sm text-muted-foreground h-10">{drink.description}</p>
                           <p className="text-2xl font-bold font-headline text-primary mt-4">RM{drink.price.toFixed(2)}</p>
                          <Button className="mt-4" variant="outline">
                            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Order
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-12" />
            <CarouselNext className="hidden sm:flex -right-12" />
          </Carousel>
        </div>
        <div className="mt-12">
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
