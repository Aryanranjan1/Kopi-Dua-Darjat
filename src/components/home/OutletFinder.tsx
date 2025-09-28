import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function OutletFinder() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'outlet-map');
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 text-center lg:text-left">
            <h2 className="text-4xl font-headline font-bold text-primary">
              Find Us Near You
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Your daily dose of artisan Kopi Kampung is just around the corner.
            </p>
            <div className="mt-6 flex gap-2">
              <Input placeholder="Enter your city or postcode..." className="bg-background"/>
              <Button>Search</Button>
            </div>
            <Button asChild variant="link" className="mt-2 text-accent hover:text-accent/80 pl-0">
                <Link href="/outlets">Or view all 50+ outlets</Link>
            </Button>
          </div>
          <div className="lg:col-span-3">
            <Card className="overflow-hidden shadow-lg">
                {mapImage && (
                    <div className="relative aspect-[4/3]">
                        <Image
                            src={mapImage.imageUrl}
                            alt={mapImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={mapImage.imageHint}
                        />
                         <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <Link href="/outlets">
                                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground scale-110 shadow-2xl">
                                    <MapPin className="mr-2 h-5 w-5" />
                                    Launch Interactive Map
                                </Button>
                            </Link>
                         </div>
                    </div>
                )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
