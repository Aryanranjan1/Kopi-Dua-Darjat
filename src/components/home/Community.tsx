'use client';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { siteContentData } from '@/lib/site-content';

const communityData = [
  {
    type: 'portrait',
    name: 'Marina Mogilko',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500',
    bgColor: 'bg-cyan-300',
    className: 'sm:col-span-1',
  },
  {
    type: 'logo',
    name: 'Superhuman',
    imageUrl: '/image/1.svg', 
    className: 'sm:col-span-1',
  },
  {
    type: 'quote',
    quote: "Passionfroot makes it incredibly easy for me to secure sponsorship deals with brands that resonate with my audience.",
    name: 'Jörg Storm',
    role: 'Founder of AI Newsletter Weekly Storm, Top 50 Creator Worldwide',
    bgColor: 'bg-yellow-300',
    textColor: 'text-black',
    className: 'sm:col-span-2',
  },
  {
    type: 'logo',
    name: 'Milk Road',
    imageUrl: '/image/1.svg', 
    className: 'sm:col-span-1',
  },
  {
    type: 'portrait',
    name: 'Zain Kahn',
    imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500',
    bgColor: 'bg-green-400',
    className: 'sm:col-span-1',
  },
  {
    type: 'logo',
    name: 'Every',
    imageUrl: '/image/1.svg', 
    className: 'sm:col-span-1',
  },
  {
    type: 'portrait',
    name: 'Ali Abdaal',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    bgColor: 'bg-orange-400',
    className: 'sm:col-span-1',
  },
  {
    type: 'quote',
    quote: "Passionfroot has become a valuable channel for connecting with sponsors. The platform simplifies the process, and payments are always secure, making it a reliable tool for managing our sponsorships.",
    name: 'Paula Echeverria',
    role: 'Manager at Youtube Channel Slidebean',
    bgColor: 'bg-black',
    textColor: 'text-white',
    className: 'sm:col-span-2',
  },
  {
    type: 'portrait',
    name: 'Bonnie Dilber',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
    bgColor: 'bg-blue-400',
    className: 'sm:col-span-1',
  },
  {
    type: 'logo',
    name: 'Sketchy',
    imageUrl: '/image/1.svg', 
    className: 'sm:col-span-1',
  },
];

export default function Community() {
  const { title, subtitle } = siteContentData.home.community;

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimateOnScroll className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-black">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            {subtitle}
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {communityData.map((item, index) => {
            const delay = (index % 4) * 0.1;
            if (item.type === 'portrait') {
              return (
                <AnimateOnScroll key={index} className={cn('relative aspect-square rounded-2xl overflow-hidden group', item.bgColor, item.className)} delay={delay}>
                  <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-center grayscale" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <p className="text-white font-bold text-sm sm:text-base">{item.name}</p>
                    <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm shrink-0">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            }
            if (item.type === 'logo') {
              return (
                <AnimateOnScroll key={index} className={cn('relative aspect-square rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-8', item.className)} delay={delay}>
                   <Image src={item.imageUrl} alt={item.name} width={150} height={40} className="object-contain filter grayscale" />
                </AnimateOnScroll>
              );
            }
            if (item.type === 'quote') {
              return (
                <AnimateOnScroll key={index} className={cn('min-h-[300px] md:min-h-0 md:aspect-[2/1] rounded-2xl p-6 sm:p-8 flex flex-col justify-between', item.bgColor, item.textColor, item.className)} delay={delay}>
                  <div>
                    <p className="text-4xl font-serif">"</p>
                    <p className="text-base md:text-lg font-medium">{item.quote}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                    <div className="max-w-[80%]">
                      <p className="font-bold text-sm sm:text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm opacity-80">{item.role}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center backdrop-blur-sm shrink-0">
                      <Plus className="w-5 h-5" />
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            }
            return null;
          })}
        </div>
      </div>
    </section>
  );
}
