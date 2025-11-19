
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, MapPin } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from '@/components/layout/Logo';
import type { Outlet } from '@/lib/types';

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '#about-story' },
  { title: 'Menu', href: '#menu' },
  { title: 'Outlets', href: '/outlets' },
  { title: 'Contact', href: '/contact' },
];

interface MicrositeHeaderProps {
    outlet: Outlet;
}

export default function MicrositeHeader({ outlet }: MicrositeHeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md' : 'bg-black/30 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.slice(0,2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative text-sm font-medium transition-colors',
                 isScrolled ? 'text-black' : 'text-white',
                 pathname === item.href
                  ? 'text-primary'
                  : 'hover:text-primary'
              )}
            >
              {item.title}
              {pathname === item.href && (
                <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5",
                    isScrolled ? "bg-black" : "bg-white"
                )} />
              )}
            </Link>
          ))}
        </nav>
        
        {/* Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="p-0 m-0 h-20 flex items-center">
                <Logo className={cn("filter", isScrolled ? 'brightness-0' : 'brightness-0 invert')} />
            </Link>
        </div>


        <nav className="hidden lg:flex items-center gap-8">
            {navItems.slice(2,4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative text-sm font-medium transition-colors',
                 isScrolled ? 'text-black' : 'text-white',
                 pathname === item.href
                  ? 'text-primary'
                  : 'hover:text-primary'
              )}
            >
              {item.title}
               {pathname === item.href && (
                <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5",
                    isScrolled ? "bg-black" : "bg-white"
                )} />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
            <Button asChild className="hidden lg:flex rounded-full bg-white text-black hover:bg-primary hover:text-black">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                Visit Us
              </a>
            </Button>
            
            {/* Mobile Navigation Trigger */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/20 hover:text-white">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-white">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Mobile Menu</SheetTitle>
                      <SheetDescription>Navigation links for Kopi Dua Darjat</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col h-full p-4">
                        <Link href="/" className="h-20 flex items-center p-0 m-0">
                           <Logo className="filter brightness-0" />
                        </Link>
                        <div className="flex flex-col space-y-4 mt-8">
                            {navItems.map((item) => (
                                <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-lg font-medium',
                                    pathname === item.href ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                                )}
                                >
                                {item.title}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto">
                            <Button asChild className="w-full rounded-full bg-black text-white hover:bg-white hover:text-black">
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

