'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query, where } from 'firebase/firestore';
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
import { Loader2, PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import CategoryForm from './CategoryForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function CategoriesManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const categoriesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuCategories'), orderBy('displayOrder', 'asc')) : null,
    [firestore]
  );
  const { data: categories, isLoading: isLoadingCategories } = useCollection<MenuCategory>(categoriesQuery);

  const groupsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuGroups')) : null,
    [firestore]
  );
  const { data: groups } = useCollection<MenuGroup>(groupsQuery);
  const groupMap = useMemo(() => new Map(groups?.map(g => [g.id, g.name])), [groups]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!searchQuery) return categories;
    const lowercasedQuery = searchQuery.toLowerCase();
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(lowercasedQuery) ||
      (groupMap.get(cat.groupId) || '').toLowerCase().includes(lowercasedQuery)
    );
  }, [categories, searchQuery, groupMap]);
  
  const handleAddNew = () => {
    setSelectedCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;

    // Check if any menu items are using this category
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
            <TableHead>Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingCategories && <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoadingCategories && filteredCategories.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-zinc-400 py-8">No categories found. Add one to get started.</TableCell></TableRow>}
          {filteredCategories?.map(cat => (
            <TableRow key={cat.id} className="border-zinc-700 hover:bg-zinc-800">
              <TableCell className="font-mono text-sm w-16 text-center">{cat.displayOrder}</TableCell>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{groupMap.get(cat.groupId) || 'N/A'}</Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{cat.slug}</TableCell>
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
