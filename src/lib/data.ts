
import type { Outlet, Blog, Testimonial, FaqItem, SiteSettings, MenuGroup, MenuCategory, MenuItem, Promotion } from './types';
import { Timestamp } from 'firebase/firestore';

// This file now contains only data that is not part of the main CMS.
// Menu items, categories, and promotions are now fetched from Firestore.

export const menuGroups: Omit<MenuGroup, 'createdAt' | 'updatedAt'>[] = [
  { id: 'nak-kopi', name: 'Nak Kopi?', slug: 'nak-kopi', displayOrder: 1, status: 'published' },
  { id: 'nak-makan', name: 'Nak Makan?', slug: 'nak-makan', displayOrder: 2, status: 'published' },
  { id: 'nak-lain', name: 'Nak Lain?', slug: 'nak-lain', displayOrder: 3, status: 'published' },
];

export const menuCategories: Omit<MenuCategory, 'createdAt' | 'updatedAt'>[] = [
  { id: 'darjat-series', name: 'Darjat Series', slug: 'darjat-series', groupId: 'nak-kopi', displayOrder: 1, status: 'published' },
  { id: 'kopi-series', name: 'Kopi Series', slug: 'kopi-series', groupId: 'nak-kopi', displayOrder: 2, status: 'published' },
  { id: 'coklat-series', name: 'Coklat Series', slug: 'coklat-series', groupId: 'nak-lain', displayOrder: 3, status: 'published' },
  { id: 'matcha-series', name: 'Matcha Series', slug: 'matcha-series', groupId: 'nak-lain', displayOrder: 4, status: 'published' },
];

export const menuItems: Omit<MenuItem, 'createdAt' | 'updatedAt'>[] = [
  { id: 'darjat-caramel', name: 'Darjat Caramel', slug: 'darjat-caramel', description: 'Our signature blend with a sweet caramel twist.', price: 6.00, imageUrl: 'https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg', categoryId: 'darjat-series', isGeneral: true, status: 'published', isPopular: true, displayOrder: 1 },
  { id: 'darjat-borneo', name: 'Darjat Borneo', slug: 'darjat-borneo', description: 'A taste of Borneo with rich Gula Apong.', price: 6.00, imageUrl: 'https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg', categoryId: 'darjat-series', isGeneral: true, status: 'published', isPopular: true, displayOrder: 2 },
  { id: 'kopi-darjat', name: 'Kopi Darjat', slug: 'kopi-darjat', description: 'The original classic Kopi Dua Darjat.', price: 5.00, imageUrl: 'https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg', categoryId: 'kopi-series', isGeneral: true, status: 'published', isPopular: false, displayOrder: 1 },
  { id: 'kopi-o', name: 'Kopi O', slug: 'kopi-o', description: 'Classic black coffee, Malaysian style.', price: 3.00, imageUrl: 'https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg', categoryId: 'kopi-series', isGeneral: true, status: 'published', isPopular: false, displayOrder: 2 },
  { id: 'coklat-artisan', name: 'Coklat Artisan', slug: 'coklat-artisan', description: 'Rich, decadent chocolate for the soul.', price: 6.00, imageUrl: 'https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg', categoryId: 'coklat-series', isGeneral: true, status: 'published', isPopular: true, displayOrder: 1 },
  { id: 'matcha-latte', name: 'Matcha Latte', slug: 'matcha-latte', description: 'Earthy and creamy premium matcha latte.', price: 6.00, imageUrl: 'https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg', categoryId: 'matcha-series', isGeneral: true, status: 'published', isPopular: false, displayOrder: 1 },
];

export const promotions: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'status'>[] = [
    {
        title: "Weekday Kopi Kickstart",
        description: "Get your favorite Kopi Series drink for only RM4 every weekday morning.",
        discountType: 'flat',
        discountValue: 1, // Represents logic for special price, actual enforcement in code.
        customDiscountDescription: "RM4 for Kopi Series",
        startDate: Timestamp.fromDate(new Date('2024-01-01')),
        endDate: Timestamp.fromDate(new Date('2024-12-31')),
        menuItemIds: ['kopi-darjat', 'kopi-o'],
    }
]

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

