import type { Drink, Outlet, Promotion, BlogPost } from './types';

export const featuredDrinks: Drink[] = [
  {
    id: '1',
    name: 'Kopi Darjat',
    slug: 'kopi-darjat',
    price: 4.5,
    image: 'drink-darjat',
    description: 'Our signature blend, a perfect harmony of bold and smooth.',
    tags: ['Darjat', 'Signature'],
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Artisan Matcha',
    slug: 'artisan-matcha',
    price: 6.0,
    image: 'drink-matcha',
    description: 'Stone-ground matcha from Niko Neko, whisked to perfection.',
    tags: ['Non-Coffee'],
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Bottled Series',
    slug: 'bottled-series',
    price: 5.0,
    image: 'drink-bottled',
    description: 'Your favorite Kopi Dua Darjat drinks, ready to go.',
    tags: ['Bottled'],
    isFeatured: true,
  },
];

export const promotions: Promotion[] = [
  {
    id: '1',
    title: 'Weekday Special',
    description: 'Get any 2 drinks for RM10, Mon-Fri, 2-5 PM.',
    expiry: 'Expires 31 Dec 2024',
    image: 'promotion-banner',
  },
];

export const outlets: Outlet[] = [
    {
        id: '1',
        name: 'Kopi Dua Darjat - Kajang',
        slug: 'kopi-dua-darjat-kajang',
        address: '123 Jalan Reko, Kajang, Selangor',
        hours: '8:00 AM - 10:00 PM',
        city: 'Kajang',
        isOpenNow: true,
    },
    {
        id: '2',
        name: 'Kopi Dua Darjat - Bangi',
        slug: 'kopi-dua-darjat-bangi',
        address: '456 Bandar Baru Bangi, Selangor',
        hours: '8:00 AM - 10:00 PM',
        city: 'Bangi',
        isOpenNow: true,
    },
    {
        id: '3',
        name: 'Kopi Dua Darjat - Putrajaya',
        slug: 'kopi-dua-darjat-putrajaya',
        address: '789 Presint 15, Putrajaya',
        hours: '9:00 AM - 9:00 PM',
        city: 'Putrajaya',
        isOpenNow: false,
    },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Secret Behind Our Kopi Kampung',
    slug: 'secret-behind-kopi-kampung',
    excerpt: 'Discover the heritage and brewing methods that make our coffee special.',
    imageUrl: 'blog-post-1',
    author: 'Hadi & Azad',
    publishDate: '15 July 2024',
    tags: ['Heritage', 'Coffee'],
  },
  {
    id: '2',
    title: 'From One Stall to 50+ Outlets: Our Journey',
    slug: 'from-one-to-fifty',
    excerpt: 'A look back at how Kopi Dua Darjat grew from a humble beginning.',
    imageUrl: 'blog-post-2',
    author: 'KopiVerse Team',
    publishDate: '10 July 2024',
    tags: ['Brand Story', 'Franchise'],
  },
  {
    id: '3',
    title: 'Why Kopi Dua Darjat is Your Next Franchise Opportunity',
    slug: 'franchise-opportunity',
    excerpt: 'Low entry costs, full support, and a beloved brand. Learn more here.',
    imageUrl: 'blog-post-3',
    author: 'Franchise Team',
    publishDate: '05 July 2024',
    tags: ['Franchise', 'Business'],
  },
];
