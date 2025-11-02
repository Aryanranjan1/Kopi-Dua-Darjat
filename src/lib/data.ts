
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
    // Selangor
    { id: '1', name: 'Kajang Prima', slug: 'kajang-prima', address: '123 Jalan Prima, Kajang', city: 'Selangor', lat: 2.9935, lng: 101.7874, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '2', name: 'Bandar Baru Bangi', slug: 'bangi', address: '456 Seksyen 9, Bangi', city: 'Selangor', lat: 2.9555, lng: 101.7616, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '3', name: 'Shah Alam', slug: 'shah-alam', address: '789 Seksyen 7, Shah Alam', city: 'Selangor', lat: 3.0738, lng: 101.5183, hours: '8 AM - 11 PM', isOpenNow: true },
    { id: '4', name: 'Puchong Perdana', slug: 'puchong', address: '101 Jalan Perdana, Puchong', city: 'Selangor', lat: 3.008, lng: 101.613, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '5', name: 'Subang Jaya', slug: 'subang-jaya', address: '212 Jalan SS15/4, Subang Jaya', city: 'Selangor', lat: 3.076, lng: 101.587, hours: '9 AM - 11 PM', isOpenNow: true },
    { id: '6', name: 'Damansara Utama', slug: 'damansara', address: '333 Jalan SS21/37, Damansara Utama', city: 'Selangor', lat: 3.136, lng: 101.621, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '7', name: 'Ampang', slug: 'ampang', address: '444 Jalan Ampang, Ampang', city: 'Selangor', lat: 3.15, lng: 101.75, hours: '8 AM - 10 PM', isOpenNow: false },
    { id: '8', name: 'Klang', slug: 'klang', address: '555 Jalan Meru, Klang', city: 'Selangor', lat: 3.045, lng: 101.44, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '9', name: 'Gombak', slug: 'gombak', address: '666 Jalan Gombak, Gombak', city: 'Selangor', lat: 3.23, lng: 101.7, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '10', name: 'Cheras', slug: 'cheras-selangor', address: '777 Jalan Cheras, Cheras', city: 'Selangor', lat: 3.09, lng: 101.74, hours: '8 AM - 10 PM', isOpenNow: true },
    
    // Kuala Lumpur
    { id: '11', name: 'Bukit Bintang', slug: 'bukit-bintang', address: '888 Jalan Bukit Bintang', city: 'Kuala Lumpur', lat: 3.146, lng: 101.71, hours: '10 AM - 12 AM', isOpenNow: true },
    { id: '12', name: 'KL Sentral', slug: 'kl-sentral', address: '999 Jalan Stesen Sentral, KL Sentral', city: 'Kuala Lumpur', lat: 3.134, lng: 101.686, hours: '7 AM - 10 PM', isOpenNow: true },
    { id: '13', name: 'Mont Kiara', slug: 'mont-kiara', address: '111 Jalan Kiara, Mont Kiara', city: 'Kuala Lumpur', lat: 3.165, lng: 101.65, hours: '9 AM - 10 PM', isOpenNow: true },
    { id: '14', name: 'TTDI', slug: 'ttdi', address: '222 Lorong Rahim Kajai, TTDI', city: 'Kuala Lumpur', lat: 3.14, lng: 101.63, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '15', name: 'Wangsa Maju', slug: 'wangsa-maju', address: '333 Jalan Wangsa Delima, Wangsa Maju', city: 'Kuala Lumpur', lat: 3.205, lng: 101.74, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '16', name: 'Setapak', slug: 'setapak', address: '444 Jalan Genting Klang, Setapak', city: 'Kuala Lumpur', lat: 3.19, lng: 101.71, hours: '8 AM - 10 PM', isOpenNow: true },

    // Putrajaya
    { id: '17', name: 'Presint 15', slug: 'putrajaya-p15', address: '789 Jalan Diplomatik, Presint 15', city: 'Putrajaya', lat: 2.9264, lng: 101.6964, hours: '9 AM - 9 PM', isOpenNow: false },
    { id: '18', name: 'Ayer@8', slug: 'putrajaya-ayer8', address: 'Jalan P8, Presint 8', city: 'Putrajaya', lat: 2.93, lng: 101.67, hours: '10 AM - 10 PM', isOpenNow: true },

    // Johor
    { id: '19', name: 'Johor Bahru City Square', slug: 'jb-city-square', address: '106-108 Jalan Wong Ah Fook, Johor Bahru', city: 'Johor', lat: 1.46, lng: 103.76, hours: '10 AM - 10 PM', isOpenNow: true },
    { id: '20', name: 'Taman Mount Austin', slug: 'mount-austin', address: 'Jalan Austin Heights 8/5, Taman Mount Austin', city: 'Johor', lat: 1.56, lng: 103.77, hours: '9 AM - 11 PM', isOpenNow: true },
    { id: '21', name: 'Kluang', slug: 'kluang', address: 'Jalan Lambak, Kluang', city: 'Johor', lat: 2.03, lng: 103.32, hours: '8 AM - 9 PM', isOpenNow: true },
    { id: '22', name: 'Batu Pahat', slug: 'batu-pahat', address: 'Jalan Rahmat, Batu Pahat', city: 'Johor', lat: 1.85, lng: 102.93, hours: '8 AM - 9 PM', isOpenNow: true },
    { id: '23', name: 'Muar', slug: 'muar', address: 'Jalan Sisi, Muar', city: 'Johor', lat: 2.05, lng: 102.57, hours: '8 AM - 9 PM', isOpenNow: true },
    { id: '24', name: 'Skudai', slug: 'skudai', address: 'Jalan Laksamana, Skudai', city: 'Johor', lat: 1.54, lng: 103.66, hours: '8 AM - 10 PM', isOpenNow: false },

    // Penang
    { id: '25', name: 'Georgetown', slug: 'georgetown', address: '25 Lebuh Campbell, Georgetown', city: 'Penang', lat: 5.419, lng: 100.33, hours: '9 AM - 10 PM', isOpenNow: true },
    { id: '26', name: 'Bayan Lepas', slug: 'bayan-lepas', address: 'Jalan Mayang Pasir, Bayan Lepas', city: 'Penang', lat: 5.32, lng: 100.28, hours: '8 AM - 10 PM', isOpenNow: true },
    { id: '27', name: 'Gurney Drive', slug: 'gurney-drive', address: 'Persiaran Gurney, Georgetown', city: 'Penang', lat: 5.43, lng: 100.31, hours: '10 AM - 11 PM', isOpenNow: true },
    { id: '28', name: 'Bukit Mertajam', slug: 'bukit-mertajam', address: 'Jalan Arumugam Pillai, Bukit Mertajam', city: 'Penang', lat: 5.36, lng: 100.45, hours: '8 AM - 9 PM', isOpenNow: true },
    { id: '29', name: 'Butterworth', slug: 'butterworth', address: 'Jalan Bagan Luar, Butterworth', city: 'Penang', lat: 5.39, lng: 100.36, hours: '8 AM - 9 PM', isOpenNow: true },
    { id: '30', name: 'Tanjung Tokong', slug: 'tanjung-tokong', address: 'Jalan Seri Tanjung Pinang', city: 'Penang', lat: 5.45, lng: 100.3, hours: '9 AM - 10 PM', isOpenNow: false },
    
    // Perak
    { id: '31', name: 'Ipoh Old Town', slug: 'ipoh-old-town', address: 'Jalan Panglima, Ipoh', city: 'Perak', lat: 4.59, lng: 101.07, hours: '9 AM - 9 PM', isOpenNow: true },
    { id: '32', name: 'Taiping', slug: 'taiping', address: 'Jalan Kota, Taiping', city: 'Perak', lat: 4.85, lng: 100.74, hours: '8 AM - 8 PM', isOpenNow: true },
    { id: '33', name: 'Teluk Intan', slug: 'teluk-intan', address: 'Jalan Ah Cheong, Teluk Intan', city: 'Perak', lat: 4.02, lng: 101.02, hours: '8 AM - 8 PM', isOpenNow: true },

    // Melaka
    { id: '34', name: 'Jonker Street', slug: 'jonker-street', address: 'Jalan Hang Jebat, Melaka', city: 'Melaka', lat: 2.19, lng: 102.24, hours: '10 AM - 10 PM', isOpenNow: true },
    { id: '35', name: 'Mahkota Parade', slug: 'mahkota-parade', address: 'Jalan Merdeka, Melaka', city: 'Melaka', lat: 2.18, lng: 102.25, hours: '10 AM - 10 PM', isOpenNow: true },

    // Negeri Sembilan
    { id: '36', name: 'Seremban', slug: 'seremban', address: 'Jalan Dato Bandar Tunggal, Seremban', city: 'Negeri Sembilan', lat: 2.72, lng: 101.94, hours: '9 AM - 9 PM', isOpenNow: true },
    { id: '37', name: 'Port Dickson', slug: 'port-dickson', address: 'Jalan Pantai, Port Dickson', city: 'Negeri Sembilan', lat: 2.52, lng: 101.79, hours: '10 AM - 9 PM', isOpenNow: false },

    // Pahang
    { id: '38', name: 'Kuantan', slug: 'kuantan', address: 'Jalan Mahkota, Kuantan', city: 'Pahang', lat: 3.81, lng: 103.32, hours: '9 AM - 10 PM', isOpenNow: true },
    { id: '39', name: 'Genting Highlands', slug: 'genting', address: 'Genting Highlands', city: 'Pahang', lat: 3.42, lng: 101.79, hours: '10 AM - 12 AM', isOpenNow: true },

    // Terengganu
    { id: '40', name: 'Kuala Terengganu', slug: 'kuala-terengganu', address: 'Jalan Sultan Zainal Abidin, Kuala Terengganu', city: 'Terengganu', lat: 5.33, lng: 103.13, hours: '9 AM - 10 PM', isOpenNow: true },

    // Kelantan
    { id: '41', name: 'Kota Bharu', slug: 'kota-bharu', address: 'Jalan Pintu Pong, Kota Bharu', city: 'Kelantan', lat: 6.13, lng: 102.23, hours: '9 AM - 10 PM', isOpenNow: true },

    // Kedah
    { id: '42', name: 'Alor Setar', slug: 'alor-setar', address: 'Jalan Langgar, Alor Setar', city: 'Kedah', lat: 6.12, lng: 100.36, hours: '9 AM - 9 PM', isOpenNow: true },
    { id: '43', name: 'Langkawi', slug: 'langkawi', address: 'Pantai Cenang, Langkawi', city: 'Kedah', lat: 6.29, lng: 99.72, hours: '10 AM - 10 PM', isOpenNow: true },

    // Perlis
    { id: '44', name: 'Kangar', slug: 'kangar', address: 'Jalan Penjara, Kangar', city: 'Perlis', lat: 6.44, lng: 100.19, hours: '9 AM - 9 PM', isOpenNow: false },

    // Sabah
    { id: '45', name: 'Kota Kinabalu', slug: 'kota-kinabalu', address: 'Jalan Gaya, Kota Kinabalu', city: 'Sabah', lat: 5.98, lng: 116.07, hours: '9 AM - 10 PM', isOpenNow: true },
    { id: '46', name: 'Sandakan', slug: 'sandakan', address: 'Jalan Pelabuhan, Sandakan', city: 'Sabah', lat: 5.84, lng: 118.11, hours: '8 AM - 8 PM', isOpenNow: true },
    { id: '47', name: 'Tawau', slug: 'tawau', address: 'Jalan Kuhara, Tawau', city: 'Sabah', lat: 4.24, lng: 117.88, hours: '8 AM - 8 PM', isOpenNow: true },

    // Sarawak
    { id: '48', name: 'Kuching', slug: 'kuching', address: 'Jalan Main Bazaar, Kuching', city: 'Sarawak', lat: 1.55, lng: 110.34, hours: '9 AM - 10 PM', isOpenNow: true },
    { id: '49', name: 'Miri', slug: 'miri', address: 'Jalan North Yu Seng, Miri', city: 'Sarawak', lat: 4.41, lng: 114.0, hours: '9 AM - 10 PM', isOpenNow: true },
    { id: '50', name: 'Sibu', slug: 'sibu', address: 'Jalan Channel, Sibu', city: 'Sarawak', lat: 2.29, lng: 111.82, hours: '8 AM - 9 PM', isOpenNow: false },
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
      content: `
        <p>This is the main body of the article, designed to be flexible for a CMS. It can contain various HTML elements that will be styled by the 'prose' classes.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
        <h3>A Subheading for a New Section</h3>
        <p>You can structure your content with headings, paragraphs, and lists to create a readable and engaging article. Here is an example of an unordered list:</p>
        <ul>
          <li>Item one: High-quality, locally sourced beans.</li>
          <li>Item two: Traditional brewing methods with a modern twist.</li>
          <li>Item three: A commitment to community and affordability.</li>
        </ul>
        <figure>
            <img src="https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydHxlbnwwfHx8fDE3NjE4OTcwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Latte art" class="rounded-lg shadow-md" />
            <figcaption>The 'prose' classes will even style image captions nicely.</figcaption>
        </figure>
        <p>And here's an ordered list:</p>
        <ol>
            <li>Apply for a franchise.</li>
            <li>Complete our training program.</li>
            <li>Launch your own Kopi Dua Darjat stall!</li>
        </ol>
        <blockquote>
            <p>"This is a blockquote. It's a great way to highlight a key point or a quote from someone relevant to the article."</p>
        </blockquote>
        <p>Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam.</p>
      `,
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

