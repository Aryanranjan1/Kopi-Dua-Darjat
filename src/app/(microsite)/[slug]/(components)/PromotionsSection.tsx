
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
  return (
    <section className="bg-[#FAF3E0] py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">
            Sip Smart. Share Joy.
          </h2>
          <p className="mt-2 text-lg text-neutral-600">Don't miss out on our latest offers.</p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <AnimateOnScroll key={promo.id} animationType="fadeIn" delay={index * 0.1}>
              <Card className="bg-white rounded-lg shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-video w-full">
                  <Image
                    src={promo.bannerImage || `https://picsum.photos/seed/promo${index}/600/400`}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                   <div className="absolute top-3 left-3 bg-[#F9C349] text-black text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      LIMITED TIME
                    </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-headline font-bold text-black">{promo.title}</h3>
                  <p className="text-sm text-neutral-600 mt-2 line-clamp-2 h-10">{promo.description}</p>
                  <p className="text-xs text-neutral-500 mt-3">
                    Expires: {format(promo.endDate.toDate(), 'PPP')}
                  </p>
                  <Button className="mt-4 w-full bg-black text-white hover:bg-neutral-800 rounded-md">
                    Redeem at Outlet
                  </Button>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
