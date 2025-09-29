import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function FranchiseTeaser() {
    const franchiseImage = PlaceHolderImages.find((img) => img.id === 'franchise-teaser');

  return (
    <section className="bg-primary text-primary-foreground py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative aspect-square max-w-md mx-auto w-full">
                {franchiseImage && (
                <Image
                    src={franchiseImage.imageUrl}
                    alt={franchiseImage.description}
                    fill
                    className="object-cover rounded-2xl shadow-xl"
                    data-ai-hint={franchiseImage.imageHint}
                />
                )}
            </div>
          <div className="text-center md:text-left">
            <h2 className="font-headline text-4xl font-bold">
              Berminat jadi rakan niaga?
            </h2>
            <p className="mt-4 text-lg max-w-prose text-primary-foreground/80">
              Pelaburan kopi yang terbukti menguntungkan. Join a fast-growing Malaysian brand and bring the taste of Kopi Dua Darjat to your community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/franchise">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
