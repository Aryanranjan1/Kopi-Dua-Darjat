
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, updateDoc, writeBatch, query, orderBy, getDocs, where, setDoc } from 'firebase/firestore';
import type { PublicInstaPost, InstagramSyncSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Trash, Pin, PinOff, Eye, EyeOff, RefreshCw, PlusCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PostTile = ({ post, onAction }: { post: PublicInstaPost; onAction: (action: 'delete' | 'pin' | 'visible', postId: string, currentStatus?: boolean) => void; }) => {
    const isVideo = post.mediaType === 'VIDEO';
    return (
        <div className={`relative group overflow-hidden bg-zinc-800 ${isVideo ? 'aspect-[9/16]' : 'aspect-square'}`}>
            {post.mediaType === 'VIDEO' ? (
                <video src={post.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            ) : (
                <img src={post.mediaUrl} alt={post.caption || 'Instagram post'} className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-bold">@{post.username}</span>
                <span className="text-white text-xs mt-1 font-mono">ID: {post.id}</span>
                 <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="mt-2">
                    <Button size="sm" variant="outline" className="bg-white/20 border-white/50 text-white hover:bg-white hover:text-black">
                        View Post
                    </Button>
                </a>
            </div>

            <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={() => onAction('pin', post.id, post.pinned)}>
                    {post.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={() => onAction('visible', post.id, post.visible)}>
                    {post.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="destructive" className="h-7 w-7 bg-red-600/80 hover:bg-red-500" onClick={() => onAction('delete', post.id)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};


export default function SocialFeedManager() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'instagram_sync') : null, [firestore]);
    const { data: syncSettings, isLoading: isLoadingSettings } = useDoc<InstagramSyncSettings>(settingsRef);
    
    const [tagInput, setTagInput] = useState(syncSettings?.active_tag || '');
    const [mode, setMode] = useState<'scraper' | 'graph'>(syncSettings?.mode || 'scraper');

    useEffect(() => {
        if (syncSettings) {
            setTagInput(syncSettings.active_tag || '');
            setMode(syncSettings.mode || 'scraper');
        }
    }, [syncSettings]);

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
    
    const handleRefresh = async () => {
        setIsRefreshing(true);
        toast({ title: "Syncing Feed", description: "This may take a moment..." });
        
        try {
          const res = await fetch("https://us-central1-studio-5747447299-c92b3.cloudfunctions.net/syncInstagramHybrid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (res.ok) {
            toast({ title: "Sync Success", description: data.message });
          } else {
            throw new Error(data.error || 'Unknown error');
          }
        } catch (error: any) {
          console.error("🔥 Sync Failed:", error);
          toast({ variant: 'destructive', title: 'Sync Failed', description: error.message });
        } finally {
          setIsRefreshing(false);
        }
    };

    const handleUpdateSettings = async (newSettings: Partial<InstagramSyncSettings>) => {
        if (!firestore || !settingsRef) return;
        await setDoc(settingsRef, newSettings, { merge: true });
        toast({ title: 'Settings Updated' });
    }

    return (
        <div>
            <Card className="bg-zinc-900 border-zinc-800 text-white mb-8">
                <CardHeader>
                    <CardTitle>Sync Settings</CardTitle>
                    <CardDescription>Manage the Instagram hashtag and sync settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div className="space-y-1">
                             <Label htmlFor="sync-mode">Sync Mode</Label>
                             <Select value={mode} onValueChange={(value) => handleUpdateSettings({ mode: value as 'scraper' | 'graph' })}>
                                <SelectTrigger id="sync-mode" className="w-full bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="scraper">Scraper</SelectItem>
                                    <SelectItem value="graph">Graph API</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="tag-input">Active Hashtag</Label>
                            <div className="flex gap-2">
                                <span className="flex items-center pl-3 pr-1 border border-r-0 border-zinc-700 rounded-l-md bg-zinc-800 text-zinc-400">#</span>
                                <Input id="tag-input" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="bg-zinc-800 border-zinc-700 rounded-l-none" />
                            </div>
                        </div>
                         <Button onClick={() => handleUpdateSettings({ active_tag: tagInput })}>Update Tag</Button>
                    </div>
                     <div className="flex items-center space-x-2 pt-4">
                        <Switch id="auto-sync-toggle" checked={syncSettings?.auto_sync_enabled} onCheckedChange={(checked) => handleUpdateSettings({ auto_sync_enabled: checked })} />
                        <Label htmlFor="auto-sync-toggle">Enable Daily Auto-Sync</Label>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full md:w-auto">
                            {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            Manual Sync Now
                        </Button>
                         {syncSettings?.last_synced && (
                            <p className="text-xs text-zinc-500 pt-2">Last synced: {format(new Date(syncSettings.last_synced as any), 'PPP p')}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                     <CardTitle>Feed Management</CardTitle>
                    <CardDescription>Review and manage the posts displayed on your site.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search by username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-zinc-800 border-zinc-700"
                            />
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[3px]">
                            {filteredPosts.map(post => (
                                <PostTile key={post.id} post={post} onAction={handleAction} />
                            ))}
                        </div>
                    )}
                    {filteredPosts.length === 0 && !isLoading && (
                        <p className="text-center text-zinc-500 py-16">No posts found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
