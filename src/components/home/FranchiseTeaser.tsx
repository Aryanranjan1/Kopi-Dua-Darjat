import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CoffeeBean } from '@/components/icons/CoffeeBean';

export default function FranchiseTeaser() {
  const teaserImage = PlaceHolderImages.find((img) => img.id === 'franchise-teaser');

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-square max-w-md mx-auto">
            {teaserImage && (
                <Image
                    src={teaserImage.imageUrl}
                    alt={teaserImage.description}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    data-ai-hint={teaserImage.imageHint}
                />
            )}
            <div className="absolute -bottom-4 -left-4 w-20 h-20 text-accent">
                <CoffeeBean />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-headline text-4xl font-bold">
              Be Part of Our Family
            </h2>
            <p className="mt-4 text-lg max-w-prose text-primary-foreground/80">
              Join a fast-growing Malaysian brand and bring the taste of Kopi Dua Darjat to your community. We provide full training, SOPs, and marketing support.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/franchise">
                  Become a Partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                <Link href="/franchise/apply">
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
