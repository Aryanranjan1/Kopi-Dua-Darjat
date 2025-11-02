'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Reply } from 'lucide-react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, Timestamp, orderBy, query } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
}

export default function MessagesPage() {
  const firestore = useFirestore();
  const messagesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'contactMessages'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: messages, isLoading } = useCollection<Omit<ContactMessage, 'id'>>(messagesQuery);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const handleDeleteMessage = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'contactMessages', id);
    await deleteDoc(docRef);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Contact Form Messages</CardTitle>
          <CardDescription className="text-zinc-400">
            Messages submitted through the public website's contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-zinc-800">
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && messages && messages.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-400 py-8">
                        No messages found.
                    </TableCell>
                </TableRow>
              )}
              {messages?.map(message => (
                <TableRow key={message.id} className="border-zinc-700 hover:bg-zinc-800">
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>{message.createdAt?.toDate().toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(message as ContactMessage)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <a href={`mailto:${message.email}?subject=RE: ${message.subject}`} className="inline-flex items-center justify-center">
                      <Button variant="ghost" size="icon">
                        <Reply className="h-4 w-4" />
                      </Button>
                    </a>
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
                            This action cannot be undone. This will permanently delete the message.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteMessage(message.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message Details Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <DialogDescription className="text-zinc-400">
                From: {selectedMessage.name} ({selectedMessage.email}) on {selectedMessage.createdAt?.toDate().toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="bg-zinc-800 p-4 rounded-md">{selectedMessage.message}</p>
            </div>
            <DialogFooter>
               <a href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`} className="w-full sm:w-auto">
                 <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                 </Button>
               </a>
              <Button onClick={() => setSelectedMessage(null)} variant="outline" className="bg-transparent border-zinc-700 hover:bg-zinc-800">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
