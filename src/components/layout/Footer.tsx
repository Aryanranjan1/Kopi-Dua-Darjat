import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Music2 } from 'lucide-react';
import InteractiveMap from '../home/InteractiveMap';
import { Card } from '../ui/card';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-primary text-2xl font-headline font-bold"
            >
              Kopi Dua Darjat
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
                <Music2 className="h-6 w-6" />
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
              <li><Link href="/faq" className="text-gray-400 hover:text-primary">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-white">
              Opportunities
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/franchise" className="text-gray-400 hover:text-primary">Franchise</Link></li>
              <li><Link href="/franchise/apply" className="text-gray-400 hover:text-primary">Apply</Link></li>
              <li><Link href="/news" className="text-gray-400 hover:text-primary">News</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1 flex items-center justify-center">
            <Image src="/image/1.svg" alt="Kopi Dua Darjat Logo" width={150} height={150} />
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Kopi Dua Darjat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
