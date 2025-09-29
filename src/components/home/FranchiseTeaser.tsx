import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import InfiniteMenu from './InfiniteMenu';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function FranchiseTeaser() {
  const menuItems = PlaceHolderImages.filter(item => item.id.startsWith('drink-')).map(item => ({
    image: item.imageUrl,
    link: item.linkUrl || '#',
    title: item.id.replace('drink-', ''),
    description: item.description,
  }));

  return (
    <section className="bg-primary text-primary-foreground py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-square max-w-md mx-auto w-full h-full">
            <InfiniteMenu items={menuItems} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-headline text-4xl font-bold">
              Berminat jadi rakan niaga?
            </h2>
            <p className="mt-4 text-lg max-w-prose text-primary-foreground/80">
              Pelaburan kopi yang terbukti menguntungkan. Join a fast-growing Malaysian brand and bring the taste of Kopi Dua Darjat to your community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/franchise">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
