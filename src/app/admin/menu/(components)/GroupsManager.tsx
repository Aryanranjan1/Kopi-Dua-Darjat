'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query, getDocs, where } from 'firebase/firestore';
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
import { Loader2, PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import GroupForm from './GroupForm';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

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
    return groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [groups, searchQuery]);

  const handleAddNew = () => {
    setSelectedGroup(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (group: MenuGroup) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;

    // Check if any categories are using this group
    const categoriesInGroupQuery = query(collection(firestore, 'menuCategories'), where('groupId', '==', id));
    const categoriesSnapshot = await getDocs(categoriesInGroupQuery);

    if (!categoriesSnapshot.empty) {
        toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: `Cannot delete group. It is currently used by ${categoriesSnapshot.size} categor(y/ies).`,
        });
        return;
    }

    try {
      await deleteDoc(doc(firestore, 'menuGroups', id));
      toast({ title: 'Success', description: 'Group deleted successfully.' });
    } catch (error: any) {
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
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoading && filteredGroups.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-zinc-400 py-8">No groups found. Add one to get started.</TableCell></TableRow>}
          {filteredGroups?.map(g => (
            <TableRow key={g.id} className="border-zinc-700 hover:bg-zinc-800">
              <TableCell className="font-mono text-sm w-16 text-center">{g.displayOrder}</TableCell>
              <TableCell className="font-medium">{g.name}</TableCell>
              <TableCell className="font-mono text-sm">{g.slug}</TableCell>
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
                        <AlertDialogDescription className="text-zinc-400">This will permanently delete the "{g.name}" group.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(g.id)}>Delete</AlertDialogAction>
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
            <DialogTitle>{selectedGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedGroup ? `Editing the "${selectedGroup.name}" group.` : 'Create a new group for your menu.'}
            </DialogDescription>
          </DialogHeader>
          <GroupForm group={selectedGroup} allGroups={groups || []} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
