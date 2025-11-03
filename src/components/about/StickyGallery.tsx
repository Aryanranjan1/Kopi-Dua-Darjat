
'use client';

import React from 'react';
import { useMedia } from '@/lib/media';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

const GalleryColumn = ({ images, className }: { images: any[]; className?: string }) => (
  <div className={`grid gap-4 ${className}`}>
    {images.map((image, index) => (
      <figure key={index} className="w-full aspect-[4/5] relative">
        {image ? (
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover rounded-2xl"
            data-ai-hint={image.imageHint}
          />
        ) : (
          <Skeleton className="w-full h-full rounded-2xl" />
        )}
      </figure>
    ))}
  </div>
);

const StickyGallery = () => {
  const { data: media, isLoading } = useMedia();

  const galleryImages = media?.filter(m => m.id.startsWith('gallery-')).slice(0, 13) || [];
  
  // Distribute images into three columns
  const imagesPerColumn = Math.ceil(galleryImages.length / 3);
  const col1Images = isLoading ? Array(5).fill(null) : galleryImages.slice(0, 5);
  const col2Images = isLoading ? Array(3).fill(null) : galleryImages.slice(5, 8);
  const col3Images = isLoading ? Array(5).fill(null) : galleryImages.slice(8, 13);
  
  return (
      <main className='bg-black py-24 sm:py-32'>
        <div className='container mx-auto px-6'>
          <section className='text-white text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-headline text-primary tracking-tight leading-[120%]'>
              A Glimpse Into Our World
            </h2>
            <p className='text-lg text-white/70 mt-4 max-w-2xl mx-auto'>
              Every cup, every stall, and every smile is a part of the Kopi Dua Darjat story. Here's a look at the moments that make us who we are.
            </p>
          </section>

          <section className='text-white w-full'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <GalleryColumn images={col1Images} className="space-y-4" />
              
              <div className="md:sticky md:top-24 h-fit space-y-4">
                 {col2Images.map((image, index) => (
                    <figure key={index} className="w-full aspect-[4/5] relative">
                        {image ? (
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover rounded-2xl"
                            data-ai-hint={image.imageHint}
                        />
                        ) : (
                        <Skeleton className="w-full h-full rounded-2xl" />
                        )}
                    </figure>
                ))}
              </div>

              <GalleryColumn images={col3Images} className="space-y-4" />
            </div>
          </section>
        </div>
      </main>
  );
}

export default StickyGallery;
