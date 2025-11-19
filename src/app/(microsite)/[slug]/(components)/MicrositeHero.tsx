
'use client';

import type { Outlet } from '@/lib/types';
import Image from 'next/image';

interface MicrositeHeroProps {
  outlet: Outlet;
}

export default function MicrositeHero({ outlet }: MicrositeHeroProps) {
  return (
    <section className="relative w-full h-[60vh] bg-zinc-900">
      {outlet.heroImage ? (
        <Image
          src={outlet.heroImage}
          alt={outlet.name}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-white">No hero image available for this outlet.</p>
        </div>
      )}
    </section>
  );
}
