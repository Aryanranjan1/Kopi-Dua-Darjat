
'use client';

import React from 'react';
import { useMedia } from '@/lib/media';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

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

const StickyGallery = () => {
  const { data: media, isLoading } = useMedia();

  const galleryImages = React.useMemo(() => {
    if (isLoading) return Array(13).fill(null);
    return media?.filter(m => m.id.startsWith('gallery-')).slice(0, 13) || [];
  }, [media, isLoading]);
  
  const col1Images = galleryImages.slice(0, 5);
  const col2Images = galleryImages.slice(5, 8);
  const col3Images = galleryImages.slice(8, 13);
  
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
