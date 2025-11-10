
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { PublicInstaPost } from '@/lib/types';
import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SocialPostFormProps {
  post?: PublicInstaPost;
  onSuccess: () => void;
}

const formSchema = z.object({
  id: z.string().min(1, 'A unique ID is required.'),
  mediaUrl: z.string().url('Please enter a valid URL.'),
  mediaType: z.enum(['IMAGE', 'VIDEO']),
  username: z.string().min(1, 'Username is required.'),
  caption: z.string().optional(),
  permalink: z.string().url('Please enter a valid Instagram post URL.'),
  visible: z.boolean().default(true),
  pinned: z.boolean().default(false),
});

export default function SocialPostForm({ post, onSuccess }: SocialPostFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: post || {
      id: `manual_${Date.now()}`,
      mediaUrl: '',
      mediaType: 'IMAGE',
      username: 'kopiduadarjat',
      caption: '',
      permalink: '',
      visible: true,
      pinned: false,
    },
  });

  // Reset form if post prop changes
  useEffect(() => {
    if (post) {
      form.reset(post);
    } else {
      form.reset({
        id: `manual_${Date.now()}`,
        mediaUrl: '',
        mediaType: 'IMAGE',
        username: 'kopiduadarjat',
        caption: '',
        permalink: '',
        visible: true,
        pinned: false,
      });
    }
  }, [post, form]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;
    try {
      const docRef = doc(firestore, 'public_insta_feed', values.id);
      
      const dataToSave = {
        ...values,
        source: 'manual',
        timestamp: post?.timestamp || new Date().toISOString(),
        rank: post?.rank || Date.now(), // Use existing rank or new timestamp
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      toast({ title: `Post ${post ? 'Updated' : 'Created'}`, description: `Post ID: ${values.id} has been saved.` });
      onSuccess();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };
  
  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post ID</FormLabel>
                  <FormControl><Input {...field} className={inputStyles} readOnly={!!post} /></FormControl>
                  <FormDescription>A unique ID for the post. Cannot be changed after creation.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URL</FormLabel>
                  <FormControl><Input type="url" placeholder="https://..." {...field} className={inputStyles} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className={inputStyles}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permalink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Post URL (Permalink)</FormLabel>
                  <FormControl><Input type="url" placeholder="https://www.instagram.com/p/..." {...field} className={inputStyles} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input placeholder="@username" {...field} className={inputStyles} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl><Textarea placeholder="Post caption text..." {...field} className={inputStyles} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-8">
                <FormField control={form.control} name="visible" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel>Visible</FormLabel>
                    </FormItem>
                )} />
                <FormField control={form.control} name="pinned" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel>Pinned</FormLabel>
                    </FormItem>
                )} />
            </div>
          </div>
        </ScrollArea>


        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {post ? 'Save Changes' : 'Create Post'}
        </Button>
      </form>
    </Form>
  );
}
