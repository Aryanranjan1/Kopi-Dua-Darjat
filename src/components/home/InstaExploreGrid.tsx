'use client';

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2, Instagram as InstagramIcon } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

interface InstagramPost {
  id: string;
  username: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  permalink: string;
  timestamp: string;
}

const PostItem = ({ post }: { post: InstagramPost }) => (
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
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <span className="text-white text-sm font-semibold flex items-center gap-1">
        <InstagramIcon className="w-4 h-4" />
        {post.username}
      </span>
    </div>
  </a>
);

export default function InstaExploreGrid() {
  const firestore = useFirestore();
  const instaQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'public-insta-feed'),
            orderBy('timestamp', 'desc'),
            limit(20)
          )
        : null,
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<InstagramPost>(instaQuery);

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
          <p className="text-center text-muted-foreground">
            Could not load Instagram feed. Check back later!
          </p>
        )}
        <div className="mt-8 text-center">
          <a
            href="https://www.instagram.com/explore/tags/kopiduadarjat/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-black text-black hover:bg-black hover:text-white transition px-6 py-2 text-sm uppercase"
          >
            Show More on Instagram
          </a>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
