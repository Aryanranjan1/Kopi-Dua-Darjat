
'use client';

import type { Promotion, MenuItem, Blog, PublicInstaPost } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { format } from 'date-fns';

interface BentoGridSectionProps {
  promotions: Promotion[];
  items: MenuItem[];
  blog: Blog | null;
  instaPosts: PublicInstaPost[];
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
    <AnimateOnScroll animationType="fadeIn" className={`relative rounded-2xl overflow-hidden group border border-black/10 ${className}`}>
        <Link href={ctaLink} className="block w-full h-full">
            <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 text-white">
                {tag && <p className="text-sm font-semibold text-primary">{tag}</p>}
                <h3 className="text-2xl font-headline font-bold text-white mt-1">{title}</h3>
                <p className="text-white/80 mt-1 line-clamp-2">{description}</p>
            </div>
        </Link>
    </AnimateOnScroll>
);


const InstaCard = ({ post, className }: { post: PublicInstaPost, className?: string }) => (
    <AnimateOnScroll
        animationType="fadeIn"
        className={`relative rounded-2xl overflow-hidden group border border-black/10 ${className}`}
    >
        <Link href={post.permalink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            {post.mediaType === 'VIDEO' ? (
                <video src={post.mediaUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
                <Image
                    src={post.mediaUrl}
                    alt={post.caption || 'Instagram Post'}
                    fill
                    className="object-cover"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
                <Instagram className="w-6 h-6 text-white mb-2" />
                <p className="text-white/80 mt-1 line-clamp-2 text-sm">{post.caption}</p>
            </div>
        </Link>
    </AnimateOnScroll>
)


export default function PromotionsSection({ promotions, items, blog, instaPosts }: BentoGridSectionProps) {
    if ((!promotions || promotions.length === 0) && (!items || items.length === 0)) return null;

    // Create a pool of items to pick from
    const contentPool = [
        ...promotions.map(promo => ({ type: 'promo', data: promo })),
        ...items.filter(item => item.isPopular).map(item => ({ type: 'item', data: item })),
        ...(blog ? [{ type: 'blog', data: blog }] : []),
        ...(instaPosts ? instaPosts.map(post => ({ type: 'insta', data: post })) : [])
    ];

    const getItem = (type: 'promo' | 'item' | 'blog' | 'insta', fallbackIndex: number) => {
        return contentPool.find(c => c.type === type) || contentPool[fallbackIndex];
    }
    
    // Define the grid items
    const item1 = getItem('promo', 0);
    const item2 = getItem('blog', 1);
    const item3 = getItem('item', 2);
    const item4 = getItem('insta', 3);
    const item5 = getItem('promo', 4);
    const item6 = getItem('insta', 5);
    const item7 = getItem('item', 6);
    
    const bentoItems = [item1, item2, item3, item4, item5, item6, item7].filter(Boolean);
    
    const renderCard = (item: any) => {
        if (!item) return null;

        switch (item.type) {
            case 'promo':
                return {
                    title: item.data.title,
                    description: item.data.description || 'Check out our latest offer!',
                    imageUrl: item.data.bannerImage || `https://picsum.photos/seed/${item.data.id}/800/400`,
                    cta: 'Redeem Now',
                    tag: 'Limited Time Offer',
                    ctaLink: `/promotions#${item.data.id}`
                };
            case 'item':
                 return {
                    title: item.data.name,
                    description: item.data.description,
                    imageUrl: item.data.imageUrl || `https://picsum.photos/seed/${item.data.id}/400/400`,
                    cta: 'Try Now',
                    tag: 'Fan Favorite',
                    ctaLink: `/menu#${item.data.slug}`
                };
            case 'blog':
                return {
                    title: item.data.title,
                    description: item.data.excerpt,
                    imageUrl: item.data.coverImage.url || `https://picsum.photos/seed/${item.data.id}/400/400`,
                    cta: 'Read More',
                    tag: `Latest News • ${format(new Date(item.data.publishedAt), 'dd MMM')}`,
                    ctaLink: `/news/${item.data.slug}`
                };
            default:
                return null;
        }
    };
    
    const card1 = renderCard(bentoItems[0]);
    const card2 = renderCard(bentoItems[1]);
    const card3 = renderCard(bentoItems[2]);
    const card4 = renderCard(bentoItems[4]);
    const card5 = renderCard(bentoItems[5]);
    const card6 = renderCard(bentoItems[6]);
    const instaPost = bentoItems.find(item => item?.type === 'insta');

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-4 auto-rows-[250px]">
            {card1 && (
                <BentoCard
                    className="md:col-span-2 md:row-span-2"
                    {...card1}
                />
            )}
            {card2 && (
                 <BentoCard
                    className="md:col-span-2"
                    {...card2}
                />
            )}
            {card3 && (
                 <BentoCard
                    className=""
                    {...card3}
                />
            )}
            {instaPost && (
                 <InstaCard
                    className=""
                    post={instaPost.data}
                />
            )}
             {card4 && (
                 <BentoCard
                    className="md:col-span-2"
                    {...card4}
                />
            )}
            {card5 && (
                 <BentoCard
                    className=""
                    {...card5}
                />
            )}
             {card6 && (
                 <BentoCard
                    className=""
                    {...card6}
                />
            )}
        </div>
      </div>
    </section>
  );
}
