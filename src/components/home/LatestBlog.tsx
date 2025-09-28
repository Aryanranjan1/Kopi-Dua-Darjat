import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function LatestBlog() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-headline font-bold text-primary">
            From the Coffee Press
          </h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Stories, news, and updates from the world of Kopi Dua Darjat.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => {
            const postImage = PlaceHolderImages.find((img) => img.id === post.imageUrl);
            return (
              <Card key={post.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-xl">
                {postImage && (
                  <CardHeader className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={postImage.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        data-ai-hint={postImage.imageHint}
                      />
                    </div>
                  </CardHeader>
                )}
                <CardContent className="p-6 flex-1">
                  <div className="flex gap-2 mb-2">
                    {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <CardTitle className="font-headline text-xl text-primary leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 text-sm text-muted-foreground">
                  <p>{post.author} &bull; {post.publishDate}</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="mt-12 text-center">
            <Button size="lg" asChild variant="outline">
                <Link href="/blog">Visit The Blog <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
