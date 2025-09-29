import Link from 'next/link';
import { Coffee, Facebook, Instagram, Twitter } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="flex items-center space-x-2 text-primary"
            >
              <Coffee className="h-8 w-8" />
              <span className="font-bold text-2xl font-headline">
                Kopi Dua Darjat
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Antara Warisan & Artisan. Experience the perfect blend of heritage and artisan coffee, crafted with passion and served with warmth.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">Our Story</Link></li>
              <li><Link href="/menu" className="text-muted-foreground hover:text-primary">Menu</Link></li>
              <li><Link href="/outlets" className="text-muted-foreground hover:text-primary">Outlets</Link></li>
              <li><Link href="/promotions" className="text-muted-foreground hover:text-primary">Promotions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">
              Opportunities
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/franchise" className="text-muted-foreground hover:text-primary">Franchise</Link></li>
              <li><Link href="/franchise/apply" className="text-muted-foreground hover:text-primary">Apply Now</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Kopi Dua Darjat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
