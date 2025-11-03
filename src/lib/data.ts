
import type { Outlet, BlogPost, Testimonial, FaqItem } from './types';

// This file now contains only data that is not part of the main CMS.
// Menu items, categories, and promotions are now fetched from Firestore.

export const outlets: Omit<Outlet, 'id' | 'createdAt' | 'updatedAt'>[] = [
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

type DessertSeed = { name: string; slug: string; price: number; image: string; description: string; category: string; };
export const allDesserts: DessertSeed[] = [
    { name: 'Kek Batik Indulgence', slug: 'kek-batik-indulgence', price: 8, image: '/image/dessert1.png', description: 'Classic Malaysian layered cake with a chocolatey twist.', category: 'Desserts'},
    { name: 'Pandan Gula Melaka Cake', slug: 'pandan-gula-melaka-cake', price: 12, image: '/image/dessert2.png', description: 'Soft pandan sponge with rich palm sugar frosting.', category: 'Desserts'},
    { name: 'Signature Brownie', slug: 'signature-brownie', price: 9, image: '/image/dessert3.png', description: 'Fudgy chocolate brownie served with a scoop of vanilla ice cream.', category: 'Desserts'},
    { name: 'Red Velvet Slice', slug: 'red-velvet-slice', price: 11, image: '/image/dessert4.png', description: 'Moist red velvet cake with a smooth cream cheese frosting.', category: 'Desserts'},
    { name: 'Carrot Walnut Cake', slug: 'carrot-walnut-cake', price: 11, image: '/image/dessert1.png', description: 'A classic spiced carrot cake with crunchy walnuts.', category: 'Desserts'},
    { name: 'Lemon Meringue Tart', slug: 'lemon-meringue-tart', price: 10, image: '/image/dessert2.png', description: 'Zesty lemon curd topped with fluffy toasted meringue.', category: 'Desserts'},
    { name: 'Chocolate Lava Cake', slug: 'chocolate-lava-cake', price: 13, image: '/image/dessert3.png', description: 'Warm chocolate cake with a molten center.', category: 'Desserts'},
    { name: 'Tiramisu Cup', slug: 'tiramisu-cup', price: 14, image: '/image/dessert4.png', description: 'Coffee-soaked ladyfingers with a light mascarpone cream.', category: 'Desserts'},
];
