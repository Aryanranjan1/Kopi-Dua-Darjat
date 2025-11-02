'use client';
import { useState } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoriesTable from './(components)/CategoriesTable';
import MenuItemsTable from './(components)/MenuItemsTable';

// export const metadata: Metadata = {
//   title: 'Menu Management',
//   description: 'Manage menu items and categories for Kopi Dua Darjat.',
// };

export default function MenuPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Menu Management</h1>
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardContent className="pt-6">
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
              <TabsTrigger value="items" className="data-[state=active]:bg-zinc-950">Menu Items</TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-zinc-950">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="items" className="mt-4">
              <MenuItemsTable />
            </TabsContent>
            <TabsContent value="categories" className="mt-4">
              <CategoriesTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
