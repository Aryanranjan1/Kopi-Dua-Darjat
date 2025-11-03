
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import PostForm from '../../(components)/PostForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const router = useRouter();

  const isNew = id === 'new';
  
  const postRef = useMemoFirebase(
    () => (firestore && !isNew) ? doc(collection(firestore, 'blogs'), id as string) : null,
    [firestore, isNew, id]
  );
  
  const { data: post, isLoading } = useDoc<Blog>(postRef);

  const handleSuccess = (postId: string) => {
    router.push(`/admin/blog/edit/${postId}`);
    router.refresh();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="outline" className="mb-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white">
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Posts
          </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-white">
          {isNew ? 'Create New Post' : 'Edit Post'}
        </h1>
      </div>

      {(isLoading && !isNew) ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <PostForm post={post || undefined} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
