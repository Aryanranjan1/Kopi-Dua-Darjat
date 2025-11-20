
'use client';

import { useForm } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import slugify from 'slugify';
import { useEffect } from 'react';
import { getLocalized } from '@/lib/utils';

interface PostFormProps {
  post?: Blog;
  onSuccess: (postId: string) => void;
}

const formSchema = z.object({
  slug: z.string().min(3, 'Slug is required.'),
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
  isFeatured: z.boolean().default(false),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }),
  translations: z.object({
    en: z.object({
      title: z.string().min(3, 'English title is required.'),
      excerpt: z.string().min(10, 'English excerpt is required.'),
      content: z.string().min(10, 'English content cannot be empty.'),
    }),
    ms: z.object({
      title: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
    }),
  }),
});


type FormValues = z.infer<typeof formSchema>;

export default function PostForm({ post, onSuccess }: PostFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: post ? {
        slug: post.slug,
        coverImage: {
          url: post.coverImage.url || '',
          alt: post.coverImage.alt || '',
          caption: post.coverImage.caption || '',
        },
        author: { 
          name: post.author.name || '',
          photo: post.author.photo || '', 
          bio: post.author.bio || '' 
        },
        tags: post.tags?.join(', ') || '',
        category: post.category,
        status: post.status,
        isFeatured: post.isFeatured || false,
        seo: {
            title: post.seo?.title || '',
            description: post.seo?.description || '',
            keywords: post.seo?.keywords ? (Array.isArray(post.seo.keywords) ? post.seo.keywords.join(', ') : post.seo.keywords) : '',
        },
        translations: {
          en: getLocalized(post, 'en'),
          ms: getLocalized(post, 'ms'),
        }
    } : {
        slug: '',
        coverImage: { url: '', alt: '', caption: '' },
        author: { name: 'Admin', photo: '', bio: '' },
        tags: '',
        category: '',
        status: 'draft',
        isFeatured: false,
        seo: { title: '', description: '', keywords: '' },
        translations: { en: { title: '', excerpt: '', content: '' }, ms: { title: '', excerpt: '', content: '' } },
    }
  });

  const { isSubmitting, watch, setValue } = form;
  const watchedTitle = watch('translations.en.title');

  useEffect(() => {
    if (watchedTitle && !form.formState.dirtyFields.slug) {
      const newSlug = slugify(watchedTitle, { lower: true, strict: true });
      setValue('slug', newSlug);
    }
  }, [watchedTitle, setValue, form.formState.dirtyFields.slug]);
  
  const handleCopyToMalay = () => {
    const en = form.getValues('translations.en');
    form.setValue('translations.ms', en);
    toast({ title: "Content Copied", description: "English content has been copied to the Malay fields." });
  }

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

      const docId = post ? post.id : values.slug;
      const postRef = doc(firestore, 'blogs', docId);

      if (post) {
        await setDoc(postRef, dataToSave, { merge: true });
        toast({ title: 'Post Updated', description: `"${values.translations.en.title}" has been saved.` });
        onSuccess(docId);
      } else {
        await setDoc(postRef, {
          ...dataToSave,
          createdAt: serverTimestamp(),
          views: 0,
          likes: 0,
        }, { merge: true }); 
        toast({ title: 'Post Created', description: `"${values.translations.en.title}" has been saved.` });
        onSuccess(docId);
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
                <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Fill in the content for both languages.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <h3 className="font-medium text-lg text-zinc-300">English (EN)</h3>
                           <FormField control={form.control} name="translations.en.title" render={({ field }) => (
                               <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Awesome Post Title" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                           )} />
                           <FormField control={form.control} name="translations.en.excerpt" render={({ field }) => (
                               <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea placeholder="Short summary..." {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                           )} />
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                             <h3 className="font-medium text-lg text-zinc-300">Malay (MS)</h3>
                             <Button type="button" size="sm" onClick={handleCopyToMalay} className="bg-primary text-primary-foreground border border-black hover:bg-primary">Copy from EN</Button>
                           </div>
                           <FormField control={form.control} name="translations.ms.title" render={({ field }) => (
                               <FormItem><FormLabel>Tajuk</FormLabel><FormControl><Input placeholder="Tajuk Hebat" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                           )} />
                           <FormField control={form.control} name="translations.ms.excerpt" render={({ field }) => (
                               <FormItem><FormLabel>Petikan</FormLabel><FormControl><Textarea placeholder="Ringkasan pendek..." {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                           )} />
                        </div>
                    </div>
                     <FormField control={form.control} name="translations.en.content" render={({ field }) => (
                        <FormItem><FormLabel>Content (EN)</FormLabel><FormControl><Textarea placeholder="Start writing the English post..." {...field} value={field.value || ''} className={inputStyles} rows={15} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="translations.ms.content" render={({ field }) => (
                        <FormItem><FormLabel>Kandungan (MS)</FormLabel><FormControl><Textarea placeholder="Mula menulis post dalam Bahasa Melayu..." {...field} value={field.value || ''} className={inputStyles} rows={15} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>SEO & Metadata</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="seo.title" render={({ field }) => (
                        <FormItem><FormLabel>SEO Title</FormLabel><FormControl><Input placeholder="Custom title for search engines" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormDescription>If empty, the post title will be used.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seo.description" render={({ field }) => (
                        <FormItem><FormLabel>SEO Description</FormLabel><FormControl><Textarea placeholder="Custom description for search engines" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormDescription>If empty, the excerpt will be used.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seo.keywords" render={({ field }) => (
                        <FormItem><FormLabel>Keywords</FormLabel><FormControl><Input placeholder="coffee, kopi, franchise" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormDescription>Comma-separated keywords.</FormDescription><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>Publishing</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="isFeatured" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Feature Post</FormLabel>
                                <FormDescription>Mark this post to be featured.</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )} />
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
                        <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="coffee, story, tips" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormDescription>Comma-separated tags.</FormDescription><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>Cover Image</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="coverImage.url" render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="coverImage.alt" render={({ field }) => (
                        <FormItem><FormLabel>Alt Text</FormLabel><FormControl><Input placeholder="Descriptive text for accessibility" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="coverImage.caption" render={({ field }) => (
                        <FormItem><FormLabel>Caption</FormLabel><FormControl><Input placeholder="Optional image caption" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

             <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>Author</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="author.name" render={({ field }) => (
                        <FormItem><FormLabel>Author Name</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="author.photo" render={({ field }) => (
                        <FormItem><FormLabel>Author Photo URL</FormLabel><FormControl><Input type="url" placeholder="https://..." value={field.value || ''} onChange={field.onChange} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="author.bio" render={({ field }) => (
                        <FormItem><FormLabel>Author Bio</FormLabel><FormControl><Textarea placeholder="A short bio about the author" value={field.value || ''} onChange={field.onChange} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

          </div>
        </div>
      </form>
    </Form>
  );
}
