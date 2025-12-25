
'use client';

import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { CommunityItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getLocalized } from '@/lib/utils';

export default function Community({ content }: { content: any }) {
  const { language } = useLanguage();
  const firestore = useFirestore();
  const communityQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'community_items'), orderBy('displayOrder', 'asc')) : null,
    [firestore]
  );
  const { data: communityItems, isLoading } = useCollection<CommunityItem>(communityQuery);
  
  if (!content) return null;
  const localizedContent = content.home?.community;
  const { title, subtitle } = localizedContent;

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
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl bg-gray-200" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {communityItems?.map((item, index) => {
              const delay = (index % 4) * 0.1;
              const localizedItem = getLocalized(item, language);

              if (item.type === 'portrait') {
                return (
                  <AnimateOnScroll key={item.id} className={cn('relative aspect-square rounded-2xl overflow-hidden group', item.bgColor, item.className)} delay={delay}>
                    <Image src={item.imageUrl} alt={localizedItem.name || ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-center grayscale" />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <p className="text-white font-bold text-sm sm:text-base">{localizedItem.name}</p>
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm shrink-0">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              }
              if (item.type === 'logo') {
                return (
                  <AnimateOnScroll key={item.id} className={cn('relative aspect-square rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-8', item.className)} delay={delay}>
                    <Image src={item.imageUrl} alt={localizedItem.name || ''} width={150} height={40} className="object-contain filter grayscale" />
                  </AnimateOnScroll>
                );
              }
              if (item.type === 'quote') {
                return (
                  <AnimateOnScroll key={item.id} className={cn('rounded-2xl p-6 sm:p-8 flex flex-col justify-between', item.bgColor, item.textColor, item.className, item.className?.includes('sm:col-span-2') ? 'aspect-[2/1]' : 'aspect-square')} delay={delay}>
                    <div>
                      <p className="text-4xl font-serif">"</p>
                      <p className="text-base md:text-lg font-medium">{localizedItem.quote}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div className="max-w-[80%]">
                        <p className="font-bold text-sm sm:text-base">{localizedItem.name}</p>
                        <p className="text-xs sm:text-sm opacity-80">{localizedItem.role}</p>
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
        )}
      </div>
    </section>
  );
}
