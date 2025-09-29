import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'drink-darjat');

  return (
    <section className="relative bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-32 grid md:grid-cols-2 gap-8 items-center">
        <div className="z-10 text-center md:text-left">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary drop-shadow-lg">
                Antara Warisan & Artisan.
            </h1>
            <p className="mt-4 text-lg text-foreground/80 max-w-lg mx-auto md:mx-0">
                Experience the perfect blend of heritage and artisan coffee, crafted with passion and served with warmth in over 50+ outlets nationwide.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Button size="lg" asChild>
                  <Link href="/menu">See The Menu</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                  <Link href="/outlets">
                    Find Outlet Near Me
                  </Link>
              </Button>
            </div>
        </div>
        <div className="relative h-80 md:h-full w-full flex items-center justify-center">
            {heroImage && (
                <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] animate-pulse">
                     <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-contain rounded-full shadow-2xl drop-shadow-2xl"
                        priority
                        data-ai-hint={heroImage.imageHint}
                     />
                </div>
            )}
        </div>
      </div>
       <div className="absolute bottom-0 left-0 w-full h-24 bg-background [clip-path:ellipse(100%_100%_at_50%_100%)]"></div>
    </section>
  );
}
