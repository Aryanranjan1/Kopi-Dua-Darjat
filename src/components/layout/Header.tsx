'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/MobileNav';
import { Coffee, Menu, MapPin } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { ListItem } from './ListItem';

const aboutLinks: { title: string; href: string; description: string }[] = [
  {
    title: "Our Story",
    href: "/about",
    description:
      "Learn about our history, our passion for coffee, and our mission.",
  },
  {
    title: "Blog",
    href: "/blog",
    description:
      "Read our latest articles, stories, and updates from the world of Kopi Dua Darjat.",
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Get in touch with us for inquiries, partnerships, or feedback.",
  },
]

const franchiseLinks: { title: string; href: string; description: string }[] = [
    {
      title: "Franchise Info",
      href: "/franchise",
      description:
        "Learn more about our franchise model, benefits, and how to get started.",
    },
    {
      title: "Apply Now",
      href: "/franchise/apply",
      description: "Ready to join us? Start your franchise application today.",
    },
]

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
  

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline text-primary text-lg">
              Kopi Dua Darjat
            </span>
          </Link>
          
          <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="hidden md:flex justify-end items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {aboutLinks.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/menu" passHref>
                      <NavigationMenuLink 
                        className={cn('group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50', 
                          pathname === '/menu' ? 'text-foreground' : 'text-foreground/60'
                        )}
                      >
                        Menu
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/outlets" passHref>
                      <NavigationMenuLink 
                        className={cn('group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50', 
                          pathname === '/outlets' ? 'text-foreground' : 'text-foreground/60'
                        )}
                      >
                        Outlets
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Franchise</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {franchiseLinks.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
                <div className="absolute top-full right-0 flex justify-end">
                  <NavigationMenuViewport />
                </div>
              </NavigationMenu>

              <Button asChild className="hidden md:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground ml-2">
                <Link href="/outlets">Find Outlet</Link>
              </Button>
            </div>
            
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
