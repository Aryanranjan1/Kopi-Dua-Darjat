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
        isScrolled ? 'bg-primary' : 'bg-transparent',
        isHidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
            
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
                  ? 'text-foreground bg-primary/90'
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
