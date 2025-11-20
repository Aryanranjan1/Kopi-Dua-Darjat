
'use client';

import { useState, useMemo, Fragment } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';
import type { MenuItem, MenuCategory, MenuGroup } from '@/lib/types';
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
import { Loader2, PlusCircle, Edit, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import MenuItemForm from './MenuItemForm';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { getLocalized } from '@/lib/utils';

export default function MenuItemsManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const itemsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuItems'), orderBy('displayOrder', 'asc')) : null,
    [firestore]
  );
  const { data: menuItems, isLoading: isLoadingItems } = useCollection<MenuItem>(itemsQuery);

  const categoriesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuCategories'), orderBy('displayOrder', 'asc')) : null,
    [firestore]
  );
  const { data: categories } = useCollection<MenuCategory>(categoriesQuery);
  const categoryMap = useMemo(() => new Map(categories?.map(c => [c.id, getLocalized(c, 'en').name])), [categories]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsByCategory = useMemo(() => {
    const grouped = new Map<string, MenuItem[]>();
    if (!menuItems || !categories) return grouped;

    categories.forEach(cat => {
      const categoryItems = menuItems
        .filter(item => item.categoryId === cat.id)
        .filter(item => {
            const localized = getLocalized(item, 'en');
            return localized.name?.toLowerCase().includes(searchQuery.toLowerCase());
        });
      if (categoryItems.length > 0 || searchQuery === '') {
        grouped.set(cat.id, categoryItems);
      }
    });
    return grouped;
  }, [menuItems, categories, searchQuery]);


  const handleAddNew = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleReorder = async (item: MenuItem, direction: 'up' | 'down') => {
    if (!menuItems || !firestore) return;
    const itemsInCategory = menuItems.filter(i => i.categoryId === item.categoryId).sort((a,b) => a.displayOrder - b.displayOrder);
    
    const currentIndex = itemsInCategory.findIndex(i => i.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= itemsInCategory.length) return;

    const batch = writeBatch(firestore);
    const currentItemRef = doc(firestore, 'menuItems', item.id);
    const targetItemRef = doc(firestore, 'menuItems', itemsInCategory[targetIndex].id);

    batch.update(currentItemRef, { displayOrder: itemsInCategory[targetIndex].displayOrder });
    batch.update(targetItemRef, { displayOrder: item.displayOrder });

    try {
      await batch.commit();
      toast({ title: 'Success', description: 'Item order updated.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not reorder items: ${error.message}` });
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-800 border-zinc-700 w-full"
          />
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800">
            <TableHead className="w-28">Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingItems && <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoadingItems && itemsByCategory.size === 0 && <TableRow><TableCell colSpan={5} className="text-center text-zinc-400 py-8">No menu items found. Add one to get started.</TableCell></TableRow>}
          {Array.from(itemsByCategory.entries()).map(([categoryId, categoryItems]) => (
            <Fragment key={categoryId}>
              <TableRow className="bg-zinc-800/50 border-zinc-700">
                <TableCell colSpan={5} className="font-semibold text-white">
                  {categoryMap.get(categoryId) || 'Uncategorized'}
                </TableCell>
              </TableRow>
              {categoryItems.map((item, index) => {
                const localized = getLocalized(item, 'en');
                return (
                  <TableRow key={item.id} className="border-zinc-700 hover:bg-zinc-800/80">
                    <TableCell>
                       <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => handleReorder(item, 'up')}><ArrowUp className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" disabled={index === categoryItems.length - 1} onClick={() => handleReorder(item, 'down')}><ArrowDown className="h-4 w-4"/></Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium flex items-center gap-4">
                      <Image src={item.imageUrl} alt={localized.name || ''} width={40} height={40} className="rounded-md object-contain bg-zinc-700 p-1" />
                      {localized.name}
                    </TableCell>
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
                              <AlertDialogDescription className="text-zinc-400">This will permanently delete the item "{localized.name}".</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </Fragment>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedItem ? `Editing "${getLocalized(selectedItem, 'en').name}".` : 'Create a new item for your menu.'}
            </DialogDescription>
          </DialogHeader>
          <MenuItemForm menuItem={selectedItem} allItems={menuItems || []} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
