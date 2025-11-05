'use client';

import React, { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, updateDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Trash, Pin, PinOff, Eye, EyeOff, RefreshCw, PlusCircle, ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const PostTile = ({ post, onAction }: { post: PublicInstaPost; onAction: (action: 'delete' | 'pin' | 'visible', postId: string) => void; }) => {
    return (
        <div className="relative group aspect-square overflow-hidden bg-zinc-800">
            {post.mediaType === 'video' ? (
                <video src={post.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            ) : (
                <img src={post.mediaUrl} alt={post.caption || 'Instagram post'} className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-bold">@{post.username}</span>
                <span className="text-white text-xs mt-1 font-mono">ID: {post.id}</span>
            </div>

            <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={() => onAction(post.pinned ? 'pin' : 'pin', post.id)}>
                    {post.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={() => onAction(post.visible ? 'visible' : 'visible', post.id)}>
                    {post.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="destructive" className="h-7 w-7 bg-red-600/80 hover:bg-red-500" onClick={() => onAction('delete', post.id)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
             <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="absolute bottom-1 right-1">
                <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white">
                    <ExternalLink className="h-4 w-4" />
                </Button>
            </a>
        </div>
    );
};


export default function SocialFeedManager() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const feedQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'public_insta_feed'), orderBy('rank', 'asc')) : null,
        [firestore]
    );
    const { data: posts, isLoading } = useCollection<PublicInstaPost>(feedQuery);

    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        return posts.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [posts, searchQuery]);

    const handleAction = async (action: 'delete' | 'pin' | 'visible', postId: string) => {
        if (!firestore) return;
        
        const postRef = doc(firestore, 'public_insta_feed', postId);

        try {
            if (action === 'delete') {
                await deleteDoc(postRef);
                toast({ title: 'Post Deleted' });
            } else if (action === 'pin') {
                const post = posts?.find(p => p.id === postId);
                await updateDoc(postRef, { pinned: !post?.pinned });
                toast({ title: post?.pinned ? 'Post Unpinned' : 'Post Pinned' });
            } else if (action === 'visible') {
                const post = posts?.find(p => p.id === postId);
                await updateDoc(postRef, { visible: !post?.visible });
                toast({ title: post?.visible ? 'Post Hidden' : 'Post Visible' });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Action Failed', description: error.message });
        }
    };
    
    const handleRefresh = async () => {
        // This is a placeholder for a cloud function call
        setIsRefreshing(true);
        toast({ title: "Syncing Feed", description: "This may take a moment..." });
        
        // In a real app, you would call a cloud function here:
        // const refreshFunction = httpsCallable(functions, 'refreshInstaFeed');
        // await refreshFunction();

        setTimeout(() => {
            setIsRefreshing(false);
            toast({ title: "Sync Complete", description: "The feed has been updated."});
        }, 3000); // Simulate cloud function call
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-zinc-800 border-zinc-700"
                    />
                </div>
                <div className="flex gap-4">
                    <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full md:w-auto">
                        {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Manual Refresh
                    </Button>
                     <Button variant="outline" className="w-full md:w-auto bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Manual Post
                    </Button>
                </div>
            </div>
            
             {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
             ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                    {filteredPosts.map(post => (
                        <PostTile key={post.id} post={post} onAction={handleAction} />
                    ))}
                </div>
             )}
             {filteredPosts.length === 0 && !isLoading && (
                 <p className="text-center text-zinc-500 py-16">No posts found.</p>
             )}
        </div>
    )
}
