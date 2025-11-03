
import type { Outlet, Blog } from './types';

// This file now contains only data that is not part of the main CMS.
// Menu items, categories, and promotions are now fetched from Firestore.

export const outlets: Omit<Outlet, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // This data is now only for migration and will be removed later.
    // Selangor
    { name: 'Kajang Prima', slug: 'kajang-prima', address: '123 Jalan Prima, Kajang', city: 'Selangor', lat: 2.9935, lng: 101.7874, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Bandar Baru Bangi', slug: 'bangi', address: '456 Seksyen 9, Bangi', city: 'Selangor', lat: 2.9555, lng: 101.7616, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Shah Alam', slug: 'shah-alam', address: '789 Seksyen 7, Shah Alam', city: 'Selangor', lat: 3.0738, lng: 101.5183, hours: '8 AM - 11 PM', isOpenNow: true },
    { name: 'Puchong Perdana', slug: 'puchong', address: '101 Jalan Perdana, Puchong', city: 'Selangor', lat: 3.008, lng: 101.613, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Subang Jaya', slug: 'subang-jaya', address: '212 Jalan SS15/4, Subang Jaya', city: 'Selangor', lat: 3.076, lng: 101.587, hours: '9 AM - 11 PM', isOpenNow: true },
    { name: 'Damansara Utama', slug: 'damansara', address: '333 Jalan SS21/37, Damansara Utama', city: 'Selangor', lat: 3.136, lng: 101.621, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Ampang', slug: 'ampang', address: '444 Jalan Ampang, Ampang', city: 'Selangor', lat: 3.15, lng: 101.75, hours: '8 AM - 10 PM', isOpenNow: false },
    { name: 'Klang', slug: 'klang', address: '555 Jalan Meru, Klang', city: 'Selangor', lat: 3.045, lng: 101.44, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Gombak', slug: 'gombak', address: '666 Jalan Gombak, Gombak', city: 'Selangor', lat: 3.23, lng: 101.7, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Cheras', slug: 'cheras-selangor', address: '777 Jalan Cheras, Cheras', city: 'Selangor', lat: 3.09, lng: 101.74, hours: '8 AM - 10 PM', isOpenNow: true },
    
    // Kuala Lumpur
    { name: 'Bukit Bintang', slug: 'bukit-bintang', address: '888 Jalan Bukit Bintang', city: 'Kuala Lumpur', lat: 3.146, lng: 101.71, hours: '10 AM - 12 AM', isOpenNow: true },
    { name: 'KL Sentral', slug: 'kl-sentral', address: '999 Jalan Stesen Sentral, KL Sentral', city: 'Kuala Lumpur', lat: 3.134, lng: 101.686, hours: '7 AM - 10 PM', isOpenNow: true },
    { name: 'Mont Kiara', slug: 'mont-kiara', address: '111 Jalan Kiara, Mont Kiara', city: 'Kuala Lumpur', lat: 3.165, lng: 101.65, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'TTDI', slug: 'ttdi', address: '222 Lorong Rahim Kajai, TTDI', city: 'Kuala Lumpur', lat: 3.14, lng: 101.63, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Wangsa Maju', slug: 'wangsa-maju', address: '333 Jalan Wangsa Delima, Wangsa Maju', city: 'Kuala Lumpur', lat: 3.205, lng: 101.74, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Setapak', slug: 'setapak', address: '444 Jalan Genting Klang, Setapak', city: 'Kuala Lumpur', lat: 3.19, lng: 101.71, hours: '8 AM - 10 PM', isOpenNow: true },

    // Putrajaya
    { name: 'Presint 15', slug: 'putrajaya-p15', address: '789 Jalan Diplomatik, Presint 15', city: 'Putrajaya', lat: 2.9264, lng: 101.6964, hours: '9 AM - 9 PM', isOpenNow: false },
    { name: 'Ayer@8', slug: 'putrajaya-ayer8', address: 'Jalan P8, Presint 8', city: 'Putrajaya', lat: 2.93, lng: 101.67, hours: '10 AM - 10 PM', isOpenNow: true },

    // Johor
    { name: 'Johor Bahru City Square', slug: 'jb-city-square', address: '106-108 Jalan Wong Ah Fook, Johor Bahru', city: 'Johor', lat: 1.46, lng: 103.76, hours: '10 AM - 10 PM', isOpenNow: true },
    { name: 'Taman Mount Austin', slug: 'mount-austin', address: 'Jalan Austin Heights 8/5, Taman Mount Austin', city: 'Johor', lat: 1.56, lng: 103.77, hours: '9 AM - 11 PM', isOpenNow: true },
    { name: 'Kluang', slug: 'kluang', address: 'Jalan Lambak, Kluang', city: 'Johor', lat: 2.03, lng: 103.32, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Batu Pahat', slug: 'batu-pahat', address: 'Jalan Rahmat, Batu Pahat', city: 'Johor', lat: 1.85, lng: 102.93, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Muar', slug: 'muar', address: 'Jalan Sisi, Muar', city: 'Johor', lat: 2.05, lng: 102.57, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Skudai', slug: 'skudai', address: 'Jalan Laksamana, Skudai', city: 'Johor', lat: 1.54, lng: 103.66, hours: '8 AM - 10 PM', isOpenNow: false },

    // Penang
    { name: 'Georgetown', slug: 'georgetown', address: '25 Lebuh Campbell, Georgetown', city: 'Penang', lat: 5.419, lng: 100.33, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Bayan Lepas', slug: 'bayan-lepas', address: 'Jalan Mayang Pasir, Bayan Lepas', city: 'Penang', lat: 5.32, lng: 100.28, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Gurney Drive', slug: 'gurney-drive', address: 'Persiaran Gurney, Georgetown', city: 'Penang', lat: 5.43, lng: 100.31, hours: '10 AM - 11 PM', isOpenNow: true },
    { name: 'Bukit Mertajam', slug: 'bukit-mertajam', address: 'Jalan Arumugam Pillai, Bukit Mertajam', city: 'Penang', lat: 5.36, lng: 100.45, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Butterworth', slug: 'butterworth', address: 'Jalan Bagan Luar, Butterworth', city: 'Penang', lat: 5.39, lng: 100.36, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Tanjung Tokong', slug: 'tanjung-tokong', address: 'Jalan Seri Tanjung Pinang', city: 'Penang', lat: 5.45, lng: 100.3, hours: '9 AM - 10 PM', isOpenNow: false },
    
    // Perak
    { name: 'Ipoh Old Town', slug: 'ipoh-old-town', address: 'Jalan Panglima, Ipoh', city: 'Perak', lat: 4.59, lng: 101.07, hours: '9 AM - 9 PM', isOpenNow: true },
    { name: 'Taiping', slug: 'taiping', address: 'Jalan Kota, Taiping', city: 'Perak', lat: 4.85, lng: 100.74, hours: '8 AM - 8 PM', isOpenNow: true },
    { name: 'Teluk Intan', slug: 'teluk-intan', address: 'Jalan Ah Cheong, Teluk Intan', city: 'Perak', lat: 4.02, lng: 101.02, hours: '8 AM - 8 PM', isOpenNow: true },

    // Melaka
    { name: 'Jonker Street', slug: 'jonker-street', address: 'Jalan Hang Jebat, Melaka', city: 'Melaka', lat: 2.19, lng: 102.24, hours: '10 AM - 10 PM', isOpenNow: true },
    { name: 'Mahkota Parade', slug: 'mahkota-parade', address: 'Jalan Merdeka, Melaka', city: 'Melaka', lat: 2.18, lng: 102.25, hours: '10 AM - 10 PM', isOpenNow: true },

    // Negeri Sembilan
    { name: 'Seremban', slug: 'seremban', address: 'Jalan Dato Bandar Tunggal, Seremban', city: 'Negeri Sembilan', lat: 2.72, lng: 101.94, hours: '9 AM - 9 PM', isOpenNow: true },
    { name: 'Port Dickson', slug: 'port-dickson', address: 'Jalan Pantai, Port Dickson', city: 'Negeri Sembilan', lat: 2.52, lng: 101.79, hours: '10 AM - 9 PM', isOpenNow: false },

    // Pahang
    { name: 'Kuantan', slug: 'kuantan', address: 'Jalan Mahkota, Kuantan', city: 'Pahang', lat: 3.81, lng: 103.32, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Genting Highlands', slug: 'genting', address: 'Genting Highlands', city: 'Pahang', lat: 3.42, lng: 101.79, hours: '10 AM - 12 AM', isOpenNow: true },

    // Terengganu
    { name: 'Kuala Terengganu', slug: 'kuala-terengganu', address: 'Jalan Sultan Zainal Abidin, Kuala Terengganu', city: 'Terengganu', lat: 5.33, lng: 103.13, hours: '9 AM - 10 PM', isOpenNow: true },

    // Kelantan
    { name: 'Kota Bharu', slug: 'kota-bharu', address: 'Jalan Pintu Pong, Kota Bharu', city: 'Kelantan', lat: 6.13, lng: 102.23, hours: '9 AM - 10 PM', isOpenNow: true },

    // Kedah
    { name: 'Alor Setar', slug: 'alor-setar', address: 'Jalan Langgar, Alor Setar', city: 'Kedah', lat: 6.12, lng: 100.36, hours: '9 AM - 9 PM', isOpenNow: true },
    { name: 'Langkawi', slug: 'langkawi', address: 'Pantai Cenang, Langkawi', city: 'Kedah', lat: 6.29, lng: 99.72, hours: '10 AM - 10 PM', isOpenNow: true },

    // Perlis
    { name: 'Kangar', slug: 'kangar', address: 'Jalan Penjara, Kangar', city: 'Perlis', lat: 6.44, lng: 100.19, hours: '9 AM - 9 PM', isOpenNow: false },

    // Sabah
    { name: 'Kota Kinabalu', slug: 'kota-kinabalu', address: 'Jalan Gaya, Kota Kinabalu', city: 'Sabah', lat: 5.98, lng: 116.07, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Sandakan', slug: 'sandakan', address: 'Jalan Pelabuhan, Sandakan', city: 'Sabah', lat: 5.84, lng: 118.11, hours: '8 AM - 8 PM', isOpenNow: true },
    { name: 'Tawau', slug: 'tawau', address: 'Jalan Kuhara, Tawau', city: 'Sabah', lat: 4.24, lng: 117.88, hours: '8 AM - 8 PM', isOpenNow: true },

    // Sarawak
    { name: 'Kuching', slug: 'kuching', address: 'Jalan Main Bazaar, Kuching', city: 'Sarawak', lat: 1.55, lng: 110.34, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Miri', slug: 'miri', address: 'Jalan North Yu Seng, Miri', city: 'Sarawak', lat: 4.41, lng: 114.0, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Sibu', slug: 'sibu', address: 'Jalan Channel, Sibu', city: 'Sarawak', lat: 2.29, lng: 111.82, hours: '8 AM - 9 PM', isOpenNow: false },
];

// The old allDrinks data, to be used by the one-time migration script.
type DrinkSeed = { name: string; slug: string; price: number; image: string; description: string; tags: string[]; };
export const allDrinks: DrinkSeed[] = [
    // This data is now only for migration and will be removed later.
    // Darjat Series
  { name: 'Darjat Vanilla', slug: 'darjat-vanilla', price: 9, image: '/image/a.png', description: 'Creamy vanilla goodness', tags: ['Darjat Series', 'Coffee', 'featured'] },
  { name: 'Darjat Caramel', slug: 'darjat-caramel', price: 9, image: '/image/d.png', description: 'Rich caramel swirls', tags: ['Darjat Series', 'Coffee', 'featured'] },
  { name: 'Darjat Hazel', slug: 'darjat-hazel', price: 9, image: '/image/a.png', description: 'Nutty & aromatic', tags: ['Darjat Series', 'Coffee'] },
  { name: 'Darjat Butterscotch', slug: 'darjat-butterscotch', price: 9, image: '/image/d.png', description: 'Sweet butterscotch notes', tags: ['Darjat Series', 'Coffee'] },
  { name: 'Darjat Borneo', slug: 'darjat-borneo', price: 9, image: '/image/a.png', description: 'dengan sirap Gula Apong Sarawak', tags: ['Darjat Series', 'Coffee'] },
  { name: 'Darjat Malaya', slug: 'darjat-malaya', price: 8, image: '/image/d.png', description: 'kopi susu dan susu pekat', tags: ['Darjat Series', 'Coffee'] },
  { name: 'Darjat Tamanis', slug: 'darjat-tamanis', price: 8, image: '/image/a.png', description: 'kopi susu tanpa gula/sirap', tags: ['Darjat Series', 'Coffee'] },

  // Kopitiam Series
  { name: 'Kopi Warisan', slug: 'kopi-warisan', price: 8, image: '/image/d.png', description: 'The original classic', tags: ['Kopitiam Series', 'Coffee'] },
  { name: 'Kopi Karim', slug: 'kopi-karim', price: 8, image: '/image/b.png', description: 'kopi ekstra kaw dengan krim pekat manis', tags: ['Kopitiam Series', 'Coffee'] },
  { name: 'Kopi Melayo', slug: 'kopi-melayo', price: 5, image: '/image/a.png', description: 'kopi hitam dan sirap vanila', tags: ['Kopitiam Series', 'Coffee'] },

  // Espresso Series
  { name: 'Americano', slug: 'americano', price: 7, image: '/image/d.png', description: 'Bold and intense', tags: ['Espresso Series', 'Coffee'] },
  { name: 'Latté', slug: 'latte', price: 9, image: '/image/a.png', description: 'Smooth and milky', tags: ['Espresso Series', 'Coffee'] },
  { name: 'Creamy Latté', slug: 'creamy-latte', price: 10, image: '/image/d.png', description: 'cafe latte yang lebih creamy', tags: ['Espresso Series', 'Coffee'] },
  { name: 'Borneo Latté', slug: 'borneo-latte', price: 10, image: '/image/a.png', description: 'latte dengan sirap gula apong Sarawak', tags: ['Espresso Series', 'Coffee'] },
  { name: 'Latté Malaya', slug: 'latte-malaya', price: 10, image: '/image/d.png', description: 'latte dengan susu pekat', tags: ['Espresso Series', 'Coffee'] },
  { name: 'Café Limone', slug: 'cafe-limone', price: 10, image: '/image/a.png', description: 'americano lemon', tags: ['Espresso Series', 'Coffee'] },
  { name: 'Mocha', slug: 'mocha', price: 10, image: '/image/d.png', description: 'Chocolatey coffee delight', tags: ['Espresso Series', 'Coffee'] },
  { name: 'Dark Mocha', slug: 'dark-mocha', price: 11, image: '/image/a.png', description: 'mocha dengan extra coklat', tags: ['Espresso Series', 'Coffee'] },
  { name: 'Dirty Matcha', slug: 'dirty-matcha', price: 11, image: '/image/d.png', description: 'matcha dipadankan dengan espreso', tags: ['Espresso Series', 'Coffee', 'Matcha'] },

  // Coklat Series
  { name: 'Coklat Artisan', slug: 'coklat-artisan', price: 9, image: '/image/c.png', description: 'Rich chocolate indulgence', tags: ['Coklat Series'] },
  { name: 'Makha', slug: 'makha', price: 9, image: '/image/a.png', description: 'mocha versi Dua Darjat. Campuran kopi dan coklat', tags: ['Coklat Series', 'Coffee'] },
  { name: 'Triple Choc Makha', slug: 'triple-choc-makha', price: 10, image: '/image/d.png', description: 'makha dengan ekstra coklat', tags: ['Coklat Series', 'Coffee'] },
  { name: 'Coklat Caramel', slug: 'coklat-caramel', price: 10, image: '/image/c.png', description: 'Sweet caramel chocolate', tags: ['Coklat Series'] },

  // Matcha Series
  { name: 'Matcho', slug: 'matcho', price: 8, image: '/image/b.png', description: 'matcha O tanpa susu dengan pilihan sirap Dua Darjat', tags: ['Matcha Series', 'Matcha'] },
  { name: 'Matchaa', slug: 'matchaa', price: 9, image: '/image/b.png', description: 'matcha latte yang lebih berkrim', tags: ['Matcha Series', 'Matcha'] },
  { name: 'Choc Matchaa', slug: 'choc-matchaa', price: 10, image: '/image/b.png', description: 'Matcha with chocolate', tags: ['Matcha Series', 'Matcha'] },
  { name: 'Kopi Matchaa', slug: 'kopi-matchaa', price: 10, image: '/image/b.png', description: 'Matcha with coffee', tags: ['Matcha Series', 'Coffee', 'Matcha'] },
  { name: 'Matchaa Caramel', slug: 'matchaa-caramel', price: 10, image: '/image/b.png', description: 'Sweet caramel matcha', tags: ['Matcha Series', 'Matcha'] },
  
  // Menet Series (Fruity Sparkling)
  { name: 'Le Menet', slug: 'le-menet', price: 7, image: '/image/a.png', description: 'minuman sparkling berperisa lemon', tags: ['Menet Series'] },
  { name: 'Kopi Leman', slug: 'kopi-leman', price: 7, image: '/image/d.png', description: 'kopi O dan sirap lemon', tags: ['Menet Series', 'Coffee'] },
  { name: 'Matcho Leman', slug: 'matcho-leman', price: 9, image: '/image/b.png', description: 'matcha O dan sirap lemon', tags: ['Menet Series', 'Matcha'] },
  { name: 'Berrygo Menet', slug: 'berrygo-menet', price: 9, image: '/image/c.png', description: 'gabungan strawberi, mangga dan lemon', tags: ['Menet Series', 'featured'] },
  { name: 'Strawberry Menet', slug: 'strawberry-menet', price: 9, image: '/image/a.png', description: 'Sparkling strawberry', tags: ['Menet Series'] },
  { name: 'Mango Menet', slug: 'mango-menet', price: 9, image: '/image/d.png', description: 'Sparkling mango', tags: ['Menet Series'] },
  { name: 'Blueberry Menet', slug: 'blueberry-menet', price: 9, image: '/image/c.png', description: 'Sparkling blueberry', tags: ['Menet Series'] },
  { name: 'Pomegranate Menet', slug: 'pomegranate-menet', price: 9, image: '/image/a.png', description: 'Sparkling pomegranate', tags: ['Menet Series'] },
  { name: 'Rock Melon Menet', slug: 'rock-melon-menet', price: 9, image: '/image/d.png', description: 'Sparkling rock melon', tags: ['Menet Series'] },
];

export const testimonials = [
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

export const faqItems = [
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

export const blogSeedData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>[] = [
    {
      title: "The Story Behind 'Antara Warisan & Artisan'",
      slug: "story-behind-antara-warisan-artisan",
      excerpt: "Explore the philosophy that fuels Kopi Dua Darjat, blending Malaysia's rich coffee heritage with modern artisanal craftsmanship.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop",
        alt: "A traditional Malaysian coffee cup next to a modern espresso machine.",
        caption: "Where heritage meets modern craft."
      },
      author: {
        name: "Hadi & Azad",
        photo: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&auto=format&fit=crop",
        bio: "Founders of Kopi Dua Darjat, passionate about sharing Malaysian coffee culture with the world."
      },
      tags: ["Brand Story", "Heritage"],
      category: "Our Story",
      status: "published",
      content: "<p>The phrase 'Antara Warisan & Artisan' is more than just a tagline for us; it's the very soul of Kopi Dua Darjat. 'Warisan' represents the rich, nostalgic legacy of Malaysian 'kopi kampung'—the coffee our parents and grandparents enjoyed. 'Artisan' signifies our commitment to modern quality, ethical sourcing, and the craft of brewing. This article explores how we balance these two worlds in every cup.</p>",
      seo: { title: "The Philosophy of Kopi Dua Darjat: Antara Warisan & Artisan" }
    },
    {
      title: "Why Our Gula Apong 'Darjat Borneo' is a Must-Try",
      slug: "why-darjat-borneo-is-a-must-try",
      excerpt: "Discover the sweet, smoky, and utterly unique flavor of Gula Apong, the heart of our best-selling Darjat Borneo coffee.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1559924991-fc02f7418732?w=500&auto=format&fit=crop",
        alt: "A glass of iced Darjat Borneo coffee with Gula Apong syrup.",
        caption: "A taste of Sarawak in every sip."
      },
      author: { name: "Menu Development Team" },
      tags: ["Menu", "Coffee", "Signature"],
      category: "Behind The Cup",
      status: "published",
      content: "<p>Gula Apong, a palm sugar from the nipa palms of Sarawak, is the secret behind our beloved Darjat Borneo. Unlike regular brown sugar, it has a subtle smoky and saline note that perfectly complements the robust flavors of our coffee. We source our Gula Apong directly from local producers in Sarawak to ensure authenticity and support the local economy.</p>",
      seo: { description: "Learn what makes the Gula Apong in our Darjat Borneo coffee so special and why it's a customer favorite." }
    },
    {
      title: "5 Reasons to Start a Kopi Dua Darjat Franchise in Your Town",
      slug: "5-reasons-to-start-franchise",
      excerpt: "Thinking of starting your own business? Here are five compelling reasons why a Kopi Dua Darjat franchise is a recipe for success.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=500&auto=format&fit=crop",
        alt: "A smiling Kopi Dua Darjat franchisee handing a coffee to a customer.",
        caption: "Your success story starts here."
      },
      author: { name: "Franchise Team" },
      tags: ["Franchise", "Business", "Opportunity"],
      category: "Franchise",
      status: "published",
      content: "<p>Joining the Kopi Dua Darjat family means more than just opening a coffee stall. It means becoming part of a community with a proven business model. We offer 1. Low Start-up Cost, 2. Strong Brand Recognition, 3. Comprehensive Training, 4. Marketing Support, and 5. A menu loved by Malaysians. Ready to brew your own success? Read on to learn more.</p>",
      seo: { keywords: ["coffee franchise", "small business Malaysia", "F&B opportunity"] }
    },
    {
      title: "Not a Coffee Person? Our 'Taknak Kopi' Menu is for You!",
      slug: "taknak-kopi-menu-for-you",
      excerpt: "From rich, decadent chocolate to earthy, premium matcha, our 'Taknak Kopi' (Don't Want Coffee) menu has something for everyone.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1578253809372-23992040ac26?w=500&auto=format&fit=crop",
        alt: "A vibrant spread of chocolate, matcha, and fruity drinks.",
        caption: "Delicious drinks, with or without the caffeine."
      },
      author: { name: "Aina Rahman" },
      tags: ["Menu", "Matcha", "Chocolate", "Non-Coffee"],
      category: "Our Drinks",
      status: "published",
      content: "<p>We believe everyone deserves a delicious, handcrafted drink. That's why we put just as much love into our non-coffee creations. Our Coklat Artisan uses premium cocoa for a rich, velvety experience, while our Matchaa series features high-grade matcha for a smooth, authentic taste. And for something fruity and refreshing, our Menet sparkling drinks are the perfect choice!</p>",
      seo: { title: "Best Non-Coffee Drinks in Malaysia | Kopi Dua Darjat" }
    },
    {
      title: "From Customer to Owner: A Franchisee Success Story",
      slug: "franchisee-success-story-ahmad",
      excerpt: "Meet Ahmad, a long-time Kopi Dua Darjat fan who took the leap and opened his own successful stall in Shah Alam.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1551706872-893907c44a3e?w=500&auto=format&fit=crop",
        alt: "Ahmad, a happy Kopi Dua Darjat franchisee, standing in front of his stall.",
        caption: "Ahmad's dream of owning a business came true."
      },
      author: { name: "Community Team" },
      tags: ["Franchise", "Success Story", "Community"],
      category: "Franchise",
      status: "published",
      content: "<p>Ahmad Faizal was one of our first customers in Kajang. 'I loved the coffee and the brand's mission,' he says. 'When I saw the franchise opportunity, I knew it was for me.' Just three months after opening his stall in Shah Alam, Ahmad's business is thriving. Here's his story, in his own words.</p>",
      seo: { description: "Read the inspiring journey of Ahmad Faizal, who turned his love for Kopi Dua Darjat into a thriving franchise business." }
    },
    // Add 15 more blog posts
    {
      title: "The Art of 'Tarik': More Than Just Pouring",
      slug: "the-art-of-tarik",
      excerpt: "The 'pulling' technique in Malaysian beverages isn't just for show. It's a crucial step that creates the perfect foam and temperature.",
      coverImage: { url: "https://images.unsplash.com/photo-1600093463592-8e36ae95254c?w=500&auto=format&fit=crop", alt: "A barista skillfully pulling teh tarik.", caption: "The perfect froth comes from skill and practice." },
      author: { name: "Hadi & Azad" },
      tags: ["Heritage", "Brewing", "Tips"],
      category: "Behind The Cup",
      status: "published",
      content: "<p>Theatrics? Maybe a little. But the act of 'tarik' or pulling our drinks is a time-honored technique to cool the beverage to the perfect drinking temperature while creating a signature frothy head. This aeration enhances the flavor and texture, a small detail that makes a world of difference.</p>",
      seo: { title: "What is 'Tarik' in Malaysian Drinks? | Kopi Dua Darjat" }
    },
    {
      title: "Our Top 3 'Menet' Sparkling Drinks for a Hot Day",
      slug: "top-3-menet-sparkling-drinks",
      excerpt: "Beat the Malaysian heat with our top picks from the refreshing, fizzy, and fruity Menet Series.",
      coverImage: { url: "https://images.unsplash.com/photo-1542691500-83ab3a7a37a9?w=500&auto=format&fit=crop", alt: "Three colorful sparkling fruit drinks in a row.", caption: "Your ultimate thirst quenchers." },
      author: { name: "Menu Development Team" },
      tags: ["Menu", "Non-Coffee", "Featured"],
      category: "Our Drinks",
      status: "published",
      content: "<p>When the sun is blazing, nothing hits the spot like a cold, sparkling drink. Our Menet series is designed for just that. Our top recommendations are: 1. **Berrygo Menet** for its sweet and tangy mix, 2. **Le Menet** for a classic zesty kick, and 3. **Strawberry Menet** for a crowd-pleasing fruity flavor.</p>",
      seo: { description: "Find the best refreshing sparkling drinks at Kopi Dua Darjat to cool you down on a hot day." }
    },
    {
      title: "Kopi Dua Darjat x Local Artists: The Community Cup Project",
      slug: "community-cup-project",
      excerpt: "We're collaborating with local Malaysian artists to feature their work on our cups, turning every coffee into a piece of art.",
      coverImage: { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop", alt: "A coffee cup with a beautiful, intricate artistic design on it.", caption: "Sip on art." },
      author: { name: "Community Team" },
      tags: ["Community", "Art", "Collaboration"],
      category: "Our Story",
      status: "published",
      content: "<p>We believe in celebrating local talent. The Community Cup Project is our initiative to showcase the incredible creativity of Malaysian artists. Each month, we feature a new design on our cups, giving artists a platform and our customers a beautiful surprise. Learn about this month's featured artist!</p>",
      seo: { title: "Kopi Dua Darjat Community Cup Project | Supporting Local Artists" }
    },
    {
      title: "Understanding Our Coffee: From Espresso to Kopitiam",
      slug: "understanding-our-coffee-menu",
      excerpt: "Confused between a 'Darjat Malaya' and a 'Latté Malaya'? This guide breaks down our coffee menu for you.",
      coverImage: { url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&auto=format&fit=crop", alt: "A diagram showing the different components of various coffee drinks.", caption: "Your guide to our coffee world." },
      author: { name: "Menu Development Team" },
      tags: ["Menu", "Coffee", "Tips"],
      category: "Behind The Cup",
      status: "published",
      content: "<p>Our menu celebrates two distinct coffee traditions. The **Kopitiam & Darjat Series** use our signature 'kopi kampung' brew, which is robust and bold. The **Espresso Series** uses a modern espresso shot as its base, resulting in a different flavor profile. For example, a 'Darjat Malaya' is kopi susu with condensed milk, while a 'Latté Malaya' is an espresso-based latte with condensed milk. Explore the differences and find your perfect cup!</p>",
      seo: { description: "Learn the difference between Kopi Dua Darjat's espresso-based and traditional kopi kampung drinks." }
    },
    {
      title: "How We Keep Our Artisan Coffee Affordable",
      slug: "how-we-keep-coffee-affordable",
      excerpt: "Quality coffee shouldn't break the bank. Here’s how we maintain our accessible price point without compromising on quality.",
      coverImage: { url: "https://images.unsplash.com/photo-1522992319-3595b1247293?w=500&auto=format&fit=crop", alt: "A close-up of Malaysian ringgit notes next to a cup of coffee.", caption: "Great value in every cup." },
      author: { name: "Hadi & Azad" },
      tags: ["Business", "Brand Story", "Value"],
      category: "Our Story",
      status: "published",
      content: "<p>From day one, our mission was to make great coffee accessible to everyone. We achieve this through a smart, lean business model. Our stall-based franchise system keeps overheads low, we work directly with local bean suppliers to get the best prices, and we focus on operational efficiency. This means we can pass the savings directly on to you, our valued customer.</p>",
      seo: { title: "Affordable Artisan Coffee in Malaysia | Kopi Dua Darjat" }
    },
    {
      title: "A Deep Dive into Matcha: What's the Difference?",
      slug: "deep-dive-into-matcha",
      excerpt: "From 'Matcho' to 'Matchaa' to 'Dirty Matcha', we explore the different styles of matcha drinks on our menu.",
      coverImage: { url: "https://images.unsplash.com/photo-1566373049939-704ea187ef98?w=500&auto=format&fit=crop", alt: "A vibrant green cup of matcha latte.", caption: "The art and science of a good matcha." },
      author: { name: "Aina Rahman" },
      tags: ["Menu", "Matcha", "Non-Coffee"],
      category: "Our Drinks",
      status: "published",
      content: "<p>Matcha is not just matcha! Our 'Matcho' is a pure, unsweetened matcha 'O' for purists. 'Matchaa' is our creamy, perfectly balanced matcha latte. And for those who want the best of both worlds, the 'Dirty Matcha' adds a shot of our signature espresso for a unique caffeine kick. Which one is your favorite?</p>",
      seo: { description: "Explore the different types of matcha drinks available at Kopi Dua Darjat, from pure matcha to dirty matcha." }
    },
    {
      title: "Join Us! New Outlets Now Open in Penang and Melaka",
      slug: "new-outlets-penang-melaka",
      excerpt: "We're excited to announce the grand opening of our newest stalls in Georgetown, Penang, and Jonker Street, Melaka!",
      coverImage: { url: "https://images.unsplash.com/photo-1601288338087-61203c693fac?w=500&auto=format&fit=crop", alt: "A brand new, brightly lit Kopi Dua Darjat stall at night.", caption: "Bringing our heritage brew to more communities." },
      author: { name: "Community Team" },
      tags: ["Community", "Outlets", "News"],
      category: "News",
      status: "published",
      content: "<p>The Kopi Dua Darjat family is growing! We're thrilled to bring our blend of heritage and artisan coffee to the historic streets of Penang and Melaka. Find us at Lebuh Campbell in Georgetown and Jalan Hang Jebat in Melaka. Come say hello and grab your favorite cup!</p>",
      seo: { title: "Kopi Dua Darjat Opens New Outlets in Penang and Melaka" }
    },
    {
      title: "Sustainability at Heart: Our Eco-Friendly Practices",
      slug: "sustainability-practices",
      excerpt: "From sourcing beans ethically to reducing waste, learn about our commitment to protecting the environment.",
      coverImage: { url: "https://images.unsplash.com/photo-1607595339243-52431690e83a?w=500&auto=format&fit=crop", alt: "Hands holding a reusable coffee cup.", caption: "Small changes, big impact." },
      author: { name: "Hadi & Azad" },
      tags: ["Brand Story", "Sustainability", "Community"],
      category: "Our Story",
      status: "published",
      content: "<p>We believe great coffee shouldn't cost the earth. We are actively working to reduce our environmental footprint by encouraging the use of reusable cups, sourcing our beans from sustainable local farms, and minimizing waste at all our outlets. It's a journey, and we're committed to doing our part for a greener Malaysia.</p>",
      seo: { description: "Learn about Kopi Dua Darjat's commitment to sustainability and our eco-friendly initiatives." }
    },
    {
      title: "What Does 'Dua Darjat' Mean?",
      slug: "what-does-dua-darjat-mean",
      excerpt: "The name 'Kopi Dua Darjat' (Two-Class Coffee) is a playful nod to our mission of bridging two worlds.",
      coverImage: { url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop", alt: "Two different styles of coffee cups sitting side by side.", caption: "Two worlds, one perfect cup." },
      author: { name: "Hadi & Azad" },
      tags: ["Brand Story", "Heritage"],
      category: "Our Story",
      status: "published",
      content: "<p>The name is a conversation starter! 'Dua Darjat' or 'Two Classes' represents the two worlds we bring together: the classic, affordable 'kopi kampung' (the people's coffee) and the premium, meticulous world of 'artisan' coffee. Our goal is to offer artisan quality at a price that everyone can enjoy, breaking down the idea that good coffee has to be exclusive or expensive.</p>",
      seo: { title: "The Meaning Behind the Name 'Kopi Dua Darjat'" }
    },
    {
      title: "Your Perfect Pair: What to Eat with Your Kopi",
      slug: "perfect-pairing-kopi",
      excerpt: "Elevate your coffee break by pairing your favorite Kopi Dua Darjat drink with classic Malaysian kuih and snacks.",
      coverImage: { url: "https://images.unsplash.com/photo-1622322359423-0c173c387799?w=500&auto=format&fit=crop", alt: "A cup of coffee next to a plate of colorful Malaysian kuih.", caption: "The perfect afternoon combination." },
      author: { name: "Aina Rahman" },
      tags: ["Tips", "Menu", "Food"],
      category: "Behind The Cup",
      status: "draft",
      content: "<p>A great cup of coffee is made even better with the right snack. We recommend pairing the robust Kopi Warisan with a sweet and chewy 'kuih lapis'. The creamy Darjat Caramel goes beautifully with a classic curry puff. And for our Matcha drinks? A simple butter cookie is the perfect companion. What's your favorite pairing?</p>",
      seo: { description: "Discover the best Malaysian snacks and kuih to pair with your Kopi Dua Darjat coffee." }
    },
    {
      title: "Celebrating Our 50th Outlet!",
      slug: "celebrating-50th-outlet",
      excerpt: "A huge thank you to our amazing community and partners for helping us reach this incredible milestone of 50 outlets nationwide.",
      coverImage: { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop", alt: "A celebration event with balloons and a '50' sign.", caption: "To many more milestones together!" },
      author: { name: "Community Team" },
      tags: ["News", "Brand Story", "Community"],
      category: "News",
      status: "published",
      content: "<p>We are overjoyed and humbled to announce the opening of our 50th outlet! What started as a single stall has grown into a nationwide family, all thanks to your incredible support. This journey is a testament to Malaysia's love for authentic, quality coffee. Thank you for being a part of our story.</p>",
      seo: { title: "Kopi Dua Darjat Reaches 50 Outlets Nationwide | A Milestone" }
    },
    {
      title: "The Franchisee Checklist: Are You Ready to Join Us?",
      slug: "franchisee-checklist-are-you-ready",
      excerpt: "Think you have what it takes to be a Kopi Dua Darjat partner? Here's a quick checklist of the qualities we look for in our franchisees.",
      coverImage: { url: "https://images.unsplash.com/photo-1586473215181-a3c393d6232b?w=500&auto=format&fit=crop", alt: "A person ticking off items on a checklist.", caption: "Your journey to entrepreneurship starts here." },
      author: { name: "Franchise Team" },
      tags: ["Franchise", "Business", "Tips"],
      category: "Franchise",
      status: "published",
      content: "<p>We're looking for passionate individuals to grow with us. The ideal Kopi Dua Darjat franchisee is: 1. **Passionate about coffee and community.** 2. **Driven and entrepreneurial.** 3. **Committed to quality and customer service.** 4. **A great team player.** If this sounds like you, we'd love to hear from you!</p>",
      seo: { description: "Find out if you have the right qualities to become a successful Kopi Dua Darjat franchisee." }
    },
    {
      title: "Customer Spotlight: Why #KopiDuaDarjat is Trending",
      slug: "why-kopi-dua-darjat-is-trending",
      excerpt: "We dive into social media to see why our customers love sharing their Kopi Dua Darjat moments. See some of our favorite posts!",
      coverImage: { url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop", alt: "A collage of Instagram posts featuring Kopi Dua Darjat cups.", caption: "You are the heart of our brand." },
      author: { name: "Community Team" },
      tags: ["Community", "Social Media"],
      category: "Community",
      status: "published",
      content: "<p>From stunning flatlays to happy selfies, our community's creativity is amazing! The #KopiDuaDarjat tag is buzzing with your stories. In this post, we're sharing some of the most beautiful and heartwarming moments you've shared with us. Keep them coming!</p>",
      seo: { title: "See Why #KopiDuaDarjat is Trending on Instagram and TikTok" }
    },
    {
      title: "Brew at Home: A Simple Guide to Making Kopi Susu",
      slug: "brew-at-home-kopi-susu",
      excerpt: "Can't get to one of our stalls? Here’s a simple, traditional recipe to brew a delicious cup of Kopi Susu at home.",
      coverImage: { url: "https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=500&auto=format&fit=crop", alt: "Ingredients for making kopi susu laid out on a kitchen counter.", caption: "Bring the warisan taste home." },
      author: { name: "Hadi & Azad" },
      tags: ["Tips", "Brewing", "Coffee"],
      category: "Behind The Cup",
      status: "draft",
      content: "<p>While nothing beats a cup from our baristas, you can still enjoy a great Kopi Susu at home. You'll need coarse Malaysian coffee grounds, a 'sock' filter, hot water, and condensed milk. The key is the slow drip and getting the right ratio of coffee to milk. Follow our step-by-step guide inside!</p>",
      seo: { description: "Learn how to make authentic Malaysian Kopi Susu at home with this easy-to-follow recipe guide." }
    },
    {
      title: "Meet the Team: The Faces Behind Your Favorite Coffee",
      slug: "meet-the-team",
      excerpt: "From our founders to our baristas, meet the passionate people who make Kopi Dua Darjat special.",
      coverImage: { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop", alt: "A group photo of the smiling Kopi Dua Darjat team.", caption: "The family that brews together." },
      author: { name: "Community Team" },
      tags: ["Community", "Brand Story"],
      category: "Our Story",
      status: "published",
      content: "<p>Kopi Dua Darjat is built on people. Passionate, dedicated people who love coffee and serving our community. In this series, we'll be introducing you to the team members who work tirelessly behind the scenes and at our stalls to bring you the perfect cup, every time.</p>",
      seo: { title: "Meet the Kopi Dua Darjat Team | Our People" }
    }
  ];

