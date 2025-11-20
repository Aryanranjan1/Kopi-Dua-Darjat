
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query, where } from 'firebase/firestore';
import type { Promotion } from '@/lib/types';
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
import { Loader2, PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import PromotionForm from './PromotionForm';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, getLocalized, getDiscountDisplay } from '@/lib/utils';


const getStatus = (promo: Promotion): 'active' | 'scheduled' | 'expired' => {
  const now = new Date();
  const startDate = promo.startDate.toDate();
  const endDate = promo.endDate.toDate();
  if (now < startDate) return 'scheduled';
  if (now > endDate) return 'expired';
  return 'active';
}

export default function PromotionsManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const promosQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'promotions'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: promotions, isLoading } = useCollection<Promotion>(promosQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPromotions = useMemo(() => {
    if (!promotions) return [];
    return promotions.filter(promo => {
      const localized = getLocalized(promo, 'en');
      const matchesSearch = localized.title?.toLowerCase().includes(searchQuery.toLowerCase());
      if (statusFilter === 'all') return matchesSearch;
      return getStatus(promo) === statusFilter && matchesSearch;
    });
  }, [promotions, searchQuery, statusFilter]);

  const handleAddNew = () => {
    setSelectedPromotion(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'promotions', id));
      toast({ title: 'Success', description: 'Promotion deleted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete promotion: ${error.message}` });
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex-grow w-full flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search promotions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-800 border-zinc-700 w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto flex-shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Promotion
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800/80">
            <TableHead>Title</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Links</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={6} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoading && filteredPromotions.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-zinc-400 py-8">No promotions found.</TableCell></TableRow>}
          {filteredPromotions?.map(promo => {
            const status = getStatus(promo);
            const localized = getLocalized(promo, 'en');
            return (
            <TableRow key={promo.id} className="border-zinc-700 hover:bg-zinc-800/80">
              <TableCell className="font-medium">{localized.title}</TableCell>
              <TableCell>
                {getDiscountDisplay(promo)}
              </TableCell>
              <TableCell className="text-xs">
                {format(promo.startDate.toDate(), 'dd/MM/yy')} - {format(promo.endDate.toDate(), 'dd/MM/yy')}
              </TableCell>
              <TableCell>
                <Badge variant={status === 'active' ? 'default' : status === 'expired' ? 'destructive' : 'secondary'} className={cn(
                  status === 'active' && 'bg-green-600',
                  status === 'expired' && 'bg-red-700',
                  status === 'scheduled' && 'bg-blue-600'
                )}>
                  {status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">
                <div>Items: {promo.menuItemIds?.length || 0}</div>
                <div>Outlets: {promo.outletIds?.length ? promo.outletIds.length : 'All'}</div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(promo)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">This will permanently delete the "{localized.title}" promotion.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(promo.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPromotion ? 'Edit Promotion' : 'Add New Promotion'}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedPromotion ? `Editing "${getLocalized(selectedPromotion, 'en').title}".` : 'Create a new campaign.'}
            </DialogDescription>
          </DialogHeader>
          <PromotionForm promotion={selectedPromotion} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
