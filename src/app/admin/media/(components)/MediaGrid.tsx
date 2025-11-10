'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import ImageUpload from '@/components/shared/ImageUpload';
import { set } from 'lodash';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

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

export default function MediaGrid({ assets, onUpdate }: { assets: MediaAsset[], onUpdate: () => void }) {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [newUrl, setNewUrl] = useState('');
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
        const [collectionName, docId] = selectedAsset.path.split('.');
        const propertyPath = selectedAsset.path.split('.').slice(2).join('.');
        
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
            description: 'Editing hardcoded JSON files is not supported via this interface. Please update the file directly in your codebase.'
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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {assets.map((asset) => (
          <MediaCard key={asset.path} asset={asset} onEdit={handleEditClick} />
        ))}
      </div>
      
      {assets.length === 0 && (
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
           <div className="flex justify-between">
                <Button variant="destructive" onClick={handleDelete} disabled={selectedAsset?.source === 'json'}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete (Not Implemented)
                </Button>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setSelectedAsset(null)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={selectedAsset?.url === newUrl}>Save Changes</Button>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
