
'use client';

import React from 'react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

// Temporary placeholder data
const galleryImages = [
  { id: 'gallery-1', imageUrl: 'https://images.unsplash.com/photo-1517701559435-505494a8c255?w=500', description: 'Latte art', imageHint: 'latte art' },
  { id: 'gallery-2', imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500', description: 'Cafe friends', imageHint: 'cafe friends' },
  { id: 'gallery-3', imageUrl: 'https://images.unsplash.com/photo-1559496417-50b5d5b74248?w=500', description: 'Malaysian coffee', imageHint: 'malaysian coffee' },
  { id: 'gallery-4', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500', description: 'Cafe interior', imageHint: 'cafe interior' },
  { id: 'gallery-5', imageUrl: 'https://images.unsplash.com/photo-1525875955322-a27c01a59050?w=500', description: 'Couple coffee', imageHint: 'couple coffee' },
  { id: 'gallery-6', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500', description: 'Coffee roasting', imageHint: 'coffee roasting' },
  { id: 'gallery-7', imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500', description: 'Cozy cafe', imageHint: 'cozy cafe' },
  { id: 'gallery-8', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500', description: 'Barista', imageHint: 'barista' },
  { id: 'gallery-9', imageUrl: 'https://images.unsplash.com/photo-1542181961-9430372250b7?w=500', description: 'Coffee pour', imageHint: 'coffee pour' },
  { id: 'gallery-10', imageUrl: 'https://images.unsplash.com/photo-1587122413491-331528658882?w=500', description: 'Coffee flatlay', imageHint: 'coffee flatlay' },
  { id: 'gallery-11', imageUrl: 'https://images.unsplash.com/photo-1527498332215-5517fde89f45?w=500', description: 'Friends coffee', imageHint: 'friends coffee' },
  { id: 'gallery-12', imageUrl: 'https://images.unsplash.com/photo-1444910629988-537060a46b74?w=500', description: 'Cafe interior', imageHint: 'cafe interior' },
  { id: 'gallery-13', imageUrl: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=500', description: 'Coffee cup', imageHint: 'coffee cup' }
];

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
