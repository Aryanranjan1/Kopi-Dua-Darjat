'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FaqManager from './(components)/FaqManager';
import TestimonialsManager from './(components)/TestimonialsManager';

export default function FaqTestimonialsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">FAQ & Testimonials</h1>
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Manage Content</CardTitle>
          <CardDescription className="text-zinc-400">
            Edit, add, or remove FAQs and testimonials displayed on your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
              <TabsTrigger value="faq" className="data-[state=active]:bg-zinc-950">FAQs</TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:bg-zinc-950">Testimonials</TabsTrigger>
            </TabsList>
            <TabsContent value="faq" className="mt-4">
              <FaqManager />
            </TabsContent>
            <TabsContent value="testimonials" className="mt-4">
              <TestimonialsManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
