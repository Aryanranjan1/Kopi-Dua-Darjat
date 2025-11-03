'use client';

import { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, query } from 'firebase/firestore';
import type { MenuItem, MenuCategory } from '@/lib/types';

interface MenuItemFormProps {
  menuItem?: MenuItem;
  allItems: MenuItem[];
  onSuccess: () => void;
}

export default function MenuItemForm({ menuItem, allItems, onSuccess }: MenuItemFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'menuCategories')) : null),
    [firestore]
  );
  const { data: categories } = useCollection<MenuCategory>(categoriesQuery);
  
  const generateFormSchema = (existingItem?: MenuItem) => {
      return z.object({
        name: z.string().min(2, 'Name must be at least 2 characters.'),
        slug: z.string().min(2, 'Slug must be at least 2 characters.'),
        description: z.string().min(10, 'Description must be at least 10 characters.'),
        price: z.coerce.number().min(0, 'Price must be a positive number.'),
        imageUrl: z.string().url('Please enter a valid image URL.'),
        categoryId: z.string({ required_error: 'Please select a category.' }),
        status: z.enum(['draft', 'published']),
        tags: z.string().optional(),
        displayOrder: z.coerce.number().int().min(1, 'Order number cannot be 0 or negative.'),
    }).refine(data => {
        const itemsInSameCategory = allItems.filter(item => item.categoryId === data.categoryId && item.id !== existingItem?.id);
        const isDuplicate = itemsInSameCategory.some(item => item.displayOrder === data.displayOrder);
        if (isDuplicate) {
            return false;
        }
        return true;
    }, {
        message: 'This order number is already in use for this category.',
        path: ['displayOrder'],
    }).refine(data => {
        if (!existingItem) { // Only for new items
            const itemsInSameCategory = allItems.filter(item => item.categoryId === data.categoryId);
            const maxOrder = itemsInSameCategory.reduce((max, item) => Math.max(max, item.displayOrder), 0);
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
    resolver: zodResolver(generateFormSchema(menuItem)),
    defaultValues: menuItem ? {
        name: menuItem.name,
        slug: menuItem.slug,
        description: menuItem.description,
        price: menuItem.price,
        imageUrl: menuItem.imageUrl,
        categoryId: menuItem.categoryId,
        status: menuItem.status,
        tags: menuItem.tags?.join(', ') || '',
        displayOrder: menuItem.displayOrder,
    } : {
        name: '',
        slug: '',
        description: '',
        price: 0,
        imageUrl: '',
        categoryId: undefined,
        status: 'draft',
        tags: '',
        displayOrder: 1,
    }
  });

  const { isSubmitting, watch, setValue } = form;
  const watchedCategoryId = watch('categoryId');

  useEffect(() => {
    if (!menuItem && watchedCategoryId) {
        const itemsInCategory = allItems.filter(item => item.categoryId === watchedCategoryId);
        const nextOrder = itemsInCategory.length > 0 
            ? Math.max(...itemsInCategory.map(item => item.displayOrder)) + 1 
            : 1;
        setValue('displayOrder', nextOrder);
    }
  }, [watchedCategoryId, allItems, setValue, menuItem]);


  const onSubmit = async (values: z.infer<ReturnType<typeof generateFormSchema>>) => {
    if (!firestore) return;

    try {
      const dataToSave = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        updatedAt: serverTimestamp(),
        isGeneral: menuItem?.isGeneral ?? true,
        outletIds: menuItem?.outletIds ?? [],
        promotionIds: menuItem?.promotionIds ?? [],
      };

      if (menuItem) {
        const itemRef = doc(firestore, 'menuItems', menuItem.id);
        await setDoc(itemRef, dataToSave, { merge: true });
        toast({ title: 'Menu Item Updated', description: `"${values.name}" has been successfully updated.` });
      } else {
        const itemsRef = collection(firestore, 'menuItems');
        await addDoc(itemsRef, {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Menu Item Created', description: `"${values.name}" has been successfully added.` });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not save the menu item.',
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
                <FormLabel>Name</FormLabel>
                <FormControl><Input placeholder="e.g., Darjat Caramel" {...field} className={inputStyles} /></FormControl>
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
                <FormControl><Input placeholder="e.g., darjat-caramel" {...field} className={inputStyles} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="A short, tasty description..." {...field} className={inputStyles} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price (RM)</FormLabel>
                <FormControl><Input type="number" step="0.10" placeholder="e.g., 9.50" {...field} className={inputStyles} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        {categories?.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl><Input placeholder="https://example.com/image.png" {...field} className={inputStyles} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., featured, new" {...field} className={inputStyles} /></FormControl>
                <FormDescription>Comma-separated tags for filtering.</FormDescription>
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
                    <FormDescription>Order within the category (lower numbers first).</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        
        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                <div className="space-y-0.5">
                <FormLabel className="text-base">Publish</FormLabel>
                <FormDescription>Make this item visible on the public website.</FormDescription>
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
          {menuItem ? 'Save Changes' : 'Create Menu Item'}
        </Button>
      </form>
    </Form>
  );
}
