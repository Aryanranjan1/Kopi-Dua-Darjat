
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
import { useEffect, useState } from 'react';
import { useAdminLanguage } from '../../(components)/AdminLanguageContext';
import { getLocalized } from '@/lib/localization';


interface PostFormProps {
  post?: Blog;
  onSuccess: (postId: string) => void;
}

// Schema for the translatable part of the form
const translationSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  excerpt: z.string().min(10, 'Excerpt is required.'),
  content: z.string().min(10, 'Content cannot be empty.'),
});

// Main form schema including non-translated fields
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
  translations: translationSchema,
});


type FormValues = z.infer<typeof formSchema>;

export default function PostForm({ post, onSuccess }: PostFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { language } = useAdminLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // `values` is used to re-evaluate the form when `post` or `language` changes
    values: post ? {
        // Non-translated fields
        slug: post.slug,
        coverImage: post.coverImage,
        author: { ...post.author, photo: post.author.photo || '', bio: post.author.bio || '' },
        tags: post.tags?.join(', '),
        category: post.category,
        status: post.status,
        isFeatured: post.isFeatured || false,
        seo: {
            title: post.seo?.title || '',
            description: post.seo?.description || '',
            keywords: post.seo?.keywords?.join(', '),
        },
        // Translated fields
        translations: getLocalized(post, language, 'en'),
    } : {
        // Default values for a new post
        slug: '',
        coverImage: { url: '', alt: '', caption: '' },
        author: { name: '', photo: '', bio: '' },
        tags: '',
        category: '',
        status: 'draft',
        isFeatured: false,
        seo: { title: '', description: '', keywords: '' },
        translations: { title: '', excerpt: '', content: '' },
    }
  });

  const { isSubmitting, watch, setValue, getValues } = form;
  const watchedTitle = watch('translations.title');

  // Auto-generate slug from the title of the default language
  useEffect(() => {
    if (watchedTitle && !getValues('slug')) { 
      const newSlug = slugify(watchedTitle, { lower: true, strict: true });
      setValue('slug', newSlug);
    }
  }, [watchedTitle, setValue, getValues]);

  const handleCopyToLanguage = () => {
    if (!post) return;
    const englishContent = getLocalized(post, 'en');
    setValue('translations', englishContent);
    toast({ title: "Content Copied", description: "English content has been copied to the current form." });
  }

  const onSubmit = async (values: FormValues) => {
    if (!firestore) return;

    try {
      const isPublished = values.status === 'published';
      // Structure the data for saving, separating non-translated from translated
      const dataToSave = {
        // Non-translated fields
        slug: values.slug,
        coverImage: values.coverImage,
        author: values.author,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        category: values.category,
        status: values.status,
        isFeatured: values.isFeatured,
        seo: {
            ...values.seo,
            keywords: values.seo.keywords ? values.seo.keywords.split(',').map(kw => kw.trim()) : [],
        },
        // Translated fields are handled via the translations object
        [`translations.${language}`]: values.translations,
        updatedAt: serverTimestamp(),
        ...(isPublished && !post?.publishedAt && { publishedAt: serverTimestamp() }),
      };

      const docId = post ? post.id : values.slug;
      const postRef = doc(firestore, 'blogs', docId);

      if (post) {
        await setDoc(postRef, dataToSave, { merge: true });
        toast({ title: 'Post Updated', description: `"${values.translations.title}" has been saved.` });
        onSuccess(docId);
      } else {
        await setDoc(postRef, {
          ...dataToSave,
          createdAt: serverTimestamp(),
          views: 0,
          likes: 0,
        }, { merge: true }); // Use merge true to create or update
        toast({ title: 'Post Created', description: `"${values.translations.title}" has been saved.` });
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
                    <div className="flex justify-between items-center">
                        <CardTitle>Main Content ({language.toUpperCase()})</CardTitle>
                        {language !== 'en' && post && (
                            <Button type="button" variant="outline" size="sm" onClick={handleCopyToLanguage}>Copy from English</Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="translations.title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Your Awesome Post Title" {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="translations.excerpt" render={({ field }) => (
                        <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea placeholder="A short summary of your post..." {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="translations.content" render={({ field }) => (
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
