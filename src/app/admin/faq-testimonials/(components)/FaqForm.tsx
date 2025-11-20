
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
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import type { FaqItem } from '@/lib/types';
import { getLocalized } from '@/lib/utils';

interface FaqFormProps {
  faqItem?: FaqItem;
  onSuccess: () => void;
}

const formSchema = z.object({
  category: z.enum(['General', 'Product', 'Franchise']),
  translations: z.object({
    en: z.object({
        question: z.string().min(10, 'English question is too short.'),
        answer: z.string().min(10, 'English answer is too short.'),
    }),
    ms: z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
    }),
  })
});

export default function FaqForm({ faqItem, onSuccess }: FaqFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: faqItem ? {
      category: faqItem.category,
      translations: {
          en: getLocalized(faqItem, 'en'),
          ms: getLocalized(faqItem, 'ms'),
      }
    } : {
      category: 'General',
      translations: {
          en: { question: '', answer: '' },
          ms: { question: '', answer: '' },
      }
    },
  });

  const { isSubmitting } = form.formState;

  const handleCopyToMalay = () => {
    const en = form.getValues('translations.en');
    form.setValue('translations.ms', en);
    toast({ title: "Content Copied", description: "English content has been copied to the Malay fields." });
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;
    try {
      const dataToSave = {
        category: values.category,
        translations: values.translations,
      };

      if (faqItem) {
        await setDoc(doc(firestore, 'faq', faqItem.id), dataToSave, { merge: true });
        toast({ title: 'FAQ Updated' });
      } else {
        await addDoc(collection(firestore, 'faq'), dataToSave);
        toast({ title: 'FAQ Created' });
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
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className={inputStyles}><SelectValue /></SelectTrigger></FormControl>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Franchise">Franchise</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-medium text-lg text-zinc-300">English (EN)</h3>
                 <FormField control={form.control} name="translations.en.question" render={({ field }) => (
                    <FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="translations.en.answer" render={({ field }) => (
                    <FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea {...field} className={inputStyles} rows={5} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg text-zinc-300">Malay (MS)</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleCopyToMalay}>Copy from EN</Button>
                </div>
                 <FormField control={form.control} name="translations.ms.question" render={({ field }) => (
                    <FormItem><FormLabel>Soalan</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="translations.ms.answer" render={({ field }) => (
                    <FormItem><FormLabel>Jawapan</FormLabel><FormControl><Textarea {...field} className={inputStyles} rows={5} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {faqItem ? 'Save Changes' : 'Create FAQ'}
        </Button>
      </form>
    </Form>
  );
}
