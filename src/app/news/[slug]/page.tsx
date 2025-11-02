
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { blogPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import InstaSync from '@/components/home/InstaSync';

type Props = {
  params: { slug: string };
};

const getPostFromSlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostFromSlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

const RecommendedPosts = ({ currentPostId }: { currentPostId: string }) => {
    const recommended = blogPosts
        .filter(p => p.id !== currentPostId)
        .slice(0, 3);
    
    return (
        <section className="py-16 bg-card">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-headline font-bold text-foreground mb-8">Recommended For You</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {recommended.map(post => {
                        const image = PlaceHolderImages.find(img => img.id === post.imageUrl);
                        return (
                             <Link key={post.id} href={`/news/${post.slug}`} className="group block">
                                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                                    {image && (
                                    <Image
                                        src={image.imageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                    )}
                                </div>
                                <p className="font-semibold text-accent text-sm">{post.tags.filter(t => t !== 'All').join(', ')}</p>
                                <h4 className="text-xl font-headline font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-2">{post.publishDate}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}


export default function NewsArticlePage({ params }: Props) {
  const post = getPostFromSlug(params.slug);

  if (!post) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === post.imageUrl);

  return (
    <>
        <div className="bg-background text-foreground">
            <article className="container mx-auto px-6 py-24 sm:py-32">
                <div className="max-w-4xl mx-auto">
                <Button asChild variant="outline" className="mb-8 rounded-full">
                    <Link href="/news">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to News
                    </Link>
                </Button>

                <p className="font-semibold text-accent">{post.tags[0]}</p>
                <h1 className="mt-2 text-4xl md:text-5xl font-headline font-bold text-primary">
                    {post.title}
                </h1>
                
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{post.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        <span>{post.tags.join(', ')}</span>
                    </div>
                </div>

                {image && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden my-8 shadow-lg">
                    <Image
                        src={image.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        priority
                    />
                    </div>
                )}
                
                <div 
                    className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-foreground prose-blockquote:border-accent prose-blockquote:text-muted-foreground prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-img:rounded-xl prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                </div>
            </article>
        </div>
        <RecommendedPosts currentPostId={post.id} />
        <InstaSync />
    </>
  );
}
