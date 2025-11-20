
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AdminSidebar from './(components)/AdminSidebar';
import AdminHeader from './(components)/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Wait until loading is finished before checking for user
    if (isUserLoading) {
      return;
    }
    
    // If no user is logged in and the page is not the login page, redirect
    if (!user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, pathname, router]);

  // If the current route is the login page, just render its content
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // While loading auth state, or if there's no user (and we're not on login), show a loader
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated and not on login page, render the admin layout
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
