
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Phone, Instagram } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from '@/components/layout/Logo';
import type { Outlet, SiteSettings } from '@/lib/types';
import { FaTiktok, FaFacebook } from 'react-icons/fa';
import { useSettings } from '@/components/layout/SettingsProvider';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

const navItems = [
  { title: 'Home', href: '#home' },
  { title: 'About', href: '#about' },
  { title: 'Menu', href: '#menu' },
  { title: 'Outlets', href: '#outlet-locator' },
];

interface MicrositeHeaderProps {
    outlet: Outlet;
}

export default function MicrositeHeader({ outlet }: MicrositeHeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const { settings } = useSettings();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      let currentSection = '';
      for(const item of navItems) {
        const sectionId = item.href.substring(1);
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl && window.scrollY >= sectionEl.offsetTop - 100) {
          currentSection = sectionId;
        }
      }
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`;

  const instagramUrl = outlet.socials?.instagram || settings?.socials?.instagram;
  const tiktokUrl = outlet.socials?.tiktok || settings?.socials?.tiktok;
  const facebookUrl = outlet.socials?.facebook || settings?.socials?.facebook;
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md' : 'bg-black/30 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="p-0 m-0 h-20 flex items-center">
            <Logo className={cn("filter", isScrolled ? 'brightness-0' : 'brightness-0 invert')} />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative text-sm font-medium transition-colors',
                 isScrolled ? 'text-black hover:text-black/70' : 'text-white hover:text-white/70'
              )}
            >
              {item.title}
              {activeSection === item.href.substring(1) && (
                <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5",
                    isScrolled ? "bg-black" : "bg-white"
                )} />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-4">
                {outlet.whatsappLink && (
                  <a href={outlet.whatsappLink} target="_blank" rel="noopener noreferrer" className={cn('text-sm font-medium transition-colors', isScrolled ? 'text-black hover:text-black/70' : 'text-white hover:text-white/70')}>
                      <Phone className="h-5 w-5" />
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={cn('text-sm font-medium transition-colors', isScrolled ? 'text-black hover:text-black/70' : 'text-white hover:text-white/70')}>
                      <Instagram className="h-5 w-5" />
                  </a>
                )}
                {tiktokUrl && (
                    <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className={cn('text-sm font-medium transition-colors', isScrolled ? 'text-black hover:text-black/70' : 'text-white hover:text-white/70')}>
                        <FaTiktok className="h-5 w-5" />
                    </a>
                )}
                {facebookUrl && (
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={cn('text-sm font-medium transition-colors', isScrolled ? 'text-black hover:text-black/70' : 'text-white hover:text-white/70')}>
                        <FaFacebook className="h-5 w-5" />
                    </a>
                )}
            </div>
             <LanguageSwitcher className={cn('bg-transparent border-none', isScrolled ? 'text-black hover:bg-black/10' : 'text-white hover:bg-white/10')} />
             <Button asChild variant="outline" className={cn(
               'rounded-full ml-4',
                isScrolled 
                ? 'border-black text-black hover:bg-black hover:text-white' 
                : 'bg-white text-black border-transparent hover:bg-white/90'
             )}>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                    Visit Us
                </a>
            </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher className={cn('bg-transparent border-none', isScrolled ? 'text-black hover:bg-black/10' : 'text-white hover:bg-white/10')} />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn('lg:hidden', isScrolled ? 'text-black hover:text-black' : 'text-white hover:text-white')}>
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
                                    activeSection === item.href.substring(1) ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                                )}
                                >
                                {item.title}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto">
                            <Button asChild className="w-full rounded-full bg-black text-white hover:bg-white hover:text-black border border-transparent hover:border-black">
                               <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
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
