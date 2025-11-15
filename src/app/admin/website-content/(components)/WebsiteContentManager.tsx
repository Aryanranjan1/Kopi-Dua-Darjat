
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaAssetManager from './MediaAssetManager';
import StaticContentManager from './StaticContentManager';
import CommunityItemsManager from './CommunityItemsManager';

export default function WebsiteContentManager() {
  return (
    <Tabs defaultValue="static-content" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
        <TabsTrigger value="static-content">Static Content</TabsTrigger>
        <TabsTrigger value="community-grid">Community Grid</TabsTrigger>
        <TabsTrigger value="media-assets">Media Assets</TabsTrigger>
      </TabsList>
      <TabsContent value="static-content" className="mt-6">
        <StaticContentManager />
      </TabsContent>
      <TabsContent value="community-grid" className="mt-6">
        <CommunityItemsManager />
      </TabsContent>
      <TabsContent value="media-assets" className="mt-6">
        <MediaAssetManager />
      </TabsContent>
    </Tabs>
  );
}

    