
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import ImageUpload from '@/components/shared/ImageUpload';
import { set } from 'lodash';
import { Pencil, Loader2, RefreshCw, Search } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type MediaAsset = {
  id: string;
  url: string;
  type: 'image' | 'video' | 'icon';
  source: 'json' | 'firestore';
  path: string; 
};

type MediaGroup = {
  group: string;
  assets: MediaAsset[];
};

const MediaCard = ({ asset, onEdit }: { asset: MediaAsset; onEdit: (asset: MediaAsset) => void; }) => {
  return (
    <div className="relative group aspect-square bg-zinc-800 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer" onClick={() => onEdit(asset)}>
      {asset.type === 'video' ? (
        <video src={asset.url} muted loop playsInline className="w-full h-full object-cover" />
      ) : (
        <Image src={asset.url} alt={asset.id} fill className="w-full h-full object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 flex flex-col justify-end">
        <p className="text-xs font-mono text-white truncate" title={asset.path}>{asset.path}</p>
        <p className="text-xs text-zinc-400 capitalize">{asset.source}</p>
      </div>
       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="default" className="h-8 w-8 pointer-events-none">
              <Pencil className="h-4 w-4" />
          </Button>
      </div>
    </div>
  );
};

export default function MediaAssetManager() {
  const [groupedAssets, setGroupedAssets] = useState<MediaGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const firestore = useFirestore();

  const scanForMedia = useCallback(async () => {
    setIsLoading(true);
    toast({ title: 'Scanning for media...' });
    try {
      const response = await fetch('/api/scan-media-grouped');
      if (!response.ok) throw new Error('Failed to fetch media assets.');
      const data = await response.json();
      setGroupedAssets(data.groupedAssets);
      const totalAssets = data.groupedAssets.reduce((acc: number, group: MediaGroup) => acc + group.assets.length, 0);
      toast({ title: 'Scan Complete!', description: `Found ${totalAssets} media assets.` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Scan Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    scanForMedia();
  }, [scanForMedia]);

  const handleEditClick = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setNewUrl(asset.url);
  };
  
  const handleSave = async () => {
    if (!selectedAsset) return;

    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore not available.' });
      return;
    }

    try {
      const [collectionName, docId, ...rest] = selectedAsset.path.split('.');
      const propertyPath = rest.join('.');
      
      const docRef = doc(firestore, collectionName, docId);
      
      const updateData: { [key: string]: any } = {};
      set(updateData, propertyPath, newUrl);

      await updateDoc(docRef, updateData);
      toast({ title: 'Success', description: 'Firestore media updated.' });
      scanForMedia();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    }

    setSelectedAsset(null);
  };

  const filteredGroupedAssets = React.useMemo(() => {
    if (!searchQuery) return groupedAssets;
    
    return groupedAssets.map(group => {
      const filteredAssets = group.assets.filter(asset => 
        asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.path.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...group, assets: filteredAssets };
    }).filter(group => group.assets.length > 0);

  }, [groupedAssets, searchQuery]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                  placeholder="Search media by ID or path..."
                  className="pl-9 bg-zinc-800 border-zinc-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          <Button onClick={scanForMedia} disabled={isLoading} variant="outline" className="bg-zinc-800 border-zinc-700">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4" />}
              Rescan
          </Button>
      </div>

      {isLoading ? (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : (
        <Accordion type="multiple" defaultValue={filteredGroupedAssets.map(g => g.group)} className="w-full space-y-2">
            {filteredGroupedAssets.map(({ group, assets }) => (
                <AccordionItem key={group} value={group} className="bg-zinc-900/50 border-zinc-800 rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">{group} ({assets.length})</AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                            {assets.map((asset) => (
                                <MediaCard key={asset.path} asset={asset} onEdit={handleEditClick} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      )}
      
      {groupedAssets.length === 0 && !isLoading && (
          <p className="text-center text-zinc-500 py-16">No media assets found.</p>
      )}

      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit Media Asset</DialogTitle>
            <DialogDescription>
              Replace the URL for <span className="font-mono text-primary bg-zinc-800 px-1 rounded">{selectedAsset?.path}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative aspect-video w-full bg-zinc-800 rounded-lg overflow-hidden">
                {selectedAsset?.url && (
                    <Image src={selectedAsset.url} alt="Current media" fill className="w-full h-full object-contain" />
                )}
            </div>
            <ImageUpload 
                label="New Image/Video URL"
                value={newUrl}
                onChange={setNewUrl}
                folderName={`media_library/${selectedAsset?.id || 'general'}`}
            />
          </div>
           <DialogFooter>
              <Button variant="ghost" onClick={() => setSelectedAsset(null)}>Cancel</Button>
              <Button onClick={handleSave} disabled={selectedAsset?.url === newUrl}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
