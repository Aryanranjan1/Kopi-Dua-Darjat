
export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

// The existing Drink type, will be phased out in favor of MenuItem
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

export type MenuGroup = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
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
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  startDate: any; // Firestore Timestamp
  endDate: any; // Firestore Timestamp
  menuItemIds?: string[];
  outletIds?: string[];
  status: 'active' | 'expired';
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
