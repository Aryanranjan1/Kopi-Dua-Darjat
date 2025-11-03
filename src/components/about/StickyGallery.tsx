
'use client';
import { ReactLenis, useLenis } from '@studio-freight/lenis/react';
import React, { forwardRef, useEffect } from 'react';
import { useMedia } from '@/lib/media';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

const GalleryColumn = ({ images }: { images: any[] }) => (
  <div className='grid gap-2 col-span-4'>
    {images.map((image, index) => (
      <figure key={index} className='w-full'>
        {image ? (
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={500}
            height={384}
            className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
            data-ai-hint={image.imageHint}
          />
        ) : (
          <Skeleton className='w-full h-96 rounded-md' />
        )}
      </figure>
    ))}
  </div>
);

const StickyColumn = ({ images }: { images: any[] }) => (
  <div className='sticky top-0 h-screen w-full col-span-4 gap-2 grid grid-rows-3'>
    {images.map((image, index) => (
      <figure key={index} className='w-full h-full'>
        {image ? (
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={500}
            height={500}
            className='transition-all duration-300 h-full w-full align-bottom object-cover rounded-md'
            data-ai-hint={image.imageHint}
          />
        ) : (
          <Skeleton className='w-full h-full rounded-md' />
        )}
      </figure>
    ))}
  </div>
);

const Component = forwardRef<HTMLElement>((props, ref) => {
  const { data: media, isLoading } = useMedia();

  const galleryImages = media?.filter(m => m.id.startsWith('gallery-')).slice(0, 13) || [];
  
  const leftColImages = isLoading ? Array(5).fill(null) : galleryImages.slice(0, 5);
  const centerColImages = isLoading ? Array(3).fill(null) : galleryImages.slice(5, 8);
  const rightColImages = isLoading ? Array(5).fill(null) : galleryImages.slice(8, 13);
  
  return (
      <main className='bg-black' ref={ref}>
        <div className='wrapper'>
          <section className='text-white h-[60vh] w-full bg-slate-950 grid place-content-center sticky top-0'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
            <h2 className='text-4xl md:text-5xl font-headline text-primary text-center tracking-tight leading-[120%]'>
              A Glimpse Into Our World
            </h2>
            <p className='text-center text-lg text-white/70 mt-4 max-w-2xl mx-auto'>
              Every cup, every stall, and every smile is a part of the Kopi Dua Darjat story. Here's a look at the moments that make us who we are.
            </p>
          </section>
        </div>

        <section className='text-white w-full bg-slate-950 p-2'>
          <div className='grid grid-cols-12 gap-2'>
            <GalleryColumn images={leftColImages} />
            <StickyColumn images={centerColImages} />
            <GalleryColumn images={rightColImages} />
          </div>
        </section>
      </main>
  );
});

Component.displayName = 'Component';

const StickyGallery = () => {
  // We wrap the component in ReactLenis to provide the smooth scroll context
  return (
    <ReactLenis root>
      <Component />
    </ReactLenis>
  );
}

export default StickyGallery;
