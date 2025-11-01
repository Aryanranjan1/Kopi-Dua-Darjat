
import type { Drink, Outlet, Promotion, BlogPost, Testimonial, FaqItem } from './types';

export const allDrinks: Drink[] = [
  // Darjat Series
  { id: 'd1', name: 'Darjat Vanilla', slug: 'darjat-vanilla', price: 9, image: '/image/a.png', description: 'Creamy vanilla goodness', tags: ['Darjat Series', 'Coffee'], isFeatured: false, hasPromotion: true, promotionDetails: 'RM2 Off Today' },
  { id: 'd2', name: 'Darjat Caramel', slug: 'darjat-caramel', price: 9, image: '/image/d.png', description: 'Rich caramel swirls', tags: ['Darjat Series', 'Our Favourites', 'Daily Special', 'Coffee'], isFeatured: true },
  { id: 'd3', name: 'Darjat Hazel', slug: 'darjat-hazel', price: 9, image: '/image/a.png', description: 'Nutty & aromatic', tags: ['Darjat Series', 'Coffee'], isFeatured: false },
  { id: 'd4', name: 'Darjat Butterscotch', slug: 'darjat-butterscotch', price: 9, image: '/image/d.png', description: 'Sweet butterscotch notes', tags: ['Darjat Series', 'Daily Special', 'Coffee'], isFeatured: false, promotionDetails: 'Free Upsize' },
  { id: 'd5', name: 'Darjat Borneo', slug: 'darjat-borneo', price: 9, image: '/image/a.png', description: 'dengan sirap Gula Apong Sarawak', tags: ['Darjat Series', 'Coffee'], isFeatured: false },
  { id: 'd6', name: 'Darjat Malaya', slug: 'darjat-malaya', price: 8, image: '/image/d.png', description: 'kopi susu dan susu pekat', tags: ['Darjat Series', 'Coffee'], isFeatured: false },
  { id: 'd7', name: 'Darjat Tamanis', slug: 'darjat-tamanis', price: 8, image: '/image/a.png', description: 'kopi susu tanpa gula/sirap', tags: ['Darjat Series', 'Coffee'], isFeatured: false },

  // Kopitiam Series
  { id: 'k1', name: 'Kopi Warisan', slug: 'kopi-warisan', price: 8, image: '/image/d.png', description: 'The original classic', tags: ['Kopitiam Series', 'Coffee'], isFeatured: false },
  { id: 'k2', name: 'Kopi Karim', slug: 'kopi-karim', price: 8, image: '/image/b.png', description: 'kopi ekstra kaw dengan krim pekat manis', tags: ['Kopitiam Series', 'Our Favourites', 'Coffee'], isFeatured: true, hasPromotion: true, promotionDetails: 'Buy 1 Get 1' },
  { id: 'k3', name: 'Kopi Melayo', slug: 'kopi-melayo', price: 5, image: '/image/a.png', description: 'kopi hitam dan sirap vanila', tags: ['Kopitiam Series', 'Coffee'], isFeatured: false },

  // Espresso Series
  { id: 'e1', name: 'Americano', slug: 'americano', price: 7, image: '/image/d.png', description: 'Bold and intense', tags: ['Espresso Series', 'Coffee'], isFeatured: false },
  { id: 'e2', name: 'Latté', slug: 'latte', price: 9, image: '/image/a.png', description: 'Smooth and milky', tags: ['Espresso Series', 'Coffee'], isFeatured: false },
  { id: 'e3', name: 'Creamy Latté', slug: 'creamy-latte', price: 10, image: '/image/d.png', description: 'cafe latte yang lebih creamy', tags: ['Espresso Series', 'Daily Special', 'Coffee'], isFeatured: false },
  { id: 'e4', name: 'Borneo Latté', slug: 'borneo-latte', price: 10, image: '/image/a.png', description: 'latte dengan sirap gula apong Sarawak', tags: ['Espresso Series', 'Coffee'], isFeatured: false },
  { id: 'e5', name: 'Latté Malaya', slug: 'latte-malaya', price: 10, image: '/image/d.png', description: 'latte dengan susu pekat', tags: ['Espresso Series', 'Coffee'], isFeatured: false },
  { id: 'e6', name: 'Café Limone', slug: 'cafe-limone', price: 10, image: '/image/a.png', description: 'americano lemon', tags: ['Espresso Series', 'Coffee'], isFeatured: false },
  { id: 'e7', name: 'Mocha', slug: 'mocha', price: 10, image: '/image/d.png', description: 'Chocolatey coffee delight', tags: ['Espresso Series', 'Daily Special', 'Coffee'], isFeatured: false, hasPromotion: true, promotionDetails: 'Free Espresso Shot' },
  { id: 'e8', name: 'Dark Mocha', slug: 'dark-mocha', price: 11, image: '/image/a.png', description: 'mocha dengan extra coklat', tags: ['Espresso Series', 'Coffee'], isFeatured: false, hasPromotion: true, promotionDetails: 'RM1 Off' },
  { id: 'e9', name: 'Dirty Matcha', slug: 'dirty-matcha', price: 11, image: '/image/d.png', description: 'matcha dipadankan dengan espreso', tags: ['Espresso Series', 'Daily Special', 'Coffee', 'Matcha'], isFeatured: false, hasPromotion: true, promotionDetails: 'Combo Deal' },

  // Coklat Series
  { id: 'cs1', name: 'Coklat Artisan', slug: 'coklat-artisan', price: 9, image: '/image/c.png', description: 'Rich chocolate indulgence', tags: ['Coklat Series', 'Tea'], isFeatured: false },
  { id: 'cs2', name: 'Makha', slug: 'makha', price: 9, image: '/image/a.png', description: 'mocha versi Dua Darjat. Campuran kopi dan coklat', tags: ['Coklat Series', 'Coffee', 'Tea'], isFeatured: false },
  { id: 'cs3', name: 'Triple Choc Makha', slug: 'triple-choc-makha', price: 10, image: '/image/d.png', description: 'makha dengan ekstra coklat', tags: ['Coklat Series', 'Coffee', 'Tea'], isFeatured: false },
  { id: 'cs4', name: 'Coklat Caramel', slug: 'coklat-caramel', price: 10, image: '/image/c.png', description: 'Sweet caramel chocolate', tags: ['Coklat Series', 'Tea'], isFeatured: false, hasPromotion: true, promotionDetails: '20% Off' },

  // Matcha Series
  { id: 'ma1', name: 'Matcho', slug: 'matcho', price: 8, image: '/image/b.png', description: 'matcha O tanpa susu dengan pilihan sirap Dua Darjat', tags: ['Matcha Series', 'Matcha'], isFeatured: false },
  { id: 'ma2', name: 'Matchaa', slug: 'matchaa', price: 9, image: '/image/b.png', description: 'matcha latte yang lebih berkrim', tags: ['Matcha Series', 'Daily Special', 'Matcha'], isFeatured: false },
  { id: 'ma3', name: 'Choc Matchaa', slug: 'choc-matchaa', price: 10, image: '/image/b.png', description: 'Matcha with chocolate', tags: ['Matcha Series', 'Matcha'], isFeatured: false },
  { id: 'ma4', name: 'Kopi Matchaa', slug: 'kopi-matchaa', price: 10, image: '/image/b.png', description: 'Matcha with coffee', tags: ['Matcha Series', 'Coffee', 'Matcha'], isFeatured: false, hasPromotion: true, promotionDetails: 'New Item Promo' },
  { id: 'ma5', name: 'Matchaa Caramel', slug: 'matchaa-caramel', price: 10, image: '/image/b.png', description: 'Sweet caramel matcha', tags: ['Matcha Series', 'Our Favourites', 'Matcha'], isFeatured: true, hasPromotion: true, promotionDetails: 'Member Exclusive' },
  
  // Menet Series
  { id: 'me1', name: 'Le Menet', slug: 'le-menet', price: 7, image: '/image/a.png', description: 'minuman sparkling berperisa lemon', tags: ['Menet Series', 'Tea'], isFeatured: false },
  { id: 'me2', name: 'Kopi Leman', slug: 'kopi-leman', price: 7, image: '/image/d.png', description: 'kopi O dan sirap lemon', tags: ['Menet Series', 'Coffee'], isFeatured: false, hasPromotion: true, promotionDetails: 'Student Price' },
  { id: 'me3', name: 'Matcho Leman', slug: 'matcho-leman', price: 9, image: '/image/b.png', description: 'matcha O dan sirap lemon', tags: ['Menet Series', 'Matcha'], isFeatured: false },
  { id: 'me4', name: 'Berrygo Menet', slug: 'berrygo-menet', price: 9, image: '/image/c.png', description: 'gabungan strawberi, mangga dan lemon', tags: ['Menet Series', 'Our Favourites', 'Tea'], isFeatured: true, hasPromotion: true, promotionDetails: 'Limited Time' },
  { id: 'me5', name: 'Strawberry Menet', slug: 'strawberry-menet', price: 9, image: '/image/a.png', description: 'Sparkling strawberry', tags: ['Menet Series', 'Daily Special', 'Tea'], isFeatured: false },
  { id: 'me6', name: 'Mango Menet', slug: 'mango-menet', price: 9, image: '/image/d.png', description: 'Sparkling mango', tags: ['Menet Series', 'Tea'], isFeatured: false },
  { id: 'me7', name: 'Blueberry Menet', slug: 'blueberry-menet', price: 9, image: '/image/c.png', description: 'Sparkling blueberry', tags: ['Menet Series', 'Tea'], isFeatured: false, hasPromotion: true, promotionDetails: 'Happy Hour Deal' },
  { id: 'me8', name: 'Pomegranate Menet', slug: 'pomegranate-menet', price: 9, image: '/image/a.png', description: 'Sparkling pomegranate', tags: ['Menet Series', 'Tea'], isFeatured: false },
  { id: 'me9', name: 'Rock Melon Menet', slug: 'rock-melon-menet', price: 9, image: '/image/d.png', description: 'Sparkling rock melon', tags: ['Menet Series', 'Tea'], isFeatured: false, hasPromotion: true, promotionDetails: 'Online Only' },
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

const generatePosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  const authors = ['Hadi & Azad', 'KopiVerse Team', 'Franchise Team', 'Azad', 'Guest Writer'];
  const tags = ['Heritage', 'Brand Story', 'Franchise', 'Menu', 'Community', 'Tips'];
  const titles = [
    'The Secret Behind Our Kopi Kampung',
    'From One Stall to 50+ Outlets: Our Journey',
    'Why Kopi Dua Darjat is Your Next Franchise Opportunity',
    'A Guide to Our Signature Matcha Blends',
    'Connecting Communities, One Cup at a Time',
    'Top 5 Iced Coffees to Beat the Malaysian Heat',
    'The Art of the Perfect Kopi Tarik',
    'Meet the Farmers: Sourcing Our Local Beans',
    'Celebrating Our 1 Millionth Customer!',
    'New Outlet Opening in Johor Bahru!',
    'A Deep Dive into Gula Apong',
    'Pairing Pastries with Your Favorite Kopi',
    'Behind the Scenes: A Day in the Life of a Barista',
    'Sustainability Efforts at Kopi Dua Darjat',
    'Your Guide to Our "Menet" Sparkling Series',
    'How We Keep Our Prices Affordable',
    'The Kopi Dua Darjat Foundation: Giving Back',
    'Customer Spotlight: Stories from Our Regulars',
    'Franchise Success Story: From Customer to Owner',
    'The Perfect Brew: Tips for Making Coffee at Home',
    'Our Response to the Latest Coffee Trends',
  ];

  for (let i = 0; i < titles.length; i++) {
    const publishDate = new Date(2024, 6, 20 - i);
    posts.push({
      id: `${i + 1}`,
      title: titles[i],
      slug: titles[i].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      imageUrl: `blog-post-${(i % 4) + 1}`,
      author: authors[i % authors.length],
      publishDate: publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      publishDateISO: publishDate.toISOString(),
      tags: [tags[i % tags.length], 'All'],
      popularity: Math.floor(Math.random() * 1000) + 50,
    });
  }
  return posts;
};

