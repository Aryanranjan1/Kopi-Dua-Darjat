
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, query } from 'firebase/firestore';
import type { Testimonial, Media, Review } from '@/lib/types';
import { getLocalized } from '@/lib/utils';

interface TestimonialFormProps {
  testimonial?: Testimonial | Review;
  onSuccess: () => void;
  onSave?: (reviewData: Omit<Review, 'source' | 'time'> & { id?: string }) => void;
  onCancel?: () => void;
}

const formSchema = z.object({
  image: z.string().optional(),
  company: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  translations: z.object({
    en: z.object({
      name: z.string().min(2, 'English name is required.'),
      quote: z.string().optional(),
      designation: z.string().optional(),
      text: z.string().optional(),
    }),
    ms: z.object({
      name: z.string().optional(),
      quote: z.string().optional(),
      designation: z.string().optional(),
      text: z.string().optional(),
    }),
  }),
});


export default function TestimonialForm({ testimonial, onSuccess, onSave, onCancel }: TestimonialFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: media, isLoading: isLoadingMedia } = useCollection<Media>(useMemoFirebase(() => firestore ? query(collection(firestore, 'media')) : null, [firestore]));

  const isReview = testimonial && 'source' in testimonial;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: testimonial ? {
      image: 'image' in testimonial ? testimonial.image : '',
      company: 'company' in testimonial ? testimonial.company || '' : '',
      rating: testimonial.rating || 4,
      translations: {
          en: {
            name: 'author_name' in testimonial ? testimonial.author_name || '' : getLocalized(testimonial, 'en').name || '',
            quote: 'quote' in getLocalized(testimonial, 'en') ? getLocalized(testimonial, 'en').quote : '',
            designation: 'designation' in getLocalized(testimonial, 'en') ? getLocalized(testimonial, 'en').designation : '',
            text: 'text' in getLocalized(testimonial, 'en') ? getLocalized(testimonial, 'en').text : '',
          },
          ms: {
            name: 'author_name' in testimonial ? testimonial.author_name || '' : getLocalized(testimonial, 'ms').name || '',
            quote: 'quote' in getLocalized(testimonial, 'ms') ? getLocalized(testimonial, 'ms').quote : '',
            designation: 'designation' in getLocalized(testimonial, 'ms') ? getLocalized(testimonial, 'ms').designation : '',
            text: 'text' in getLocalized(testimonial, 'ms') ? getLocalized(testimonial, 'ms').text : '',
          },
      }
    } : {
      image: '',
      company: '',
      rating: 4,
      translations: { en: { name: '', quote: '', designation: '', text: '' }, ms: { name: '', quote: '', designation: '', text: '' } },
    }
  });

  const { isSubmitting } = form.formState;

  const handleCopyToMalay = () => {
    const en = form.getValues('translations.en');
    form.setValue('translations.ms', en);
    toast({ title: "Content Copied", description: "English content has been copied to the Malay fields." });
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (onSave) { // Handling manual review for an outlet
        onSave({
            id: isReview ? (testimonial as Review).id : undefined,
            author_name: values.translations.en.name,
            rating: values.rating || 5,
            translations: {
                en: { text: values.translations.en.text || '' },
                ms: { text: values.translations.ms.text || '' }
            }
        })
        return;
    }
      
    if (!firestore) return;
    try {
      const dataToSave = {
        image: values.image,
        company: values.company || null,
        rating: values.rating,
        translations: values.translations,
        updatedAt: serverTimestamp(),
      };

      if (testimonial) {
        await setDoc(doc(firestore, 'testimonials', testimonial.id), dataToSave, { merge: true });
        toast({ title: 'Testimonial Updated' });
      } else {
        await addDoc(collection(firestore, 'testimonials'), { ...dataToSave, createdAt: serverTimestamp() });
        toast({ title: 'Testimonial Created' });
      }
      onSuccess();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };
  
  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                 <h3 className="font-medium text-lg text-zinc-300">English (EN)</h3>
                 <FormField control={form.control} name="translations.en.name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
                 {!isReview && <FormField control={form.control} name="translations.en.designation" render={({ field }) => (
                    <FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />}
                {isReview ? (
                    <FormField control={form.control} name="translations.en.text" render={({ field }) => (
                        <FormItem><FormLabel>Review Text</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} rows={4} /></FormControl><FormMessage /></FormItem>
                    )} />
                ) : (
                    <FormField control={form.control} name="translations.en.quote" render={({ field }) => (
                        <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} rows={4} /></FormControl><FormMessage /></FormItem>
                    )} />
                )}
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg text-zinc-300">Malay (MS)</h3>
                    <Button type="button" size="sm" onClick={handleCopyToMalay} className="bg-primary text-primary-foreground border border-black hover:bg-primary">Copy from EN</Button>
                </div>
                 <FormField control={form.control} name="translations.ms.name" render={({ field }) => (
                    <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
                {!isReview && <FormField control={form.control} name="translations.ms.designation" render={({ field }) => (
                    <FormItem><FormLabel>Jawatan</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />}
                {isReview ? (
                    <FormField control={form.control} name="translations.ms.text" render={({ field }) => (
                        <FormItem><FormLabel>Teks Ulasan</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} rows={4} /></FormControl><FormMessage /></FormItem>
                    )} />
                ) : (
                    <FormField control={form.control} name="translations.ms.quote" render={({ field }) => (
                        <FormItem><FormLabel>Petikan</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} rows={4} /></FormControl><FormMessage /></FormItem>
                    )} />
                )}
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
            {!isReview && <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem><FormLabel>Image</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select an image asset" /></SelectTrigger></FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {isLoadingMedia ? <SelectItem value="loading" disabled>Loading...</SelectItem> : media?.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.id}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage /></FormItem>
            )} />}
            
            <FormField control={form.control} name="rating" render={({ field }) => (
                <FormItem><FormLabel>Rating (1-5)</FormLabel><FormControl><Input type="number" min="1" max="5" step="1" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        
        <div className="flex justify-end gap-2">
            {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {testimonial ? 'Save Changes' : 'Create'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
