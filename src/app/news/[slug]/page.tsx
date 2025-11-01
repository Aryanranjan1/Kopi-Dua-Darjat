
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { blogPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
                
                <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-foreground">
                    {/* Dummy content */}
                    <p>{post.excerpt}</p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.
                    </p>
                    <p>
                        Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet.
                    </p>
                    <figure>
                        <blockquote>
                            <p>"This is a blockquote. It's a great way to highlight a key point or a quote from someone relevant to the article."</p>
                        </blockquote>
                        <figcaption>- Kopi Dua Darjat Team</figcaption>
                    </figure>
                    <p>
                        Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam.
                    </p>
                </div>
                </div>
            </article>
        </div>
        <NewsletterSignUp disableAnimations />
    </>
  );
}
