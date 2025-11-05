
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { Outlet, MenuItem, Promotion } from '@/lib/types';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getDiscountDisplay } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type Props = {
  params: { slug: string };
};

// SERVER-SIDE DATA FETCHING
async function getOutletData(slug: string): Promise<{ outlet: Outlet; menuItems: MenuItem[]; promotions: Promotion[] } | null> {
  const { firestore } = initializeServerSideFirebase();
  const outletRef = doc(firestore, 'outlets', slug);
  const outletSnap = await getDoc(outletRef);

  if (!outletSnap.exists()) {
    return null;
  }
  const outlet = { id: outletSnap.id, ...outletSnap.data() } as Outlet;

  // Fetch featured menu items
  const menuQuery = query(
    collection(firestore, 'menuItems'),
    where('outletIds', 'array-contains', outlet.id),
    where('status', '==', 'published'),
    limit(6)
  );
  const menuSnap = await getDocs(menuQuery);
  const menuItems = menuSnap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));

  // Fetch promotions
  const promoQuery = query(
    collection(firestore, 'promotions'),
    where('status', '==', 'active'),
    where('outletIds', 'array-contains', outlet.id)
  );
  const promoSnap = await getDocs(promoQuery);
  const promotions = promoSnap.docs.map(d => ({ id: d.id, ...d.data() } as Promotion));
  
  return { outlet, menuItems, promotions };
}

// DYNAMIC METADATA GENERATION
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getOutletData(params.slug);

  if (!data) {
    return { title: 'Outlet Not Found' };
  }

  const { outlet, menuItems } = data;
  const featuredMenuNames = menuItems.map(item => item.name).slice(0, 3);
  
  const description = `Visit ${outlet.name} outlet in ${outlet.city} — serving ${outlet.hours}. Try our ${featuredMenuNames.join(', ')}.`;

  return {
    title: `${outlet.name} | Kopi Dua Darjat`,
    description,
    openGraph: {
      title: `${outlet.name} | Kopi Dua Darjat`,
      description,
      images: outlet.heroImage ? [outlet.heroImage] : [],
      url: `https://www.kopiduadarjat.com/outlets/${outlet.slug}`,
    },
  };
}


const FeaturedMenuCard = ({ item, promotions }: { item: MenuItem, promotions: Promotion[] }) => {
  const promotion = promotions.find(p => p.menuItemIds?.includes(item.id));
  const offerText = promotion ? getDiscountDisplay(promotion) : null;
  
  return (
    <Card className="overflow-hidden group bg-card border-border hover:border-accent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square w-full">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        {offerText && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">{offerText}</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-headline font-bold text-lg text-foreground truncate">{item.name}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">{item.description}</p>
        <p className="font-semibold text-accent text-lg mt-2">RM{item.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}

const PromotionCard = ({ promotion }: { promotion: Promotion }) => (
    <Card className="bg-primary/10 border-primary/20 overflow-hidden">
        <div className="relative aspect-video w-full">
            <Image src={promotion.bannerImage || "https://picsum.photos/seed/promo/600/400"} alt={promotion.title} fill className="object-cover" />
            <div className="absolute top-2 left-2">
                <Badge className="bg-yellow-400 text-black">Limited Time Offer</Badge>
            </div>
        </div>
        <CardContent className="p-4">
            <h4 className="font-headline font-bold text-lg text-primary">{promotion.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{promotion.description}</p>
            <p className="text-xs text-muted-foreground mt-2">Expires: {new Date(promotion.endDate.seconds * 1000).toLocaleDateString()}</p>
            <Button size="sm" className="mt-3 rounded-full">Order Now</Button>
        </CardContent>
    </Card>
);

// MAIN PAGE COMPONENT
export default async function OutletMicrositePage({ params }: Props) {
  const data = await getOutletData(params.slug);

  if (!data) {
    notFound();
  }

  const { outlet, menuItems, promotions } = data;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${outlet.lat},${outlet.lng}&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] text-white">
        <Image 
            src={outlet.heroImage || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop"}
            alt={`Hero image for ${outlet.name}`}
            fill
            className="object-cover"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-end container mx-auto px-6 pb-12">
            <h1 className="text-5xl md:text-7xl font-headline font-bold drop-shadow-lg">{outlet.name}</h1>
            <p className="mt-2 text-xl max-w-2xl drop-shadow-md">{outlet.tagline || `Your favorite Kopi Dua Darjat in ${outlet.city}`}</p>
            <div className="mt-6 flex gap-4">
              <Button size="lg" asChild className="rounded-full"><a href="#map">Find Us</a></Button>
            </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-20 space-y-24">
        {/* 2. Outlet Info & Contact */}
        <section id="info" className="scroll-mt-20">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <Image 
                        src={outlet.interiorImage || "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&auto=format&fit=crop"}
                        alt={`Interior of ${outlet.name}`}
                        fill
                        className="object-cover"
                    />
                </div>
                 <div>
                    <h2 className="text-3xl font-headline font-bold text-primary">{outlet.name}</h2>
                    <div className="mt-4 space-y-4 text-muted-foreground border-l-4 border-accent pl-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                            <span>{outlet.address}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                            <span>{outlet.hours}</span>
                        </div>
                         {outlet.phone && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                                <span>{outlet.phone}</span>
                            </div>
                         )}
                    </div>
                    <div className="mt-6 flex gap-4">
                        <Button asChild size="lg" className="rounded-full">
                            <a href={outlet.mapsLink || `https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`} target="_blank" rel="noopener noreferrer">
                                Get Directions
                            </a>
                        </Button>
                        {outlet.phone && (
                            <Button asChild size="lg" variant="outline" className="rounded-full">
                                <a href={`tel:${outlet.phone}`}>Call Now</a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* 3. Featured Menu Items */}
        {menuItems.length > 0 && (
          <section id="menu" className="scroll-mt-20">
            <h2 className="text-4xl font-headline font-bold text-center mb-12">Featured Drinks</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menuItems.map(item => (
                    <FeaturedMenuCard key={item.id} item={item} promotions={promotions} />
                ))}
            </div>
          </section>
        )}

        {/* 4. Promotions / Seasonal Specials */}
        {promotions.length > 0 && (
          <section id="promotions" className="scroll-mt-20">
              <h2 className="text-4xl font-headline font-bold text-center mb-12">Our Latest Offers</h2>
              <Carousel opts={{ align: 'start', loop: promotions.length > 2 }} className="w-full">
                <CarouselContent className="-ml-4">
                  {promotions.map((promo) => (
                    <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                       <PromotionCard promotion={promo} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
              </Carousel>
          </section>
        )}

        {/* 5. Gallery / Social Feed (Placeholder) */}
        <section id="gallery" className="scroll-mt-20">
            <h2 className="text-4xl font-headline font-bold text-center mb-12">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                    <Image src={`https://picsum.photos/seed/${outlet.slug}-${i}/400`} alt="Gallery image" fill className="object-cover" />
                  </div>
              ))}
            </div>
        </section>

        {/* 6. Map & Find Us Section */}
        <section id="map" className="scroll-mt-20">
          <h2 className="text-4xl font-headline font-bold text-center mb-12">Find Us</h2>
          <Card className="overflow-hidden shadow-lg rounded-3xl h-[60vh]">
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
        </section>
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

    