// Mock data for admin panel
export const mockMessages = [
  { id: 'msg001', name: 'Ahmad Zaki', email: 'ahmad.z@email.com', subject: 'Partnership Inquiry', message: 'Hello, I represent a local community event and would love to partner with Kopi Dua Darjat.', read: false },
  { id: 'msg002', name: 'Chloe Chen', email: 'chloe.chen@email.com', subject: 'Feedback on new drink', message: 'The new Borneo Latté is amazing! Please make it a permanent item.', read: true },
  { id: 'msg003', name: 'Ravi Pillai', email: 'ravi.p@email.com', subject: 'Question about outlet hours', message: 'Hi, are you open on public holidays? Specifically the one in Subang Jaya.', read: false },
];

export const mockFranchiseLeads = [
  { id: 'fl001', name: 'Siti Aisyah', email: 'siti@email.com', city: 'Kuala Lumpur', budget: 'RM50,000 - RM100,000', message: 'Very interested in opening an outlet in Bangsar.', read: false },
  { id: 'fl002', name: 'Tan Wei Ling', email: 'tan.wl@email.com', city: 'Penang', budget: 'Above RM100,000', message: 'I have a great location in Georgetown.', read: true },
  { id: 'fl003', name: 'Kumar Ramasamy', email: 'kumar.r@email.com', city: 'Johor Bahru', budget: 'RM25,000 - RM50,000', message: 'Looking for opportunities in the city center.', read: false },
];

export const mockNewsletterSignups = [
  { id: 'nl001', email: 'subscriber1@email.com', date: '2023-10-26' },
  { id: 'nl002', email: 'subscriber2@email.com', date: '2023-10-25' },
  { id: 'nl003', email: 'subscriber3@email.com', date: '2023-10-24' },
  { id: 'nl004', email: 'subscriber4@email.com', date: '2023-10-23' },
  { id: 'nl005', email: 'subscriber5@email.com', date: '2023-10-22' },
];
