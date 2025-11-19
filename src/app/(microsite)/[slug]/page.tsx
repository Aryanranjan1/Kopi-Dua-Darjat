

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MicrositePageClient from './MicrositePageClient';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings, Blog, PublicInstaPost, ReviewDocument, Review, Media } from '@/lib/types';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import { collection, getDocs, query, Timestamp, doc, getDoc, limit, orderBy, where } from 'firebase/firestore';


// This remains a Server Component.

async function fetchCollection<T>(firestore: any, collectionName: string, q?: any): Promise<T[]> {
    const finalQuery = q || query(collection(firestore, collectionName));
    const snapshot = await getDocs(finalQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

const serializeTimestamps = (obj: any): any => {
    if (obj instanceof Timestamp) {
        // Return the whole Timestamp object for client-side date-fns formatting
        return { seconds: obj.seconds, nanoseconds: obj.nanoseconds };
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
  
  const outletDocRef = doc(firestore, 'outlets', slug);
  const outletDoc = await getDoc(outletDocRef);
  
  if (!outletDoc.exists()) {
    return { outlet: null };
  }

  const outlet = { id: outletDoc.id, ...outletDoc.data() } as Outlet;
  
  // Return 404 if the outlet is inactive
  if (outlet.status === 'inactive') {
    return { outlet: null };
  }
  
  const [
    allMenuItems, 
    allMenuCategories,
    allPromotions,
    reviewDoc,
    mainSettings,
    latestBlogs,
    instaFeed
  ] = await Promise.all([
    fetchCollection<MenuItem>(firestore, 'menuItems'),
    fetchCollection<MenuCategory>(firestore, 'menuCategories'),
    fetchCollection<Promotion>(firestore, 'promotions'),
    getDoc(doc(firestore, 'reviews', outlet.id)).then(d => d.exists() ? d.data() as ReviewDocument : null),
    getDoc(doc(firestore, 'settings', 'main')).then(d => d.data() as SiteSettings),
    fetchCollection<Blog>(firestore, 'blogs', query(collection(firestore, 'blogs'), orderBy('publishedAt', 'desc'), limit(1))),
    fetchCollection<PublicInstaPost>(firestore, 'public_insta_feed', query(collection(firestore, 'public_insta_feed'), orderBy('rank', 'asc'), limit(20)))
  ]);
  
  let heroImageUrl = outlet.heroImage;
  if (!heroImageUrl) {
    const allMedia = await fetchCollection<Media>(firestore, 'media');
    if (allMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * allMedia.length);
        heroImageUrl = allMedia[randomIndex].imageUrl;
    }
  }

  const outletMenuItems = allMenuItems.filter(item => 
    item.isGeneral || !item.outletIds || item.outletIds.length === 0 || item.outletIds.includes(outlet.id)
  );

  const relevantCategoryIds = new Set(outletMenuItems.map(item => item.categoryId));
  const outletMenuCategories = allMenuCategories.filter(cat => relevantCategoryIds.has(cat.id));

  const outletFeaturedItems = outletMenuItems.filter(item => item.isPopular);
  
  const outletPromotions = allPromotions.filter(p => !p.outletIds || p.outletIds.length === 0 || p.outletIds.includes(outlet.id));

  return serializeTimestamps({ 
    outlet: { ...outlet, heroImage: heroImageUrl },
    menuCategories: outletMenuCategories,
    allMenuItems: outletMenuItems,
    featuredItems: outletFeaturedItems,
    promotions: outletPromotions,
    reviewData: reviewDoc,
    siteSettings: mainSettings,
    latestBlog: latestBlogs.length > 0 ? latestBlogs[0] : null,
    instaPosts: instaFeed,
  });
}

function generateJsonLd(outlet: Outlet, reviewData: ReviewDocument | null) {
  if (!reviewData || !reviewData.aggregate || reviewData.reviews.length === 0) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": outlet.name,
    "image": outlet.heroImage || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": outlet.address,
      "addressLocality": outlet.city,
      "addressRegion": outlet.state,
      "addressCountry": "MY"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": String(reviewData.aggregate.ratingValue.toFixed(1)),
      "reviewCount": String(reviewData.aggregate.reviewCount)
    },
    "review": reviewData.reviews.map((review: Review) => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": review.author_name },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": String(review.rating)
      },
      "reviewBody": review.text,
      "publisher": { "@type": "Organization", "name": review.attribution || (review.source === 'google' ? 'Google' : 'Kopi Dua Darjat') }
    }))
  };

  return JSON.stringify(schema);
}


// DYNAMIC METADATA GENERATION
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { firestore } = initializeServerSideFirebase();
  const outletDocRef = doc(firestore, 'outlets', params.slug);
  const outletDoc = await getDoc(outletDocRef);

  if (!outletDoc.exists() || outletDoc.data()?.status === 'inactive') {
    return { title: 'Outlet Not Found' };
  }
  
  const outlet = outletDoc.data() as Outlet & { seo?: { title?: string, description?: string, keywords?: string } };
  
  const metaTitle = outlet.seo?.title || `${outlet.name} | Kopi Dua Darjat`;
  const metaDescription = outlet.seo?.description || `Visit ${outlet.name} in ${outlet.city || ''} — serving Kopi Dua Darjat from ${outlet.hours || ''}.`;
  const metaKeywords = outlet.seo?.keywords || `${outlet.name}, Kopi Dua Darjat, coffee in ${outlet.city}`;


  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: outlet.heroImage ? [outlet.heroImage] : [],
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

  if (!data || !data.outlet) {
    notFound();
  }

  const jsonLd = generateJsonLd(data.outlet, data.reviewData);

  return (
    <>
        {jsonLd && (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd }}
            />
        )}
        <MicrositePageClient {...data} />
    </>
  );
}
