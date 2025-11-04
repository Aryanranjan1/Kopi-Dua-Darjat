
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Instagram, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

const mediaItems = [
  { type: 'video' as const, src: 'https://cdn.pixabay.com/video/2024/04/25/209419_large.mp4' },
  { type: 'image' as const, src: 'https://picsum.photos/seed/insta-reel-1/450/800' },
  { type: 'video' as const, src: 'https://cdn.pixabay.com/video/2024/04/25/209424_large.mp4' },
  { type: 'image' as const, src: 'https://picsum.photos/seed/insta-reel-2/450/800' },
  { type: 'video' as const, src: 'https://cdn.pixabay.com/video/2020/08/12/46989-449623829_large.mp4' },
  { type: 'image' as const, src: 'https://picsum.photos/seed/insta-reel-3/450/800' },
  { type: 'video' as const, src: 'https://cdn.pixabay.com/video/2024/04/25/209419_large.mp4' },
  { type: 'image' as const, src: 'https://picsum.photos/seed/insta-reel-4/450/800' },
];

const InstaPostOverlay = () => (
    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none text-white">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
              <div className="bg-black p-0.5 rounded-full">
                <img src="https://picsum.photos/seed/kddlogo/40/40" alt="profile" className="rounded-full" />
              </div>
            </div>
            <p className="font-bold text-sm">kopiduadarjat</p>
        </div>
    </div>
);


export default function InstaSync() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]);
  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel({ loop: true });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
    mainEmblaApi?.scrollTo(index);
  }, [emblaApi, mainEmblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi || !mainEmblaApi) return;
    const newSelectedIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newSelectedIndex);
    if (mainEmblaApi.selectedScrollSnap() !== newSelectedIndex) {
      mainEmblaApi.scrollTo(newSelectedIndex);
    }

    // Handle video playback
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === newSelectedIndex) {
          video.play().catch(() => {}); // Play current video
        } else {
          video.pause();
          video.currentTime = 0; // Rewind others
        }
      }
    });

  }, [emblaApi, mainEmblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
        emblaApi.off('select', onSelect);
    }
  }, [emblaApi, onSelect]);
  
  const togglePause = () => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    if (isPaused) autoplay.play();
    else autoplay.stop();
    setIsPaused(!isPaused);
  };
  
  const toggleMute = () => {
    const currentVideo = videoRefs.current[selectedIndex];
    if (currentVideo) {
      currentVideo.muted = !currentVideo.muted;
      setIsMuted(currentVideo.muted);
    }
  };


  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-12">
        <AnimateOnScroll animationType="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline text-primary">#KopiDuaDarjat</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Follow our journey and share your moments with us on Instagram. We love seeing our coffee in the wild!
            </p>
          </div>
        </AnimateOnScroll>
        
        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
          <div 
            className="max-w-sm mx-auto group"
            onMouseEnter={() => { emblaApi?.plugins()?.autoplay?.stop(); setIsPaused(true); }}
            onMouseLeave={() => { emblaApi?.plugins()?.autoplay?.play(); setIsPaused(false); }}
          >
            {/* Main Viewer */}
            <div className="overflow-hidden rounded-2xl relative mb-4 shadow-lg" ref={mainEmblaRef}>
              <div className="flex">
                {mediaItems.map((item, index) => (
                  <div className="relative flex-shrink-0 w-full aspect-[9/16]" key={`main-${index}`}>
                     <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                      {item.type === 'image' ? (
                        <Image src={item.src} alt={`Instagram post ${index + 1}`} fill className="object-cover" />
                      ) : (
                        <video
                          ref={el => videoRefs.current[index] = el}
                          src={item.src}
                          playsInline
                          loop={false}
                          muted={isMuted}
                          className="w-full h-full object-cover"
                          onEnded={() => emblaApi?.scrollNext()}
                        />
                      )}
                      <InstaPostOverlay/>
                     </Link>
                  </div>
                ))}
              </div>

               {/* Controls */}
              <button onClick={togglePause} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-4 bg-black/50 rounded-full text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
                {isPaused ? <Play size={32} /> : <Pause size={32} />}
              </button>
              {mediaItems[selectedIndex].type === 'video' && (
                <button onClick={toggleMute} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white pointer-events-auto">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              )}
            </div>

            {/* Thumbnail Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-2">
                {mediaItems.map((item, index) => (
                  <div 
                    className="flex-shrink-0 w-1/3 pl-2 cursor-pointer" 
                    key={`thumb-${index}`}
                    onClick={() => scrollTo(index)}
                  >
                    <div className={cn(
                        "relative aspect-[9/16] rounded-lg overflow-hidden transition-all duration-300",
                        index === selectedIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-50 hover:opacity-75'
                    )}>
                      {item.type === 'image' ? (
                        <Image src={item.src} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                      ) : (
                        <video src={item.src} muted playsInline className="w-full h-full object-cover" />
                      )}
                       {item.type === 'video' && <Play size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.4} className="mt-12 text-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2 h-4 w-4" />
                Follow Us on Instagram
            </Link>
            </Button>
      </AnimateOnScroll>
      </div>
    </section>
  );
}
