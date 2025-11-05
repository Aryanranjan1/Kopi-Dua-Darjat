
'use client';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Plus } from 'lucide-react';
import Image from 'next/image';

const communityData = [
  {
    type: 'portrait',
    name: 'Marina Mogilko',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500',
    bgColor: 'bg-cyan-300',
  },
  {
    type: 'logo',
    name: 'Superhuman',
    imageUrl: '/image/1.svg', 
  },
  {
    type: 'quote',
    quote: "Passionfroot makes it incredibly easy for me to secure sponsorship deals with brands that resonate with my audience.",
    name: 'Jörg Storm',
    role: 'Founder of AI Newsletter Weekly Storm, Top 50 Creator Worldwide',
    bgColor: 'bg-yellow-300',
    textColor: 'text-black',
  },
  {
    type: 'logo',
    name: 'Milk Road',
    imageUrl: '/image/1.svg', 
  },
  {
    type: 'portrait',
    name: 'Zain Kahn',
    imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500',
    bgColor: 'bg-green-400',
  },
  {
    type: 'logo',
    name: 'Every',
    imageUrl: '/image/1.svg', 
  },
  {
    type: 'portrait',
    name: 'Ali Abdaal',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    bgColor: 'bg-orange-400',
  },
  {
    type: 'quote',
    quote: "Passionfroot has become a valuable channel for connecting with sponsors. The platform simplifies the process, and payments are always secure, making it a reliable tool for managing our sponsorships.",
    name: 'Paula Echeverria',
    role: 'Manager at Youtube Channel Slidebean',
    bgColor: 'bg-black',
    textColor: 'text-white',
  },
  {
    type: 'portrait',
    name: 'Bonnie Dilber',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
    bgColor: 'bg-blue-400',
  },
  {
    type: 'logo',
    name: 'Sketchy',
    imageUrl: '/image/1.svg', 
  },
];

export default function Community() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-4">
        <AnimateOnScroll className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black">
            Brewing Community, One Cup at a Time
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From our baristas to our customers, we're a family united by a love for authentic Malaysian coffee.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {communityData.map((item, index) => {
            if (item.type === 'portrait') {
              return (
                <AnimateOnScroll key={index} className={`relative aspect-square rounded-2xl overflow-hidden group ${item.bgColor}`} delay={index * 0.1}>
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover object-center grayscale" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <p className="text-white font-bold">{item.name}</p>
                    <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            }
            if (item.type === 'logo') {
              return (
                <AnimateOnScroll key={index} className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-8" delay={index * 0.1}>
                   <Image src={item.imageUrl} alt={item.name} width={150} height={40} className="object-contain filter grayscale" />
                </AnimateOnScroll>
              );
            }
            if (item.type === 'quote') {
              return (
                <AnimateOnScroll key={index} className={`md:col-span-2 relative aspect-auto md:aspect-[2/1] rounded-2xl p-8 flex flex-col justify-between ${item.bgColor} ${item.textColor}`} delay={index * 0.1}>
                  <div>
                    <p className="text-4xl font-serif">"</p>
                    <p className="text-lg md:text-xl font-medium">{item.quote}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm opacity-80">{item.role}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center backdrop-blur-sm">
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
