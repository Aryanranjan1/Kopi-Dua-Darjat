
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, query, orderBy, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import type { CommunityItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useForm, FormProvider } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  type: z.enum(['portrait', 'logo', 'quote']),
  name: z.string().min(2, 'Name is required.'),
  imageUrl: z.string().optional(),
  quote: z.string().optional(),
  role: z.string().optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  className: z.string().optional(),
  rowSpan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CommunityItemForm = ({ item, onSuccess }: { item?: CommunityItem; onSuccess: () => void }) => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: item?.type || 'portrait',
      name: item?.name || '',
      imageUrl: item?.imageUrl || '',
      quote: item?.quote || '',
      role: item?.role || '',
      bgColor: item?.bgColor || '',
      textColor: item?.textColor || 'text-black',
      className: item?.className?.split(' ').filter(c => c.startsWith('sm:col-span-')).join(' ') || '',
      rowSpan: item?.className?.split(' ').filter(c => c.startsWith('sm:row-span-')).join(' ') || '',
    },
  });
  
  const { toast } = useToast();
  const firestore = useFirestore();

  const watchedType = formMethods.watch('type');

  const onSubmit = async (values: FormValues) => {
    if (!firestore) return;

    try {
       const combinedClassName = [values.className, values.rowSpan].filter(Boolean).join(' ');
       const dataToSave = {
        type: values.type,
        name: values.name,
        imageUrl: values.imageUrl || null,
        quote: values.quote || null,
        role: values.role || null,
        bgColor: values.bgColor || null,
        textColor: values.textColor || null,
        className: combinedClassName,
        displayOrder: item?.displayOrder || Date.now(),
        updatedAt: serverTimestamp(),
      };


      if (item) {
        await setDoc(doc(firestore, 'community_items', item.id), dataToSave, { merge: true });
        toast({ title: 'Item Updated' });
      } else {
        await addDoc(collection(firestore, 'community_items'), { ...dataToSave, createdAt: serverTimestamp() });
        toast({ title: 'Item Created' });
      }
      onSuccess();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };
  
  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <FormField control={formMethods.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className={inputStyles}><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="logo">Logo</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={formMethods.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
            )} />
            
            {watchedType === 'portrait' && (
              <>
                <FormField control={formMethods.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={formMethods.control} name="bgColor" render={({ field }) => (
                  <FormItem><FormLabel>Background Color Class</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} placeholder="e.g. bg-cyan-300"/></FormControl><FormMessage /></FormItem>
                )} />
              </>
            )}
            
            {watchedType === 'logo' && (
              <FormField control={formMethods.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Logo URL</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
              )} />
            )}

            {watchedType === 'quote' && (
              <>
                <FormField control={formMethods.control} name="quote" render={({ field }) => (
                  <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={formMethods.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel>Role/Title</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={formMethods.control} name="bgColor" render={({ field }) => (
                  <FormItem><FormLabel>Background Color Class</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} placeholder="e.g. bg-yellow-300" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={formMethods.control} name="textColor" render={({ field }) => (
                   <FormItem>
                    <FormLabel>Text Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className={inputStyles}><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="text-black">Black</SelectItem>
                        <SelectItem value="text-white">White</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}

             <div className="grid grid-cols-2 gap-4">
              <FormField control={formMethods.control} name="className" render={({ field }) => (
                <FormItem><FormLabel>Column Span</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} placeholder="e.g. sm:col-span-1" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={formMethods.control} name="rowSpan" render={({ field }) => (
                <FormItem><FormLabel>Row Span</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} placeholder="e.g. sm:row-span-1" /></FormControl><FormMessage /></FormItem>
              )} />
             </div>
          </div>
        </ScrollArea>
        <Button type="submit" disabled={formMethods.formState.isSubmitting} className="w-full">
          {formMethods.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {item ? 'Save Changes' : 'Create Item'}
        </Button>
      </form>
    </FormProvider>
  );
};


export default function CommunityItemsManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const communityQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'community_items'), orderBy('displayOrder')) : null,
    [firestore]
  );
  const { data: communityItems, isLoading } = useCollection<CommunityItem>(communityQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CommunityItem | undefined>(undefined);

  const handleAddNew = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: CommunityItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'community_items', id));
      toast({ title: 'Success', description: 'Community item deleted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete item: ${error.message}` });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Item
        </Button>
      </div>
      <div className="border border-zinc-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700 hover:bg-zinc-800">
              <TableHead>Preview</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
            {!isLoading && communityItems?.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-zinc-400 py-8">No community items found.</TableCell></TableRow>}
            {communityItems?.map(item => (
              <TableRow key={item.id} className="border-zinc-700 hover:bg-zinc-800">
                <TableCell>
                  {item.imageUrl && <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md object-cover bg-zinc-700" />}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">This will permanently delete this item.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Community Item' : 'Add New Community Item'}</DialogTitle>
          </DialogHeader>
          <CommunityItemForm item={selectedItem} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
