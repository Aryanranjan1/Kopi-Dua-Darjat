
'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { collection, addDoc, doc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import type { MenuItem, MenuCategory, MenuGroup, Outlet } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuItemFormProps {
  menuItem?: MenuItem;
  allItems: MenuItem[];
  onSuccess: () => void;
}

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    slug: z.string().min(2, 'Slug must be at least 2 characters.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    price: z.coerce.number().min(0, 'Price must be a positive number.'),
    imageUrl: z.string().url('Please enter a valid image URL.'),
    groupId: z.string({ required_error: 'Please select a group.' }),
    categoryId: z.string({ required_error: 'Please select a category.' }),
    status: z.enum(['draft', 'published']),
    isPopular: z.boolean().default(false),
    tags: z.string().optional(),
    outletIds: z.array(z.string()).optional(),
});


export default function MenuItemForm({ menuItem, allItems, onSuccess }: MenuItemFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const groupsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'menuGroups'), orderBy('displayOrder')) : null),
    [firestore]
  );
  const { data: groups } = useCollection<MenuGroup>(groupsQuery);

  const categoriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'menuCategories'), orderBy('displayOrder')) : null),
    [firestore]
  );
  const { data: allCategories } = useCollection<MenuCategory>(categoriesQuery);

  const { data: outlets } = useCollection<Outlet>(useMemoFirebase(() => firestore ? query(collection(firestore, 'outlets')) : null, [firestore]));
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: menuItem ? {
        name: menuItem.name,
        slug: menuItem.slug,
        description: menuItem.description,
        price: menuItem.price,
        imageUrl: menuItem.imageUrl,
        categoryId: menuItem.categoryId,
        groupId: allCategories?.find(c => c.id === menuItem.categoryId)?.groupId || '',
        status: menuItem.status,
        isPopular: menuItem.isPopular || false,
        tags: menuItem.tags?.join(', ') || '',
        outletIds: menuItem.outletIds || [],
    } : {
        name: '',
        slug: '',
        description: '',
        price: 0,
        imageUrl: '',
        groupId: undefined,
        categoryId: undefined,
        status: 'draft',
        isPopular: false,
        tags: '',
        outletIds: [],
    }
  });

  const { isSubmitting, watch, setValue } = form;
  const watchedGroupId = watch('groupId');

  const filteredCategories = useMemo(() => {
    if (!watchedGroupId || !allCategories) return [];
    return allCategories.filter(c => c.groupId === watchedGroupId);
  }, [watchedGroupId, allCategories]);

  useEffect(() => {
    // When group changes, reset category if it's not in the new group
    if (menuItem && watchedGroupId && allCategories) {
        const currentCategory = allCategories.find(c => c.id === menuItem.categoryId);
        if (currentCategory && currentCategory.groupId !== watchedGroupId) {
            setValue('categoryId', '');
        }
    } else if (!menuItem) {
      setValue('categoryId', '');
    }
  }, [watchedGroupId, menuItem, allCategories, setValue]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;

    try {
      const dataToSave = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        price: values.price,
        imageUrl: values.imageUrl,
        categoryId: values.categoryId,
        status: values.status,
        isPopular: values.isPopular,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        outletIds: values.outletIds || [],
        isGeneral: (values.outletIds || []).length === 0,
        updatedAt: serverTimestamp(),
      };

      if (menuItem) {
        const itemRef = doc(firestore, 'menuItems', menuItem.id);
        await setDoc(itemRef, dataToSave, { merge: true });
        toast({ title: 'Menu Item Updated', description: `"${values.name}" has been successfully updated.` });
      } else {
        const itemsRef = collection(firestore, 'menuItems');
        const itemsInCategory = allItems.filter(item => item.categoryId === values.categoryId);
        const nextOrder = itemsInCategory.length > 0 ? Math.max(...itemsInCategory.map(i => i.displayOrder)) + 1 : 1;

        await addDoc(itemsRef, {
          ...dataToSave,
          displayOrder: nextOrder,
          createdAt: serverTimestamp(),
          promotionIds: [],
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
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
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
                name="groupId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            {groups?.map(g => (
                                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchedGroupId || filteredCategories.length === 0}>
                        <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            {filteredCategories.map(cat => (
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com/image.png" {...field} className={inputStyles} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="outletIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Linked Outlets</FormLabel>
                   <MultiSelectPopover
                    title="Outlets"
                    options={outlets?.map(outlet => ({ value: outlet.id, label: outlet.name })) || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormDescription>Select which outlets this item is available at. Leave empty for it to be available everywhere.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., featured, new" {...field} className={inputStyles} /></FormControl>
                <FormDescription>Comma-separated tags for filtering (e.g. for homepage showcase).</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="isPopular"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                        <div className="space-y-0.5">
                        <FormLabel className="text-base">Popular Item</FormLabel>
                        <FormDescription>Feature this on the homepage "Popular" section.</FormDescription>
                        </div>
                        <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
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
            </div>
          </div>
        </ScrollArea>
        
        <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {menuItem ? 'Save Changes' : 'Create Menu Item'}
        </Button>
      </form>
    </Form>
  );
}


function MultiSelectPopover({ title, options, selected, onChange }: {
    title: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectAll = () => {
        onChange(options.map(opt => opt.value));
    }
    const handleDeselectAll = () => {
        onChange([]);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                    <span className="truncate">
                    {selected.length === 0
                        ? `Select ${title}...`
                        : selected.length === options.length
                        ? `All ${title}`
                        : `${selected.length} of ${options.length} selected`}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[60]" align="start">
                <div className="bg-zinc-900 text-white border border-zinc-800 rounded-md">
                    <div className="p-2 border-b border-zinc-800">
                        <Input 
                            placeholder={`Search ${title.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-800 border-zinc-700"
                            autoFocus
                        />
                    </div>
                     <div className="p-2 border-b border-zinc-800 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={handleSelectAll} className="flex-1">Select All</Button>
                        <Button size="sm" variant="ghost" onClick={handleDeselectAll} className="flex-1">Deselect All</Button>
                    </div>
                    <ScrollArea className="h-48">
                        <div className="p-2 space-y-1">
                        {filteredOptions.length > 0 ? filteredOptions.map((option) => {
                            const isSelected = selected.includes(option.value);
                            return (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-zinc-800 cursor-pointer"
                                    onClick={() => {
                                        const newSelected = isSelected
                                            ? selected.filter((v) => v !== option.value)
                                            : [...selected, option.value];
                                        onChange(newSelected);
                                    }}
                                >
                                    <Checkbox
                                        id={`check-${option.value}`}
                                        checked={isSelected}
                                        readOnly
                                    />
                                    <label htmlFor={`check-${option.value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                        {option.label}
                                    </label>
                                </div>
                            )
                        }) : (
                            <p className="p-2 text-sm text-center text-zinc-500">No {title.toLowerCase()} found.</p>
                        )}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
}
