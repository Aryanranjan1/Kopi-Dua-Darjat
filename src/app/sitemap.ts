
import { MetadataRoute } from 'next';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Blog, Outlet } from '@/lib/types';

const baseUrl = 'https://kopiduadarjat.com'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { firestore } = initializeServerSideFirebase();

  // 1. Fetch dynamic routes
  const blogsQuery = query(collection(firestore, 'blogs'), where('status', '==', 'published'));
  const outletsQuery = query(collection(firestore, 'outlets'), where('status', '==', 'active'));

  const [blogSnap, outletSnap] = await Promise.all([
    getDocs(blogsQuery),
    getDocs(outletsQuery),
  ]);

  const blogEntries: MetadataRoute.Sitemap = blogSnap.docs.map(doc => {
    const post = doc.data() as Blog;
    return {
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: post.updatedAt?.toDate() || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  const outletEntries: MetadataRoute.Sitemap = outletSnap.docs.map(doc => {
    const outlet = doc.data() as Outlet;
    return {
      url: `${baseUrl}/${outlet.slug}`,
      lastModified: outlet.updatedAt?.toDate() || new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    };
  });
  
  // 2. Define static routes
  const staticRoutes = [
    '/',
    '/about',
    '/menu',
    '/outlets',
    '/contact',
    '/franchise',
    '/franchise/apply',
    '/news',
    '/faq',
    '/privacy',
    '/terms',
    '/promotions'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1.0 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...blogEntries,
    ...outletEntries,
  ];
}
