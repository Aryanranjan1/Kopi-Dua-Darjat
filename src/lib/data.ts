
import type { Outlet, Blog, Testimonial, FaqItem, SiteSettings } from './types';
import { Timestamp } from 'firebase/firestore';

// This file now contains only data that is not part of the main CMS.
// Menu items, categories, and promotions are now fetched from Firestore.

export const outlets: Omit<Outlet, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // Selangor
    { name: 'Kajang Prima', slug: 'kajang-prima', address: '123 Jalan Prima, Kajang', city: 'Kajang', state: 'Selangor', lat: 2.9935, lng: 101.7874, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'kajang@kopi.com', status: 'active', rating: 4.8, reviewCount: 150 },
    { name: 'Bandar Baru Bangi', slug: 'bangi', address: '456 Seksyen 9, Bangi', city: 'Bangi', state: 'Selangor', lat: 2.9555, lng: 101.7616, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'bangi@kopi.com', status: 'active', rating: 4.7, reviewCount: 210 },
    { name: 'Shah Alam', slug: 'shah-alam', address: '789 Seksyen 7, Shah Alam', city: 'Shah Alam', state: 'Selangor', lat: 3.0738, lng: 101.5183, hours: '8 AM - 11 PM', phone: '012-345-6789', email: 'shahalam@kopi.com', status: 'active', rating: 4.9, reviewCount: 320 },
    { name: 'Puchong Perdana', slug: 'puchong', address: '101 Jalan Perdana, Puchong', city: 'Puchong', state: 'Selangor', lat: 3.008, lng: 101.613, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'puchong@kopi.com', status: 'active', rating: 4.6, reviewCount: 180 },
    { name: 'Subang Jaya', slug: 'subang-jaya', address: '212 Jalan SS15/4, Subang Jaya', city: 'Subang Jaya', state: 'Selangor', lat: 3.076, lng: 101.587, hours: '9 AM - 11 PM', phone: '012-345-6789', email: 'subang@kopi.com', status: 'active', rating: 4.8, reviewCount: 250 },
    { name: 'Damansara Utama', slug: 'damansara', address: '333 Jalan SS21/37, Damansara Utama', city: 'Petaling Jaya', state: 'Selangor', lat: 3.136, lng: 101.621, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'damansara@kopi.com', status: 'active', rating: 4.7, reviewCount: 190 },
    { name: 'Ampang', slug: 'ampang', address: '444 Jalan Ampang, Ampang', city: 'Ampang', state: 'Selangor', lat: 3.15, lng: 101.75, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'ampang@kopi.com', status: 'inactive', rating: 4.2, reviewCount: 80 },
    { name: 'Klang', slug: 'klang', address: '555 Jalan Meru, Klang', city: 'Klang', state: 'Selangor', lat: 3.045, lng: 101.44, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'klang@kopi.com', status: 'active', rating: 4.5, reviewCount: 120 },
    { name: 'Gombak', slug: 'gombak', address: '666 Jalan Gombak, Gombak', city: 'Gombak', state: 'Selangor', lat: 3.23, lng: 101.7, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'gombak@kopi.com', status: 'active', rating: 4.6, reviewCount: 140 },
    { name: 'Cheras', slug: 'cheras-selangor', address: '777 Jalan Cheras, Cheras', city: 'Cheras', state: 'Selangor', lat: 3.09, lng: 101.74, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'cheras.sel@kopi.com', status: 'active', rating: 4.7, reviewCount: 200 },
    
    // Kuala Lumpur
    { name: 'Bukit Bintang', slug: 'bukit-bintang', address: '888 Jalan Bukit Bintang', city: 'Kuala Lumpur', state: 'Kuala Lumpur', lat: 3.146, lng: 101.71, hours: '10 AM - 12 AM', phone: '012-345-6789', email: 'bintang@kopi.com', status: 'active', rating: 4.9, reviewCount: 450 },
    { name: 'KL Sentral', slug: 'kl-sentral', address: '999 Jalan Stesen Sentral, KL Sentral', city: 'Kuala Lumpur', state: 'Kuala Lumpur', lat: 3.134, lng: 101.686, hours: '7 AM - 10 PM', phone: '012-345-6789', email: 'sentral@kopi.com', status: 'active', rating: 4.8, reviewCount: 380 },
    { name: 'Mont Kiara', slug: 'mont-kiara', address: '111 Jalan Kiara, Mont Kiara', city: 'Kuala Lumpur', state: 'Kuala Lumpur', lat: 3.165, lng: 101.65, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'kiara@kopi.com', status: 'active', rating: 4.8, reviewCount: 280 },
    { name: 'TTDI', slug: 'ttdi', address: '222 Lorong Rahim Kajai, TTDI', city: 'Kuala Lumpur', state: 'Kuala Lumpur', lat: 3.14, lng: 101.63, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'ttdi@kopi.com', status: 'active', rating: 4.9, reviewCount: 310 },
    { name: 'Wangsa Maju', slug: 'wangsa-maju', address: '333 Jalan Wangsa Delima, Wangsa Maju', city: 'Kuala Lumpur', state: 'Kuala Lumpur', lat: 3.205, lng: 101.74, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'wangsa@kopi.com', status: 'active', rating: 4.6, reviewCount: 160 },
    { name: 'Setapak', slug: 'setapak', address: '444 Jalan Genting Klang, Setapak', city: 'Kuala Lumpur', state: 'Kuala Lumpur', lat: 3.19, lng: 101.71, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'setapak@kopi.com', status: 'active', rating: 4.7, reviewCount: 175 },

    // Putrajaya
    { name: 'Presint 15', slug: 'putrajaya-p15', address: '789 Jalan Diplomatik, Presint 15', city: 'Putrajaya', state: 'Putrajaya', lat: 2.9264, lng: 101.6964, hours: '9 AM - 9 PM', phone: '012-345-6789', email: 'p15@kopi.com', status: 'inactive', rating: 4.3, reviewCount: 90 },
    { name: 'Ayer@8', slug: 'putrajaya-ayer8', address: 'Jalan P8, Presint 8', city: 'Putrajaya', state: 'Putrajaya', lat: 2.93, lng: 101.67, hours: '10 AM - 10 PM', phone: '012-345-6789', email: 'ayer8@kopi.com', status: 'active', rating: 4.8, reviewCount: 220 },

    // Johor
    { name: 'JB City Square', slug: 'jb-city-square', address: '106-108 Jalan Wong Ah Fook, Johor Bahru', city: 'Johor Bahru', state: 'Johor', lat: 1.46, lng: 103.76, hours: '10 AM - 10 PM', phone: '012-345-6789', email: 'jb@kopi.com', status: 'active', rating: 4.7, reviewCount: 300 },
    { name: 'Mount Austin', slug: 'mount-austin', address: 'Jalan Austin Heights 8/5, Taman Mount Austin', city: 'Johor Bahru', state: 'Johor', lat: 1.56, lng: 103.77, hours: '9 AM - 11 PM', phone: '012-345-6789', email: 'austin@kopi.com', status: 'active', rating: 4.9, reviewCount: 350 },
    { name: 'Kluang', slug: 'kluang', address: 'Jalan Lambak, Kluang', city: 'Kluang', state: 'Johor', lat: 2.03, lng: 103.32, hours: '8 AM - 9 PM', phone: '012-345-6789', email: 'kluang@kopi.com', status: 'active', rating: 4.6, reviewCount: 110 },
    { name: 'Batu Pahat', slug: 'batu-pahat', address: 'Jalan Rahmat, Batu Pahat', city: 'Batu Pahat', state: 'Johor', lat: 1.85, lng: 102.93, hours: '8 AM - 9 PM', phone: '012-345-6789', email: 'pahat@kopi.com', status: 'active', rating: 4.5, reviewCount: 95 },
    { name: 'Muar', slug: 'muar', address: 'Jalan Sisi, Muar', city: 'Muar', state: 'Johor', lat: 2.05, lng: 102.57, hours: '8 AM - 9 PM', phone: '012-345-6789', email: 'muar@kopi.com', status: 'active', rating: 4.6, reviewCount: 105 },
    { name: 'Skudai', slug: 'skudai', address: 'Jalan Laksamana, Skudai', city: 'Skudai', state: 'Johor', lat: 1.54, lng: 103.66, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'skudai@kopi.com', status: 'inactive', rating: 4.1, reviewCount: 60 },

    // Penang
    { name: 'Georgetown', slug: 'georgetown', address: '25 Lebuh Campbell, Georgetown', city: 'Georgetown', state: 'Penang', lat: 5.419, lng: 100.33, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'georgetown@kopi.com', status: 'active', rating: 4.9, reviewCount: 400 },
    { name: 'Bayan Lepas', slug: 'bayan-lepas', address: 'Jalan Mayang Pasir, Bayan Lepas', city: 'Bayan Lepas', state: 'Penang', lat: 5.32, lng: 100.28, hours: '8 AM - 10 PM', phone: '012-345-6789', email: 'bayanlepas@kopi.com', status: 'active', rating: 4.7, reviewCount: 230 },
    { name: 'Gurney Drive', slug: 'gurney-drive', address: 'Persiaran Gurney, Georgetown', city: 'Georgetown', state: 'Penang', lat: 5.43, lng: 100.31, hours: '10 AM - 11 PM', phone: '012-345-6789', email: 'gurney@kopi.com', status: 'active', rating: 4.8, reviewCount: 330 },
    { name: 'Bukit Mertajam', slug: 'bukit-mertajam', address: 'Jalan Arumugam Pillai, Bukit Mertajam', city: 'Bukit Mertajam', state: 'Penang', lat: 5.36, lng: 100.45, hours: '8 AM - 9 PM', phone: '012-345-6789', email: 'mertajam@kopi.com', status: 'active', rating: 4.6, reviewCount: 130 },
    { name: 'Butterworth', slug: 'butterworth', address: 'Jalan Bagan Luar, Butterworth', city: 'Butterworth', state: 'Penang', lat: 5.39, lng: 100.36, hours: '8 AM - 9 PM', phone: '012-345-6789', email: 'butterworth@kopi.com', status: 'active', rating: 4.5, reviewCount: 115 },
    { name: 'Tanjung Tokong', slug: 'tanjung-tokong', address: 'Jalan Seri Tanjung Pinang', city: 'Tanjung Tokong', state: 'Penang', lat: 5.45, lng: 100.3, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'tokong@kopi.com', status: 'inactive', rating: 4.4, reviewCount: 85 },
    
    // Perak
    { name: 'Ipoh Old Town', slug: 'ipoh-old-town', address: 'Jalan Panglima, Ipoh', city: 'Ipoh', state: 'Perak', lat: 4.59, lng: 101.07, hours: '9 AM - 9 PM', phone: '012-345-6789', email: 'ipoh@kopi.com', status: 'active', rating: 4.8, reviewCount: 290 },
    { name: 'Taiping', slug: 'taiping', address: 'Jalan Kota, Taiping', city: 'Taiping', state: 'Perak', lat: 4.85, lng: 100.74, hours: '8 AM - 8 PM', phone: '012-345-6789', email: 'taiping@kopi.com', status: 'active', rating: 4.7, reviewCount: 150 },
    { name: 'Teluk Intan', slug: 'teluk-intan', address: 'Jalan Ah Cheong, Teluk Intan', city: 'Teluk Intan', state: 'Perak', lat: 4.02, lng: 101.02, hours: '8 AM - 8 PM', phone: '012-345-6789', email: 'telukintan@kopi.com', status: 'active', rating: 4.6, reviewCount: 100 },

    // Melaka
    { name: 'Jonker Street', slug: 'jonker-street', address: 'Jalan Hang Jebat, Melaka', city: 'Melaka', state: 'Melaka', lat: 2.19, lng: 102.24, hours: '10 AM - 10 PM', phone: '012-345-6789', email: 'jonker@kopi.com', status: 'active', rating: 4.9, reviewCount: 420 },
    { name: 'Mahkota Parade', slug: 'mahkota-parade', address: 'Jalan Merdeka, Melaka', city: 'Melaka', state: 'Melaka', lat: 2.18, lng: 102.25, hours: '10 AM - 10 PM', phone: '012-345-6789', email: 'mahkota@kopi.com', status: 'active', rating: 4.7, reviewCount: 260 },

    // Negeri Sembilan
    { name: 'Seremban', slug: 'seremban', address: 'Jalan Dato Bandar Tunggal, Seremban', city: 'Seremban', state: 'Negeri Sembilan', lat: 2.72, lng: 101.94, hours: '9 AM - 9 PM', phone: '012-345-6789', email: 'seremban@kopi.com', status: 'active', rating: 4.6, reviewCount: 180 },
    { name: 'Port Dickson', slug: 'port-dickson', address: 'Jalan Pantai, Port Dickson', city: 'Port Dickson', state: 'Negeri Sembilan', lat: 2.52, lng: 101.79, hours: '10 AM - 9 PM', phone: '012-345-6789', email: 'pd@kopi.com', status: 'inactive', rating: 4.2, reviewCount: 70 },

    // Pahang
    { name: 'Kuantan', slug: 'kuantan', address: 'Jalan Mahkota, Kuantan', city: 'Kuantan', state: 'Pahang', lat: 3.81, lng: 103.32, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'kuantan@kopi.com', status: 'active', rating: 4.7, reviewCount: 200 },
    { name: 'Genting Highlands', slug: 'genting', address: 'Genting Highlands', city: 'Genting Highlands', state: 'Pahang', lat: 3.42, lng: 101.79, hours: '10 AM - 12 AM', phone: '012-345-6789', email: 'genting@kopi.com', status: 'active', rating: 4.8, reviewCount: 360 },

    // Terengganu
    { name: 'Kuala Terengganu', slug: 'kuala-terengganu', address: 'Jalan Sultan Zainal Abidin, KT', city: 'Kuala Terengganu', state: 'Terengganu', lat: 5.33, lng: 103.13, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'kt@kopi.com', status: 'active', rating: 4.7, reviewCount: 190 },

    // Kelantan
    { name: 'Kota Bharu', slug: 'kota-bharu', address: 'Jalan Pintu Pong, Kota Bharu', city: 'Kota Bharu', state: 'Kelantan', lat: 6.13, lng: 102.23, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'kb@kopi.com', status: 'active', rating: 4.6, reviewCount: 170 },

    // Kedah
    { name: 'Alor Setar', slug: 'alor-setar', address: 'Jalan Langgar, Alor Setar', city: 'Alor Setar', state: 'Kedah', lat: 6.12, lng: 100.36, hours: '9 AM - 9 PM', phone: '012-345-6789', email: 'alorsetar@kopi.com', status: 'active', rating: 4.5, reviewCount: 125 },
    { name: 'Langkawi', slug: 'langkawi', address: 'Pantai Cenang, Langkawi', city: 'Langkawi', state: 'Kedah', lat: 6.29, lng: 99.72, hours: '10 AM - 10 PM', phone: '012-345-6789', email: 'langkawi@kopi.com', status: 'active', rating: 4.8, reviewCount: 240 },

    // Perlis
    { name: 'Kangar', slug: 'kangar', address: 'Jalan Penjara, Kangar', city: 'Kangar', state: 'Perlis', lat: 6.44, lng: 100.19, hours: '9 AM - 9 PM', phone: '012-345-6789', email: 'kangar@kopi.com', status: 'inactive', rating: 4.0, reviewCount: 50 },

    // Sabah
    { name: 'Kota Kinabalu', slug: 'kota-kinabalu', address: 'Jalan Gaya, Kota Kinabalu', city: 'Kota Kinabalu', state: 'Sabah', lat: 5.98, lng: 116.07, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'kk@kopi.com', status: 'active', rating: 4.9, reviewCount: 410 },
    { name: 'Sandakan', slug: 'sandakan', address: 'Jalan Pelabuhan, Sandakan', city: 'Sandakan', state: 'Sabah', lat: 5.84, lng: 118.11, hours: '8 AM - 8 PM', phone: '012-345-6789', email: 'sandakan@kopi.com', status: 'active', rating: 4.6, reviewCount: 135 },
    { name: 'Tawau', slug: 'tawau', address: 'Jalan Kuhara, Tawau', city: 'Tawau', state: 'Sabah', lat: 4.24, lng: 117.88, hours: '8 AM - 8 PM', phone: '012-345-6789', email: 'tawau@kopi.com', status: 'active', rating: 4.7, reviewCount: 145 },

    // Sarawak
    { name: 'Kuching', slug: 'kuching', address: 'Jalan Main Bazaar, Kuching', city: 'Kuching', state: 'Sarawak', lat: 1.55, lng: 110.34, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'kuching@kopi.com', status: 'active', rating: 4.8, reviewCount: 300 },
    { name: 'Miri', slug: 'miri', address: 'Jalan North Yu Seng, Miri', city: 'Miri', state: 'Sarawak', lat: 4.41, lng: 114.0, hours: '9 AM - 10 PM', phone: '012-345-6789', email: 'miri@kopi.com', status: 'active', rating: 4.7, reviewCount: 220 },
    { name: 'Sibu', slug: 'sibu', address: 'Jalan Channel, Sibu', city: 'Sibu', state: 'Sarawak', lat: 2.29, lng: 111.82, hours: '8 AM - 9 PM', phone: '012-345-6789', email: 'sibu@kopi.com', status: 'inactive', rating: 4.3, reviewCount: 75 },
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
    {
      id: "the-art-of-the-perfect-kopi-tarik",
      title: "The Art of the Perfect 'Kopi Tarik'",
      slug: "the-art-of-the-perfect-kopi-tarik",
      excerpt: "It's more than just pulling coffee. Discover the technique and passion behind creating the perfect frothy texture in our traditional Kopi Tarik.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1559496417-50b5d5b74248?w=500&auto=format&fit=crop",
        alt: "A barista skillfully pulling coffee between two mugs, creating a frothy stream.",
        caption: "The iconic 'pull' that makes the magic happen."
      },
      author: { name: "Master Barista" },
      tags: ["Technique", "Heritage", "Kopi Tarik"],
      category: "Behind The Cup",
      status: "published",
      content: "<p>The 'tarik' or 'pulling' process is essential to a great cup of Malaysian-style coffee. It cools the coffee to the perfect drinking temperature, mixes the condensed milk thoroughly, and most importantly, creates a thick, creamy foam on top. It's a skill that takes practice and precision, and it's a performance our customers love to watch.</p>",
      seo: { title: "How to Make Kopi Tarik | The Malaysian Pulled Coffee" },
      publishedAt: Timestamp.fromDate(new Date('2023-12-10T10:00:00Z'))
    },
    {
      id: "community-spotlight-local-artists",
      title: "Community Spotlight: Featuring Local Artists at Our Outlets",
      slug: "community-spotlight-local-artists",
      excerpt: "We're more than just a coffee shop; we're a platform for local talent. Learn how we're turning our outlets into community art spaces.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=500&auto=format&fit=crop",
        alt: "Artwork displayed on the wall of a cozy cafe.",
        caption: "Art and coffee: a perfect blend."
      },
      author: { name: "Community Team" },
      tags: ["Community", "Art", "Local Talent"],
      category: "Community",
      status: "published",
      content: "<p>At Kopi Dua Darjat, we believe in nurturing the communities we serve. That's why we've partnered with local artists to showcase their work on our walls. It's our way of supporting the vibrant arts scene and giving our customers something beautiful to look at while they enjoy their coffee.</p>",
      seo: { description: "Discover how Kopi Dua Darjat supports local artists by transforming its cafes into art galleries." },
      publishedAt: Timestamp.fromDate(new Date('2023-12-18T10:00:00Z'))
    },
    {
      id: "sustainability-from-bean-to-cup",
      title: "Our Commitment to Sustainability: From Bean to Cup",
      slug: "sustainability-from-bean-to-cup",
      excerpt: "Find out how we're making a difference, from ethically sourcing our beans to reducing waste at our stalls.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1629177659529-17d479a0998f?w=500&auto=format&fit=crop",
        alt: "Hands holding freshly picked coffee cherries.",
        caption: "Good coffee starts with responsible farming."
      },
      author: { name: "Hadi & Azad" },
      tags: ["Sustainability", "Ethical Sourcing", "Environment"],
      category: "Our Story",
      status: "published",
      content: "<p>We have a responsibility to our planet and our partners. We work directly with coffee farmers to ensure fair prices and sustainable farming practices. At our outlets, we're continuously working to reduce our environmental footprint by minimizing single-use plastics and promoting reusable cups. It's a journey, and we're committed to making every step count.</p>",
      seo: { title: "Sustainable Coffee in Malaysia | Kopi Dua Darjat's Commitment" },
      publishedAt: Timestamp.fromDate(new Date('2024-01-05T10:00:00Z'))
    },
    {
      id: "new-menu-item-pandan-latte",
      title: "Introducing the Darjat Pandan: A Fragrant Twist on a Classic",
      slug: "new-menu-item-pandan-latte",
      excerpt: "Our latest creation is here! The Darjat Pandan combines the comforting aroma of pandan with our signature robust coffee for a uniquely Malaysian treat.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1600096194534-95cf5841488a?w=500&auto=format&fit=crop",
        alt: "A green pandan-infused latte in a clear glass.",
        caption: "A truly local flavour innovation."
      },
      author: { name: "Menu Development Team" },
      tags: ["Menu", "New Arrival", "Pandan"],
      category: "Our Drinks",
      status: "published",
      content: "<p>We're thrilled to launch our new Darjat Pandan! We spent months perfecting the recipe, creating our own pandan syrup from fresh leaves to capture that authentic, fragrant flavor. It’s the perfect balance of sweet, aromatic, and bold coffee notes. Come and try what we believe is the next big thing in Malaysian coffee!</p>",
      seo: { description: "Try the new Darjat Pandan latte, a unique coffee experience blending pandan and our signature espresso." },
      publishedAt: Timestamp.fromDate(new Date('2024-01-15T10:00:00Z'))
    },
    {
      id: "behind-the-scenes-a-day-at-kdd",
      title: "A Day in the Life of a Kopi Dua Darjat Barista",
      slug: "behind-the-scenes-a-day-at-kdd",
      excerpt: "Ever wondered what goes on behind the counter? Follow one of our baristas through a busy day of brewing, pulling, and serving smiles.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&auto=format&fit=crop",
        alt: "A barista focused on preparing a coffee order.",
        caption: "Passion and precision in every cup."
      },
      author: { name: "Sarah L." },
      tags: ["Day in the Life", "Barista", "Behind The Scenes"],
      category: "Our Story",
      status: "published",
      content: "<p>The morning rush is intense but fun! It's a blur of greetings, orders, and the rhythmic sound of the coffee machine. But even during the busiest moments, there's nothing better than seeing a regular customer's face light up after their first sip. Being a KDD barista is about more than coffee; it's about being a part of someone's daily routine and making it a little bit better.</p>",
      seo: { keywords: ["barista life", "cafe work", "coffee shop daily routine"] },
      publishedAt: Timestamp.fromDate(new Date('2024-01-28T10:00:00Z'))
    },
    {
      id: "your-guide-to-at-home-brewing",
      title: "Your Guide to Brewing Kopi Dua Darjat at Home",
      slug: "your-guide-to-at-home-brewing",
      excerpt: "Love our coffee? Here’s how you can enjoy the authentic Kopi Dua Darjat experience from the comfort of your own home with our bottled series.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1563868045-8493d5023908?w=500&auto=format&fit=crop",
        alt: "A person pouring bottled coffee into a glass of ice.",
        caption: "Your favorite coffee, ready anytime."
      },
      author: { name: "Home Brewing Club" },
      tags: ["How-To", "Home Coffee", "Bottled Coffee"],
      category: "Guides",
      status: "published",
      content: "<p>Recreating the cafe experience at home is easy with our KDD Bottled Series. For the perfect iced kopi, fill a glass with ice, pour our concentrated coffee over it, and top with fresh milk or your favorite dairy-free alternative. For a warm treat, gently heat the coffee concentrate with milk in a pot until warm. It's that simple!</p>",
      seo: { description: "Learn how to make the perfect iced or hot coffee at home using Kopi Dua Darjat's bottled coffee concentrates." },
      publishedAt: Timestamp.fromDate(new Date('2024-02-10T10:00:00Z'))
    },
    {
      id: "the-evolution-of-our-stall-design",
      title: "The Evolution of Our Stall Design",
      slug: "the-evolution-of-our-stall-design",
      excerpt: "From a simple pushcart to our modern, rustic kiosks. We walk you through the design philosophy of the Kopi Dua Darjat stall.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1616421235123-24251b5d1e7e?w=500&auto=format&fit=crop",
        alt: "A modern and sleek coffee kiosk.",
        caption: "Designed for efficiency and brand presence."
      },
      author: { name: "Design Team" },
      tags: ["Design", "Branding", "Franchise"],
      category: "Our Story",
      status: "published",
      content: "<p>Our stall design is a physical representation of 'Antara Warisan & Artisan'. We use natural wood textures to evoke a sense of heritage and warmth, combined with clean lines and modern materials for a contemporary, professional feel. Every element is designed for workflow efficiency, customer engagement, and strong brand visibility.</p>",
      seo: { keywords: ["kiosk design", "cafe architecture", "brand design"] },
      publishedAt: Timestamp.fromDate(new Date('2024-02-22T10:00:00Z'))
    },
    {
      id: "what-makes-our-beans-special",
      title: "What Makes Our Coffee Beans Special?",
      slug: "what-makes-our-beans-special",
      excerpt: "A deep dive into our unique blend of beans, the roasting process, and what gives our coffee its signature 'kaw' flavor.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1599335834232-09748b648937?w=500&auto=format&fit=crop",
        alt: "A close-up of dark roasted coffee beans.",
        caption: "Our unique blend, roasted to perfection."
      },
      author: { name: "Master Roaster" },
      tags: ["Coffee Beans", "Roasting", "Quality"],
      category: "Behind The Cup",
      status: "published",
      content: "<p>The secret to our signature taste lies in the blend. We use a proprietary mix of Robusta and Arabica beans, sourced from specific regions in Southeast Asia. The beans are roasted locally in small batches to a specific dark profile, which brings out the bold, chocolatey notes that Malaysians love. This 'kaw' (strong) flavor is the foundation of every drink we serve.</p>",
      seo: { description: "Learn about the unique coffee bean blend and roasting process that creates the signature Kopi Dua Darjat taste." },
      publishedAt: Timestamp.fromDate(new Date('2024-03-05T10:00:00Z'))
    },
    {
      id: "top-5-food-pairings-with-kopi",
      title: "Top 5 Food Pairings for Your Favorite Kopi",
      slug: "top-5-food-pairings-with-kopi",
      excerpt: "Elevate your coffee break with these perfect food pairings, from classic kuih to modern pastries.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1583337757-5503b41460a5?w=500&auto=format&fit=crop",
        alt: "A spread of pastries and cakes next to cups of coffee.",
        caption: "The perfect companions for your coffee."
      },
      author: { name: "Aina Rahman" },
      tags: ["Food Pairing", "Menu", "Lifestyle"],
      category: "Guides",
      status: "published",
      content: "<p>What's better than a great cup of coffee? A great cup of coffee with the perfect snack! Here are our top 5 recommendations: 1. Kopi 'O' with Kaya Toast. 2. Darjat Caramel with a flaky croissant. 3. Darjat Borneo with Kuih Lapis. 4. Coklat Artisan with a simple butter cookie. 5. Matchaa with a red bean bun. What's your favorite combo?</p>",
      seo: { keywords: ["coffee and food", "cafe snacks", "kuih and kopi"] },
      publishedAt: Timestamp.fromDate(new Date('2024-03-18T10:00:00Z'))
    },
    {
      id: "meet-the-team-operations-wizards",
      title: "Meet the Team: Our Operations Wizards",
      slug: "meet-the-team-operations-wizards",
      excerpt: "The unsung heroes who ensure every outlet runs smoothly, from supply chains to quality control. Meet the KDD operations team!",
      coverImage: {
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop",
        alt: "A diverse team of people collaborating around a table.",
        caption: "The team that keeps the coffee flowing."
      },
      author: { name: "Community Team" },
      tags: ["Team", "Behind The Scenes", "Operations"],
      category: "Our Story",
      status: "published",
      content: "<p>From sourcing the best beans to delivering them fresh to over 50 outlets, our operations team is the backbone of Kopi Dua Darjat. They are the logisticians, the quality checkers, and the problem solvers who work tirelessly behind the scenes to ensure every cup of KDD coffee meets our high standards, no matter which outlet you visit.</p>",
      seo: { title: "The Team Behind Kopi Dua Darjat's Operations" },
      publishedAt: Timestamp.fromDate(new Date('2024-04-01T10:00:00Z'))
    },
    {
      id: "new-merch-alert-kdd-tumblers",
      title: "New Merch Alert: KDD Tumblers & Tees",
      slug: "new-merch-alert-kdd-tumblers",
      excerpt: "Take a piece of Kopi Dua Darjat home with you! Our new line of tumblers, t-shirts, and tote bags are now available at selected outlets.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?w=500&auto=format&fit=crop",
        alt: "A collection of branded merchandise including t-shirts, mugs, and tote bags.",
        caption: "Wear your love for Kopi Dua Darjat."
      },
      author: { name: "Marketing Team" },
      tags: ["Merchandise", "New Arrival", "Lifestyle"],
      category: "News",
      status: "published",
      content: "<p>Show your KDD pride! We've just launched our first-ever merchandise line, featuring minimalist designs inspired by our 'Warisan & Artisan' philosophy. Grab our eco-friendly bamboo tumbler, a comfy cotton tee, or a stylish tote bag on your next coffee run. Available for a limited time at major outlets.</p>",
      seo: { description: "Shop the new Kopi Dua Darjat official merchandise, including tumblers, t-shirts, and tote bags." },
      publishedAt: Timestamp.fromDate(new Date('2024-04-12T10:00:00Z'))
    },
    {
      id: "how-we-pick-our-outlet-locations",
      title: "Location, Location, Location: How We Pick Our Outlet Spots",
      slug: "how-we-pick-our-outlet-locations",
      excerpt: "What makes a great spot for a Kopi Dua Darjat stall? We share our strategy for finding the perfect locations to serve our communities.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=500&auto=format&fit=crop",
        alt: "A bustling street corner in a Malaysian city.",
        caption: "Finding the heart of the community."
      },
      author: { name: "Franchise Team" },
      tags: ["Franchise", "Business Strategy", "Location"],
      category: "Franchise",
      status: "published",
      content: "<p>Choosing the right location is key to a successful franchise. We look for high foot-traffic areas with strong community ties, like transport hubs, office building lobbies, and neighbourhood centres. Our goal is to be a convenient and welcoming part of people's daily lives. We use data analysis and on-the-ground research to identify spots with the highest potential for our franchise partners.</p>",
      seo: { keywords: ["retail location strategy", "food business location", "franchise site selection"] },
      publishedAt: Timestamp.fromDate(new Date('2024-04-25T10:00:00Z'))
    },
    {
      id: "introducing-mobile-ordering-app",
      title: "Skip the Queue: Introducing Our New Mobile Ordering App",
      slug: "introducing-mobile-ordering-app",
      excerpt: "Your favourite coffee is now just a tap away. Order ahead and pick up your drink without the wait with the new KDD mobile app.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1581057448889-c47e8ad6f5a3?w=500&auto=format&fit=crop",
        alt: "A person using a smartphone to order coffee on a mobile app.",
        caption: "Convenience at your fingertips."
      },
      author: { name: "Digital Team" },
      tags: ["Technology", "App", "New Arrival"],
      category: "News",
      status: "published",
      content: "<p>We're excited to launch the official Kopi Dua Darjat mobile app! Now you can browse our full menu, customize your drink, pay securely, and collect your order from your chosen outlet. The app also features exclusive app-only promotions and a loyalty rewards program. Download it today on the App Store and Google Play!</p>",
      seo: { title: "Kopi Dua Darjat Mobile App | Order Coffee Online" },
      publishedAt: Timestamp.fromDate(new Date('2024-05-08T10:00:00Z'))
    },
    {
      id: "customer-photo-of-the-month",
      title: "Customer Photo of the Month: May 2024",
      slug: "customer-photo-of-the-month",
      excerpt: "Check out our favorite customer photo from May! See who won and how you can participate for a chance to be featured and win prizes.",
      coverImage: {
        url: "https://images.unsplash.com/photo-1545483486-5d65a918f564?w=500&auto=format&fit=crop",
        alt: "A creative and aesthetically pleasing photo of a Kopi Dua Darjat cup.",
        caption: "This month's winning shot by @coffeelover92."
      },
      author: { name: "Community Team" },
      tags: ["Community", "Contest", "Social Media"],
      category: "Community",
      status: "published",
      content: "<p>We love seeing your creative shots of our coffee! This month's winner is this beautiful photo by @coffeelover92 on Instagram, perfectly capturing the mood of a relaxing coffee break. Congratulations! You've won a month's supply of KDD coffee. Want to enter for next month? Just post your photo with the hashtag #KopiDuaDarjat for a chance to win.</p>",
      seo: { description: "See the winning customer photo for May and learn how to enter the Kopi Dua Darjat photo contest." },
      publishedAt: Timestamp.fromDate(new Date('2024-05-20T10:00:00Z'))
    }
];

