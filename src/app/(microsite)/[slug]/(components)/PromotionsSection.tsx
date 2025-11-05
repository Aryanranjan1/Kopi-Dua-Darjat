
'use client';

import type { Promotion } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { format } from 'date-fns';

interface PromotionsSectionProps {
  promotions: Promotion[];
}

export default function PromotionsSection({ promotions }: PromotionsSectionProps) {
  if (!promotions || promotions.length === 0) return null;

  const mainPromotion = promotions[0];
  const secondaryPromotions = promotions.slice(1, 4);

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">
            Mindful living, made simple
          </h2>
        </AnimateOnScroll>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Main Promotion */}
            <AnimateOnScroll animationType="fadeIn" className="h-full">
               <Card className="bg-white rounded-lg shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl h-full">
                 <div className="relative aspect-[4/3] w-full">
                   <Image
                     src={mainPromotion.bannerImage || `https://picsum.photos/seed/promo-main/800/600`}
                     alt={mainPromotion.title}
                     fill
                     className="object-cover transition-transform duration-300 group-hover:scale-105"
                   />
                 </div>
                 <CardContent className="p-6">
                   <h3 className="text-2xl font-headline font-bold text-black">{mainPromotion.title}</h3>
                   <p className="text-neutral-600 mt-2 line-clamp-3">{mainPromotion.description}</p>
                   <p className="text-sm text-neutral-500 mt-3">
                     Expires: {format(new Date(mainPromotion.endDate), 'PPP')}
                   </p>
                 </CardContent>
               </Card>
            </AnimateOnScroll>

            {/* Secondary Promotions */}
            <div className="grid grid-cols-1 gap-6">
                {secondaryPromotions.map((promo, index) => (
                    <AnimateOnScroll key={promo.id} animationType="fadeIn" delay={index * 0.15}>
                        <Card className="bg-white rounded-lg shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-lg flex items-center gap-6 p-4">
                            <div className="relative aspect-square w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                    src={promo.bannerImage || `https://picsum.photos/seed/promo-sub${index}/200/200`}
                                    alt={promo.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-lg font-headline font-bold text-black">{promo.title}</h4>
                                <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{promo.description}</p>
                            </div>
                            <Button className="bg-black text-white hover:bg-neutral-800 rounded-md flex-shrink-0">
                                View
                            </Button>
                        </Card>
                    </AnimateOnScroll>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
