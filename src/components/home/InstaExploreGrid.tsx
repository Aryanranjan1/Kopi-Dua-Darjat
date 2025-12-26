
'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2, Instagram as InstagramIcon } from 'lucide-react';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const PostItem = React.forwardRef<HTMLDivElement, { post: PublicInstaPost; className?: string }>(({ post, className, ...props }, ref) => {
  const isReel = post.mediaType === 'VIDEO';
  const colSpan = post.layout?.w === 2 ? 'sm:col-span-2' : 'sm:col-span-1';
  const rowSpan = post.layout?.h === 2 ? 'sm:row-span-2' : 'sm:row-span-1';

  return (
    <div
      ref={ref}
      className={cn('relative group aspect-square overflow-hidden', colSpan, rowSpan, className)}
      {...props}
    >
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
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
    </div>
  );
});
PostItem.displayName = 'PostItem';

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
    <section className="bg-black text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-headline text-4xl font-bold md:text-5xl text-white">
            Join The #KopiDua<span className="text-primary">Darjat</span> Community
          </h2>
          <p className="text-gray-400 mt-2">Follow us on Instagram for the latest updates and community stories.</p>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : visiblePosts && visiblePosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 grid-flow-dense gap-1 md:gap-2 auto-rows-fr">
            {visiblePosts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center text-white">
            <p className="text-gray-400 mt-4">No posts available right now.</p>
          </div>
        )}
        <div className="mt-8 text-center">
           <Button asChild variant="outline" className="rounded-full border-white/50 bg-transparent text-white hover:bg-white hover:text-black">
              <a href="https://www.instagram.com/explore/tags/kopiduadarjat/" target="_blank" rel="noopener noreferrer">
                  Explore More on Instagram
              </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
