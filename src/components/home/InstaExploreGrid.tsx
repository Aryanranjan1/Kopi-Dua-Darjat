
'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2, Instagram as InstagramIcon } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const PostItem = ({ post }: { post: PublicInstaPost }) => {
  const isVideo = post.mediaType === 'VIDEO';

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'relative group overflow-hidden rounded-lg shadow-md',
        isVideo ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'
      )}
    >
      {isVideo ? (
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
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <InstagramIcon className="w-8 h-8 text-white mb-2" />
        <span className="text-white text-sm font-bold">@{post.username}</span>
        <p className="text-xs text-white/80 mt-1 line-clamp-2">{post.caption}</p>
        <Button size="sm" variant="outline" className="mt-4 bg-white/20 border-white/50 text-white hover:bg-white hover:text-black">
            View Post
        </Button>
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
    <section className="px-4 sm:px-6 py-20 bg-white">
      <AnimateOnScroll animationType="fadeIn">
        <h2 className="text-3xl font-headline mb-8 text-center text-foreground">
          #KopiDuaDarjat on Instagram
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : visiblePosts && visiblePosts.length > 0 ? (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 grid-auto-rows-[250px] gap-4 [grid-auto-flow:dense]">
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
                    </a>
                </Button>
            </div>
        )}
      </AnimateOnScroll>
    </section>
  );
}
