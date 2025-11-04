
'use client';

import React from 'react';
import Image from 'next/image';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { cn } from '@/lib/utils';

const mediaItems = [
  { type: 'image', src: 'https://picsum.photos/seed/insta-1/600/600' },
  { type: 'video', src: 'https://cdn.pixabay.com/video/2024/04/25/209419_large.mp4', className: 'md:col-span-2 md:row-span-2' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-2/600/600' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-3/600/600' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-4/600/600' },
  { type: 'video', src: 'https://cdn.pixabay.com/video/2024/04/25/209424_large.mp4' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-5/600/600' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-6/600/600' },
  { type: 'video', src: 'https://cdn.pixabay.com/video/2020/08/12/46989-449623829_large.mp4' },
  { type: 'image', src: 'https://picsum.photos/seed/insta-7/600/600' },
];

const MediaItem = ({ item }: { item: typeof mediaItems[0] }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden rounded-lg group", item.className)}>
      {item.type === 'image' ? (
        <Image
          src={item.src}
          alt="Instagram Post"
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <video
          src={item.src}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/30" />
    </div>
  );
};

export default function InstaSync() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <AnimateOnScroll animationType="fadeIn" className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl aspect-square">
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-2 md:gap-4 h-full">
            {mediaItems.map((item, index) => (
              <MediaItem key={index} item={item} />
            ))}
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
