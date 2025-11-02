
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { outlets } from '@/lib/data';
import { Card } from '@/components/ui/card';
import InteractiveMap from '@/components/home/InteractiveMap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';

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
    description: `Visit Kopi Dua Darjat at ${outlet.address}.`,
  };
}

export default function OutletDetailPage({ params }: Props) {
  const outlet = getOutletFromSlug(params.slug);

  if (!outlet) {
    notFound();
  }

  const mapEmbedUrl = `https://maps.google.com/maps?q=${outlet.lat},${outlet.lng}&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-background text-foreground py-24 sm:py-32">
        <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
                 <Button asChild variant="outline" className="mb-8 rounded-full">
                    <Link href="/outlets">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Outlets
                    </Link>
                </Button>

                <div className="grid lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-headline font-bold text-primary">{outlet.name}</h1>
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
            </div>
        </div>
    </div>
  );
}

