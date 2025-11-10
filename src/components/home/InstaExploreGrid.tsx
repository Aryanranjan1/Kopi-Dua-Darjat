
'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2, Instagram as InstagramIcon } from 'lucide-react';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const PostItem = ({ post, className }: { post: PublicInstaPost; className: string }) => {
  const isReel = post.mediaType === 'VIDEO';
  
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('relative group overflow-hidden', className)}
    >
      {isReel ? (
        <video
          src={post.mediaUrl}
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => e.currentTarget.pause()}
        />
      ) : (
        <img
          src={post.mediaUrl}
          alt={post.caption || `Instagram post by ${post.username}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-end p-3">
        <div className="opacity-0 group-hover:opacity-100 transition text-white text-xs">
          <p className="font-semibold">@{post.username}</p>
          <p className="line-clamp-2">{post.caption}</p>
        </div>
      </div>
    </a>
  );
};

export default function InstaExploreGrid() {
  const firestore = useFirestore();
  const instaQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'public_insta_feed'),
            orderBy('rank', 'asc'),
            limit(21)
          )
        : null,
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<PublicInstaPost>(instaQuery);

  const visiblePosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => post.visible);
  }, [posts]);

  return (
    <section className="bg-black py-24 sm:py-32">
        <div className="container mx-auto">
            <h2 className="text-center font-headline text-4xl font-bold text-primary md:text-5xl uppercase underline decoration-white decoration-4 underline-offset-8 mb-12">
                #KOPIDUADARJAT
            </h2>
             {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
                ) : visiblePosts && visiblePosts.length > 0 ? (
                <div className="bg-neutral-950/80 p-1 md:p-2 rounded-[2rem] overflow-hidden shadow-inner border border-neutral-800">
                    <div className="grid grid-cols-3 gap-[3px] sm:gap-[4px] grid-flow-dense">
                        {visiblePosts.map((post, i) => {
                           const isReel = post.mediaType === 'VIDEO';
                           // A more robust pattern for placing larger tiles to avoid gaps
                           const isBig = i === 0 || i === 7;

                           const spanClasses = isBig
                            ? 'col-span-2 row-span-2'
                            : isReel
                            ? 'row-span-2'
                            : '';
                            
                           return <PostItem key={post.id} post={post} className={spanClasses} />;
                        })}
                    </div>
                </div>
                ) : (
                <div className="flex flex-col items-center py-10 text-center text-white">
                    <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">
                    #KopiDua<span className="text-primary">Darjat</span> on Instagram
                    </h2>
                    <p className="text-gray-400 mt-4 mb-4">No posts available right now.</p>
                </div>
            )}
            {visiblePosts && visiblePosts.length > 0 && (
                <div className="mt-12 text-center">
                    <Button asChild variant="outline" className="rounded-full border-white/50 bg-white text-black hover:bg-white/80 hover:text-black">
                        <a href="https://www.instagram.com/explore/tags/kopiduadarjat/" target="_blank" rel="noopener noreferrer">
                            explore more
                        </a>
                    </Button>
                </div>
            )}
        </div>
    </section>
  );
}
