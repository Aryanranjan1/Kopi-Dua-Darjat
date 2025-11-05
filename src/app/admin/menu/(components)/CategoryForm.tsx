
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface CategoryFormProps {
  category?: MenuCategory;
  allCategories: MenuCategory[];
  onSuccess: () => void;
}

const formSchema = z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters.'),
    slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
    description: z.string().optional(),
    imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    groupId: z.string({ required_error: 'Please select a group.' }),
    status: z.enum(['draft', 'published']),
});


export default function CategoryForm({ category, allCategories, onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const groupsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuGroups')) : null,
    [firestore]
  );
  const { data: groups, isLoading: isLoadingGroups } = useCollection<MenuGroup>(groupsQuery);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: category ? {
        ...category,
        description: category.description || '',
        imageUrl: category.imageUrl || '',
    } : {
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        groupId: undefined,
        status: 'draft',
    },
  });

  const { isSubmitting } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;

    try {
      if (category) {
        const categoryRef = doc(firestore, 'menuCategories', category.id);
        await setDoc(categoryRef, { 
            ...values,
            updatedAt: serverTimestamp(),
        }, { merge: true });
        toast({ title: 'Category Updated', description: `"${values.name}" has been successfully updated.` });
      } else {
        const categoriesRef = collection(firestore, 'menuCategories');
        const categoriesInGroup = allCategories.filter(c => c.groupId === values.groupId);
        const nextOrder = categoriesInGroup.length > 0 ? Math.max(...categoriesInGroup.map(c => c.displayOrder)) + 1 : 1;
        await addDoc(categoriesRef, {
          ...values,
          displayOrder: nextOrder,
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description of the category" {...field} className={inputStyles} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} className={inputStyles} />
              </FormControl>
               <FormDescription>Image used for the category grid on microsites.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                <div className="space-y-0.5">
                <FormLabel className="text-base">Publish</FormLabel>
                <FormDescription>Make this category visible on the public menu.</FormDescription>
                </div>
                <FormControl>
                <Switch
                    checked={field.value === 'published'}
                    onCheckedChange={(checked) => field.onChange(checked ? 'published' : 'draft')}
                />
                </FormControl>
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
