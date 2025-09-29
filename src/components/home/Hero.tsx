import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Stats from './Stats';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-coffee-cup');

  return (
    <section className="relative w-full min-h-screen text-primary-foreground overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-[-2]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/video/bg1.mp4"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 h-full relative">
        <div className="grid md:grid-cols-5 items-center h-full min-h-screen pt-20 md:pt-0">
          
          {/* Mobile Image */}
          <div className="md:hidden col-span-5 flex justify-center -mt-16">
            {heroImage && (
              <div className="relative w-[300px] h-[300px]">
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
          </div>

          {/* Text Content */}
          <div className="md:col-span-5 z-10 text-center md:text-left pb-48 md:pb-0">
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
      </div>
    </section>
  );
}
