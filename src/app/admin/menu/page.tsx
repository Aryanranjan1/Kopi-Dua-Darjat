'use client';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MenuItemsManager from './(components)/MenuItemsManager';
import CategoriesManager from './(components)/CategoriesManager';
import GroupsManager from './(components)/GroupsManager';

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
            <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
              <TabsTrigger value="items" className="data-[state=active]:bg-zinc-950">Menu Items</TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-zinc-950">Categories</TabsTrigger>
              <TabsTrigger value="groups" className="data-[state=active]:bg-zinc-950">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="items" className="mt-4">
              <MenuItemsManager />
            </TabsContent>
            <TabsContent value="categories" className="mt-4">
              <CategoriesManager />
            </TabsContent>
            <TabsContent value="groups" className="mt-4">
              <GroupsManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
