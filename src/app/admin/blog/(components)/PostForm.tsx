
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import slugify from 'slugify';
import { useEffect } from 'react';

interface PostFormProps {
  post?: Blog;
  onSuccess: (postId: string) => void;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  slug: z.string().min(3, 'Slug is required.'),
  excerpt: z.string().min(10, 'Excerpt is required.'),
  coverImage: z.object({
    url: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
    alt: z.string().optional(),
    caption: z.string().optional(),
  }),
  author: z.object({
    name: z.string().min(2, 'Author name is required.'),
    photo: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
    bio: z.string().optional(),
  }),
  tags: z.string().optional(),
  category: z.string().min(2, 'Category is required.'),
  status: z.enum(['draft', 'published']),
  content: z.string().min(10, 'Content cannot be empty.'),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostForm({ post, onSuccess }: PostFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: post ? {
        ...post,
        tags: post.tags?.join(', '),
        status: post.status as 'draft' | 'published',
        seo: {
            title: post.seo?.title || '',
            description: post.seo?.description || '',
            keywords: post.seo?.keywords?.join(', '),
        },
    } : {
      title: '',
      slug: '',
      excerpt: '',
      coverImage: { url: '', alt: '', caption: '' },
      author: { name: '', photo: '', bio: '' },
      tags: '',
      category: '',
      status: 'draft',
      content: '',
      seo: { title: '', description: '', keywords: '' },
    },
  });

  const { isSubmitting, watch, setValue } = form;
  const watchedTitle = watch('title');

  useEffect(() => {
    if (watchedTitle && !form.getValues('slug')) { // Only auto-slug if slug is empty
      const newSlug = slugify(watchedTitle, { lower: true, strict: true });
      setValue('slug', newSlug);
    }
  }, [watchedTitle, setValue, form]);

  const onSubmit = async (values: FormValues) => {
    if (!firestore) return;

    try {
      const isPublished = values.status === 'published';
      const dataToSave = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        seo: {
            ...values.seo,
            keywords: values.seo.keywords ? values.seo.keywords.split(',').map(kw => kw.trim()) : [],
        },
        updatedAt: serverTimestamp(),
        ...(isPublished && !post?.publishedAt && { publishedAt: serverTimestamp() }),
      };

      if (post) {
        const postRef = doc(firestore, 'blogs', post.id);
        await setDoc(postRef, dataToSave, { merge: true });
        toast({ title: 'Post Updated', description: `"${values.title}" has been saved.` });
        onSuccess(post.id);
      } else {
        const docRef = await addDoc(collection(firestore, 'blogs'), {
          ...dataToSave,
          createdAt: serverTimestamp(),
          views: 0,
          likes: 0,
        });
        toast({ title: 'Post Created', description: `"${values.title}" has been saved.` });
        onSuccess(docRef.id);
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>Main Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Your Awesome Post Title" {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="excerpt" render={({ field }) => (
                        <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea placeholder="A short summary of your post..." {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="content" render={({ field }) => (
                        <FormItem><FormLabel>Body</FormLabel><FormControl><Textarea placeholder="Start writing your post here. You can use Markdown for formatting." {...field} className={inputStyles} rows={20} /></FormControl><FormDescription>Full rich-text editor coming soon. For now, Markdown is supported.</FormDescription><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>SEO & Metadata</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="seo.title" render={({ field }) => (
                        <FormItem><FormLabel>SEO Title</FormLabel><FormControl><Input placeholder="Custom title for search engines" {...field} className={inputStyles} /></FormControl><FormDescription>If empty, the post title will be used.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seo.description" render={({ field }) => (
                        <FormItem><FormLabel>SEO Description</FormLabel><FormControl><Textarea placeholder="Custom description for search engines" {...field} className={inputStyles} /></FormControl><FormDescription>If empty, the excerpt will be used.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seo.keywords" render={({ field }) => (
                        <FormItem><FormLabel>Keywords</FormLabel><FormControl><Input placeholder="coffee, kopi, franchise" {...field} className={inputStyles} /></FormControl><FormDescription>Comma-separated keywords.</FormDescription><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>Publishing</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Publish</FormLabel>
                                <FormDescription>Make this post visible to the public.</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value === 'published'} onCheckedChange={(checked) => field.onChange(checked ? 'published' : 'draft')} />
                            </FormControl>
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {post ? 'Save Changes' : 'Create Post'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g. Behind The Cup" {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="tags" render={({ field }) => (
                        <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="coffee, story, tips" {...field} className={inputStyles} /></FormControl><FormDescription>Comma-separated tags.</FormDescription><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>Cover Image</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="coverImage.url" render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="coverImage.alt" render={({ field }) => (
                        <FormItem><FormLabel>Alt Text</FormLabel><FormControl><Input placeholder="Descriptive text for accessibility" {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="coverImage.caption" render={({ field }) => (
                        <FormItem><FormLabel>Caption</FormLabel><FormControl><Input placeholder="Optional image caption" {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

             <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>Author</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="author.name" render={({ field }) => (
                        <FormItem><FormLabel>Author Name</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="author.photo" render={({ field }) => (
                        <FormItem><FormLabel>Author Photo URL</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="author.bio" render={({ field }) => (
                        <FormItem><FormLabel>Author Bio</FormLabel><FormControl><Textarea placeholder="A short bio about the author" {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

          </div>
        </div>
      </form>
    </Form>
  );
}
