
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { outlets as allOutlets } from '@/lib/data';
import MicrositePageClient from './MicrositePageClient';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings, Testimonial, Blog, PublicInstaPost } from '@/lib/types';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import { collection, getDocs, query, Timestamp, doc, getDoc, limit, orderBy } from 'firebase/firestore';


// This remains a Server Component.

async function fetchCollection<T>(firestore: any, collectionName: string, q?: any): Promise<T[]> {
    const finalQuery = q || query(collection(firestore, collectionName));
    const snapshot = await getDocs(finalQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

const serializeTimestamps = (obj: any): any => {
    if (obj instanceof Timestamp) {
        return obj.toDate().toISOString();
    }
    if (Array.isArray(obj)) {
        return obj.map(serializeTimestamps);
    }
    if (typeof obj === 'object' && obj !== null) {
        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            newObj[key] = serializeTimestamps(obj[key]);
        }
        return newObj;
    }
    return obj;
};

// --- SERVER-SIDE DATA FETCHING ---
async function getMicrositeData(slug: string) {
  const { firestore } = initializeServerSideFirebase();
  const outlet = allOutlets.find(o => o.slug === slug);

  if (!outlet) {
    return { outlet: null };
  }
  
  const [
    allMenuItems, 
    allMenuCategories,
    allPromotions,
    allTestimonials,
    mainSettings,
    latestBlogs,
    instaFeed
  ] = await Promise.all([
    fetchCollection<MenuItem>(firestore, 'menuItems'),
    fetchCollection<MenuCategory>(firestore, 'menuCategories'),
    fetchCollection<Promotion>(firestore, 'promotions'),
    fetchCollection<Testimonial>(firestore, 'testimonials'),
    getDoc(doc(firestore, 'settings', 'main')).then(d => d.data() as SiteSettings),
    fetchCollection<Blog>(firestore, 'blogs', query(collection(firestore, 'blogs'), orderBy('publishedAt', 'desc'), limit(1))),
    fetchCollection<PublicInstaPost>(firestore, 'public_insta_feed', query(collection(firestore, 'public_insta_feed'), orderBy('rank', 'asc'), limit(2)))
  ]);
  
  // Filter items relevant to this outlet (or general items)
  const outletMenuItems = allMenuItems.filter(item => 
    item.isGeneral || !item.outletIds || item.outletIds.length === 0 || item.outletIds.includes(outlet.slug)
  );

  // Filter categories that have items for this outlet
  const relevantCategoryIds = new Set(outletMenuItems.map(item => item.categoryId));
  const outletMenuCategories = allMenuCategories.filter(cat => relevantCategoryIds.has(cat.id));

  // Get featured items for this outlet (popular items from the outlet's menu)
  const outletFeaturedItems = outletMenuItems.filter(item => item.isPopular);
  
  // Filter promotions relevant to this outlet (or global promotions)
  const outletPromotions = allPromotions.filter(p => !p.outletIds || p.outletIds.length === 0 || p.outletIds.includes(outlet.slug));

  return serializeTimestamps({ 
    outlet: { ...outlet, id: slug }, // Ensure outlet has an id
    menuCategories: outletMenuCategories,
    allMenuItems: outletMenuItems,
    featuredItems: outletFeaturedItems,
    promotions: outletPromotions,
    testimonials: allTestimonials,
    siteSettings: mainSettings,
    latestBlog: latestBlogs.length > 0 ? latestBlogs[0] : null,
    instaPosts: instaFeed,
  });
}

// DYNAMIC METADATA GENERATION
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const outlet = allOutlets.find(o => o.slug === params.slug);

  if (!outlet) {
    return { title: 'Outlet Not Found' };
  }

  const description = `Visit ${outlet.name} in ${outlet.city || ''} — serving Kopi Dua Darjat from ${outlet.hours || ''}.`;

  return {
    title: `${outlet.name} | Kopi Dua Darjat`,
    description,
    openGraph: {
      title: `${outlet.name} | Kopi Dua Darjat`,
      description,
      images: [],
      url: `https://kopiduadarjat.com/${outlet.slug}`,
    },
  };
}

type Props = {
  params: { slug: string };
};


// MAIN PAGE COMPONENT
export default async function OutletMicrositePage({ params }: Props) {
  const data = await getMicrositeData(params.slug);

  if (!data.outlet) {
    notFound();
  }

  // @ts-ignore
  return <MicrositePageClient {...data} />;
}
