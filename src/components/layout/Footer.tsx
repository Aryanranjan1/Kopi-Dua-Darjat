
import Link from 'next/link';
import { Coffee, Facebook, Instagram, Twitter } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const Icon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FECC0A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      <path d="M10 20.5c-3.3 0-6-2.2-6-5v-5c0-2.8 2.7-5 6-5h4c3.3 0 6 2.2 6 5v5c0 2.8-2.7 5-6 5h-4z" />
      <path d="M16 10.5h.5c1.4 0 2.5 1.1 2.5 2.5v1c0 1.4-1.1 2.5-2.5 2.5H16" />
      <path d="M7 2h8" />
    </svg>
  );

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="flex items-center space-x-2 text-primary"
            >
              <Icon />
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Antara Warisan & Artisan. Experience the perfect blend of heritage and artisan coffee, crafted with passion and served with warmth.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-primary">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary">Our Story</Link></li>
              <li><Link href="/menu" className="text-gray-400 hover:text-primary">Menu</Link></li>
              <li><Link href="/outlets" className="text-gray-400 hover:text-primary">Outlets</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-white">
              Opportunities
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/franchise" className="text-gray-400 hover:text-primary">Franchise</Link></li>
              <li><Link href="/news" className="text-gray-400 hover:text-primary">News</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-primary">FAQ</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Kopi Dua Darjat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
