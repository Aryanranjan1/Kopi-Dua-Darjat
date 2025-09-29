import Image from 'next/image';
import Link from 'next/link';
import { promotions } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Ticket } from 'lucide-react';

export default function ActivePromotions() {
  const activePromo = promotions[0];
  const promoImage = PlaceHolderImages.find((img) => img.id === activePromo.image);

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-headline font-bold">
                What's Brewing Now
            </h2>
            <p className="mt-2 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Don't miss out on our latest offers and promotions.
            </p>
        </div>

        <Card className="overflow-hidden shadow-lg bg-secondary text-secondary-foreground border-2 border-accent/50 rounded-xl max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[300px] md:min-h-full">
              {promoImage && (
                <Image
                  src={promoImage.imageUrl}
                  alt={activePromo.title}
                  fill
                  className="object-cover"
                  data-ai-hint={promoImage.imageHint}
                />
              )}
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <Ticket className="w-6 h-6 text-accent" />
                <p className="font-semibold text-accent">Limited Time Offer</p>
              </div>
              <h3 className="mt-4 font-headline text-3xl font-bold text-primary">
                {activePromo.title}
              </h3>
              <p className="mt-2 text-lg text-foreground">
                {activePromo.description}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {activePromo.expiry}
              </p>
              <Button asChild className="mt-6 self-start" size="lg">
                <Link href="/promotions">
                  View All Promotions <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
