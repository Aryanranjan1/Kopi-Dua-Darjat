
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings, Testimonial, Founder } from '@/lib/types';

import { outlets as allOutlets, blogSeedData } from '@/lib/data';

import MenuCategoriesGrid from './(components)/MenuCategoriesGrid';
import SignatureDrinksCarousel from './(components)/SignatureDrinksCarousel';
import PromotionsSection from './(components/PromotionsSection)';
import BrandStorySection from './(components)/BrandStorySection';
import OutletLocatorSection from './(components)/OutletLocatorSection';
import TestimonialsSection from './(components)/TestimonialsSection';
import SocialFeedSection from './(components)/SocialFeedSection';
import NewsletterSection from './(components)/NewsletterSection';

// --- MOCK DATA ---
const menuCategories: MenuCategory[] = [
  { id: '1', name: 'Darjat Series', slug: 'darjat-series', description: 'Our signature coffee blends.', imageUrl: 'https://picsum.photos/seed/darjat/600/800', displayOrder: 1, status: 'published', groupId: 'kopi', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Matcha Series', slug: 'matcha-series', description: 'Premium green tea creations.', imageUrl: 'https://picsum.photos/seed/matcha/600/800', displayOrder: 2, status: 'published', groupId: 'non-kopi', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Coklat Series', slug: 'coklat-series', description: 'Rich and decadent chocolate drinks.', imageUrl: 'https://picsum.photos/seed/coklat/600/800', displayOrder: 3, status: 'published', groupId: 'non-kopi', createdAt: new Date(), updatedAt: new Date() },
];

const featuredItems: MenuItem[] = [
  { id: '1', name: 'Darjat Caramel', slug: 'darjat-caramel', description: 'Our signature rich espresso with creamy milk and a sweet caramel swirl.', price: 5.50, imageUrl: '/image/kdd-cup.png', categoryId: '1', isPopular: true, status: 'published', displayOrder: 1, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Darjat Borneo', slug: 'darjat-borneo', description: 'An exotic blend featuring smoky Gula Apong from Sarawak for a unique taste.', price: 6.00, imageUrl: '/image/kdd-cup.png', categoryId: '1', isPopular: true, status: 'published', displayOrder: 2, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Matcha Latte', slug: 'matcha-latte', description: 'Ceremonial grade matcha with steamed milk, a perfect balance of earthy and creamy.', price: 7.00, imageUrl: '/image/kdd-cup.png', categoryId: '2', isPopular: true, status: 'published', displayOrder: 3, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Coklat Ais', slug: 'coklat-ais', description: 'Rich, dark chocolate poured over ice with fresh milk. A classic indulgence.', price: 6.50, imageUrl: '/image/kdd-cup.png', categoryId: '3', isPopular: true, status: 'published', displayOrder: 4, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
];

const promotions: Promotion[] = [
  { id: '1', title: 'Weekend BOGO', description: 'Buy one Darjat series drink, get another free!', discountType: 'bogo', discountValue: 0, startDate: new Date(), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'active', bannerImage: 'https://picsum.photos/seed/promo1/600/400', menuItemIds: ['1', '2'], createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Lunch Hour Special', description: 'Get 20% off any drink between 12 PM and 2 PM.', discountType: 'percentage', discountValue: 20, startDate: new Date(), endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'active', bannerImage: 'https://picsum.photos/seed/promo2/600/400', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: 'Matcha Madness', description: 'Enjoy RM2 off all Matcha series drinks.', discountType: 'flat', discountValue: 2, startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'active', bannerImage: 'https://picsum.photos/seed/promo3/600/400', menuItemIds: ['3'], createdAt: new Date(), updatedAt: new Date() },
];

const testimonials: Testimonial[] = [
    { id: '1', quote: "The best local coffee I've ever had! The Darjat Borneo is a must-try.", name: 'Aiman Hakim', designation: 'Coffee Enthusiast', image: 'https://picsum.photos/seed/aiman/100/100' },
    { id: '2', quote: "Opening a KDD franchise was the best decision I made. The support is amazing.", name: 'Siti Nurhaliza', designation: 'Franchisee, Penang', image: 'https://picsum.photos/seed/siti/100/100' },
    { id: '3', quote: "Finally, a place that makes great matcha and great coffee. My go-to spot!", name: 'Raj Patel', designation: 'Regular Customer', image: 'https://picsum.photos/seed/raj/100/100' },
];

const founders: Founder[] = [
    { name: 'Ahmad Hadi', role: 'Co-Founder & Head of Product', image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&auto=format&fit=crop', quote: "We wanted to create something that felt both nostalgic and new.", contact: 'hadi@kdd.com' },
    { name: 'Azad', role: 'Co-Founder & Head of Operations', image: 'https://images.unsplash.com/photo-1533901567451-7a6e68d6cd8f?w=500&auto=format&fit=crop', quote: "It's about empowering local entrepreneurs.", contact: 'azad@kdd.com' },
]

const siteSettings: SiteSettings = {
    id: 'main',
    brand: { name: 'Kopi Dua Darjat', primaryColor: '#F9C349', accentColor: '#000000', favicon: '', logoDark: '', logoLight: '', tagline: ''},
    founders: founders,
    contact: { email: '', phone: '', address: '', googleMapsLink: '', businessHours: '' },
    socials: { instagram: '#', facebook: '#', tiktok: '#', youtube: '#', whatsapp: '#' },
    automation: { newsletterIntegration: true, googleBusinessSync: true, autoBackup: true, appCheckEnforced: true },
    meta: { defaultTitle: '', defaultDescription: '', defaultImage: '' },
    lastUpdated: new Date(),
    updatedBy: 'system'
};
// --- END MOCK DATA ---


type Props = {
  params: { slug: string };
};

// SERVER-SIDE DATA FETCHING (from mock data)
async function getMicrositeData(slug: string) {
  const outlet = allOutlets.find(o => o.slug === slug);

  if (!outlet) {
    return { outlet: null };
  }
  
  // Filter promotions relevant to this outlet (or global promotions)
  const outletPromotions = promotions.filter(p => p.outletIds?.includes(outlet.slug) || !p.outletIds || p.outletIds.length === 0);

  return { 
    outlet: { ...outlet, id: slug }, // Ensure outlet has an id
    menuCategories,
    featuredItems,
    promotions: outletPromotions,
    testimonials,
    siteSettings,
  };
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
        <SignatureDrinksCarousel items={featuredItems} promotions={promotions || []} />
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

