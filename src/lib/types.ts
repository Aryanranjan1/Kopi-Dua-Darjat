
import { Timestamp } from "firebase/firestore";

// --- CORE MULTILINGUAL TYPES ---
export type LangCode = 'en' | 'ms';

export const SUPPORTED_LANGUAGES: { code: LangCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ms', name: 'Bahasa Melayu' },
];

export const DEFAULT_LANGUAGE: LangCode = 'en';

/**
 * A generic interface for documents that have localized content.
 * @template T - The shape of the translatable fields.
 */
export interface Localized<T> {
  translations: Record<LangCode, Partial<T>>;
}

// --- App-Specific Types ---

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type Media = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

// --- MENU ---
export type MenuGroup = {
  id: string;
  displayOrder: number;
  slug: string;
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
} & Localized<{ name: string; }>;

export type MenuCategory = {
  id: string;
  groupId: string;
  displayOrder: number;
  slug: string;
  imageUrl?: string;
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
} & Localized<{ name: string; description?: string; }>;

export type MenuItem = {
  id: string;
  slug: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  promotionIds?: string[];
  outletIds?: string[];
  isGeneral: boolean;
  status: 'draft' | 'published';
  isPopular: boolean;
  tags?: string[];
  displayOrder: number;
  createdAt: any;
  updatedAt: any;
} & Localized<{ name: string; description: string; }>;

export type DailySpecial = {
  id: string;
  menuItemId: string;
  addedAt: any; // Firestore Timestamp
};

export type Promotion = {
  id: string;
  title: string;
  description?: string;
  customDiscountDescription?: string;
  discountType: 'percentage' | 'flat' | 'bogo' | 'custom';
  discountValue?: number;
  startDate: any; // Firestore Timestamp
  endDate: any; // Firestore Timestamp
  menuItemIds?: string[];
  outletIds?: string[];
  bannerImage?: string;
  status: 'active' | 'scheduled' | 'expired';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
};



// --- OUTLETS & REVIEWS ---

export type Review = {
  source: 'google' | 'manual';
  author_name: string;
  rating: number;
  time: number | Timestamp;
  attribution?: string;
  profile_photo_url?: string;
  relative_time_description?: string;
  id?: string;
} & Localized<{ text: string }>;


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
  slug: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  placeId?: string;
  rating?: number;
  reviewCount?: number;
  heroImage?: string;
  interiorImage?: string;
  cardImage?: string;
  mapsLink?: string;
  googleMapsEmbedUrl?: string;
  whatsappLink?: string;
  chatbotEmbed?: string;
  isChatbotEnabled?: boolean;
  socials?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
  createdAt?: any;
  updatedAt?: any;
  reviewsPath?: string;
  lastFetched?: any;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
} & Localized<{ name: string; address: string; city: string; state: string; hours: string; tagline?: string; }>;


export type CommunityItem = {
    id: string;
    type: 'portrait' | 'logo' | 'quote';
    imageUrl: string;
    bgColor?: string;
    textColor?: string;
    className: string;
    displayOrder: number;
} & Localized<{ name: string; quote?: string; role?: string; }>;


// --- BLOG ---

export type Blog = {
  id: string;
  slug: string;
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
  };
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  publishedAt?: any; // Firestore Timestamp
  views?: number;
  likes?: number;
} & Localized<{ title: string; content: string; excerpt: string; }>;


export type Testimonial = {
  id: string;
  image: string;
  company?: string;
  outletId?: string;
  rating?: number;
  createdAt?: any; // Firestore Timestamp
} & Localized<{ name: string; quote: string; designation: string; }>;


export type FaqItem = {
    id: string;
    category: 'General' | 'Product' | 'Franchise';
} & Localized<{ question: string; answer: string; }>;

// --- USER SUBMISSIONS ---
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

// --- GLOBAL SETTINGS ---
export type SiteSettings = {
  id: 'main';
  brand: {
    name: string;
    favicon: string; // SVG code
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
    instagramSyncEnabled?: boolean;
    instagramApiKey?: string;
    marketingEngineEnabled?: boolean;
    marketingApiKey?: string;
    analyticsEnabled?: boolean;
    analyticsApiKey?: string;
    appCheckEnforced?: boolean;
    recaptchaSiteKey?: string;
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

// --- SOCIAL ---
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
  layout?: {
    x: number;
    y: number;
    w: number;
    h: number;
  }
}

export interface InstagramSyncSettings {
    mode: 'scraper' | 'graph';
    active_tag: string;
    last_synced?: string | Timestamp;
    auto_sync_enabled: boolean;
    graph_access_token?: string | null;
    graph_account_id?: string | null;
}
