
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Blog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Hero({ post }: { post: Blog }) {
  return (
    <motion.section variants={heroVariants} className="container mx-auto px-6 pt-24 pb-16">
      <div className="bg-card/50 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="max-w-lg">
          <p className="font-semibold text-accent">{post.category}</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mt-2">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <Button asChild size="lg" className="mt-6 rounded-full">
            <Link href={`/news/${post.slug}`}>
              Read Article <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Link href={`/news/${post.slug}`} className="relative aspect-video rounded-2xl overflow-hidden group">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={post.coverImage.alt}
            priority
          />
        </Link>
      </div>
    </motion.section>
  );
}
