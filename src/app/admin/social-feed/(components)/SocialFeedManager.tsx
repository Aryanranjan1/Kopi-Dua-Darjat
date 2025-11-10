
'use client';

import React, { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, updateDoc, writeBatch, query, orderBy, setDoc } from 'firebase/firestore';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Trash, Pin, PinOff, Eye, EyeOff, PlusCircle, Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import SocialPostForm from './SocialPostForm';

const PostTile = ({ post, onAction, onEdit }: { post: PublicInstaPost; onAction: (action: 'delete' | 'pin' | 'visible', postId: string, currentStatus?: boolean) => void; onEdit: (post: PublicInstaPost) => void; }) => {
    const isVideo = post.mediaType === 'VIDEO';
    return (
        <div className={`relative group overflow-hidden bg-zinc-800 ${isVideo ? 'aspect-[9/16]' : 'aspect-square'}`} onClick={() => onEdit(post)}>
             {post.mediaType === 'VIDEO' ? (
                <video src={post.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            ) : (
                <img src={post.mediaUrl} alt={post.caption || 'Instagram post'} className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-bold">@{post.username}</span>
                <span className="text-white text-xs mt-1 font-mono">ID: {post.id}</span>
            </div>

            <div className="absolute top-1 right-1 flex flex-col gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={(e) => { e.stopPropagation(); onAction('pin', post.id, post.pinned); }}>
                    {post.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={(e) => { e.stopPropagation(); onAction('visible', post.id, post.visible); }}>
                    {post.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="destructive" className="h-7 w-7 bg-red-600/80 hover:bg-red-500" onClick={(e) => { e.stopPropagation(); onAction('delete', post.id); }}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            {!post.visible && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <EyeOff className="h-10 w-10 text-zinc-500" />
                </div>
            )}
            {post.pinned && (
                <Pin className="absolute top-2 left-2 h-5 w-5 text-white bg-black/50 p-1 rounded-full" />
            )}
        </div>
    );
};


export default function SocialFeedManager() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<PublicInstaPost | undefined>(undefined);
    const [isSeeding, setIsSeeding] = useState(false);
    
    const feedQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'public_insta_feed'), orderBy('rank', 'asc')) : null,
        [firestore]
    );
    const { data: posts, isLoading } = useCollection<PublicInstaPost>(feedQuery);

    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        return posts.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [posts, searchQuery]);

    const handleAction = async (action: 'delete' | 'pin' | 'visible', postId: string, currentStatus?: boolean) => {
        if (!firestore) return;
        
        const postRef = doc(firestore, 'public_insta_feed', postId);

        try {
            if (action === 'delete') {
                await deleteDoc(postRef);
                toast({ title: 'Post Deleted' });
            } else if (action === 'pin') {
                await updateDoc(postRef, { pinned: !currentStatus });
                toast({ title: currentStatus ? 'Post Unpinned' : 'Post Pinned' });
            } else if (action === 'visible') {
                await updateDoc(postRef, { visible: !currentStatus });
                toast({ title: currentStatus ? 'Post Hidden' : 'Post Visible' });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Action Failed', description: error.message });
        }
    };
    
    const handleAddNew = () => {
        setSelectedPost(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (post: PublicInstaPost) => {
        setSelectedPost(post);
        setIsDialogOpen(true);
    };

    const handleSeedPosts = async () => {
      if (!firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
        return;
      }
      setIsSeeding(true);
      try {
        const batch = writeBatch(firestore);
        const collectionRef = collection(firestore, 'public_insta_feed');
        const captions = [
            "Kopi time! ☕ #kopiduadarjat",
            "That first sip feeling. #kopi",
            "Mid-day refuel. #coffeebreak",
            "Heritage in a cup. ✨",
            "Our favorite way to start the day.",
        ];

        for (let i = 1; i <= 20; i++) {
            const id = `post_${String(i).padStart(2, '0')}`;
            const postRef = doc(collectionRef, id);
            const mediaType = Math.random() > 0.7 ? 'VIDEO' : 'IMAGE';
            
            batch.set(postRef, {
                id,
                username: "kopiduadarjat",
                caption: captions[i % captions.length],
                mediaUrl: mediaType === 'VIDEO' 
                    ? `https://storage.googleapis.com/static-assets-2321/kdd-video-${(i%3)+1}.mp4`
                    : `https://picsum.photos/seed/${id}/600/600`,
                mediaType: mediaType.toUpperCase(),
                permalink: "https://www.instagram.com/p/mockPostID/",
                timestamp: new Date().toISOString(),
                visible: true,
                pinned: i % 10 === 1, // Pin the first of every 10
                rank: i,
                source: "manual",
            });
        }
        
        await batch.commit();
        toast({ title: 'Success', description: '20 mock Instagram posts have been seeded.' });

      } catch (error: any) {
        console.error("Error seeding test Instagram post: ", error);
        toast({
          variant: 'destructive',
          title: 'Seeding Failed',
          description: `Could not seed test post: ${error.message}`,
        });
      } finally {
        setIsSeeding(false);
      }
    }

    return (
        <div>
             <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-zinc-800 border-zinc-700"
                    />
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                    <Button onClick={handleAddNew} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Post
                    </Button>
                    <Button onClick={handleSeedPosts} disabled={isSeeding} variant="outline" className="w-full sm:w-auto">
                        {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Database className="mr-2 h-4 w-4" />}
                        Seed Posts
                    </Button>
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredPosts.map(post => (
                        <PostTile key={post.id} post={post} onAction={handleAction} onEdit={handleEdit} />
                    ))}
                </div>
            )}
            {filteredPosts.length === 0 && !isLoading && (
                <p className="text-center text-zinc-500 py-16">No posts found. Click 'Seed Posts' to add sample data or 'Add New Post' to create one manually.</p>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>{selectedPost ? 'Edit Social Post' : 'Add New Social Post'}</DialogTitle>
                     <DialogDescription>
                        Manually add or edit a post for the social feed.
                    </DialogDescription>
                </DialogHeader>
                <SocialPostForm 
                    post={selectedPost}
                    onSuccess={() => setIsDialogOpen(false)}
                />
                </DialogContent>
            </Dialog>
        </div>
    )
}
