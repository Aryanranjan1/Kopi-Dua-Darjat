
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
import type { Review, Testimonial } from '@/lib/types';
import { useEffect } from 'react';
import { Slider } from '@/components/ui/slider';


interface TestimonialFormProps {
  testimonial?: Review;
  outletId?: string;
  onSave: (review: Omit<Review, 'source' | 'time'>) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  id: z.string().optional(),
  author_name: z.string().min(2, 'Name is required.'),
  text: z.string().min(10, 'Quote is too short.'),
  rating: z.coerce.number().min(1).max(5),
});

export default function TestimonialForm({ testimonial, outletId, onSave, onCancel }: TestimonialFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: testimonial?.id || `manual_${Date.now()}`,
      author_name: testimonial?.author_name || '',
      text: testimonial?.text || '',
      rating: testimonial?.rating || 4,
    },
  });
  
  useEffect(() => {
      form.reset({
        id: testimonial?.id || `manual_${Date.now()}`,
        author_name: testimonial?.author_name || '',
        text: testimonial?.text || '',
        rating: testimonial?.rating || 4,
      })
  }, [testimonial, form]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    onSave(values);
    toast({ title: `Testimonial ${testimonial ? 'Updated' : 'Added'}` });
  };
  
  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="author_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Name</FormLabel>
              <FormControl><Input {...field} className={inputStyles} placeholder="e.g., John Doe" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating: {field.value}</FormLabel>
              <FormControl>
                <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={1}
                    max={5}
                    step={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Text</FormLabel>
              <FormControl><Textarea {...field} className={inputStyles} rows={4} placeholder="The coffee was amazing..."/></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {testimonial ? 'Save Changes' : 'Add Testimonial'}
            </Button>
        </div>
      </form>
    </Form>
  );
}

