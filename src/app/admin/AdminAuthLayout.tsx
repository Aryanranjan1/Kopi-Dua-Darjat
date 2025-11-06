
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AdminSidebar from './(components)/AdminSidebar';
import AdminHeader from './(components)/AdminHeader';

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    
    if (!user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Render the layout immediately if there is a user, even if isUserLoading is true initially.
  // The onAuthStateChanged listener will handle redirects if the user state changes.
  if (user) {
      return (
        <div className="min-h-screen bg-zinc-900 text-white">
          <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
          <div className="lg:pl-64 transition-all duration-300">
            <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
            <main className="p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      );
  }

  // Fallback for the brief moment before the redirect happens when no user is found.
  // Or show the children optimistically.
  return <>{children}</>;
}
