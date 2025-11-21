
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';
import { seedBlogs } from '@/lib/seeder';

export default function BlogDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedBlogs = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsSeeding(true);
    toast({ title: 'Blog Seed Initiated...', description: 'Adding 15 sample blog posts to the database.', duration: 5000 });
    
    const result = await seedBlogs(firestore);
    
    if (result.success) {
      toast({ title: 'Success!', description: result.message, duration: 5000 });
    } else {
      toast({ variant: 'destructive', title: 'Blog Seed Failed', description: result.message, duration: 8000 });
      console.error("Blog Seed Error:", result.message);
    }
    setIsSeeding(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BookOpen /> Blog Post Seeder</CardTitle>
        <CardDescription className="text-zinc-400">
          Populate the 'blogs' collection with 15 multilingual sample posts. This is a non-destructive action and will not delete existing posts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSeedBlogs} className="w-full" disabled={isSeeding}>
            {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
            Seed Blog Posts
        </Button>
      </CardContent>
    </Card>
  );
}

    