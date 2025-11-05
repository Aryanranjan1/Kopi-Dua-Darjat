
'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { SiteSettings } from '@/lib/types';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

interface BrandStorySectionProps {
  settings: SiteSettings;
}

const FounderImage = ({ src, name, className }: { src: string; name: string; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      <motion.div style={{ y }} className="relative w-full h-full">
        <Image
          src={src}
          alt={`Founder ${name}`}
          fill
          className="object-cover"
        />
      </motion.div>
      <p className="absolute bottom-4 left-4 text-white font-bold text-lg bg-black/50 px-3 py-1 rounded-md">{name}</p>
    </div>
  );
};

export default function BrandStorySection({ settings }: BrandStorySectionProps) {
  const { founders } = settings;
  const founder1 = founders?.[0];
  const founder2 = founders?.[1];
  
  // A simple placeholder story if not defined in settings
  const story = {
      title: "From Kampung to City",
      content: [
          "Kopi Dua Darjat was born from a simple vision: to honour the rich legacy of Malaysian Kopi Kampung while embracing the meticulous craft of artisan coffee. We bridge generations, serving nostalgic flavours with a modern touch.",
          "Our journey began with a single stall and a passion for authentic taste. Today, with over 50 outlets, we continue to share the warmth of community and the joy of a perfect cup, brewed with heritage and heart."
      ],
      tagline: "Brewed with heritage and heart."
  }

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className="grid grid-cols-2 gap-4 h-[60vh]">
            {founder1?.image && <FounderImage src={founder1.image} name={founder1.name} className="h-full" />}
            {founder2?.image && <FounderImage src={founder2.image} name={founder2.name} className="h-full self-end" />}
          </div>

          <AnimateOnScroll animationType="fadeIn" delay={0.2}>
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-black leading-tight">
                {story.title}
              </h2>
              <div className="mt-6 space-y-4 text-lg text-neutral-600">
                {story.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-8 text-2xl font-serif italic text-black">
                “{story.tagline}”
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
