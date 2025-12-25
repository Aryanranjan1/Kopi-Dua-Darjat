
'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { useMedia } from '@/lib/media';

const GalleryColumn = ({ images, className }: { images: any[]; className?: string }) => (
  <div className={`grid gap-2 ${className}`}>
    {images.map((image, index) => (
      <figure key={image ? image.id : index} className="w-full aspect-[4/5] relative">
        {image ? (
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            sizes="(max-width: 768px) 33vw, 25vw"
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

// This component is no longer used but kept for reference if needed.
const StickyGallery = () => {
  const { data: media, isLoading } = useMedia();

  const galleryImages = useMemo(() => {
      if (!media) return [];
      return media.filter(m => m.id.startsWith('gallery-'));
  }, [media]);

  const col1Images = galleryImages.slice(0, 5);
  const col2Images = galleryImages.slice(5, 8);
  const col3Images = galleryImages.slice(8, 13);
  
  if (isLoading) {
      return <Skeleton className="w-full h-screen" />
  }

  return (
      <main className='bg-white'>
          <section className='w-full'>
            <div className='grid grid-cols-3 gap-2'>
              <GalleryColumn images={col1Images} className="space-y-2" />
              
              <div className="sticky top-0 h-fit space-y-2">
                 {col2Images.map((image, index) => (
                    <figure key={image ? image.id : `col2-${index}`} className="w-full aspect-[4/5] relative">
                        {image ? (
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            sizes="(max-width: 768px) 33vw, 25vw"
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
