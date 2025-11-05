
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import { doc, getDoc, collection, query, where, getDocs, limit, Timestamp } from 'firebase/firestore';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings } from '@/lib/types';

import MenuCategoriesGrid from './(components)/MenuCategoriesGrid';
import SignatureDrinksCarousel from './(components)/SignatureDrinksCarousel';
import PromotionsSection from './(components)/PromotionsSection';
import BrandStorySection from './(components)/BrandStorySection';
import OutletLocatorSection from './(components)/OutletLocatorSection';
import TestimonialsSection from './(components)/TestimonialsSection';
import SocialFeedSection from './(components)/SocialFeedSection';
import NewsletterSection from './(components)/NewsletterSection';


type Props = {
  params: { slug: string };
};

// Helper to convert Firestore Timestamps in an object to serializable format
const convertTimestamps = (data: any) => {
  const newObj: any = {};
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      // Keep it as a Date object for the component, Next.js can handle this.
      newObj[key] = data[key].toDate();
    } else if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
      newObj[key] = convertTimestamps(data[key]);
    } else {
      newObj[key] = data[key];
    }
  }
  return newObj;
};


// SERVER-SIDE DATA FETCHING
async function getMicrositeData(slug: string) {
  const { firestore } = initializeServerSideFirebase();
  
  // Parallel fetching for performance
  const outletRef = doc(firestore, 'outlets', slug);
  const outletSnap = await getDoc(outletRef);

  if (!outletSnap.exists()) {
    return { outlet: null };
  }
  const outlet = { id: outletSnap.id, ...outletSnap.data() } as Outlet;

  const [
    menuCategoriesSnap,
    featuredItemsSnap,
    promotionsSnap,
    testimonialsSnap,
    settingsSnap,
  ] = await Promise.all([
    getDocs(query(collection(firestore, 'menuCategories'), where('status', '==', 'published'))),
    getDocs(query(collection(firestore, 'menuItems'), where('isPopular', '==', true), where('status', '==', 'published'), limit(8))),
    getDocs(query(collection(firestore, 'promotions'), where('status', '==', 'active'))),
    getDocs(query(collection(firestore, 'testimonials'))),
    getDoc(doc(firestore, 'settings', 'main')),
  ]);

  const menuCategories = menuCategoriesSnap.docs.map(d => ({ id: d.id, ...d.data() } as MenuCategory));
  const featuredItems = featuredItemsSnap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));
  
  // Convert timestamps to serializable format for promotions
  const promotions = promotionsSnap.docs.map(d => {
    const data = d.data();
    return { 
      id: d.id, 
      ...convertTimestamps(data)
    } as Promotion;
  });

  const testimonials = testimonialsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  const siteSettings = settingsSnap.exists() ? settingsSnap.data() as SiteSettings : null;

  // Filter promotions relevant to this outlet
  const outletPromotions = promotions.filter(p => p.outletIds?.includes(outlet.id) || !p.outletIds || p.outletIds.length === 0);

  return { 
    outlet, 
    menuCategories,
    featuredItems,
    promotions: outletPromotions,
    testimonials,
    siteSettings,
  };
}

// DYNAMIC METADATA GENERATION
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { firestore } = initializeServerSideFirebase();
  const outletRef = doc(firestore, 'outlets', params.slug);
  const outletSnap = await getDoc(outletRef);

  if (!outletSnap.exists()) {
    return { title: 'Outlet Not Found' };
  }
  const outlet = outletSnap.data() as Outlet;

  const description = `Visit ${outlet.name} in ${outlet.city || ''} — serving Kopi Dua Darjat from ${outlet.hours || ''}. ${outlet.tagline || ''}`;

  return {
    title: `${outlet.name} | Kopi Dua Darjat`,
    description,
    openGraph: {
      title: `${outlet.name} | Kopi Dua Darjat`,
      description,
      images: outlet.heroImage ? [outlet.heroImage] : [],
      url: `https://kopiduadarjat.com/${outlet.slug}`,
    },
  };
}


// MAIN PAGE COMPONENT
export default async function OutletMicrositePage({ params }: Props) {
  const data = await getMicrositeData(params.slug);

  if (!data.outlet) {
    notFound();
  }

  const { outlet, menuCategories, featuredItems, promotions, testimonials, siteSettings } = data;

  return (
    <div className="bg-white text-black">
      <main className="space-y-20 md:space-y-32">
        <MenuCategoriesGrid categories={menuCategories} />
        <SignatureDrinksCarousel items={featuredItems} promotions={promotions} />
        {promotions && promotions.length > 0 && <PromotionsSection promotions={promotions} />}
        {siteSettings && <BrandStorySection settings={siteSettings} />}
        <OutletLocatorSection currentOutlet={outlet} />
        {testimonials && testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
        <SocialFeedSection />
        <NewsletterSection />
      </main>
    </div>
  );
}
