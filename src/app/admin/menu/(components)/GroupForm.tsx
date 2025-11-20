
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
import { Switch } from '@/components/ui/switch';
import { getLocalized } from '@/lib/utils';

interface GroupFormProps {
  group?: MenuGroup;
  allGroups: MenuGroup[];
  onSuccess: () => void;
}

const formSchema = z.object({
    slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
    status: z.enum(['draft', 'published']),
    translations: z.object({
        en: z.object({
            name: z.string().min(2, 'English group name is required.'),
        }),
        ms: z.object({
            name: z.string().optional(),
        }),
    }),
});


export default function GroupForm({ group, allGroups, onSuccess }: GroupFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: group ? {
        slug: group.slug,
        status: group.status,
        translations: {
            en: getLocalized(group, 'en'),
            ms: getLocalized(group, 'ms'),
        }
    } : {
        slug: '',
        status: 'draft',
        translations: {
            en: { name: '' },
            ms: { name: '' },
        }
    },
  });

  const { isSubmitting, watch, setValue, formState: { dirtyFields } } = form;
  const watchedEnName = watch('translations.en.name');

  useEffect(() => {
    if (watchedEnName && !dirtyFields.slug) {
        const newSlug = watchedEnName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setValue('slug', newSlug);
    }
  }, [watchedEnName, setValue, dirtyFields.slug]);

  const handleCopyToMalay = () => {
    const en = form.getValues('translations.en');
    form.setValue('translations.ms', en);
    toast({ title: "Content Copied", description: "English content has been copied to the Malay fields." });
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;

    try {
      const dataToSave = { ...values, updatedAt: serverTimestamp() };

      if (group) {
        const groupRef = doc(firestore, 'menuGroups', group.id);
        await setDoc(groupRef, dataToSave, { merge: true });
        toast({ title: 'Group Updated', description: `"${values.translations.en.name}" has been successfully updated.` });
      } else {
        const groupsRef = collection(firestore, 'menuGroups');
        const nextOrder = allGroups.length > 0 ? Math.max(...allGroups.map(g => g.displayOrder)) + 1 : 1;
        await addDoc(groupsRef, {
          ...dataToSave,
          displayOrder: nextOrder,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Group Created', description: `"${values.translations.en.name}" has been successfully created.` });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-medium text-lg text-zinc-300">English (EN)</h3>
                <FormField control={form.control} name="translations.en.name" render={({ field }) => (
                    <FormItem><FormLabel>Group Name</FormLabel><FormControl><Input placeholder="e.g., Nak Kopi" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg text-zinc-300">Malay (MS)</h3>
                    <Button type="button" size="sm" onClick={handleCopyToMalay} className="bg-primary text-primary-foreground border border-black hover:bg-primary">Copy from EN</Button>
                </div>
                <FormField control={form.control} name="translations.ms.name" render={({ field }) => (
                    <FormItem><FormLabel>Nama Kumpulan</FormLabel><FormControl><Input placeholder="e.g., Nak Kopi" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>
        
        <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
                <Input placeholder="e.g., nak-kopi" {...field} value={field.value || ''} className={inputStyles} />
            </FormControl>
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
                <FormDescription>Make this group visible on the public menu.</FormDescription>
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
          {group ? 'Save Changes' : 'Create Group'}
        </Button>
      </form>
    </Form>
  );
}
