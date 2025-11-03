
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, limit } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CtaSection } from '@/components/shared/CtaSection';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

const RecommendedPosts = ({ currentPostId }: { currentPostId: string }) => {
    const firestore = useFirestore();
    const recommendedQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'blogs'), where('status', '==', 'published'), where('__name__', '!=', currentPostId), limit(3)) : null,
      [firestore, currentPostId]
    );
    const { data: recommended, isLoading } = useCollection<Blog>(recommendedQuery);
    
    return (
        <AnimateOnScroll animationType="fadeIn">
            <section className="py-16 bg-card">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-headline font-bold text-foreground mb-8">Recommended For You</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                              <div key={i}>
                                <Skeleton className="aspect-video w-full rounded-2xl mb-4" />
                                <Skeleton className="h-4 w-1/4 mb-2" />
                                <Skeleton className="h-6 w-3/4" />
                              </div>
                            ))
                        ) : (
                        recommended?.map(post => {
                            return (
                                 <Link key={post.id} href={`/news/${post.slug}`} className="group block">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            src={post.coverImage.url}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={post.coverImage.alt}
                                        />
                                    </div>
                                    <p className="font-semibold text-accent text-sm">{post.category}</p>
                                    <h4 className="text-xl font-headline font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {post.publishedAt ? format(post.publishedAt.toDate(), 'PPP') : ''}
                                    </p>
                                </Link>
                            )
                        }))}
                    </div>
                </div>
            </section>
        </AnimateOnScroll>
    );
}


export default function NewsArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const postQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'blogs'), where('slug', '==', slug), where('status', '==', 'published'), limit(1)) : null,
    [firestore, slug]
  );
  
  const { data: postData, isLoading } = useCollection<Blog>(postQuery);
  const post = postData?.[0];

  if (isLoading) {
    return (
        <div className="container mx-auto px-6 py-24 sm:py-32">
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-10 w-40 mb-8" />
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-12 w-full mb-6" />
                <div className="flex gap-6 mb-8">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="aspect-video w-full rounded-2xl mb-8" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    )
  }

  if (!post) {
    notFound();
  }

  return (
    <>
        <div className="bg-background text-foreground">
            <article className="container mx-auto px-6 py-24 sm:py-32">
                <div className="max-w-4xl mx-auto">
                <AnimateOnScroll animationType="fadeIn">
                    <Button asChild variant="outline" className="mb-8 rounded-full">
                        <Link href="/news">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to News
                        </Link>
                    </Button>

                    <p className="font-semibold text-accent">{post.category}</p>
                    <h1 className="mt-2 text-4xl md:text-5xl font-headline font-bold text-primary">
                        {post.title}
                    </h1>
                    
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>{post.author.name}</span>
                        </div>
                        {post.publishedAt && (
                          <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              <span>{format(post.publishedAt.toDate(), 'PPP')}</span>
                          </div>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-2">
                              <Tag className="w-5 h-5" />
                              <span>{post.tags.join(', ')}</span>
                          </div>
                        )}
                    </div>
                </AnimateOnScroll>
                
                <AnimateOnScroll animationType="fadeIn" delay={0.2}>
                    <div className="relative aspect-video rounded-2xl overflow-hidden my-8 shadow-lg">
                    <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        data-ai-hint={post.coverImage.alt}
                        priority
                    />
                    </div>
                </AnimateOnScroll>
                
                <AnimateOnScroll animationType="fadeIn" delay={0.3}>
                    <div 
                        className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-foreground prose-blockquote:border-accent prose-blockquote:text-muted-foreground prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </AnimateOnScroll>
                </div>
            </article>
        </div>
        <RecommendedPosts currentPostId={post.id} />
        <CtaSection />
    </>
  );
}
