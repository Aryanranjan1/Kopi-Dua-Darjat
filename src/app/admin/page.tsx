
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// This page just acts as a redirector to the dashboard.
export default function AdminRootPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      // Wait until auth state is confirmed
      return;
    }
    if (!user) {
      router.replace('/admin/login');
    } else {
      router.replace('/admin/dashboard');
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
