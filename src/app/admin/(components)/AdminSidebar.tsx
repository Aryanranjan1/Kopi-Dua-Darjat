'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Mail,
  Users,
  Coffee,
  Store,
  Tag,
  BookOpen,
  Image as ImageIcon,
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/messages', icon: Mail, label: 'Messages' },
  { href: '/admin/leads', icon: Users, label: 'Leads' },
  { href: '/admin/menu', icon: Coffee, label: 'Menu' },
  { href: '/admin/specials', icon: Sparkles, label: 'Daily Specials' },
  { href: '/admin/promotions', icon: Tag, label: 'Promotions' },
  { href: '/admin/outlets', icon: Store, label: 'Outlets' },
  { href: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { href: '/admin/media', icon: ImageIcon, label: 'Media Library' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();

  const NavLink = ({ href, icon: Icon, label }: typeof navItems[0]) => (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-300 transition-all hover:text-white hover:bg-zinc-700',
        pathname.startsWith(href) && href !== '/admin/dashboard' && 'bg-zinc-800 text-white',
        pathname === href && href === '/admin/dashboard' && 'bg-zinc-800 text-white'
      )}
      onClick={() => setIsOpen(false)}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );

  return (
    <>
      {/* Mobile Sheet Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/60 lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ease-in-out lg:translate-x-0',
          !isOpen && '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
          <Logo />
          <h1 className="text-xl font-headline font-semibold text-white">
            Admin Panel
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close Menu</span>
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink {...item} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
