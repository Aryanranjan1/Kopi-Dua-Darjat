
'use client';
import { useState } from 'react';
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
import { mockFranchiseLeads, mockNewsletterSignups } from '@/lib/data'; // Import mock data

export default function LeadsPage() {
  const [franchiseLeads, setFranchiseLeads] = useState(mockFranchiseLeads);
  const [newsletterSignups, setNewsletterSignups] = useState(mockNewsletterSignups);
  const [selectedLead, setSelectedLead] = useState<(typeof mockFranchiseLeads)[0] | null>(null);

  const handleViewLead = (lead: (typeof mockFranchiseLeads)[0]) => {
    setSelectedLead(lead);
    // Mark as read
    setFranchiseLeads(franchiseLeads.map(l => l.id === lead.id ? { ...l, read: true } : l));
  };

  const handleDeleteLead = (id: string) => {
    setFranchiseLeads(franchiseLeads.filter(l => l.id !== id));
  };

  const handleDeleteNewsletter = (id: string) => {
    setNewsletterSignups(newsletterSignups.filter(n => n.id !== id));
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Sign Up Date'];
    const rows = newsletterSignups.map(signup => [signup.email, signup.date]);
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'newsletter_signups.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Franchise Leads Section */}
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Franchise Leads</CardTitle>
          <CardDescription className="text-zinc-400">
            Inquiries from potential franchise partners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-zinc-800">
                <TableHead className="w-[20px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {franchiseLeads.map(lead => (
                <TableRow key={lead.id} className="border-zinc-700 hover:bg-zinc-800">
                  <TableCell>
                    {!lead.read && <div className="w-2 h-2 rounded-full bg-yellow-400"></div>}
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.city}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewLead(lead)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLead(lead.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Newsletter Signups Section */}
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Newsletter Signups</CardTitle>
              <CardDescription className="text-zinc-400">
                Emails collected from the newsletter signup form.
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline" className="bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black">
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-zinc-800">
                <TableHead>Email</TableHead>
                <TableHead>Sign Up Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsletterSignups.map(signup => (
                <TableRow key={signup.id} className="border-zinc-700 hover:bg-zinc-800">
                  <TableCell>{signup.email}</TableCell>
                  <TableCell>{signup.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNewsletter(signup.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lead Details Dialog */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>{selectedLead.name}</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Franchise inquiry from {selectedLead.city}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-zinc-400 text-right">Email</p>
                <p className="col-span-3 font-medium">{selectedLead.email}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-zinc-400 text-right">Budget</p>
                <p className="col-span-3 font-medium">{selectedLead.budget}</p>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <p className="text-zinc-400 text-right pt-1">Message</p>
                <p className="col-span-3 bg-zinc-800 p-3 rounded-md">{selectedLead.message}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedLead(null)} variant="outline" className="bg-transparent border-zinc-700 hover:bg-zinc-800">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
