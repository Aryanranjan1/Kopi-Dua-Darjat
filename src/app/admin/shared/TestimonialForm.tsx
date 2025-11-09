
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
import { useFirestore } from '@/firebase';
import { useMedia } from '@/lib/media';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Testimonial } from '@/lib/types';
import { useEffect } from 'react';

interface TestimonialFormProps {
  testimonial?: Testimonial;
  outletId?: string;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  designation: z.string().min(3, 'Designation is required.'),
  company: z.string().optional(),
  quote: z.string().min(10, 'Quote is too short.'),
  image: z.string({ required_error: 'Please select an image.' }),
  outletId: z.string().optional(),
});

export default function TestimonialForm({ testimonial, outletId, onSuccess }: TestimonialFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: media, isLoading: isLoadingMedia } = useMedia();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      designation: '',
      company: '',
      quote: '',
      image: '',
      outletId: outletId || '',
    },
  });
  
  useEffect(() => {
    if (testimonial) {
      form.reset({
        name: testimonial.name || '',
        designation: testimonial.designation || '',
        company: testimonial.company || '',
        quote: testimonial.quote || '',
        image: testimonial.image || '',
        outletId: outletId || testimonial.outletId || '',
      })
    } else {
       form.reset({
        name: '',
        designation: '',
        company: '',
        quote: '',
        image: '',
        outletId: outletId || '',
      })
    }
  }, [testimonial, outletId, form]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;
    try {
      const dataToSave = {
        ...values,
        createdAt: serverTimestamp(),
      }

      if (testimonial) {
        await setDoc(doc(firestore, 'testimonials', testimonial.id), dataToSave, { merge: true });
        toast({ title: 'Testimonial Updated' });
      } else {
        await addDoc(collection(firestore, 'testimonials'), dataToSave);
        toast({ title: 'Testimonial Created' });
      }
      onSuccess();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };
  
  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";
  const testimonialImages = media?.filter(m => m.id.startsWith('testimonial-')) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} className={inputStyles} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl><Input placeholder="e.g. Franchisee, Shah Alam" {...field} className={inputStyles} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., Kopi Power Sdn Bhd" {...field} className={inputStyles} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl><Textarea {...field} className={inputStyles} rows={4} /></FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingMedia}>
                <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select an image..." /></SelectTrigger></FormControl>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {testimonialImages.map(img => (
                    <SelectItem key={img.id} value={img.id}>{img.id} ({img.description})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {testimonial ? 'Save Changes' : 'Create Testimonial'}
        </Button>
      </form>
    </Form>
  );
}
