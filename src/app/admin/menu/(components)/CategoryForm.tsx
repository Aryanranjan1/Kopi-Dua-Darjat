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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, query, where } from 'firebase/firestore';
import type { MenuCategory } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  group: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: MenuCategory;
  onSuccess: () => void;
}

export default function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const parentCategoriesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuCategories'), where('parentId', '==', null)) : null,
    [firestore]
  );
  const { data: parentCategories } = useCollection<MenuCategory>(parentCategoriesQuery);

  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
      group: category?.group || '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: CategoryFormValues) => {
    if (!firestore) return;

    const dataToSave = {
        ...values,
        parentId: values.parentId || null,
        updatedAt: serverTimestamp(),
    };

    try {
      if (category) {
        // Update existing category
        const categoryRef = doc(firestore, 'menuCategories', category.id);
        await setDoc(categoryRef, dataToSave, { merge: true });
        toast({ title: 'Category Updated', description: `"${values.name}" has been successfully updated.` });
      } else {
        // Create new category
        const categoriesRef = collection(firestore, 'menuCategories');
        await addDoc(categoriesRef, {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Category Created', description: `"${values.name}" has been successfully created.` });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not save the category.',
      });
    }
  };

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Darjat Series" {...field} className={inputStyles} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., darjat-series" {...field} className={inputStyles} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Parent Category (Optional)</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select a parent category..." /></SelectTrigger></FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                         <SelectItem value="">None (Top-Level Category)</SelectItem>
                        {parentCategories?.filter(c => c.id !== category?.id).map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormDescription>Make this a sub-category.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Group (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., NAK KOPI" {...field} className={inputStyles} />
                </FormControl>
                 <FormDescription>Assigns this category to a top-level group on the menu page.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="A short description of the category" {...field} className={inputStyles} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {category ? 'Save Changes' : 'Create Category'}
        </Button>
      </form>
    </Form>
  );
}
