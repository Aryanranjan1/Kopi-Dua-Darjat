
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
import { useAdminLanguage } from '../../(components)/AdminLanguageContext';
import { getLocalized } from '@/lib/localization';

interface FaqFormProps {
  faqItem?: FaqItem;
  onSuccess: () => void;
}

const translationSchema = z.object({
  question: z.string().min(10, 'Question is too short.'),
  answer: z.string().min(10, 'Answer is too short.'),
});

const formSchema = z.object({
  category: z.enum(['General', 'Product', 'Franchise']),
  translations: translationSchema,
});

export default function FaqForm({ faqItem, onSuccess }: FaqFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { language } = useAdminLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: faqItem ? {
      category: faqItem.category,
      translations: getLocalized(faqItem, language),
    } : {
      category: 'General',
      translations: { question: '', answer: '' },
    },
  });

  const { isSubmitting } = form.formState;

  const handleCopyToLanguage = () => {
    if (!faqItem) return;
    const englishContent = getLocalized(faqItem, 'en');
    form.setValue('translations', englishContent);
    toast({ title: "Content Copied", description: "English content has been copied to the current form." });
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;
    try {
      const dataToSave = {
        category: values.category,
        [`translations.${language}`]: values.translations,
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
        {language !== 'en' && faqItem && (
            <Button type="button" variant="outline" size="sm" onClick={handleCopyToLanguage} className="w-full">Copy from English</Button>
        )}
        <FormField
          control={form.control}
          name="translations.question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question ({language.toUpperCase()})</FormLabel>
              <FormControl><Input {...field} className={inputStyles} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="translations.answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer ({language.toUpperCase()})</FormLabel>
              <FormControl><Textarea {...field} className={inputStyles} rows={5} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {faqItem ? 'Save Changes' : 'Create FAQ'}
        </Button>
      </form>
    </Form>
  );
}
