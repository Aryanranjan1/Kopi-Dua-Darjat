import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[88vh] text-primary-foreground overflow-hidden">
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
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-black to-transparent"></div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 h-full relative">
        <div className="grid md:grid-cols-1 items-center h-full min-h-[88vh] pt-0">
          
          {/* Text Content */}
          <div className="z-10 text-center md:text-left md:w-[56%]">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary drop-shadow-lg">
              Antara <span className="text-accent">Warisan</span> & Artisan.
            </h1>
            <p className="mt-4 text-lg text-primary/80 max-w-lg mx-auto md:mx-0">
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
