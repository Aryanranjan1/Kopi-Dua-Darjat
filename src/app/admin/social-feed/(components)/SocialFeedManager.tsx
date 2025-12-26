
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, query, orderBy } from 'firebase/firestore';
import type { PublicInstaPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Trash, Pin, PinOff, Eye, EyeOff, PlusCircle, Database, Save, ArrowDown, ArrowUp, ArrowLeft, Ruler, Edit, Move } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SocialPostForm from './SocialPostForm';
import { cn } from '@/lib/utils';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const ResponsiveGridLayout = WidthProvider(Responsive);

const GRID_COLS = { lg: 3, md: 3, sm: 3, xs: 2, xxs: 1 };
const GRID_ROW_HEIGHT = 150;
const MAX_ACTIVE_POSTS = 21;


const PostTile = React.forwardRef<HTMLDivElement, { post: PublicInstaPost; onAction: (action: 'delete' | 'pin' | 'visible', postId: string, currentStatus?: boolean) => void; onEdit: (post: PublicInstaPost) => void; onResize: (postId: string, w: number, h: number) => void; className?: string; isAdjustmentMode: boolean }>(
  ({ post, onAction, onEdit, onResize, className, isAdjustmentMode, ...props }, ref) => {
  return (
      <div 
        ref={ref} 
        {...props} 
        className={cn(
            'group overflow-hidden bg-zinc-800', 
            isAdjustmentMode ? 'cursor-move' : 'cursor-pointer',
            className
        )}
        onClick={() => !isAdjustmentMode && onEdit(post)}
      >
          {post.mediaType === 'VIDEO' ? (
              <video src={post.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-contain" />
          ) : (
              <img src={post.mediaUrl} alt={post.caption || 'Instagram post'} className="w-full h-full object-contain" />
          )}

          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="text-white text-sm font-bold">@{post.username}</span>
              <span className="text-white text-xs mt-1 font-mono">ID: {post.id}</span>
          </div>
            
          <div className="absolute top-1 right-1 flex flex-col gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={(e) => e.stopPropagation()}>
                        <Ruler className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => onResize(post.id, 1, 1)}>Small (1x1)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onResize(post.id, 1, 2)}>Tall (1x2)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onResize(post.id, 2, 2)}>Large (2x2)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={(e) => { e.stopPropagation(); onAction('pin', post.id, post.pinned); }}>
                  {post.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={(e) => { e.stopPropagation(); onAction('visible', post.id, post.visible); }}>
                  {post.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
               <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white" onClick={(e) => { e.stopPropagation(); onEdit(post); }}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" className="h-7 w-7 bg-red-600/80 hover:bg-red-500" onClick={(e) => { e.stopPropagation(); onAction('delete', post.id); }}>
                  <Trash className="h-4 w-4" />
              </Button>
          </div>
          {!post.visible && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none">
                  <EyeOff className="h-10 w-10 text-zinc-500" />
              </div>
          )}
          {post.pinned && (
              <Pin className="absolute top-2 left-2 h-5 w-5 text-white bg-black/50 p-1 rounded-full pointer-events-none" />
          )}
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
        () => firestore ? query(collection(firestore, 'public_insta_feed')) : null,
        [firestore]
    );
    const { data: posts, isLoading } = useCollection<PublicInstaPost>(feedQuery);

    const [activeLayout, setActiveLayout] = useState<Layout[]>([]);
    const [passivePosts, setPassivePosts] = useState<PublicInstaPost[]>([]);
    const [activePosts, setActivePosts] = useState<PublicInstaPost[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isAdjustmentMode, setIsAdjustmentMode] = useState(false);

    useEffect(() => {
        if (posts) {
            const sorted = [...posts].sort((a,b) => (a.rank || Infinity) - (b.rank || Infinity));
            const active = sorted.filter(p => (p.rank || 0) <= MAX_ACTIVE_POSTS && p.rank !== 0);
            const passive = sorted.filter(p => (p.rank || 0) > MAX_ACTIVE_POSTS || p.rank === 0);
            
            setActivePosts(active);
            setPassivePosts(passive);

            const initialLayout = active.map((p, index) => {
                if (p.layout) {
                    return { ...p.layout, i: p.id };
                }
                // Fallback layout logic if none exists
                return {
                    i: p.id,
                    x: (index % GRID_COLS.lg),
                    y: Math.floor(index / GRID_COLS.lg),
                    w: 1,
                    h: p.mediaType === 'VIDEO' ? 2 : 1,
                };
            });
            setActiveLayout(initialLayout);
        }
    }, [posts]);

    const handleAction = async (action: 'delete' | 'pin' | 'visible', postId: string, currentStatus?: boolean) => {
        if (!firestore) return;
        const postRef = doc(firestore, 'public_insta_feed', postId);
        try {
            if (action === 'delete') { 
                await writeBatch(firestore).delete(postRef).commit(); 
                toast({ title: 'Post Deleted' }); 
            }
            else if (action === 'pin') { 
                await writeBatch(firestore).update(postRef, { pinned: !currentStatus }).commit(); 
                toast({ title: currentStatus ? 'Post Unpinned' : 'Post Pinned' }); 
            }
            else if (action === 'visible') { 
                await writeBatch(firestore).update(postRef, { visible: !currentStatus }).commit(); 
                toast({ title: currentStatus ? 'Post Hidden' : 'Post Visible' }); 
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Action Failed', description: error.message });
        }
    };

    const handleLayoutChange = (newLayout: Layout[]) => {
        setActiveLayout(newLayout);
        setHasChanges(true);
    };

    const handleResizePost = (postId: string, w: number, h: number) => {
        setActiveLayout(prevLayout => {
            return prevLayout.map(item => {
                if (item.i === postId) {
                    return { ...item, w, h };
                }
                return item;
            });
        });
        setHasChanges(true);
    };

    const handleSaveLayout = async () => {
        if (!firestore) return;
        const batch = writeBatch(firestore);
        
        activePosts.forEach((post, index) => {
            const layoutItem = activeLayout.find(l => l.i === post.id);
            const postRef = doc(firestore, 'public_insta_feed', post.id);
            batch.update(postRef, {
                rank: index + 1,
                layout: layoutItem ? { x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h } : post.layout
            });
        });

        passivePosts.forEach((post, index) => {
             const postRef = doc(firestore, 'public_insta_feed', post.id);
             batch.update(postRef, {
                 rank: MAX_ACTIVE_POSTS + index + 1
             });
        });

        try {
            await batch.commit();
            toast({ title: "Layout and Ranks Saved", description: "Your changes have been successfully saved." });
            setHasChanges(false);
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
        }
    };

    const moveToActive = (post: PublicInstaPost) => {
        if(activePosts.length >= MAX_ACTIVE_POSTS) {
            toast({ variant: 'destructive', title: 'Active Posts Limit Reached', description: `You can only have ${MAX_ACTIVE_POSTS} active posts.` });
            return;
        }

        const newPassive = passivePosts.filter(p => p.id !== post.id);
        const newActive = [...activePosts, post];

        // Add to layout
        const newLayoutItem: Layout = {
            i: post.id,
            x: (activePosts.length % GRID_COLS.lg),
            y: Infinity, // place at the bottom
            w: 1,
            h: 1
        };
        setActiveLayout([...activeLayout, newLayoutItem]);

        setActivePosts(newActive);
        setPassivePosts(newPassive);
        setHasChanges(true);
    };

    const moveToPassive = (post: PublicInstaPost) => {
        const newActive = activePosts.filter(p => p.id !== post.id);
        const newPassive = [post, ...passivePosts];

        setActiveLayout(activeLayout.filter(l => l.i !== post.id));
        setActivePosts(newActive);
        setPassivePosts(newPassive);
        setHasChanges(true);
    };


    const filteredPassivePosts = useMemo(() => {
        if (!passivePosts) return [];
        return passivePosts.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [passivePosts, searchQuery]);

    const activePostsMap = useMemo(() => new Map(activePosts.map(p => [p.id, p])), [activePosts]);
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Button 
                    onClick={() => setIsAdjustmentMode(!isAdjustmentMode)} 
                    variant={isAdjustmentMode ? 'default' : 'outline'}
                    className={cn(isAdjustmentMode && 'bg-accent hover:bg-accent/90')}
                >
                    <Move className="mr-2 h-4 w-4" />
                    {isAdjustmentMode ? 'Exit Adjustment Mode' : 'Adjust Layout'}
                </Button>
                {hasChanges && (
                    <Button onClick={handleSaveLayout}><Save className="mr-2 h-4 w-4" /> Save Layout & Ranks</Button>
                )}
            </div>
           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-2">Active Posts ({activePosts.length}/{MAX_ACTIVE_POSTS})</h3>
                     {isLoading ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>
                    ) : (
                        <ResponsiveGridLayout
                            className={cn("layout rounded-lg", isAdjustmentMode && "bg-zinc-900/50 ring-2 ring-accent ring-dashed")}
                            layouts={{ lg: activeLayout }}
                            cols={GRID_COLS}
                            rowHeight={GRID_ROW_HEIGHT}
                            onLayoutChange={handleLayoutChange}
                            isDraggable={isAdjustmentMode}
                            isResizable={isAdjustmentMode}
                        >
                            {activePosts.map(post => (
                                <PostTile 
                                    key={post.id} 
                                    post={post} 
                                    onAction={handleAction} 
                                    onEdit={setSelectedPost} 
                                    onResize={handleResizePost} 
                                    isAdjustmentMode={isAdjustmentMode}
                                />
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
                                <img src={post.mediaUrl} alt="" className="w-10 h-10 object-contain rounded"/>
                                <div className="flex-grow overflow-hidden">
                                    <p className="text-sm font-semibold truncate">{post.username}</p>
                                    <p className="text-xs text-zinc-400 truncate">{post.caption || "No caption"}</p>
                                </div>
                                {activePosts.length < MAX_ACTIVE_POSTS ? (
                                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => moveToActive(post)}><ArrowLeft className="h-4 w-4"/></Button>
                                ) : (
                                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" disabled>
                                        <ArrowLeft className="h-4 w-4 text-zinc-600"/>
                                    </Button>
                                )}
                            </div>
                         ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <Dialog open={!!selectedPost} onOpenChange={(open) => { if(!open) { setSelectedPost(undefined); }}}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Social Post</DialogTitle>
                     <DialogDescription>
                        Manually edit a post for the social feed.
                    </DialogDescription>
                </DialogHeader>
                <SocialPostForm 
                    post={selectedPost}
                    onSuccess={() => { setSelectedPost(undefined); }}
                />
                </DialogContent>
            </Dialog>
        </div>
    )
}
