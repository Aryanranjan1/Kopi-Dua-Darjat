
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { outlets } from '@/lib/data';
import { Card } from '@/components/ui/card';
import InteractiveMap from '@/components/home/InteractiveMap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';

type Props = {
  params: { slug: string };
};

const getOutletFromSlug = (slug: string) => {
  return outlets.find((outlet) => outlet.slug === slug);
};

export function generateMetadata({ params }: Props): Metadata {
  const outlet = getOutletFromSlug(params.slug);

  if (!outlet) {
    return {
      title: 'Outlet Not Found',
    };
  }

  return {
    title: outlet.name,
    description: `Welcome to Kopi Dua Darjat at ${outlet.address}.`,
  };
}

export default function OutletMicrositePage({ params }: Props) {
  const outlet = getOutletFromSlug(params.slug);

  if (!outlet) {
    notFound();
  }

  const mapEmbedUrl = `https://maps.google.com/maps?q=${outlet.lat},${outlet.lng}&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 text-center">
        <h1 className="text-3xl font-headline font-bold">{outlet.name}</h1>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg mb-12">
            <Image 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop"
                alt={`Image of ${outlet.name}`}
                fill
                className="object-cover"
            />
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
              <h2 className="text-3xl font-headline font-bold text-primary">Welcome!</h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                      <span>{outlet.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                      <span>{outlet.hours}</span>
                  </div>
              </div>
               <Button asChild size="lg" className="mt-6 rounded-full">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`} target="_blank" rel="noopener noreferrer">
                      Get Directions
                  </a>
              </Button>
          </div>

          <div className="lg:col-span-3 min-h-[400px]">
              <Card className="overflow-hidden shadow-lg rounded-3xl h-full">
                 <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      src={mapEmbedUrl}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                  >
                  </iframe>
              </Card>
          </div>
        </div>
      </main>
       <footer className="bg-zinc-900 text-white text-center p-4 mt-12">
            <p>&copy; {new Date().getFullYear()} {outlet.name} - A Kopi Dua Darjat Franchise</p>
            <Button asChild variant="link" className="text-primary">
                <Link href="/">Back to Main Site</Link>
            </Button>
      </footer>
    </div>
  );
}
