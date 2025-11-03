'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import type { FaqItem } from '@/lib/types';
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
import FaqForm from './FaqForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function FaqManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const faqQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'faq'), orderBy('category')) : null,
    [firestore]
  );
  const { data: faqItems, isLoading } = useCollection<FaqItem>(faqQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | undefined>(undefined);

  const handleAddNew = () => {
    setSelectedFaq(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (faq: FaqItem) => {
    setSelectedFaq(faq);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'faq', id));
      toast({ title: 'Success', description: 'FAQ item deleted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete FAQ: ${error.message}` });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New FAQ Item
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800">
            <TableHead>Question</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoading && faqItems?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-zinc-400 py-8">No FAQ items found.</TableCell></TableRow>}
          {faqItems?.map(faq => (
            <TableRow key={faq.id} className="border-zinc-700 hover:bg-zinc-800">
              <TableCell className="font-medium">{faq.question}</TableCell>
              <TableCell>
                <Badge variant="secondary">{faq.category}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}><Edit className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">This will permanently delete this FAQ item.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(faq.id)}>Delete</AlertDialogAction>
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
            <DialogTitle>{selectedFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
          </DialogHeader>
          <FaqForm faqItem={selectedFaq} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
