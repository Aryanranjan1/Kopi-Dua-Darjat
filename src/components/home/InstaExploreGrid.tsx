
'use client';

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Loader2, Instagram as InstagramIcon } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '../ui/button';

const PostItem = ({ post }: { post: PublicInstaPost }) => (
  <a
    href={post.permalink}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group aspect-square overflow-hidden"
  >
    {post.mediaType === 'video' ? (
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
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <span className="text-white text-sm font-bold flex items-center gap-1">
        <InstagramIcon className="w-4 h-4" />
        {post.username}
      </span>
      <span className="text-white text-xs mt-1 font-mono">ID: {post.id}</span>
    </div>
  </a>
);

export default function InstaExploreGrid() {
  const firestore = useFirestore();
  const instaQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'public_insta_feed'),
            where('visible', '==', true),
            orderBy('rank', 'asc'),
            limit(20)
          )
        : null,
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<PublicInstaPost>(instaQuery);

  return (
    <section className="px-6 py-20 bg-white">
      <AnimateOnScroll animationType="fadeIn">
        <h2 className="text-3xl font-headline mb-6 text-center text-foreground">
          #KopiDuaDarjat on Instagram
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[3px]">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center">
            <p className="text-gray-500 mb-4">No posts available right now.</p>
            <Button
              onClick={() =>
                window.open('https://www.instagram.com/explore/tags/kopiduadarjat/', '_blank')
              }
              className="rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
            >
              View on Instagram →
            </Button>
          </div>
        )}
        {posts && posts.length > 0 && (
            <div className="mt-8 text-center">
                <Button asChild variant="outline" className="rounded-full border-yellow-400 text-black hover:bg-yellow-400">
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