export const blogPosts: BlogPost[] = generatePosts();


export const testimonials: Testimonial[] = [
    {
      id: '1',
      quote: 'I started my stall in Shah Alam — sold out every morning within 2 weeks! The training and marketing support made everything easy.',
      name: 'Ahmad Faizal',
      designation: 'Franchisee, Shah Alam',
      image: 'testimonial-1',
    },
    {
      id: '2',
      quote: 'The brand recognition is incredible. Customers love the coffee, and my outlet has been profitable since month one.',
      name: 'Siti Nurhaliza',
      designation: 'Franchisee, Kajang',
      image: 'testimonial-2',
    },
    {
      id: '3',
      quote: 'I always wanted to own a café. Kopi Dua Darjat made that dream a reality with a low-cost, high-return model.',
      name: 'Ravi Chandran',
      designation: 'Franchisee, Putrajaya',
      image: 'testimonial-3',
    },
  ];

export const faqItems: FaqItem[] = [
    {
        id: 'faq-gen-1',
        category: 'General',
        question: 'What makes Kopi Dua Darjat different?',
        answer: 'We bridge the gap between "Warisan" (heritage) and "Artisan." We honor traditional Malaysian Kopi Kampung recipes and brewing methods while infusing them with modern quality and creativity. It\'s the nostalgic taste you love, elevated.'
    },
    {
        id: 'faq-gen-2',
        category: 'General',
        question: 'Are your ingredients Halal?',
        answer: 'Yes, all our ingredients are sourced from Halal-certified suppliers. We are committed to serving all members of our community.'
    },
    {
        id: 'faq-gen-3',
        category: 'General',
        question: 'Where can I find your outlets?',
        answer: 'We have over 50 outlets across Malaysia! You can find the one nearest to you by visiting our Outlets page, which has an interactive map and a full directory.'
    },
    {
        id: 'faq-prod-1',
        category: 'Product',
        question: 'What is your signature drink?',
        answer: 'Our signature line is the "Darjat Series," especially the Darjat Caramel. For a true classic, you can\'t go wrong with the "Kopi Warisan" from our Kopitiam series.'
    },
    {
        id: 'faq-prod-2',
        category: 'Product',
        question: 'Do you offer non-coffee drinks?',
        answer: 'Absolutely! Our "Taknak Kopi" (Don\'t Want Coffee) menu includes a delicious Coklat Series, a premium Matcha Series, and our refreshing fruit-infused "Menet" sparkling drinks.'
    },
    {
        id: 'faq-prod-3',
        category: 'Product',
        question: 'Can I customize the sweetness level?',
        answer: 'Yes, of course. Just let our baristas know your preference, and they will be happy to adjust the sweetness level to your liking.'
    },
    {
        id: 'faq-fran-1',
        category: 'Franchise',
        question: 'What’s the minimum investment to start a franchise?',
        answer: 'You can start your own Kopi Dua Darjat stall with an investment as low as RM25,000. This includes your kiosk, essential equipment, branding kit, initial stock, and comprehensive training.'
    },
    {
        id: 'faq-fran-2',
        category: 'Franchise',
        question: 'Do I need F&B experience to be a franchisee?',
        answer: 'No, you don’t! Our comprehensive training program covers everything from barista skills to daily operations and customer service. A passion for coffee and business is all you need to start.'
    },
    {
        id: 'faq-fran-3',
        category: 'Franchise',
        question: 'What kind of support do you provide to franchisees?',
        answer: 'We provide end-to-end support, including location scouting assistance, full operational training, supply chain management, and continuous brand-level marketing to drive customers to your outlet.'
    }
];
    

