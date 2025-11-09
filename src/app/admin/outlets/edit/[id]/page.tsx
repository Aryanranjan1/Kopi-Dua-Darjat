
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Outlet } from '@/lib/types';
import OutletForm from '../../(components)/OutletForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditOutletPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const router = useRouter();

  const isNew = id === 'new';

  const outletRef = useMemoFirebase(
    () => (firestore && !isNew) ? doc(firestore, 'outlets', id as string) : null,
    [firestore, isNew, id]
  );
  const { data: outlet, isLoading } = useDoc<Outlet>(outletRef);

  const handleSuccess = () => {
    // If it was a new outlet, redirect to its new edit page
    if (isNew) {
      // The slug would have been set in the form, need to get it from there.
      // For now, let's just go back to the list. A more robust solution might
      // pass the new slug back from the onSuccess callback.
      router.push('/admin/outlets');
    }
    router.refresh(); // Refresh data on the page
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" className="mb-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white">
        <Link href="/admin/outlets">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Outlets
        </Link>
      </Button>
      <h1 className="text-3xl font-headline font-bold text-white">
        {isNew ? 'Create New Outlet' : `Edit: ${outlet?.name || '...'}`}
      </h1>

      {(isLoading && !isNew) ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <OutletForm outlet={outlet || undefined} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
