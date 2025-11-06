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
import Image from 'next/image';
import { useSettings } from './SettingsProvider';
import { Logo } from './Logo';

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Menu', href: '/menu' },
  { title: 'Outlets', href: '/outlets' },
  { title: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const { settings } = useSettings();
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
        isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent',
        isHidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="p-0 m-0 h-20 flex items-center">
             <Image src="/image/1.svg" alt="Kopi Dua Darjat Logo" width={80} height={80} className="object-contain filter invert" />
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center bg-zinc-800/80 rounded-full shadow-lg p-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-full transition-colors',
                pathname === item.href
                  ? 'text-black bg-primary'
                  : 'text-white hover:text-primary'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
            <Button asChild className="hidden lg:flex rounded-full bg-primary text-black hover:bg-primary/80">
              <Link href="/outlets">
                <MapPin className="mr-2 h-4 w-4" />
                Locate Me
              </Link>
            </Button>
            
            {/* Mobile Navigation Trigger */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-zinc-800 hover:text-white">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-black text-white border-zinc-800">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Mobile Menu</SheetTitle>
                      <SheetDescription>Navigation links for Kopi Dua Darjat</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col h-full p-4">
                        <Link href="/" className="h-20 flex items-center p-0 m-0">
                           <Image src="/image/1.svg" alt="Kopi Dua Darjat Logo" width={80} height={80} className="object-contain filter invert" />
                        </Link>
                        <div className="flex flex-col space-y-4 mt-8">
                            {navItems.map((item) => (
                                <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-lg font-medium',
                                    pathname === item.href ? 'text-primary' : 'text-white/70 hover:text-white'
                                )}
                                >
                                {item.title}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto">
                            <Button asChild className="w-full rounded-full bg-primary text-black hover:bg-primary/90">
                              <Link href="/outlets">
                                <MapPin className="mr-2 h-4 w-4" />
                                Locate Me
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
