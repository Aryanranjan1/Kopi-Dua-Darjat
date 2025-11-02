'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import MenuItemForm from './MenuItemForm';
import { useToast } from '@/hooks/use-toast';

export default function MenuItemsTable() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const itemsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuItems'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: menuItems, isLoading: isLoadingItems } = useCollection<MenuItem>(itemsQuery);

  const categoriesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuCategories')) : null,
    [firestore]
  );
  const { data: categories } = useCollection<MenuCategory>(categoriesQuery);
  const categoryMap = new Map(categories?.map(c => [c.id, c.name]));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(undefined);

  const handleAddNew = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'menuItems', id));
      toast({ title: 'Success', description: 'Menu item deleted successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete menu item: ${error.message}` });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800">
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingItems && <TableRow><TableCell colSpan={6} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoadingItems && menuItems && menuItems.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-zinc-400 py-8">No menu items found. Add one to get started.</TableCell></TableRow>}
          {menuItems?.map(item => (
            <TableRow key={item.id} className="border-zinc-700 hover:bg-zinc-800">
              <TableCell>
                <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md object-contain bg-zinc-700 p-1" />
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-zinc-400">{categoryMap.get(item.categoryId) || 'N/A'}</TableCell>
              <TableCell>RM{item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className={item.status === 'published' ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-200'}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">This will permanently delete the item "{item.name}".</AlertDialogDescription>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedItem ? `Editing "${selectedItem.name}".` : 'Create a new item for your menu.'}
            </DialogDescription>
          </DialogHeader>
          <MenuItemForm menuItem={selectedItem} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
