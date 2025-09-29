import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Stats from './Stats';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-coffee-cup');

  return (
    <section className="relative text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 z-[-1]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="https://videos.pexels.com/video-files/4784093/4784093-hd_1920_1080_25fps.mp4"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container mx-auto px-4 min-h-screen flex items-center">
        <div className="z-10 text-center md:text-left max-w-2xl">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-background drop-shadow-lg">
            Antara Warisan & Artisan.
          </h1>
          <p className="mt-4 text-lg text-background/80 max-w-lg mx-auto md:mx-0">
            Experience the perfect blend of heritage and artisan coffee, crafted with passion and served with warmth in over 50+ outlets nationwide.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/menu">See The Menu</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link href="/outlets">Find Outlet Near Me</Link>
            </Button>
          </div>
        </div>
      </div>

      {heroImage && (
        <div className="absolute z-10 bottom-0 md:-bottom-16 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] pointer-events-none">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-contain"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-auto bg-transparent">
        <div
          className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-background [clip-path:ellipse(100%_100%_at_50%_100%)]"
          aria-hidden="true"
        ></div>
        <div className="relative container mx-auto px-4">
            <Stats />
        </div>
      </div>
    </section>
  );
}
