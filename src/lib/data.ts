import type { Drink, Outlet, Promotion, BlogPost, Testimonial } from './types';

export const featuredDrinks: Drink[] = [
  {
    id: '1',
    name: 'Kopi Darjat',
    slug: 'kopi-darjat',
    price: 4.5,
    image: '/image/a.png',
    description: 'Our signature blend, a perfect harmony of bold and smooth, representing our heritage.',
    tags: ['Specials', 'Coffee'],
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Artisan Matcha',
    slug: 'artisan-matcha',
    price: 6.0,
    image: '/image/b.png',
    description: 'Stone-ground matcha from Niko Neko, whisked to perfection for a vibrant taste.',
    tags: ['Matcha', 'Specials'],
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Iced Peach Tea',
    slug: 'iced-peach-tea',
    price: 5.0,
    image: '/image/c.png',
    description: 'A refreshing iced tea infused with sweet peach flavor, perfect for a sunny day.',
    tags: ['Tea'],
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Caramel Macchiato',
    slug: 'caramel-macchiato',
    price: 5.5,
    image: '/image/d.png',
    description: 'A creamy, classic favorite with a sweet caramel drizzle and a bold espresso shot.',
    tags: ['Coffee', 'Specials'],
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
        lat: 2.9935,
        lng: 101.7874,
        isOpenNow: true,
    },
    {
        id: '2',
        name: 'Kopi Dua Darjat - Bangi',
        slug: 'kopi-dua-darjat-bangi',
        address: '456 Bandar Baru Bangi, Selangor',
        hours: '8:00 AM - 10:00 PM',
        city: 'Bangi',
        lat: 2.9555,
        lng: 101.7616,
        isOpenNow: true,
    },
    {
        id: '3',
        name: 'Kopi Dua Darjat - Putrajaya',
        slug: 'kopi-dua-darjat-putrajaya',
        address: '789 Presint 15, Putrajaya',
        hours: '9:00 AM - 9:00 PM',
        city: 'Putrajaya',
        lat: 2.9264,
        lng: 101.6964,
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

export const testimonials: Testimonial[] = [
    {
      id: '1',
      quote: 'Joining Kopi Dua Darjat was the best business decision I\'ve ever made. The support from the central team is unmatched.',
      name: 'Ahmad Faizal',
      designation: 'Franchisee, KDD Bangi',
      image: 'testimonial-1',
    },
    {
      id: '2',
      quote: 'The brand recognition is incredible. Customers love the coffee, and my outlet has been profitable since month one.',
      name: 'Siti Nurhaliza',
      designation: 'Franchisee, KDD Kajang',
      image: 'testimonial-2',
    },
    {
      id: '3',
      quote: 'I always wanted to own a café. Kopi Dua Darjat made that dream a reality with a low-cost, high-return model.',
      name: 'Ravi Chandran',
      designation: 'Franchisee, KDD Putrajaya',
      image: 'testimonial-3',
    },
  ];




