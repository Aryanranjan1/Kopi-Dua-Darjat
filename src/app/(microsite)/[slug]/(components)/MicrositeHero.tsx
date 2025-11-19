
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Outlet, MenuItem, ReviewDocument } from '@/lib/types';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import FloatingDrinkCard from './FloatingDrinkCard';
import { motion } from 'framer-motion';

interface MicrositeHeroProps {
    outlet: Outlet;
    featuredItems: MenuItem[];
    reviewData: ReviewDocument | null;
}

const FloatingReviewCard = ({ reviewData }: { reviewData: ReviewDocument | null }) => {
  if (!reviewData || !reviewData.aggregate || reviewData.aggregate.reviewCount === 0) return null;

  return (
    <motion.div 
      className="absolute bg-white/70 backdrop-blur-md rounded-full shadow-lg p-2 pr-4 flex items-center gap-2"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 15 }}
    >
      <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center text-lg">😊</div>
      <div>
        <p className="text-sm font-bold text-black">Our Happy Customers</p>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <p className="text-xs text-zinc-700 font-medium">
            {reviewData.aggregate.ratingValue.toFixed(1)} ({reviewData.aggregate.reviewCount} Reviews)
          </p>
        </div>
      </div>
    </motion.div>
  );
};


export default function MicrositeHero({ outlet, featuredItems, reviewData }: MicrositeHeroProps) {
    const popularDrink = featuredItems && featuredItems.length > 0 ? featuredItems[0] : null;
    const satelliteDrinks = featuredItems ? featuredItems.slice(1, 5) : [];

    const satellitePositions = [
        { top: '5%', left: '15%', size: 90 },
        { top: '30%', left: '85%', size: 120 },
        { top: '75%', left: '70%', size: 100 },
        { top: '80%', left: '5%', size: 110 },
    ]

  return (
    <section className="relative min-h-screen flex items-center bg-[#F7F4EF] text-zinc-900 overflow-hidden py-24 sm:py-0">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Content */}
            <div className="relative z-10 text-center lg:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Badge variant="default" className="mb-4 text-sm py-1 px-4 rounded-full bg-accent text-accent-foreground shadow-sm">
                        <Star className="w-3 h-3 mr-1.5 fill-current" /> People Trust Us
                    </Badge>
                    <h1 className="text-4xl lg:text-6xl font-headline font-bold text-black leading-tight">
                        Authentic Kopi at<br />
                        <span className="text-primary underline decoration-wavy underline-offset-8 decoration-2">{outlet.name}</span>
                    </h1>
                    <p className="mt-6 text-base lg:text-lg text-zinc-600 drop-shadow-sm max-w-lg mx-auto lg:mx-0">
                       {outlet.address} <br/> Open Today: {outlet.hours}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                            <a href="#menu">View Our Menu</a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="rounded-full border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white shadow-sm">
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`} target="_blank" rel="noopener noreferrer">
                                <MapPin className="mr-2 h-5 w-5" /> Get Directions
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Image Collage */}
            <div className="relative min-h-[400px] lg:min-h-[600px] w-full h-full">
                {/* Central Outlet Image */}
                 <motion.div
                    className="absolute z-10 w-[60%] h-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
                 >
                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
                        <Image
                            src={outlet.heroImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop'}
                            alt={`Kopi Dua Darjat ${outlet.name}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                 </motion.div>
                
                {/* Floating Drink Cards */}
                {satelliteDrinks.map((drink, index) => (
                    <FloatingDrinkCard 
                        key={drink.id}
                        drink={drink}
                        size={satellitePositions[index].size}
                        className="absolute"
                        style={{
                            top: satellitePositions[index].top,
                            left: satellitePositions[index].left,
                        }}
                        delay={0.6 + index * 0.15}
                    />
                ))}

                 {/* Floating UI cards */}
                <div className="absolute top-[10%] left-[60%] z-20">
                   {popularDrink && <FloatingDrinkCard drink={popularDrink} isFeatured delay={1.0}/>}
                </div>
                 <div className="absolute bottom-[5%] left-[30%] z-20">
                   <FloatingReviewCard reviewData={reviewData} />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
