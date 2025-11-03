

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

// This type is deprecated and will be removed after migration.
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

// New Data Models for Firestore-backed CMS

export type Media = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export type MenuGroup = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  status: 'draft' | 'published';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  groupId: string;
  displayOrder: number;
  status: 'draft' | 'published';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
};

export type MenuItem = {
  id: string;
  name:string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  promotionIds?: string[];
  outletIds?: string[];
  isGeneral: boolean;
  status: 'draft' | 'published';
  isPopular: boolean;
  tags?: string[]; // For 'featured', 'new', etc.
  displayOrder: number;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
};

export type DailySpecial = {
  id: string;
  menuItemId: string;
  addedAt: any; // Firestore Timestamp
};


export type Promotion = {
  id: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'flat' | 'bogo' | 'custom';
  discountValue: number;
  customDiscountDescription?: string;
  startDate: any; // Firestore Timestamp
  endDate: any; // Firestore Timestamp
  menuItemIds?: string[];
  outletIds?: string[];
  bannerImage?: string;
  status: 'active' | 'scheduled' | 'expired';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
};

export type Outlet = {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  hours: string;
  isOpenNow: boolean; // Retaining for now, can be computed if needed
  // New fields from brief
  state?: string;
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive';
  createdAt?: any;
  updatedAt?: any;
};

// --- BLOG ---

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: {
    url: string;
    alt: string;
    caption?: string;
  };
  author: {
    name: string;
    photo?: string;
    bio?: string;
  };
  tags?: string[];
  category: string;
  status: 'published' | 'draft';
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    metaImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  content: string; // Storing as Markdown/HTML string for simplicity
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  publishedAt?: any; // Firestore Timestamp
  views?: number;
  likes?: number;
};


// Old blog type, to be replaced by the one above
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
  id: '1' | '2' | '3';
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

// Types for form submissions in Firestore
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any; // Firestore Timestamp
};

export type FranchiseApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  budget: string;
  message: string;
  createdAt: any; // Firestore Timestamp
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  createdAt: any; // Firestore Timestamp
};
