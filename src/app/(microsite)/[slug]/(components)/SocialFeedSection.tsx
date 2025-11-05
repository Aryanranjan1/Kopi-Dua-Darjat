
'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';


const feedItems = [
    { type: 'image', src: 'https://picsum.photos/seed/feed1/600/600' },
    { type: 'image', src: 'https://picsum.photos/seed/feed2/600/600' },
    { type: 'image', src: 'https://picsum.photos/seed/feed3/600/600' },
    { type: 'image', src: 'https://picsum.photos/seed/feed4/600/600' },
    { type: 'image', src: 'https://picsum.photos/seed/feed5/600/600' },
    { type: 'image', src: 'https://picsum.photos/seed/feed6/600/600' },
];

export default function SocialFeedSection() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">
                Join Our Community
            </h2>
            <p className="mt-2 text-lg text-neutral-600">Follow our journey and share yours with #KopiDuaDarjat</p>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {feedItems.map((item, index) => (
            <AnimateOnScroll
              key={index}
              animationType="fadeIn"
              delay={index * 0.05}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <Image
                src={item.src}
                alt={`Social media post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg" className="bg-[#F9C349] text-black hover:bg-[#F9C349]/90 rounded-md">
            <a href="#" target="_blank" rel="noopener noreferrer">
              Follow @kopiduadarjat
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
