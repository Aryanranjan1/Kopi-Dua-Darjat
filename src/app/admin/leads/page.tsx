'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, Timestamp, orderBy, query } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface FranchiseLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  budget: string;
  message: string;
  createdAt: Timestamp;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: Timestamp;
}

const FranchiseLeadsTable = () => {
  const firestore = useFirestore();
  const leadsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'franchiseApplications'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: leads, isLoading } = useCollection<Omit<FranchiseLead, 'id'>>(leadsQuery);
  const [selectedLead, setSelectedLead] = useState<FranchiseLead | null>(null);

  const handleDeleteLead = async (id: string) => {
    if (!firestore) return;
    await deleteDoc(doc(firestore, 'franchiseApplications', id));
    setSelectedLead(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 hover:bg-zinc-800">
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={6} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
          {!isLoading && leads && leads.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-zinc-400 py-8">No franchise leads found.</TableCell></TableRow>}
          {leads?.map(lead => (
            <TableRow key={lead.id} className="border-zinc-700 hover:bg-zinc-800">
              <TableCell className="font-medium">{lead.fullName}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.city}</TableCell>
              <TableCell>{lead.budget}</TableCell>
              <TableCell>{lead.createdAt?.toDate().toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => setSelectedLead(lead as FranchiseLead)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button></AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">This will permanently delete this application.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteLead(lead.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedLead.fullName}</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Franchise inquiry from {selectedLead.city} on {selectedLead.createdAt?.toDate().toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-3 items-center gap-4"><p className="text-zinc-400">Email</p><p className="col-span-2 font-medium">{selectedLead.email}</p></div>
                <div className="grid grid-cols-3 items-center gap-4"><p className="text-zinc-400">Phone</p><p className="col-span-2 font-medium">{selectedLead.phone}</p></div>
                <div className="grid grid-cols-3 items-center gap-4"><p className="text-zinc-400">City/State</p><p className="col-span-2 font-medium">{selectedLead.city}</p></div>
                <div className="grid grid-cols-3 items-center gap-4"><p className="text-zinc-400">Budget</p><p className="col-span-2 font-medium">{selectedLead.budget}</p></div>
                <div className="grid grid-cols-3 items-start gap-4"><p className="text-zinc-400 pt-1">Motivation</p><p className="col-span-2 bg-zinc-800 p-3 rounded-md">{selectedLead.message}</p></div>
            </div>
            <DialogFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive">Delete Application</Button></AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">Are you sure you want to delete this application?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteLead(selectedLead.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              <Button onClick={() => setSelectedLead(null)} variant="outline" className="bg-transparent border-zinc-700 hover:bg-zinc-800">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

const NewsletterTable = () => {
    const firestore = useFirestore();
    const subscribersQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'newsletterSubscribers'), orderBy('createdAt', 'desc')) : null,
      [firestore]
    );
    const { data: subscribers, isLoading } = useCollection<Omit<NewsletterSubscriber, 'id'>>(subscribersQuery);

    const handleDeleteSubscriber = async (id: string) => {
        if (!firestore) return;
        await deleteDoc(doc(firestore, 'newsletterSubscribers', id));
    };

    const exportToCSV = () => {
        if (!subscribers) return;
        const headers = ['Email', 'DateSubscribed'];
        const csvData = subscribers.map(d => `${d.email},${d.createdAt.toDate().toLocaleString()}`).join('\n');
        const blob = new Blob([`${headers.join(',')}\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'newsletter_subscribers.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={exportToCSV} variant="outline" className="bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black">
                    <Download className="mr-2 h-4 w-4" />
                    Export as CSV
                </Button>
            </div>
             <Table>
                <TableHeader>
                    <TableRow className="border-zinc-700 hover:bg-zinc-800">
                        <TableHead>Email</TableHead>
                        <TableHead>Date Subscribed</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>}
                    {!isLoading && subscribers && subscribers.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-zinc-400 py-8">No subscribers found.</TableCell></TableRow>}
                    {subscribers?.map(signup => (
                        <TableRow key={signup.id} className="border-zinc-700 hover:bg-zinc-800">
                            <TableCell>{signup.email}</TableCell>
                            <TableCell>{signup.createdAt?.toDate().toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-zinc-400">
                                                This will permanently delete the subscriber.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteSubscriber(signup.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default function LeadsPage() {
  return (
    <div className="space-y-8">
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage franchise applications and newsletter subscribers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="franchise" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
              <TabsTrigger value="franchise" className="data-[state=active]:bg-zinc-950">Franchise Applications</TabsTrigger>
              <TabsTrigger value="newsletter" className="data-[state=active]:bg-zinc-950">Newsletter Subscribers</TabsTrigger>
            </TabsList>
            <TabsContent value="franchise" className="mt-4">
              <FranchiseLeadsTable />
            </TabsContent>
            <TabsContent value="newsletter" className="mt-4">
              <NewsletterTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
