'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, MapPin } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from '@/components/layout/Logo';
import type { Outlet } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MicrositeHeaderProps {
  outlet: Outlet;
}

const navItems = [
  { title: 'Menu', href: '#menu' },
  { title: 'About', href: '#about-story' },
  { title: 'Contact', href: '/contact' },
];

export default function MicrositeHeader({ outlet }: MicrositeHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href={`/${outlet.slug}`} className="p-0 m-0 h-20 flex items-center gap-2 text-foreground">
          <Logo className="filter brightness-0" />
          <span className="font-bold font-headline">{outlet.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center bg-background/50 rounded-full shadow-lg p-1 border">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-foreground hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
            <Button asChild className="hidden lg:flex rounded-full bg-black text-white hover:bg-zinc-800">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin className="mr-2 h-4 w-4" />
                Visit Us
              </a>
            </Button>
            
            {/* Mobile Navigation Trigger */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden rounded-full">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                    <div className="flex flex-col h-full p-4">
                        <Link href={`/${outlet.slug}`} className="h-20 flex items-center p-0 m-0 gap-2">
                           <Logo className="filter brightness-0" />
                           <span className="font-bold font-headline">{outlet.name}</span>
                        </Link>
                        <div className="flex flex-col space-y-4 mt-8">
                            {navItems.map((item) => (
                                <Link
                                key={item.href}
                                href={item.href}
                                className="text-lg font-medium text-foreground/70 hover:text-foreground"
                                >
                                {item.title}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto">
                            <Button asChild className="w-full rounded-full bg-black text-white hover:bg-zinc-800">
                              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                                <MapPin className="mr-2 h-4 w-4" />
                                Visit Us
                              </a>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
