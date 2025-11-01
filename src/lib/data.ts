
import type { Drink, Outlet, Promotion, BlogPost, Testimonial } from './types';

export const allDrinks: Drink[] = [
  // Darjat Series
  { id: 'd1', name: 'Darjat Vanilla', slug: 'darjat-vanilla', price: 9, image: '/image/a.png', description: '', tags: ['Darjat Series'], isFeatured: false, hasPromotion: true, promotionDetails: 'RM2 Off Today' },
  { id: 'd2', name: 'Darjat Caramel', slug: 'darjat-caramel', price: 9, image: '/image/d.png', description: '', tags: ['Darjat Series', 'Our Favourites'], isFeatured: true },
  { id: 'd3', name: 'Darjat Hazel', slug: 'darjat-hazel', price: 9, image: '/image/a.png', description: '', tags: ['Darjat Series'], isFeatured: false },
  { id: 'd4', name: 'Darjat Butterscotch', slug: 'darjat-butterscotch', price: 9, image: '/image/d.png', description: '', tags: ['Darjat Series'], isFeatured: false },
  { id: 'd5', name: 'Darjat Borneo', slug: 'darjat-borneo', price: 9, image: '/image/a.png', description: 'dengan sirap Gula Apong Sarawak', tags: ['Darjat Series'], isFeatured: false },
  { id: 'd6', name: 'Darjat Malaya', slug: 'darjat-malaya', price: 8, image: '/image/d.png', description: 'kopi susu dan susu pekat', tags: ['Darjat Series'], isFeatured: false },
  { id: 'd7', name: 'Darjat Tamanis', slug: 'darjat-tamanis', price: 8, image: '/image/a.png', description: 'kopi susu tanpa gula/sirap', tags: ['Darjat Series'], isFeatured: false },

  // Kopitiam Series
  { id: 'k1', name: 'Kopi Warisan', slug: 'kopi-warisan', price: 8, image: '/image/d.png', description: '', tags: ['Kopitiam Series'], isFeatured: false },
  { id: 'k2', name: 'Kopi Karim', slug: 'kopi-karim', price: 8, image: '/image/b.png', description: 'kopi ekstra kaw dengan krim pekat manis', tags: ['Kopitiam Series', 'Our Favourites'], isFeatured: true, hasPromotion: true, promotionDetails: 'Buy 1 Get 1' },
  { id: 'k3', name: 'Kopi Melayo', slug: 'kopi-melayo', price: 5, image: '/image/a.png', description: 'kopi hitam dan sirap vanila', tags: ['Kopitiam Series'], isFeatured: false },

  // Espresso Series
  { id: 'e1', name: 'Americano', slug: 'americano', price: 7, image: '/image/d.png', description: '', tags: ['Espresso Series'], isFeatured: false },
  { id: 'e2', name: 'Latté', slug: 'latte', price: 9, image: '/image/a.png', description: '', tags: ['Espresso Series'], isFeatured: false },
  { id: 'e3', name: 'Creamy Latté', slug: 'creamy-latte', price: 10, image: '/image/d.png', description: 'cafe latte yang lebih creamy', tags: ['Espresso Series'], isFeatured: false },
  { id: 'e4', name: 'Borneo Latté', slug: 'borneo-latte', price: 10, image: '/image/a.png', description: 'latte dengan sirap gula apong Sarawak', tags: ['Espresso Series'], isFeatured: false },
  { id: 'e5', name: 'Latté Malaya', slug: 'latte-malaya', price: 10, image: '/image/d.png', description: 'latte dengan susu pekat', tags: ['Espresso Series'], isFeatured: false },
  { id: 'e6', name: 'Café Limone', slug: 'cafe-limone', price: 10, image: '/image/a.png', description: 'americano lemon', tags: ['Espresso Series'], isFeatured: false },
  { id: 'e7', name: 'Mocha', slug: 'mocha', price: 10, image: '/image/d.png', description: '', tags: ['Espresso Series'], isFeatured: false, hasPromotion: true, promotionDetails: 'Free Espresso Shot' },
  { id: 'e8', name: 'Dark Mocha', slug: 'dark-mocha', price: 11, image: '/image/a.png', description: 'mocha dengan extra coklat', tags: ['Espresso Series'], isFeatured: false },
  { id: 'e9', name: 'Dirty Matcha', slug: 'dirty-matcha', price: 11, image: '/image/d.png', description: 'matcha dipadankan dengan espreso', tags: ['Espresso Series'], isFeatured: false },

  // Coklat Series
  { id: 'cs1', name: 'Coklat Artisan', slug: 'coklat-artisan', price: 9, image: '/image/c.png', description: '', tags: ['Coklat Series'], isFeatured: false },
  { id: 'cs2', name: 'Makha', slug: 'makha', price: 9, image: '/image/a.png', description: 'mocha versi Dua Darjat. Campuran kopi dan coklat', tags: ['Coklat Series'], isFeatured: false },
  { id: 'cs3', name: 'Triple Choc Makha', slug: 'triple-choc-makha', price: 10, image: '/image/d.png', description: 'makha dengan ekstra coklat', tags: ['Coklat Series'], isFeatured: false },
  { id: 'cs4', name: 'Coklat Caramel', slug: 'coklat-caramel', price: 10, image: '/image/c.png', description: '', tags: ['Coklat Series'], isFeatured: false, hasPromotion: true, promotionDetails: '20% Off' },

  // Matcha Series
  { id: 'ma1', name: 'Matcho', slug: 'matcho', price: 8, image: '/image/b.png', description: 'matcha O tanpa susu dengan pilihan sirap Dua Darjat', tags: ['Matcha Series'], isFeatured: false },
  { id: 'ma2', name: 'Matchaa', slug: 'matchaa', price: 9, image: '/image/b.png', description: 'matcha latte yang lebih berkrim', tags: ['Matcha Series'], isFeatured: false },
  { id: 'ma3', name: 'Choc Matchaa', slug: 'choc-matchaa', price: 10, image: '/image/b.png', description: '', tags: ['Matcha Series'], isFeatured: false },
  { id: 'ma4', name: 'Kopi Matchaa', slug: 'kopi-matchaa', price: 10, image: '/image/b.png', description: '', tags: ['Matcha Series'], isFeatured: false },
  { id: 'ma5', name: 'Matchaa Caramel', slug: 'matchaa-caramel', price: 10, image: '/image/b.png', description: '', tags: ['Matcha Series', 'Our Favourites'], isFeatured: true, hasPromotion: true, promotionDetails: 'Member Exclusive' },
  
  // Menet Series
  { id: 'me1', name: 'Le Menet', slug: 'le-menet', price: 7, image: '/image/a.png', description: 'minuman sparkling berperisa lemon', tags: ['Menet Series'], isFeatured: false },
  { id: 'me2', name: 'Kopi Leman', slug: 'kopi-leman', price: 7, image: '/image/d.png', description: 'kopi O dan sirap lemon', tags: ['Menet Series'], isFeatured: false },
  { id: 'me3', name: 'Matcho Leman', slug: 'matcho-leman', price: 9, image: '/image/b.png', description: 'matcha O dan sirap lemon', tags: ['Menet Series'], isFeatured: false },
  { id: 'me4', name: 'Berrygo Menet', slug: 'berrygo-menet', price: 9, image: '/image/c.png', description: 'gabungan strawberi, mangga dan lemon', tags: ['Menet Series', 'Our Favourites'], isFeatured: true, hasPromotion: true, promotionDetails: 'Limited Time' },
  { id: 'me5', name: 'Strawberry Menet', slug: 'strawberry-menet', price: 9, image: '/image/a.png', description: '', tags: ['Menet Series'], isFeatured: false },
  { id: 'me6', name: 'Mango Menet', slug: 'mango-menet', price: 9, image: '/image/d.png', description: '', tags: ['Menet Series'], isFeatured: false },
  { id_ts: 'me7', name: 'Blueberry Menet', slug: 'blueberry-menet', price: 9, image: '/image/c.png', description: '', tags: ['Menet Series'], isFeatured: false },
  { id: 'me8', name: 'Pomegranate Menet', slug: 'pomegranate-menet', price: 9, image: '/image/a.png', description: '', tags: ['Menet Series'], isFeatured: false },
  { id: 'me9', name: 'Rock Melon Menet', slug: 'rock-melon-menet', price: 9, image: '/image/d.png', description: '', tags: ['Menet Series'], isFeatured: false },
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
    excerpt: 'Discover the heritage and brewing methods that make our coffee special, and how we blend tradition with modern tastes.',
    imageUrl: 'blog-post-1',
    author: 'Hadi & Azad',
    publishDate: '15 July 2024',
    tags: ['Heritage'],
  },
  {
    id: '2',
    title: 'From One Stall to 50+ Outlets: Our Journey',
    slug: 'from-one-to-fifty',
    excerpt: 'A look back at how Kopi Dua Darjat grew from a humble beginning into a nationwide family.',
    imageUrl: 'blog-post-2',
    author: 'KopiVerse Team',
    publishDate: '10 July 2024',
    tags: ['Brand Story'],
  },
  {
    id: '3',
    title: 'Why Kopi Dua Darjat is Your Next Franchise Opportunity',
    slug: 'franchise-opportunity',
    excerpt: 'Low entry costs, full support, and a beloved brand. Learn more here.',
    imageUrl: 'blog-post-3',
    author: 'Franchise Team',
    publishDate: '05 July 2024',
    tags: ['Franchise'],
  },
  {
    id: '4',
    title: 'A Guide to Our Signature Matcha Blends',
    slug: 'matcha-blends-guide',
    excerpt: 'Explore the world of our artisan matcha, from classic lattes to unique infusions.',
    imageUrl: 'blog-post-4',
    author: 'Azad',
    publishDate: '20 July 2024',
    tags: ['Menu'],
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
