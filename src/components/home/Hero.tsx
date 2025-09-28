import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CoffeeBean } from '@/components/icons/CoffeeBean';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section className="relative h-[80vh] min-h-[500px] max-h-[700px] w-full">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <div className="relative p-8 bg-black/30 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="absolute -top-4 -left-4">
                <CoffeeBean className="w-16 h-16 text-primary-foreground/50 transform -rotate-45" />
            </div>
            <div className="absolute -bottom-4 -right-4">
                <CoffeeBean className="w-16 h-16 text-primary-foreground/50 transform rotate-[135deg]" />
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary-foreground drop-shadow-lg">
                Kopi Dua Darjat
            </h1>
            <p className="mt-4 text-xl md:text-2xl max-w-2xl text-primary-foreground/90 drop-shadow-md">
                Antara Warisan & Artisan
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/outlets">
                Find an Outlet
                <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                <Link href="/menu">See The Menu</Link>
            </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
