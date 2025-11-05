
'use client';

import type { Promotion, MenuItem } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { format } from 'date-fns';
import Link from 'next/link';

interface BentoGridSectionProps {
  promotions: Promotion[];
  items: MenuItem[];
}

const BentoCard = ({
  className,
  title,
  description,
  imageUrl,
  cta,
  ctaLink = '#',
  tag,
}: {
  className: string;
  title: string;
  description: string;
  imageUrl: string;
  cta: string;
  ctaLink?: string;
  tag?: string;
}) => (
  <AnimateOnScroll
    animationType="fadeIn"
    className={`relative rounded-2xl overflow-hidden group border border-black/10 flex flex-col justify-end p-6 ${className}`}
  >
    <Image
      src={imageUrl}
      alt={title}
      fill
      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 -z-10"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent -z-10"></div>
    {tag && <p className="text-sm font-semibold text-primary">{tag}</p>}
    <h3 className="text-2xl font-headline font-bold text-white mt-1">{title}</h3>
    <p className="text-white/80 mt-1 line-clamp-2">{description}</p>
    <div className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href={ctaLink}>{cta}</Link>
      </Button>
    </div>
  </AnimateOnScroll>
);

export default function BentoGridSection({ promotions, items }: BentoGridSectionProps) {
    if ((!promotions || promotions.length === 0) && (!items || items.length === 0)) return null;

    // Prioritize promotions, then fill with items
    const bentoItems = [
        ...promotions.slice(0, 3).map(promo => ({
            type: 'promo',
            data: promo,
        })),
        ...items.slice(0, 4).map(item => ({
            type: 'item',
            data: item,
        }))
    ];

    const item1 = bentoItems[0];
    const item2 = bentoItems[1];
    const item3 = bentoItems[2];
    const item4 = bentoItems[3];
    const item5 = bentoItems[4];

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">
                Mindful living, made simple
            </h2>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-3 grid-rows-2 gap-4 auto-rows-[250px]">
            {item1 && (
                <BentoCard
                    className="md:col-span-2"
                    title={item1.type === 'promo' ? item1.data.title : item1.data.name}
                    description={item1.data.description || 'Check out our latest offer!'}
                    imageUrl={item1.type === 'promo' ? item1.data.bannerImage || `https://picsum.photos/seed/bento1/800/400` : item1.data.imageUrl}
                    cta={item1.type === 'promo' ? 'Redeem Now' : 'Try Now'}
                    tag={item1.type === 'promo' ? 'Limited Time Offer' : 'Fan Favorite'}
                />
            )}
            {item2 && (
                 <BentoCard
                    className=""
                    title={item2.type === 'promo' ? item2.data.title : item2.data.name}
                    description={item2.data.description || 'A delicious treat awaits.'}
                    imageUrl={item2.type === 'promo' ? item2.data.bannerImage || `https://picsum.photos/seed/bento2/400/400` : item2.data.imageUrl}
                    cta={item2.type === 'promo' ? 'View Deal' : 'Explore'}
                    tag={item2.type === 'promo' ? 'Promotion' : 'Signature'}
                />
            )}
             {item3 && (
                 <BentoCard
                    className=""
                    title={item3.type === 'promo' ? item3.data.title : item3.data.name}
                    description={item3.data.description || 'A delicious treat awaits.'}
                    imageUrl={item3.type === 'promo' ? item3.data.bannerImage || `https://picsum.photos/seed/bento3/400/400` : item3.data.imageUrl}
                    cta={item3.type === 'promo' ? 'View Deal' : 'Explore'}
                    tag={item3.type === 'promo' ? 'Promotion' : 'Signature'}
                />
            )}
            {item4 && (
                 <BentoCard
                    className="md:col-span-2"
                    title={item4.type === 'promo' ? item4.data.title : item4.data.name}
                    description={item4.data.description || 'Check out our latest offer!'}
                    imageUrl={item4.type === 'promo' ? item4.data.bannerImage || `https://picsum.photos/seed/bento4/800/400` : item4.data.imageUrl}
                    cta={item4.type === 'promo' ? 'Redeem Now' : 'Try Now'}
                    tag={item4.type === 'promo' ? 'Limited Time Offer' : 'Fan Favorite'}
                />
            )}
        </div>
      </div>
    </section>
  );
}
