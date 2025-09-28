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
};

export type Outlet = {
  id: string;
  name: string;
  slug: string;
  address: string;
  hours: string;
  city: string;
  isOpenNow: boolean;
};

export type Promotion = {
  id: string;
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
  publishDate: string;
  tags: string[];
};
