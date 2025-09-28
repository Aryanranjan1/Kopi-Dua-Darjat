'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/MobileNav';
import { Coffee, Menu } from 'lucide-react';

const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Our Story', href: '/about' },
  { title: 'Menu', href: '/menu' },
  { title: 'Outlets', href: '/outlets' },
  { title: 'Franchise', href: '/franchise' },
  { title: 'Blog', href: '/blog' },
  { title: 'Contact', href: '/contact' },
  { title: 'AI Tool', href: '/brand-story-generator'},
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Coffee className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block font-headline text-primary text-lg">
            Kopi Dua Darjat
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild className="hidden md:inline-flex" variant="outline">
            <Link href="/franchise/apply">Apply Now</Link>
          </Button>
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
      <MobileNav
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        navItems={navItems}
      />
    </header>
  );
}
