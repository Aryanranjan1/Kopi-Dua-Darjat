import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Header from './Header';

export default function Hero() {
  return (
    <>
      <Header />
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden bg-card">
        {/* Main Content Area */}
        <div className="container mx-auto px-12 z-10">
          <AnimateOnScroll animationType='slideInFromBottom'>
              <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tight text-primary drop-shadow-lg">
                Antara Warisan & Artisan.
              </h1>
              <p className="mt-6 text-lg text-foreground/80 max-w-2xl mx-auto">
                Experience the perfect blend of heritage and artisan coffee, crafted with passion and served with warmth in over 50+ outlets nationwide.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/menu">See The Menu</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <Link href="/outlets">Find Outlet Near Me</Link>
                </Button>
              </div>
          </AnimateOnScroll>
        </div>

        {/* Bottom Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-0 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#f7f4ef" fillOpacity="1" d="M0,288L48,288C96,288,192,288,288,256C384,224,480,160,576,133.3C672,107,768,117,864,149.3C960,181,1056,235,1152,229.3C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
    </>
  );
}
