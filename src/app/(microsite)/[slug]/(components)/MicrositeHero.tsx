
'use client';

import type { Outlet } from '@/lib/types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mouse } from 'lucide-react';

interface MicrositeHeroProps {
  outlet: Outlet;
}

export default function MicrositeHero({ outlet }: MicrositeHeroProps) {
  const heroImageUrl = "https://lh3.googleusercontent.com/p/AF1QipPN12db8DKjb9jFg8lHFguXVNf7TbsrIug8BwE6=w426-h240-k-no";
  
  return (
    <section id="home" className="relative w-full h-screen bg-zinc-900">
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

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div
            animate={{
                y: [0, 10, 0],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
            }}
        >
            <Mouse className="w-8 h-8 text-white/70" />
        </motion.div>
      </div>
    </section>
  );
}
