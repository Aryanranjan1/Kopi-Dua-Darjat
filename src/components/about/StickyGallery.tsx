
'use client';

import React from 'react';
import { useMedia } from '@/lib/media';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

const GalleryColumn = ({ images, className }: { images: any[]; className?: string }) => (
  <div className={`grid gap-2 ${className}`}>
    {images.map((image, index) => (
      <figure key={index} className="w-full aspect-[4/5] relative">
        {image ? (
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </figure>
    ))}
  </div>
);

const StickyGallery = () => {
  const { data: media, isLoading } = useMedia();

  const galleryImages = media?.filter(m => m.id.startsWith('gallery-')).slice(0, 13) || [];
  
  // Distribute images into three columns
  const col1Images = isLoading ? Array(5).fill(null) : galleryImages.slice(0, 5);
  const col2Images = isLoading ? Array(3).fill(null) : galleryImages.slice(5, 8);
  const col3Images = isLoading ? Array(5).fill(null) : galleryImages.slice(8, 13);
  
  return (
      <main className='bg-white'>
          <section className='w-full'>
            <div className='grid grid-cols-3 gap-2'>
              <GalleryColumn images={col1Images} className="space-y-2" />
              
              <div className="md:sticky md:top-0 h-fit space-y-2">
                 {col2Images.map((image, index) => (
                    <figure key={index} className="w-full aspect-[4/5] relative">
                        {image ? (
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                        ) : (
                        <Skeleton className="w-full h-full" />
                        )}
                    </figure>
                ))}
              </div>

              <GalleryColumn images={col3Images} className="space-y-2" />
            </div>
          </section>
      </main>
  );
}

export default StickyGallery;
