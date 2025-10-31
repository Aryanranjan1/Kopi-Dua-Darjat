
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/MobileNav';
import { Menu, MapPin } from 'lucide-react';

const mainNavItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Menu', href: '/menu' },
  { title: 'About', href: '/about' },
  { title: 'Outlets', href: '/outlets' },
  { title: 'Contact', href: '/contact' },
];

const allNavItems: NavItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Menu', href: '/menu' },
    { title: 'Outlets', href: '/outlets' },
    { title: 'Promotions', href: '/promotions' },
    { title: 'Franchise', href: '/franchise' },
    { title: 'About', href: '/about' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
  ];
  
const Icon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FECC0A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      <path d="M10 20.5c-3.3 0-6-2.2-6-5v-5c0-2.8 2.7-5 6-5h4c3.3 0 6 2.2 6 5v5c0 2.8-2.7 5-6 5h-4z" />
      <path d="M16 10.5h.5c1.4 0 2.5 1.1 2.5 2.5v1c0 1.4-1.1 2.5-2.5 2.5H16" />
      <path d="M7 2h8" />
    </svg>
  );

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full p-4">
        <div className="container flex h-16 items-center justify-between bg-background rounded-full shadow-lg">
          <Link href="/" className="flex items-center space-x-2">
            <Icon />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors text-accent/80 hover:text-accent",
                    isActive && "text-accent"
                  )}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-accent rounded-full"></span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
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
      </header>
      <MobileNav
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        navItems={allNavItems}
      />
       <div className="md:hidden fixed bottom-4 right-4 z-50">
         <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg">
           <Link href="/outlets">
             <MapPin className="mr-2 h-5 w-5" />
             Find Outlet
           </Link>
         </Button>
       </div>
    </>
  );
}

