'use client';

import { useState, useMemo, Fragment } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query, where, writeBatch, getDocs, setDoc } from 'firebase/firestore';
import type { MenuCategory, MenuGroup } from '@/lib/types';
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
import { Loader2, PlusCircle, Edit, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import CategoryForm from './CategoryForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function CategoriesManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const categoriesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuCategories'), orderBy('displayOrder', 'asc')) : null,
    [firestore]
  );
  const { data: categories, isLoading: isLoadingCategories } = useCollection<MenuCategory>(categoriesQuery);

  const groupsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuGroups'), orderBy('displayOrder', 'asc')) : null,
    [firestore]
  );
  const { data: groups } = useCollection<MenuGroup>(groupsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const categoriesByGroup = useMemo(() => {
    const grouped = new Map<string, MenuCategory[]>();
    if (!categories || !groups) return grouped;

    groups.forEach(group => {
      const groupCategories = categories
        .filter(cat => cat.groupId === group.id)
        .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (groupCategories.length > 0 || searchQuery === '') {
        grouped.set(group.id, groupCategories);
      }
    });
    return grouped;
  }, [categories, groups, searchQuery]);
  
  const handleAddNew = () => {
    setSelectedCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleReorder = async (category: MenuCategory, direction: 'up' | 'down') => {
    if (!categories || !firestore) return;
    const itemsInGroup = categories.filter(c => c.groupId === category.groupId).sort((a,b) => a.displayOrder - b.displayOrder);
    
    const currentIndex = itemsInGroup.findIndex(c => c.id === category.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= itemsInGroup.length) return;

    const batch = writeBatch(firestore);
    const currentCatRef = doc(firestore, 'menuCategories', category.id);
    const targetCatRef = doc(firestore, 'menuCategories', itemsInGroup[targetIndex].id);

    batch.update(currentCatRef, { displayOrder: itemsInGroup[targetIndex].displayOrder });
    batch.update(targetCatRef, { displayOrder: category.displayOrder });

    try {
      await batch.commit();
      toast({ title: 'Success', description: 'Category order updated.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not reorder categories: ${error.message}` });
    }
  };

  const handleToggleStatus = async (category: MenuCategory) => {
    if (!firestore) return;
    const catRef = doc(firestore, 'menuCategories', category.id);
    const newStatus = category.status === 'published' ? 'draft' : 'published';
    try {
      await setDoc(catRef, { status: newStatus }, { merge: true });
      toast({ title: 'Status Updated', description: `${category.name} is now ${newStatus}.` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not update status: ${error.message}` });
    }
  };


  const handleDelete = async (id: string) => {
    if (!firestore) return;

    const itemsInCatQuery = query(collection(firestore, 'menuItems'), where('categoryId', '==', id));
    const itemsSnapshot = await getDocs(itemsInCatQuery);

    if (!itemsSnapshot.empty) {
        toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: `Cannot delete category. It is currently used by ${itemsSnapshot.size} menu item(s).`,
        });
        return;
    }

    try {
      await deleteDoc(doc(firestore, 'menuCategories', id));
      toast({ title: 'Success', description: 'Category deleted successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete category: ${error.message}` });
    }
  };

  const groupMap = useMemo(() => new Map(groups?.map(g => [g.id, g.name])), [groups]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-800 border-zinc-700 w-full"
          />
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800">
            <TableHead className="w-28">Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingCategories && <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoadingCategories && categoriesByGroup.size === 0 && <TableRow><TableCell colSpan={4} className="text-center text-zinc-400 py-8">No categories found. Add one to get started.</TableCell></TableRow>}
          {Array.from(categoriesByGroup.entries()).map(([groupId, groupCategories]) => (
            <Fragment key={groupId}>
              <TableRow className="bg-zinc-800/50 border-zinc-700">
                <TableCell colSpan={4} className="font-bold text-base text-white">
                  {groupMap.get(groupId) || 'Uncategorized'}
                </TableCell>
              </TableRow>
              {groupCategories.map((cat, index) => (
                <TableRow key={cat.id} className="border-zinc-700 hover:bg-zinc-800/80">
                  <TableCell>
                     <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => handleReorder(cat, 'up')}><ArrowUp className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="icon" disabled={index === groupCategories.length - 1} onClick={() => handleReorder(cat, 'down')}><ArrowDown className="h-4 w-4"/></Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={cat.status === 'published'}
                      onCheckedChange={() => handleToggleStatus(cat)}
                      aria-label={`Publish status for ${cat.name}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">This will permanently delete the "{cat.name}" category.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(cat.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedCategory ? `Editing the "${selectedCategory.name}" category.` : 'Create a new category for your menu items.'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm category={selectedCategory} allCategories={categories || []} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
