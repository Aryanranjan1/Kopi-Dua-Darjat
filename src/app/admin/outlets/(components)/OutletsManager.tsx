
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import type { Outlet, MenuItem } from '@/lib/types';
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
import { Loader2, PlusCircle, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { cn, getLocalized } from '@/lib/utils';
import Link from 'next/link';
import { Pagination } from '@/components/shared/Pagination';
import OutletForm from './OutletForm';

const OUTLETS_PER_PAGE = 8;

export default function OutletsManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | undefined>(undefined);
  
  const outletsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'outlets')) : null,
    [firestore]
  );
  const { data: outlets, isLoading: isLoadingOutlets } = useCollection<Outlet>(outletsQuery);

  const { data: menuItems, isLoading: isLoadingItems } = useCollection<MenuItem>(
    useMemoFirebase(() => firestore ? query(collection(firestore, 'menuItems')) : null, [firestore])
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOutlets = useMemo(() => {
    if (!outlets) return [];
    
    const sortedByName = [...outlets].sort((a, b) => {
        const nameA = getLocalized(a, 'en').name || '';
        const nameB = getLocalized(b, 'en').name || '';
        return nameA.localeCompare(nameB);
    });

    if (!searchQuery) return sortedByName;

    return sortedByName.filter(outlet => {
      const localized = getLocalized(outlet, 'en');
      const name = localized.name || '';
      const address = localized.address || '';
      const city = localized.city || '';
      const state = localized.state || '';
      
      return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             address.toLowerCase().includes(searchQuery.toLowerCase()) ||
             city.toLowerCase().includes(searchQuery.toLowerCase()) ||
             state.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [outlets, searchQuery]);

  const totalPages = Math.ceil(filteredOutlets.length / OUTLETS_PER_PAGE);
  const paginatedOutlets = filteredOutlets.slice(
    (currentPage - 1) * OUTLETS_PER_PAGE,
    currentPage * OUTLETS_PER_PAGE
  );

  const handleAddNew = () => {
    setSelectedOutlet(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'outlets', id));
      toast({ title: 'Success', description: 'Outlet deleted successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete outlet: ${error.message}` });
    }
  };
  
  const isDataLoading = isLoadingOutlets || isLoadingItems;
  
  // Effect to close dialog if the selected outlet is deleted
  useEffect(() => {
    if(selectedOutlet && !outlets?.find(o => o.id === selectedOutlet.id)) {
      setIsDialogOpen(false);
    }
  }, [outlets, selectedOutlet]);


  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search by name, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-800 border-zinc-700 w-full"
          />
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto flex-shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Outlet
        </Button>
      </div>
      <div className="overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-zinc-900 z-10">
            <TableRow className="border-zinc-700 hover:bg-zinc-800/80">
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingOutlets && <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
            {!isLoadingOutlets && paginatedOutlets.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-zinc-400 py-8">No outlets found.</TableCell></TableRow>}
            {paginatedOutlets?.map(outlet => {
                const localized = getLocalized(outlet, 'en');
                return (
              <TableRow key={outlet.id} className="border-zinc-700 hover:bg-zinc-800/80">
                <TableCell className="font-medium">{localized.name}</TableCell>
                <TableCell>{localized.city}</TableCell>
                <TableCell>{localized.state}</TableCell>
                <TableCell>
                  <Badge variant={outlet.status === 'active' ? 'default' : 'destructive'} className={cn(
                    outlet.status === 'active' ? 'bg-green-600' : 'bg-red-700'
                  )}>
                    {outlet.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon" disabled={outlet.status === 'inactive'}>
                    <Link href={`/${outlet.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(outlet)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                      <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">This will permanently delete the "{localized.name}" outlet.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(outlet.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>

       <div className="mt-4">
         <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
       </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{selectedOutlet ? `Edit: ${getLocalized(selectedOutlet, 'en').name}` : 'Create New Outlet'}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Manage all details for this outlet and its microsite.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-hidden">
                    {isDataLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <OutletForm 
                            outlet={selectedOutlet} 
                            allItems={menuItems || []} 
                            onSuccess={() => setIsDialogOpen(false)} 
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}
