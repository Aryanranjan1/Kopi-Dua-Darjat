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
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Menu', href: '/menu' },
  { title: 'Outlets', href: '/outlets' },
  { title: 'Contact', href: '/contact' },
];

const Icon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-foreground"
    >
      <path d="M10 20.5c-3.3 0-6-2.2-6-5v-5c0-2.8 2.7-5 6-5h4c3.3 0 6 2.2 6 5v5c0 2.8-2.7 5-6 5h-4z" />
      <path d="M16 10.5h.5c1.4 0 2.5 1.1 2.5 2.5v1c0 1.4-1.1 2.5-2.5 2.5H16" />
      <path d="M7 2h8" />
    </svg>
  );

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-card/80 backdrop-blur-sm shadow-md' : 'bg-transparent',
        isHidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
            <Icon />
            <span className="font-bold text-2xl font-headline text-foreground">
                Kopi Dua Darjat
            </span>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center bg-foreground/90 rounded-full shadow-lg p-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-full transition-colors',
                pathname === item.href
                  ? 'text-foreground bg-primary'
                  : 'text-background hover:text-primary'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
            <Button asChild className="hidden lg:flex rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/outlets">
                <MapPin className="h-4 w-4 mr-2" />
                Find Outlet
              </Link>
            </Button>
            
            {/* Mobile Navigation Trigger */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                    <div className="flex flex-col h-full p-4">
                        <Link href="/" className="flex items-center space-x-2 mb-8">
                            <Icon />
                            <span className="font-bold text-xl font-headline">Kopi Dua Darjat</span>
                        </Link>
                        <div className="flex flex-col space-y-4">
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
                            <Button asChild className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                              <Link href="/outlets">
                                <MapPin className="h-4 w-4 mr-2" />
                                Find Outlet
                              </Link>
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
