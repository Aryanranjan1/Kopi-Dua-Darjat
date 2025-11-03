'use client';

import { useForm, Controller } from 'react-hook-form';
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
import { collection, addDoc, doc, setDoc, serverTimestamp, query } from 'firebase/firestore';
import type { MenuCategory, MenuGroup } from '@/lib/types';
import { useEffect } from 'react';

interface CategoryFormProps {
  category?: MenuCategory;
  allCategories: MenuCategory[];
  onSuccess: () => void;
}

export default function CategoryForm({ category, allCategories, onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const groupsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuGroups')) : null,
    [firestore]
  );
  const { data: groups, isLoading: isLoadingGroups } = useCollection<MenuGroup>(groupsQuery);

  const generateFormSchema = (existingCategory?: MenuCategory) => {
    return z.object({
        name: z.string().min(2, 'Category name must be at least 2 characters.'),
        slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
        description: z.string().optional(),
        groupId: z.string({ required_error: 'Please select a group.' }),
        displayOrder: z.coerce.number().int().min(1, 'Order number cannot be 0 or negative.'),
    }).refine(data => {
        const categoriesInSameGroup = allCategories.filter(c => c.groupId === data.groupId && c.id !== existingCategory?.id);
        const isDuplicate = categoriesInSameGroup.some(c => c.displayOrder === data.displayOrder);
        if (isDuplicate) {
            return false;
        }
        return true;
    }, {
        message: 'This order number is already in use for this group.',
        path: ['displayOrder'],
    }).refine(data => {
        if (!existingCategory) { // Only for new categories
            const categoriesInSameGroup = allCategories.filter(c => c.groupId === data.groupId);
            const maxOrder = categoriesInSameGroup.reduce((max, c) => Math.max(max, c.displayOrder), 0);
            if (data.displayOrder > maxOrder + 1) {
                return false;
            }
        }
        return true;
    }, {
        message: 'Order number cannot skip a value.',
        path: ['displayOrder'],
    });
  }
  
  const form = useForm<z.infer<ReturnType<typeof generateFormSchema>>>({
    resolver: zodResolver(generateFormSchema(category)),
    defaultValues: category ? {
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        groupId: category.groupId,
        displayOrder: category.displayOrder,
    } : {
        name: '',
        slug: '',
        description: '',
        groupId: undefined,
        displayOrder: 1,
    },
  });

  const { isSubmitting, watch, setValue } = form;
  const watchedGroupId = watch('groupId');

  useEffect(() => {
    if (!category && watchedGroupId) {
      const categoriesInGroup = allCategories.filter(c => c.groupId === watchedGroupId);
      const nextOrder = categoriesInGroup.length > 0
        ? Math.max(...categoriesInGroup.map(c => c.displayOrder)) + 1
        : 1;
      setValue('displayOrder', nextOrder);
    }
  }, [watchedGroupId, allCategories, setValue, category]);


  const onSubmit = async (values: z.infer<ReturnType<typeof generateFormSchema>>) => {
    if (!firestore) return;

    const dataToSave = {
        ...values,
        updatedAt: serverTimestamp(),
    };

    try {
      if (category) {
        const categoryRef = doc(firestore, 'menuCategories', category.id);
        await setDoc(categoryRef, dataToSave, { merge: true });
        toast({ title: 'Category Updated', description: `"${values.name}" has been successfully updated.` });
      } else {
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
            name="groupId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Group</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingGroups}>
                    <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select a parent group..." /></SelectTrigger></FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        {groups?.map(g => (
                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormDescription>Assigns this category to a top-level group.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="displayOrder"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="1" {...field} className={inputStyles} />
                </FormControl>
                <FormDescription>Order within the group (lower numbers first).</FormDescription>
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
