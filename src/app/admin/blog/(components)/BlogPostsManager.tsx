
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, PlusCircle, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAdminLanguage } from '../../(components)/AdminLanguageContext';
import { getLocalized } from '@/lib/localization';


export default function BlogPostsManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { language } = useAdminLanguage();
  
  const postsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'blogs'), orderBy('publishedAt', 'desc')) : null,
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<Blog>(postsQuery);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => {
      const localized = getLocalized(post, language, 'en');
      const matchesSearch = localized.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter, language]);

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'blogs', id));
      toast({ title: 'Success', description: 'Blog post deleted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete post: ${error.message}` });
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex-grow w-full flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-800 border-zinc-700 w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild className="w-full sm:w-auto flex-shrink-0">
          <Link href="/admin/blog/edit/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800/80">
            <TableHead>Cover</TableHead>
            <TableHead>Title ({language.toUpperCase()})</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={6} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoading && filteredPosts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-zinc-400 py-8">No posts found.</TableCell></TableRow>}
          {filteredPosts?.map(post => {
            const localized = getLocalized(post, language, 'en');
            return (
              <TableRow key={post.id} className="border-zinc-700 hover:bg-zinc-800/80">
                <TableCell>
                  <Image src={post.coverImage.url || 'https://placehold.co/100x100'} alt={post.coverImage.alt || localized.title || ''} width={40} height={40} className="rounded-md object-cover bg-zinc-700" />
                </TableCell>
                <TableCell className="font-medium">{localized.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={cn(
                    post.status === 'published' ? 'bg-green-600' : 'bg-zinc-600'
                  )}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {post.publishedAt ? format(post.publishedAt.toDate(), 'dd MMM yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon" disabled={post.status === 'draft'}>
                    <Link href={`/news/${post.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/blog/edit/${post.id}`}><Edit className="h-4 w-4" /></Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                      <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">This will permanently delete the post "{localized.title}".</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(post.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  );
}
