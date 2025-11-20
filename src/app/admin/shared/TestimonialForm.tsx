
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
import { useAdminLanguage } from '../(components)/AdminLanguageContext';
import { getLocalized } from '@/lib/localization';

interface TestimonialFormProps {
  testimonial?: Testimonial | Review;
  onSuccess: () => void;
  // Use a more specific callback for saving reviews if needed
  onSave?: (reviewData: Omit<Review, 'source' | 'time'> & { id?: string }) => void;
  onCancel?: () => void;
}

const translationSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  quote: z.string().min(10, 'Quote is too short.').optional(),
  designation: z.string().min(2, 'Designation is required.').optional(),
  text: z.string().min(10, 'Review text is too short.').optional(),
});

const formSchema = z.object({
  image: z.string().min(1, 'Image is required.').optional(),
  company: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  translations: translationSchema,
});

export default function TestimonialForm({ testimonial, onSuccess, onSave, onCancel }: TestimonialFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { language } = useAdminLanguage();
  const { data: media, isLoading: isLoadingMedia } = useCollection<Media>(useMemoFirebase(() => firestore ? query(collection(firestore, 'media')) : null, [firestore]));

  const isReview = testimonial && 'source' in testimonial;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: testimonial ? {
      image: 'image' in testimonial ? testimonial.image : '',
      company: 'company' in testimonial ? testimonial.company || '' : '',
      rating: testimonial.rating || 4,
      translations: {
          name: testimonial.author_name || ('translations' in testimonial ? getLocalized(testimonial, language, 'en').name : ''),
          quote: 'quote' in getLocalized(testimonial, language, 'en') ? getLocalized(testimonial, language, 'en').quote : '',
          designation: 'designation' in getLocalized(testimonial, language, 'en') ? getLocalized(testimonial, language, 'en').designation : '',
          text: 'text' in getLocalized(testimonial, language, 'en') ? getLocalized(testimonial, language, 'en').text : '',
      }
    } : {
      image: '',
      company: '',
      rating: 4,
      translations: { name: '', quote: '', designation: '', text: '' },
    }
  });

  const { isSubmitting } = form.formState;

  const handleCopyToLanguage = () => {
    if (!testimonial) return;
    form.setValue('translations', getLocalized(testimonial, 'en'));
    toast({ title: "Content Copied", description: "English content has been copied to the current form." });
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (onSave) {
        onSave({
            id: isReview ? (testimonial as Review).id : undefined,
            author_name: values.translations.name,
            rating: values.rating || 5,
            translations: {
                en: { text: values.translations.text || '' },
                ms: { text: values.translations.text || '' }
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
        [`translations.${language}`]: values.translations,
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
        {language !== 'en' && testimonial && (
            <Button type="button" variant="outline" size="sm" onClick={handleCopyToLanguage} className="w-full">Copy from English</Button>
        )}
        
        {isReview ? (
             <FormField
                control={form.control}
                name="translations.text"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Review Text ({language.toUpperCase()})</FormLabel>
                    <FormControl><Textarea {...field} className={inputStyles} rows={4} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        ) : (
           <>
            <FormField
            control={form.control}
            name="translations.name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name ({language.toUpperCase()})</FormLabel>
                <FormControl><Input {...field} className={inputStyles} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="translations.designation"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Designation ({language.toUpperCase()})</FormLabel>
                <FormControl><Input {...field} className={inputStyles} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Image</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select an image asset" /></SelectTrigger></FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {isLoadingMedia ? <SelectItem value="loading" disabled>Loading...</SelectItem> : media?.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.id}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="translations.quote"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quote ({language.toUpperCase()})</FormLabel>
                <FormControl><Textarea {...field} className={inputStyles} rows={4} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
          </>
        )}
        
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

    