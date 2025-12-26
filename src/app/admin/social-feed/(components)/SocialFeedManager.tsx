
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, query, orderBy } from 'firebase/firestore';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Trash, Pin, PinOff, Eye, EyeOff, PlusCircle, Database, Save, ArrowDown, ArrowUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SocialPostForm from './SocialPostForm';
import { cn } from '@/lib/utils';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ScrollArea } from '@/components/ui/scroll-area';

const ResponsiveGridLayout = WidthProvider(Responsive);

const GRID_COLS = { lg: 3, md: 3, sm: 3, xs: 2, xxs: 1 };
const GRID_ROW_HEIGHT = 150;
const MAX_ACTIVE_POSTS = 21;
const MAX_ACTIVE_IMAGES = 18;
const MAX_ACTIVE_VIDEOS = 3;


const PostTile = React.forwardRef<HTMLDivElement, { post: PublicInstaPost; onAction: (action: 'delete' | 'pin' | 'visible', postId: string, currentStatus?: boolean) => void; onEdit: (post: PublicInstaPost) => void, className?: string }>(
  ({ post, onAction, onEdit, className, ...props }, ref) => {
  return (
      <div ref={ref} {...props} className={cn('group overflow-hidden bg-zinc-800 cursor-pointer', className)}>
          {post.mediaType === 'VIDEO' ? (
              <video src={post.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
              <img src={post.mediaUrl} alt={post.caption || 'Instagram post'} className="w-full h-full object-cover" />
          )}

          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={() => onEdit(post)}>
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
          <div className="react-resizable-handle" />
      </div>
  );
});
PostTile.displayName = 'PostTile';


export default function SocialFeedManager() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<PublicInstaPost | undefined>(undefined);
    
    const feedQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'public_insta_feed'), orderBy('rank', 'asc')) : null,
        [firestore]
    );
    const { data: posts, isLoading } = useCollection<PublicInstaPost>(feedQuery);

    const [activeLayout, setActiveLayout] = useState<Layout[]>([]);
    const [passivePosts, setPassivePosts] = useState<PublicInstaPost[]>([]);
    const [activePosts, setActivePosts] = useState<PublicInstaPost[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (posts) {
            const active = posts.filter(p => p.rank <= MAX_ACTIVE_POSTS);
            const passive = posts.filter(p => p.rank > MAX_ACTIVE_POSTS);
            
            setActivePosts(active);
            setPassivePosts(passive);

            const initialLayout = active.map(p => p.layout ? { ...p.layout, i: p.id } : {
                i: p.id,
                x: (p.rank - 1) % GRID_COLS.lg,
                y: Math.floor((p.rank - 1) / GRID_COLS.lg),
                w: 1,
                h: p.mediaType === 'VIDEO' ? 2 : 1,
            });
            setActiveLayout(initialLayout);
        }
    }, [posts]);

    const handleAction = async (action: 'delete' | 'pin' | 'visible', postId: string, currentStatus?: boolean) => {
        if (!firestore) return;
        const postRef = doc(firestore, 'public_insta_feed', postId);
        try {
            if (action === 'delete') { await writeBatch(firestore).delete(postRef).commit(); toast({ title: 'Post Deleted' }); }
            else if (action === 'pin') { await writeBatch(firestore).update(postRef, { pinned: !currentStatus }).commit(); toast({ title: currentStatus ? 'Post Unpinned' : 'Post Pinned' }); }
            else if (action === 'visible') { await writeBatch(firestore).update(postRef, { visible: !currentStatus }).commit(); toast({ title: currentStatus ? 'Post Hidden' : 'Post Visible' }); }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Action Failed', description: error.message });
        }
    };

    const handleLayoutChange = (newLayout: Layout[]) => {
        setActiveLayout(newLayout);
        setHasChanges(true);
    };

    const handleSaveLayout = async () => {
        if (!firestore) return;
        const batch = writeBatch(firestore);
        
        activeLayout.forEach(item => {
            const postRef = doc(firestore, 'public_insta_feed', item.i);
            batch.update(postRef, {
                layout: { x: item.x, y: item.y, w: item.w, h: item.h }
            });
        });

        try {
            await batch.commit();
            toast({ title: "Layout Saved", description: "Your grid layout has been updated." });
            setHasChanges(false);
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
        }
    };

    const moveToActive = (post: PublicInstaPost) => {
        let newActivePosts = [...activePosts, post];
        let newPassivePosts = passivePosts.filter(p => p.id !== post.id);

        if (newActivePosts.length > MAX_ACTIVE_POSTS) {
            const postToMove = newActivePosts.shift();
            if(postToMove) newPassivePosts.unshift(postToMove);
        }

        setActivePosts(newActivePosts);
        setPassivePosts(newPassivePosts);
        setHasChanges(true);
    };

    const moveToPassive = (post: PublicInstaPost) => {
        setActivePosts(activePosts.filter(p => p.id !== post.id));
        setPassivePosts([post, ...passivePosts]);
        setHasChanges(true);
    };


    const filteredPassivePosts = useMemo(() => {
        if (!passivePosts) return [];
        return passivePosts.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [passivePosts, searchQuery]);

    return (
        <div>
            {hasChanges && (
                 <div className="flex justify-end mb-4">
                    <Button onClick={handleSaveLayout}><Save className="mr-2 h-4 w-4" /> Save Layout</Button>
                </div>
            )}
           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-2">Active Posts ({activePosts.length}/{MAX_ACTIVE_POSTS})</h3>
                     {isLoading ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>
                    ) : (
                        <ResponsiveGridLayout
                            className="layout"
                            layouts={{ lg: activeLayout }}
                            cols={GRID_COLS}
                            rowHeight={GRID_ROW_HEIGHT}
                            onLayoutChange={handleLayoutChange}
                        >
                            {activePosts.map(post => (
                                <PostTile key={post.id} post={post} onAction={handleAction} onEdit={setSelectedPost} />
                            ))}
                        </ResponsiveGridLayout>
                    )}
                </div>
                <div>
                     <h3 className="font-bold text-lg mb-2">Passive Posts ({passivePosts.length})</h3>
                      <div className="relative w-full mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search passive posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-zinc-800 border-zinc-700"
                        />
                    </div>
                     <ScrollArea className="h-[60vh] bg-zinc-900/50 p-2 rounded-lg">
                        <div className="space-y-2">
                         {filteredPassivePosts.map(post => (
                            <div key={post.id} className="flex items-center gap-2 p-2 bg-zinc-800 rounded-md">
                                <img src={post.mediaUrl} alt="" className="w-10 h-10 object-cover rounded"/>
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold truncate">{post.username}</p>
                                    <p className="text-xs text-zinc-400 truncate">{post.caption || "No caption"}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveToActive(post)}><ArrowUp className="h-4 w-4"/></Button>
                            </div>
                         ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <Dialog open={isDialogOpen || !!selectedPost} onOpenChange={(open) => { if(!open) { setIsDialogOpen(false); setSelectedPost(undefined); }}}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>{selectedPost ? 'Edit Social Post' : 'Add New Social Post'}</DialogTitle>
                     <DialogDescription>
                        Manually add or edit a post for the social feed.
                    </DialogDescription>
                </DialogHeader>
                <SocialPostForm 
                    post={selectedPost}
                    onSuccess={() => { setIsDialogOpen(false); setSelectedPost(undefined); }}
                />
                </DialogContent>
            </Dialog>
        </div>
    )
}
