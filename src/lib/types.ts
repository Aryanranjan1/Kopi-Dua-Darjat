export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type Drink = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  tags: string[];
  isFeatured: boolean;
  hasPromotion?: boolean;
  promotionDetails?: string;
};

export type Outlet = {
  id: string;
  name: string;
  slug: string;
  address: string;
  hours: string;
  city: string;
  lat: number;
  lng: number;
  isOpenNow: boolean;
};

export type Promotion = {
  id:string;
  title: string;
  description: string;
  expiry: string;
  image: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  publishDate: string; // Keep as string for display
  publishDateISO: string; // Add ISO string for sorting
  tags: string[];
  popularity: number; // Add for "Popular" sort
  content: string; // Added for rich text content
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  designation: string;
  image: string;
};

export type FaqItem = {
    id: string;
    category: 'General' | 'Product' | 'Franchise';
    question: string;
    answer: string;
};
