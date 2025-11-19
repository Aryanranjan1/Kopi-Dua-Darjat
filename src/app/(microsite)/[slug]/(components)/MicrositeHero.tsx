
'use client';

import type { Outlet } from '@/lib/types';
import Image from 'next/image';

interface MicrositeHeroProps {
  outlet: Outlet;
}

export default function MicrositeHero({ outlet }: MicrositeHeroProps) {
  const heroImageUrl = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSz128v6Y9CJhTN9m1JGDFmwH4G5Wt0suN4bYA35vGk_dV5f1h8mCKLyZVp8RYWF14J-cgbjzWK2OmjRSQCqOz3koHxfB81P86wZLhZpKgFdAaQnxgtlWK1yvPhPqrgGdaYp2i0E5Q=w408-h544-k-no";
  
  return (
    <section className="relative w-full h-[60vh] bg-zinc-900">
      {heroImageUrl ? (
        <Image
          src={heroImageUrl}
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
