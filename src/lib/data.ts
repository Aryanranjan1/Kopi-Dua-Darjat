
import type { Outlet, Blog, Testimonial, FaqItem, SiteSettings } from './types';
import { Timestamp } from 'firebase/firestore';

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

export const blogSeedData: Omit<Blog, 'createdAt' | 'updatedAt' | 'views' | 'likes'>[] = [
    {
      id: "story-behind-antara-warisan-artisan",
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
      seo: { title: "The Philosophy of Kopi Dua Darjat: Antara Warisan & Artisan" },
      publishedAt: Timestamp.fromDate(new Date('2023-10-26T10:00:00Z'))
    },
    {
      id: "why-darjat-borneo-is-a-must-try",
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
      seo: { description: "Learn what makes the Gula Apong in our Darjat Borneo coffee so special and why it's a customer favorite." },
      publishedAt: Timestamp.fromDate(new Date('2023-11-05T10:00:00Z'))
    },
    {
      id: "5-reasons-to-start-franchise",
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
      seo: { keywords: ["coffee franchise", "small business Malaysia", "F&B opportunity"] },
      publishedAt: Timestamp.fromDate(new Date('2023-11-15T10:00:00Z'))
    },
    {
      id: "taknak-kopi-menu-for-you",
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
      seo: { title: "Best Non-Coffee Drinks in Malaysia | Kopi Dua Darjat" },
      publishedAt: Timestamp.fromDate(new Date('2023-11-25T10:00:00Z'))
    },
    {
      id: "franchisee-success-story-ahmad",
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
      seo: { description: "Read the inspiring journey of Ahmad Faizal, who turned his love for Kopi Dua Darjat into a thriving franchise business." },
      publishedAt: Timestamp.fromDate(new Date('2023-12-01T10:00:00Z'))
    },
];
