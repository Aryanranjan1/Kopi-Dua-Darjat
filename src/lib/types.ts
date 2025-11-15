

import { Timestamp } from "firebase/firestore";

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
  imageUrl?: string;
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
  id:string;
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

export type Review = {
  source: 'google' | 'manual';
  author_name: string;
  rating: number;
  text: string;
  time: number | Timestamp;
  attribution?: string;
  // Google specific fields
  profile_photo_url?: string;
  relative_time_description?: string;
  // Manual specific fields
  id?: string; // for managing manual reviews
}

export type ReviewDocument = {
  outletId: string;
  aggregate: {
    ratingValue: number;
    reviewCount: number;
  };
  reviews: Review[];
}


export type Outlet = {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  hours: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  placeId?: string; // Google Place ID
  rating?: number; // Google Rating
  reviewCount?: number;
  heroImage?: string;
  interiorImage?: string;
  tagline?: string;
  mapsLink?: string;
  googleMapsEmbedUrl?: string;
  whatsappLink?: string;
  chatbotEmbed?: string;
  isChatbotEnabled?: boolean;
  createdAt?: any;
  updatedAt?: any;
  // New review structure
  reviewsPath?: string;
  lastFetched?: any; // Firestore Timestamp
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
};

export type CommunityItem = {
    id: string;
    type: 'portrait' | 'logo' | 'quote';
    name: string;
    imageUrl: string;
    quote?: string;
    role?: string;
    bgColor?: string;
    textColor?: string;
    className: string;
    displayOrder: number;
}


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
  isFeatured?: boolean;
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
  id: string;
  quote: string;
  name: string;
  designation: string;
  image: string;
  company?: string;
  outletId?: string;
  rating?: number;
  createdAt?: any; // Firestore Timestamp
};

export type FaqItem = {
    id: string;
    category: 'General' | 'Product' | 'Franchise';
    question: string;
    answer: string;
};

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

export type Founder = {
  name: string;
  role: string;
  imageId: string;
  quote: string;
  contact: string;
};

export type SiteSettings = {
  id: 'main';
  brand: {
    name: string;
    faviconId: string;
    logoLightId: string;
    logoDarkId: string;
    tagline: string;
    primaryColor: string;
    accentColor: string;
  };
  founders: {
    name: string;
    role: string;
    imageId: string;
    quote: string;
    contact: string;
  }[];
  contact: {
    email: string;
    phone: string;
    address: string;
    googleMapsLink: string;
    businessHours: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    whatsapp: string;
  };
  automation: {
    newsletterIntegration: boolean;
    googleBusinessSync: boolean;
    autoBackup: boolean;
    appCheckEnforced: boolean;
  };
  meta: {
    defaultTitle: string;
    defaultDescription: string;
    defaultImageId: string;
    keywords?: string[];
  };
  lastUpdated: Timestamp;
  updatedBy: string;
};

export interface PublicInstaPost {
  id: string;
  username: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  timestamp: string; // ISO 8601
  likes?: number | null;
  comments?: number | null;
  visible: boolean;
  pinned: boolean;
  source: 'scraper' | 'manual' | 'graph';
  rank: number;
}

export interface InstagramSyncSettings {
    mode: 'scraper' | 'graph';
    active_tag: string;
    last_synced?: string | Timestamp;
    auto_sync_enabled: boolean;
    graph_access_token?: string | null;
    graph_account_id?: string | null;
}
