
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
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
    router.push('/admin/outlets');
    router.refresh();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="outline" className="mb-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white">
          <Link href="/admin/outlets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Outlets
          </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-white">
          {isNew ? 'Create New Outlet' : 'Edit Outlet'}
        </h1>
         <p className="text-zinc-400 mt-1">
            {isNew ? 'Add a new outlet to the system.' : `Editing details for ${outlet?.name || '...'}`}
          </p>
      </div>

      {(isLoading && !isNew) ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <OutletForm outlet={outlet || undefined} onSuccess={handleSuccess} />
        </div>
      )}
    </div>
  );
}
