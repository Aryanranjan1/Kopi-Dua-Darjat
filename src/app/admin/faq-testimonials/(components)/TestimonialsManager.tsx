
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import type { Testimonial } from '@/lib/types';
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
import TestimonialForm from '../../shared/TestimonialForm';
import { useToast } from '@/hooks/use-toast';
import { useMediaAsset } from '@/lib/media';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { getLocalized } from '@/lib/utils';

const TestimonialImage = ({ imageId }: { imageId: string }) => {
    const { asset, isLoading } = useMediaAsset(imageId);
    if(isLoading) return <Skeleton className="h-10 w-10 rounded-full" />;
    if(!asset) return <div className="h-10 w-10 rounded-full bg-zinc-700" />;
    return <Image src={asset.imageUrl} alt={asset.description} width={40} height={40} className="rounded-full object-cover" />;
}

export default function TestimonialsManager() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const testimonialsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'testimonials'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | undefined>(undefined);

  const handleAddNew = () => {
    setSelectedTestimonial(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'testimonials', id));
      toast({ title: 'Success', description: 'Testimonial deleted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete testimonial: ${error.message}` });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Testimonial
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800">
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Quote</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoading && testimonials?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-zinc-400 py-8">No testimonials found.</TableCell></TableRow>}
          {testimonials?.map(testimonial => {
            const localized = getLocalized(testimonial, 'en');
            return (
              <TableRow key={testimonial.id} className="border-zinc-700 hover:bg-zinc-800">
                <TableCell><TestimonialImage imageId={testimonial.image} /></TableCell>
                <TableCell className="font-medium">{localized.name}</TableCell>
                <TableCell>{localized.designation}</TableCell>
                <TableCell className="text-zinc-400 truncate max-w-xs">"{localized.quote}"</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">This will permanently delete this testimonial.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(testimonial.id)}>Delete</AlertDialogAction>
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
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
          </DialogHeader>
          <TestimonialForm testimonial={selectedTestimonial} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