export const testimonialSeedData = [
  { outletId: "kajang-prima", quote: "My daily morning stop! The Darjat Borneo is consistently amazing.", name: "Sarah L.", designation: "Teacher, Kajang", image: "testimonial-2", company: "KDD Fan" },
  { outletId: "bangi", quote: "Fast service and the best local coffee in Bangi. The baristas are always friendly.", name: "Aiman H.", designation: "Student, UKM", image: "testimonial-3", company: "KDD Fan" },
  { outletId: "shah-alam", quote: "I organized a bulk order for my office, and the process was so smooth. Everyone loved the coffee!", name: "Priya K.", designation: "HR Executive, Shah Alam", image: "testimonial-1", company: "KDD Fan" },
  { outletId: "jb-city-square", quote: "A must-visit when I cross the border. It's the authentic Malaysian taste I miss.", name: "David Chen", designation: "Visitor, Singapore", image: "testimonial-3", company: "KDD Fan" },
  { outletId: "georgetown", quote: "Perfect companion for a walk around historical Georgetown. The Coklat Artisan is my kid's favorite.", name: "Emily T.", designation: "Tourist, Australia", image: "testimonial-2", company: "KDD Fan" },
  { outletId: "kota-kinabalu", quote: "The view is great, but the coffee is even better. Love this place!", name: "Jackson R.", designation: "Local Resident, KK", image: "testimonial-1", company: "KDD Fan" }
]
