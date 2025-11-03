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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { MenuGroup } from '@/lib/types';
import { useEffect } from 'react';

interface GroupFormProps {
  group?: MenuGroup;
  allGroups: MenuGroup[];
  onSuccess: () => void;
}

export default function GroupForm({ group, allGroups, onSuccess }: GroupFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const generateFormSchema = (existingGroup?: MenuGroup) => {
    return z.object({
      name: z.string().min(2, 'Group name must be at least 2 characters.'),
      slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
      displayOrder: z.coerce.number().int().min(1, 'Order number cannot be 0 or negative.'),
    }).refine(data => {
        const otherGroups = allGroups.filter(g => g.id !== existingGroup?.id);
        const isDuplicate = otherGroups.some(g => g.displayOrder === data.displayOrder);
        if (isDuplicate) {
            return false;
        }
        return true;
    }, {
        message: 'This order number is already in use.',
        path: ['displayOrder'],
    }).refine(data => {
        if (!existingGroup) { // Only for new groups
            const maxOrder = allGroups.reduce((max, g) => Math.max(max, g.displayOrder), 0);
            if (data.displayOrder > maxOrder + 1) {
                return false;
            }
        }
        return true;
    }, {
        message: 'Order number cannot skip a value. The next available is ' + (allGroups.reduce((max, g) => Math.max(max, g.displayOrder), 0) + 1),
        path: ['displayOrder'],
    });
  }

  const form = useForm<z.infer<ReturnType<typeof generateFormSchema>>>({
    resolver: zodResolver(generateFormSchema(group)),
    defaultValues: group ? {
        name: group.name,
        slug: group.slug,
        displayOrder: group.displayOrder,
    } : {
        name: '',
        slug: '',
        displayOrder: allGroups.reduce((max, g) => Math.max(max, g.displayOrder), 0) + 1,
    },
  });

  useEffect(() => {
    if (!group) {
      const nextOrder = allGroups.reduce((max, g) => Math.max(max, g.displayOrder), 0) + 1;
      form.setValue('displayOrder', nextOrder);
    }
  }, [allGroups, form, group]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<ReturnType<typeof generateFormSchema>>) => {
    if (!firestore) return;

    const dataToSave = {
        ...values,
        updatedAt: serverTimestamp(),
    };

    try {
      if (group) {
        const groupRef = doc(firestore, 'menuGroups', group.id);
        await setDoc(groupRef, dataToSave, { merge: true });
        toast({ title: 'Group Updated', description: `"${values.name}" has been successfully updated.` });
      } else {
        const groupsRef = collection(firestore, 'menuGroups');
        await addDoc(groupsRef, {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Group Created', description: `"${values.name}" has been successfully created.` });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving group:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not save the group.',
      });
    }
  };

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-white">
        <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Group Name</FormLabel>
            <FormControl>
                <Input placeholder="e.g., Nak Kopi" {...field} className={inputStyles} />
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
                <Input placeholder="e.g., nak-kopi" {...field} className={inputStyles} />
            </FormControl>
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
                <FormDescription>Order on the menu page (lower numbers first).</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {group ? 'Save Changes' : 'Create Group'}
        </Button>
      </form>
    </Form>
  );
}