export const blogSeedData: Omit<Blog, 'createdAt' | 'updatedAt'>[] = [
    {
        id: 'kopi-dua-darjat-story',
        title: "The Kopi Dua Darjat Story: From a Cart to a Community",
        slug: "kopi-dua-darjat-story",
        excerpt: "Discover the journey of Kopi Dua Darjat, from a humble street cart to a beloved national brand with over 50 outlets.",
        coverImage: { url: "https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg", alt: "A cup of Kopi Dua Darjat coffee" },
        author: { name: "Hadi & Azad", photo: "https://placehold.co/100x100" },
        category: "Brand Story",
        status: "published",
        isFeatured: true,
        content: "<h2>Our Humble Beginnings</h2><p>It all started with a dream and a single cart on the streets of Kuala Lumpur...</p>",
        publishedAt: Timestamp.fromDate(new Date('2024-05-10T12:00:00Z')),
        tags: ['brand', 'heritage', 'our story']
    },
    {
        id: 'art-of-kopi-kampung',
        title: "The Art of Kopi Kampung: More Than Just Coffee",
        slug: "art-of-kopi-kampung",
        excerpt: "We dive deep into the traditional methods and cultural significance of Malaysian Kopi Kampung, the heart of our brand.",
        coverImage: { url: "https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg", alt: "Traditional coffee brewing" },
        author: { name: "KDD Team" },
        category: "Coffee 101",
        status: "published",
        content: "<h3>The Perfect Brew</h3><p>Kopi Kampung is a unique brewing style that involves a 'sock' filter, giving it a distinctive robust flavor...</p>",
        publishedAt: Timestamp.fromDate(new Date('2024-05-15T12:00:00Z')),
        tags: ['kopi', 'culture', 'brewing']
    },
    {
        id: 'introducing-darjat-series',
        title: "Introducing the Darjat Series: Our Signature Creations",
        slug: "introducing-darjat-series",
        excerpt: "Meet our best-selling Darjat series, a perfect fusion of traditional flavors and modern artisan techniques.",
        coverImage: { url: "https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg", alt: "A lineup of Darjat Series drinks" },
        author: { name: "KDD Team" },
        category: "Product",
        status: "published",
        content: "<h4>Darjat Caramel</h4><p>Our most popular drink combines rich espresso with luscious caramel sauce...</p>",
        publishedAt: Timestamp.fromDate(new Date('2024-05-20T12:00:00Z')),
        tags: ['menu', 'signature', 'darjat series']
    },
    {
        id: 'franchise-success-story-ahmad',
        title: "Franchise Success: How Ahmad Grew His Outlet in Shah Alam",
        slug: "franchise-success-story-ahmad",
        excerpt: "Ahmad Faizal shares his journey from a new franchisee to a successful business owner in just a few months.",
        coverImage: { url: "https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg", alt: "Ahmad Faizal at his Kopi Dua Darjat stall" },
        author: { name: "Ahmad Faizal" },
        category: "Franchise",
        status: "published",
        content: "<p>\"I was nervous at first, but the support from the KDD team was amazing. The training gave me all the skills I needed...\"</p>",
        publishedAt: Timestamp.fromDate(new Date('2024-05-25T12:00:00Z')),
        tags: ['franchise', 'success story', 'entrepreneurship']
    },
     {
        id: 'behind-the-beans',
        title: "Behind the Beans: Our Commitment to Quality Sourcing",
        slug: "behind-the-beans",
        excerpt: "Learn about how we select our coffee beans and our commitment to ethical and sustainable sourcing practices.",
        coverImage: { url: "https://cdn.pixabay.com/photo/2020/03/20/20/48/coffe-4951982_1280.jpg", alt: "Hands holding fresh coffee beans" },
        author: { name: "Hadi", photo: "https://placehold.co/100x100" },
        category: "Coffee 101",
        status: "draft",
        content: "<p>Quality starts at the source. That's why we partner directly with local farmers...</p>",
        publishedAt: Timestamp.fromDate(new Date('2024-06-01T12:00:00Z')),
        tags: ['sourcing', 'quality', 'sustainability']
    }
];

export const testimonialSeedData: Omit<Testimonial, 'id' | 'createdAt'>[] = [
  { outletId: "kajang-prima", quote: "The brand recognition is incredible. Customers love the coffee, and my outlet has been profitable since month one.", name: "Siti Nurhaliza", designation: "Franchisee, Kajang", image: "testimonial-2" },
  { outletId: "putrajaya-ayer8", quote: "I always wanted to own a café. Kopi Dua Darjat made that dream a reality with a low-cost, high-return model.", name: "Ravi Chandran", designation: "Franchisee, Putrajaya", image: "testimonial-3" },
  { outletId: "shah-alam", quote: "I started my stall in Shah Alam — sold out every morning within 2 weeks! The training and marketing support made everything easy.", name: "Ahmad Faizal", designation: "Franchisee, Shah Alam", image: "testimonial-1" },
  { outletId: "jb-city-square", quote: "A must-visit when I cross the border. It's the authentic Malaysian taste I miss.", name: "David Chen", designation: "Visitor, Singapore", image: "testimonial-3" },
  { outletId: "georgetown", quote: "Perfect companion for a walk around historical Georgetown. The Coklat Artisan is my kid's favorite.", name: "Emily T.", designation: "Tourist, Australia", image: "testimonial-2" },
  { outletId: "kota-kinabalu", quote: "The view is great, but the coffee is even better. Love this place!", name: "Jackson R.", designation: "Local Resident, KK", image: "testimonial-1" }
]

    
