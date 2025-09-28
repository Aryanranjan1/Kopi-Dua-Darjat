import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section className="relative h-[70vh] min-h-[450px] max-h-[600px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 max-w-3xl">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary-foreground drop-shadow-lg">
              Antara Warisan & Artisan.
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
                <Link href="/menu">See The Menu</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-accent text-accent bg-transparent hover:bg-accent/10 hover:text-accent">
                <Link href="/outlets">
                  Find Outlet Near Me
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}