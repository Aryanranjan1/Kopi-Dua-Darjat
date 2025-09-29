'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { Coffee } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: NavItem[];
}

export function MobileNav({ isOpen, setIsOpen, navItems }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="pr-0 flex flex-col">
        <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">A list of links to navigate the Kopi Dua Darjat website.</SheetDescription>
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <Coffee className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold font-headline text-primary">
            Kopi Dua Darjat
          </span>
        </Link>
        <ScrollArea className="my-4 flex-1 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-4">
            {navItems.map(
              (item) =>
                item.href && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
