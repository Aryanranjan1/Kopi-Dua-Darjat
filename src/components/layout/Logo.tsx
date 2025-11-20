
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image src="/image/1.svg" alt="Kopi Dua Darjat Logo" width={80} height={80} className={cn(className)} priority />
  );
}
