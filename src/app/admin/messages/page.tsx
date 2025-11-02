
'use client';
import { useState } from 'react';
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
import { mockMessages } from '@/lib/data'; // Import mock data

export default function MessagesPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<(typeof mockMessages)[0] | null>(null);

  const handleViewMessage = (message: (typeof mockMessages)[0]) => {
    setSelectedMessage(message);
    // Mark as read
    setMessages(messages.map(m => m.id === message.id ? { ...m, read: true } : m));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
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
                <TableHead className="w-[20px]"></TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map(message => (
                <TableRow key={message.id} className="border-zinc-700 hover:bg-zinc-800">
                  <TableCell>
                    {!message.read && <div className="w-2 h-2 rounded-full bg-yellow-400"></div>}
                  </TableCell>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewMessage(message)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <a href={`mailto:${message.email}?subject=RE: ${message.subject}`} className="inline-flex items-center justify-center">
                      <Button variant="ghost" size="icon">
                        <Reply className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(message.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
                From: {selectedMessage.name} ({selectedMessage.email})
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
