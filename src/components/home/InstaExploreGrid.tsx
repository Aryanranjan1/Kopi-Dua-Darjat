
'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2, Instagram as InstagramIcon, ArrowDown } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const PostItem = ({ post }: { post: PublicInstaPost }) => {
  const isVideo = post.mediaType === 'VIDEO';

  return (
    <div
      className={cn(
        'group relative break-inside-avoid-column',
        isVideo ? 'aspect-[9/16]' : 'aspect-square'
      )}
    >
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full overflow-hidden rounded-lg"
      >
        {isVideo ? (
          <video
            src={post.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption || `Instagram post by ${post.username}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <InstagramIcon className="mb-2 h-8 w-8" />
          <span className="text-sm font-bold">@{post.username}</span>
          <p className="mt-1 line-clamp-2 text-xs text-white/80">
            {post.caption}
          </p>
        </div>
      </a>
    </div>
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
            limit(20)
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
    <section className="bg-white px-4 sm:px-6 py-24 sm:py-32">
      <AnimateOnScroll animationType="fadeIn">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : visiblePosts && visiblePosts.length > 0 ? (
           <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {visiblePosts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center">
            <p className="text-gray-500 mb-4">No posts available right now.</p>
             <Button asChild>
                <Link href="/admin/data-seeding">
                    Seed Sample Posts
                </Link>
            </Button>
          </div>
        )}
        {visiblePosts && visiblePosts.length > 0 && (
            <div className="mt-12 text-center">
                <Button asChild variant="outline" className="rounded-full border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground">
                    <a href="https://www.instagram.com/explore/tags/kopiduadarjat/" target="_blank" rel="noopener noreferrer">
                        Show More on Instagram
                         <ArrowDown className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>
        )}
      </AnimateOnScroll>
    </section>
  );
}
