
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
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
    <section className="bg-black w-full">
        <div className="w-full">
             {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
                ) : visiblePosts && visiblePosts.length > 0 ? (
                <div className="bg-neutral-950/80 overflow-hidden relative">
                    <div className="grid grid-cols-3 gap-[2px] sm:gap-[3px] grid-flow-dense">
                        {visiblePosts.map((post) => {
                           const layout = post.layout || { w: 1, h: 1 };
                           const spanClasses = `col-span-${layout.w} row-span-${layout.h}`;
                           return <PostItem key={post.id} post={post} className={spanClasses} />;
                        })}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                         <Button asChild variant="outline" className="rounded-full border-white/50 bg-white text-black hover:bg-white/80 hover:text-black">
                            <a href="https://www.instagram.com/explore/tags/kopiduadarjat/" target="_blank" rel="noopener noreferrer">
                                explore more
                            </a>
                        </Button>
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
        </div>
    </section>
  );
}
