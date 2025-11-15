'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaAssetManager from './MediaAssetManager';
import StaticContentManager from './StaticContentManager';

export default function WebsiteContentManager() {
  return (
    <Tabs defaultValue="static-content" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
        <TabsTrigger value="static-content">Static Content</TabsTrigger>
        <TabsTrigger value="media-assets">Media Assets</TabsTrigger>
      </TabsList>
      <TabsContent value="static-content" className="mt-6">
        <StaticContentManager />
      </TabsContent>
      <TabsContent value="media-assets" className="mt-6">
        <MediaAssetManager />
      </TabsContent>
    </Tabs>
  );
}
