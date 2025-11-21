
"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export function ParallaxPromo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  
  // Temporary placeholder image
  const bgImage = {
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxjb2ZmZWV8ZW58MHx8fHwxNzYyMDAwNDgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "A close-up shot of rich, dark coffee beans.",
      imageHint: "coffee"
  };
  const isLoading = false;

  return (
    <div
      ref={containerRef}
      className="relative grid h-[50vh] w-full place-items-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {isLoading ? <Skeleton className="w-full h-full" /> : bgImage && (
            <Image
            src={bgImage.imageUrl}
            alt={bgImage.description}
            fill
            className="object-cover"
            data-ai-hint={bgImage.imageHint}
            />
        )}
      </motion.div>
      <div className="absolute inset-0 z-10 bg-black/60" />

      <div className="relative z-20 flex flex-col items-center text-center text-primary-foreground">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl font-headline font-bold drop-shadow-md md:text-6xl"
        >
          Today Only: RM3 Signature Kopi
        </motion.h2>
         <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             viewport={{ once: true, amount: 0.5 }}
             className="mt-6"
         >
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/outlets">
                Grab Yours Today <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
         </motion.div>
      </div>
    </div>
  );
};
