'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import ImageUpload from '@/components/shared/ImageUpload';
import { set } from 'lodash';
import { Pencil, Trash2, Loader2, RefreshCw, Search } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

type MediaAsset = {
  id: string;
  url: string;
  type: 'image' | 'video' | 'icon';
  source: 'json' | 'firestore';
  path: string; // e.g., 'home.hero.image' or 'placeholderImages[0].imageUrl'
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

export default function MediaGrid({ assets, onUpdate, isLoading }: { assets: MediaAsset[], onUpdate: () => void, isLoading: boolean }) {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleEditClick = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setNewUrl(asset.url);
  };
  
  const handleSave = async () => {
    if (!selectedAsset) return;

    if (selectedAsset.source === 'firestore') {
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
        onUpdate();
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
      }
    } else {
        toast({
            variant: 'destructive',
            title: 'Action Not Supported',
            description: 'Editing hardcoded JSON files is not supported. Please tell me what to change, and I will update the file for you.'
        });
    }

    setSelectedAsset(null);
  };
  
  const handleDelete = () => {
      if (!selectedAsset) return;
      
      toast({
            variant: 'destructive',
            title: 'Action Not Supported',
            description: 'Deleting media assets from the codebase is not supported.'
        });
  }

  const filteredMedia = React.useMemo(() => {
    if (!searchQuery) return assets;
    return assets.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                  placeholder="Search media by ID or URL..."
                  className="pl-9 bg-zinc-800 border-zinc-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          <Button onClick={onUpdate} disabled={isLoading} variant="outline" className="bg-zinc-800 border-zinc-700">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh
          </Button>
      </div>

      {isLoading ? (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {filteredMedia.map((asset) => (
                <MediaCard key={asset.path} asset={asset} onEdit={handleEditClick} />
                ))}
            </div>
            
            {assets.length === 0 && (
                <p className="text-center text-zinc-500 py-16">No media assets found.</p>
            )}
        </>
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
           <DialogFooter className="justify-between sm:justify-between">
                <Button variant="destructive" onClick={handleDelete} disabled={selectedAsset?.source === 'json'}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setSelectedAsset(null)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={selectedAsset?.url === newUrl}>Save Changes</Button>
                </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
