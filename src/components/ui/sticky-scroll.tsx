// component.tsx
'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const StickyScroll = forwardRef<HTMLElement>((props, ref) => {
  const images = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));
  
  const col1 = images.slice(0, 5);
  const col2 = images.slice(5, 8);
  const col3 = images.slice(8, 13);


  return (
    <ReactLenis root>
      <main className='bg-background' ref={ref}>
        <section className='text-foreground w-full bg-background'>
          <div className='grid grid-cols-12 gap-2'>
            <div className='grid gap-2 col-span-4'>
              {col1.map(image => image && (
                <figure key={image.id} className='w-full relative h-96'>
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    data-ai-hint={image.imageHint}
                    className='transition-all duration-300 align-bottom object-cover rounded-md '
                  />
                </figure>
              ))}
            </div>
            <div className='sticky top-0 h-screen w-full col-span-4 gap-2  grid grid-rows-3'>
              {col2.map(image => image && (
                <figure key={image.id} className='w-full h-full relative'>
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    data-ai-hint={image.imageHint}
                    className='transition-all duration-300 align-bottom object-cover rounded-md '
                  />
                </figure>
              ))}
            </div>
            <div className='grid gap-2 col-span-4'>
              {col3.map(image => image && (
                <figure key={image.id} className='w-full relative h-96'>
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    data-ai-hint={image.imageHint}
                    className='transition-all duration-300 align-bottom object-cover rounded-md '
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

      </main>
    </ReactLenis>
  );
});

StickyScroll.displayName = 'StickyScroll';

export default StickyScroll;
