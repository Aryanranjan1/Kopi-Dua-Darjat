'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import type { NavItem } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    className="h-6 w-6 mr-2"
  >
    <path d="M10 20.5c-3.3 0-6-2.2-6-5v-5c0-2.8 2.7-5 6-5h4c3.3 0 6 2.2 6 5v5c0 2.8-2.7 5-6 5h-4z" />
    <path d="M16 10.5h.5c1.4 0 2.5 1.1 2.5 2.5v1c0 1.4-1.1 2.5-2.5 2.5H16" />
    <path d="M7 2h8" />
  </svg>
);


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
          <Icon />
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
