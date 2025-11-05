
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { outlets as allOutlets } from '@/lib/data';
import MicrositePageClient from './MicrositePageClient';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings, Founder } from '@/lib/types';


// This remains a Server Component.

// --- MOCK DATA ---
const menuCategories: MenuCategory[] = [
  { id: '1', name: 'Darjat Series', slug: 'darjat-series', description: 'Our signature coffee blends.', imageUrl: 'https://picsum.photos/seed/darjat/600/800', displayOrder: 1, status: 'published', groupId: 'kopi', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Matcha Series', slug: 'matcha-series', description: 'Premium green tea creations.', imageUrl: 'https://picsum.photos/seed/matcha/600/800', displayOrder: 2, status: 'published', groupId: 'non-kopi', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Coklat Series', slug: 'coklat-series', description: 'Rich and decadent chocolate drinks.', imageUrl: 'https://picsum.photos/seed/coklat/600/800', displayOrder: 3, status: 'published', groupId: 'non-kopi', createdAt: new Date(), updatedAt: new Date() },
];

const allMenuItems: MenuItem[] = [
  { id: '1', name: 'Darjat Caramel', slug: 'darjat-caramel', description: 'Our signature rich espresso with creamy milk and a sweet caramel swirl.', price: 5.50, imageUrl: '/image/kdd-cup.png', categoryId: '1', isPopular: true, status: 'published', displayOrder: 1, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Darjat Borneo', slug: 'darjat-borneo', description: 'An exotic blend featuring smoky Gula Apong from Sarawak for a unique taste.', price: 6.00, imageUrl: '/image/kdd-cup.png', categoryId: '1', isPopular: true, status: 'published', displayOrder: 2, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Matcha Latte', slug: 'matcha-latte', description: 'Ceremonial grade matcha with steamed milk, a perfect balance of earthy and creamy.', price: 7.00, imageUrl: '/image/kdd-cup.png', categoryId: '2', isPopular: true, status: 'published', displayOrder: 3, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Coklat Ais', slug: 'coklat-ais', description: 'Rich, dark chocolate poured over ice with fresh milk. A classic indulgence.', price: 6.50, imageUrl: '/image/kdd-cup.png', categoryId: '3', isPopular: true, status: 'published', displayOrder: 4, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', name: 'Vanilla Latte', slug: 'vanilla-latte', description: 'Smooth espresso with steamed milk and a hint of vanilla.', price: 6.00, imageUrl: '/image/kdd-cup.png', categoryId: '1', isPopular: false, status: 'published', displayOrder: 5, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', name: 'Hazelnut Americano', slug: 'hazelnut-americano', description: 'A shot of espresso with hot water and a nutty hazelnut flavor.', price: 5.00, imageUrl: '/image/kdd-cup.png', categoryId: '1', isPopular: false, status: 'published', displayOrder: 6, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', name: 'Hojicha Latte', slug: 'hojicha-latte', description: 'Roasted green tea with steamed milk for a toasty, comforting drink.', price: 7.50, imageUrl: '/image/kdd-cup.png', categoryId: '2', isPopular: false, status: 'published', displayOrder: 7, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', name: 'Dark Chocolate Mocha', slug: 'dark-chocolate-mocha', description: 'A perfect blend of dark chocolate and rich espresso.', price: 8.00, imageUrl: '/image/kdd-cup.png', categoryId: '3', isPopular: false, status: 'published', displayOrder: 8, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', name: 'Classic Kopi O', slug: 'kopi-o', description: 'The original Malaysian black coffee, strong and aromatic.', price: 3.00, imageUrl: '/image/kdd-cup.png', categoryId: '1', isPopular: false, status: 'published', displayOrder: 9, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '10', name: 'Strawberry Matcha', slug: 'strawberry-matcha', description: 'A beautiful and tasty layer of strawberry puree, milk, and matcha.', price: 8.50, imageUrl: '/image/kdd-cup.png', categoryId: '2', isPopular: false, status: 'published', displayOrder: 10, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '11', name: 'White Chocolate Dream', slug: 'white-chocolate-dream', description: 'Creamy white chocolate melted into steamed milk.', price: 7.00, imageUrl: '/image/kdd-cup.png', categoryId: '3', isPopular: false, status: 'published', displayOrder: 11, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '12', name: 'Gula Melaka Latte', slug: 'gula-melaka-latte', description: 'A local favorite, espresso with milk and rich palm sugar.', price: 6.50, imageUrl: '/image/kdd-cup.png', categoryId: '1', isPopular: false, status: 'published', displayOrder: 12, isGeneral: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '13', name: 'Sparkling Lemonade', slug: 'sparkling-lemonade', description: 'A refreshing and bubbly lemonade for a hot day.', price: 5.00, imageUrl: '/image/kdd-cup.png', categoryId: '3', isPopular: false, status: 'published', displayOrder: 13, isGeneral: true, createdAt: new Date(), updatedAt: new Date() }
];

const featuredItems = allMenuItems.filter(item => item.isPopular);

const promotions: Promotion[] = [
  { id: '1', title: 'Weekend BOGO', description: 'Buy one Darjat series drink, get another free!', discountType: 'bogo', discountValue: 0, startDate: new Date(), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'active', bannerImage: 'https://picsum.photos/seed/promo1/800/600', menuItemIds: ['1', '2'], createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Lunch Hour Special', description: 'Get 20% off any drink between 12 PM and 2 PM.', discountType: 'percentage', discountValue: 20, startDate: new Date(), endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'active', bannerImage: 'https://picsum.photos/seed/promo2/600/400', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: 'Matcha Madness', description: 'Enjoy RM2 off all Matcha series drinks.', discountType: 'flat', discountValue: 2, startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'active', bannerImage: 'https://picsum.photos/seed/promo3/600/400', menuItemIds: ['3'], createdAt: new Date(), updatedAt: new Date() },
   { id: '4', title: 'New Drink!', description: 'Try our new Pandan Latte.', discountType: 'custom', discountValue: 0, customDiscountDescription: 'Intro Price RM5', startDate: new Date(), endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), status: 'active', bannerImage: 'https://picsum.photos/seed/promo4/600/400', menuItemIds: [], createdAt: new Date(), updatedAt: new Date() },
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
  const outletPromotions = promotions.filter(p => !p.outletIds || p.outletIds.length === 0 || p.outletIds.includes(outlet.slug));

  // Manually convert date objects to strings to avoid serialization issues
  const serializablePromotions = outletPromotions.map(promo => ({
    ...promo,
    startDate: promo.startDate.toISOString(),
    endDate: promo.endDate.toISOString(),
    createdAt: promo.createdAt.toISOString(),
    updatedAt: promo.updatedAt.toISOString(),
  }));
  
  const serializableCategories = menuCategories.map(cat => ({
      ...cat,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
  }));

  const serializableItems = allMenuItems.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
  }));

  const serializableFeaturedItems = featuredItems.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
  }));


  return { 
    outlet: { ...outlet, id: slug }, // Ensure outlet has an id
    menuCategories: serializableCategories,
    allMenuItems: serializableItems,
    featuredItems: serializableFeaturedItems,
    promotions: serializablePromotions,
    siteSettings: {
        ...siteSettings,
        lastUpdated: siteSettings.lastUpdated.toISOString(),
    },
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

  // Cast the data to remove testimonials before passing
  const { testimonials, ...restOfData } = data as any;

  return (
    <MicrositePageClient {...restOfData} />
  );
}
