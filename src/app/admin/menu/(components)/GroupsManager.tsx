
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query, getDocs, where, writeBatch, setDoc } from 'firebase/firestore';
import type { MenuGroup } from '@/lib/types';
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
import GroupForm from './GroupForm';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { getLocalized } from '@/lib/utils';

export default function GroupsManager() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const groupsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuGroups'), orderBy('displayOrder', 'asc')) : null,
    [firestore]
  );
  const { data: groups, isLoading } = useCollection<MenuGroup>(groupsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<MenuGroup | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    if (!searchQuery) return groups;
    return groups.filter(g => getLocalized(g, 'en').name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [groups, searchQuery]);

  const handleAddNew = () => {
    setSelectedGroup(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (group: MenuGroup) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  };

  const handleReorder = async (group: MenuGroup, direction: 'up' | 'down') => {
    if (!groups || !firestore) return;

    const currentIndex = groups.findIndex(g => g.id === group.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= groups.length) return;

    const batch = writeBatch(firestore);
    const currentGroupRef = doc(firestore, 'menuGroups', group.id);
    const targetGroupRef = doc(firestore, 'menuGroups', groups[targetIndex].id);

    batch.update(currentGroupRef, { displayOrder: groups[targetIndex].displayOrder });
    batch.update(targetGroupRef, { displayOrder: group.displayOrder });

    try {
      await batch.commit();
      toast({ title: 'Success', description: 'Group order updated.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not reorder groups: ${error.message}` });
    }
  };

  const handleToggleStatus = async (group: MenuGroup) => {
    if (!firestore) return;
    const groupRef = doc(firestore, 'menuGroups', group.id);
    const newStatus = group.status === 'published' ? 'draft' : 'published';
    try {
        await setDoc(groupRef, { status: newStatus }, { merge: true });
        toast({ title: 'Status Updated', description: `${getLocalized(group, 'en').name} is now ${newStatus}.` });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: `Could not update status: ${error.message}` });
    }
  }

  const handleDelete = async (groupId: string) => {
    if (!firestore) return;

    try {
      const batch = writeBatch(firestore);
      const groupRef = doc(firestore, 'menuGroups', groupId);

      // Find categories in the group
      const categoriesQuery = query(collection(firestore, 'menuCategories'), where('groupId', '==', groupId));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      
      const categoryIds = categoriesSnapshot.docs.map(d => d.id);

      // Delete items within each category
      if (categoryIds.length > 0) {
        const itemsQuery = query(collection(firestore, 'menuItems'), where('categoryId', 'in', categoryIds));
        const itemsSnapshot = await getDocs(itemsQuery);
        itemsSnapshot.forEach(itemDoc => batch.delete(itemDoc.ref));
      }
      
      // Delete categories
      categoriesSnapshot.forEach(categoryDoc => batch.delete(categoryDoc.ref));
      
      // Delete the group itself
      batch.delete(groupRef);

      await batch.commit();
      toast({ title: 'Success', description: 'Group and all its contents deleted successfully.' });
    } catch (error: any) {
      console.error("Error deleting group and its contents: ", error);
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete group: ${error.message}` });
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-800 border-zinc-700 w-full"
          />
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Group
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800">
            <TableHead>Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoading && filteredGroups.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-zinc-400 py-8">No groups found. Add one to get started.</TableCell></TableRow>}
          {filteredGroups?.map((g, index) => {
            const localized = getLocalized(g, 'en');
            return (
              <TableRow key={g.id} className="border-zinc-700 hover:bg-zinc-800">
                <TableCell className="w-28">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => handleReorder(g, 'up')}><ArrowUp className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" disabled={index === filteredGroups.length - 1} onClick={() => handleReorder(g, 'down')}><ArrowDown className="h-4 w-4"/></Button>
                    </div>
                </TableCell>
                <TableCell className="font-medium">{localized.name}</TableCell>
                <TableCell>
                   <Switch
                      checked={g.status === 'published'}
                      onCheckedChange={() => handleToggleStatus(g)}
                      aria-label={`Publish status for ${localized.name}`}
                   />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(g)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                      <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">This will permanently delete the "{localized.name}" group and all categories and items within it.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(g.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedGroup ? `Editing the "${getLocalized(selectedGroup, 'en').name}" group.` : 'Create a new group for your menu.'}
            </DialogDescription>
          </DialogHeader>
          <GroupForm group={selectedGroup} allGroups={groups || []} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
