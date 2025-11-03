
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, getDocs, writeBatch, doc, DocumentReference, addDoc, serverTimestamp, query, limit } from 'firebase/firestore';
import { allDrinks, testimonials as testimonialSeedData, faqItems as faqSeedData } from '@/lib/data';
import { Loader2, CheckCircle, AlertTriangle, Sparkles, BookOpen, Image as ImageIcon, Users, HelpCircle, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MenuGroup, MenuCategory, MenuItem, Promotion, Outlet, Blog, Testimonial, FaqItem } from '@/lib/types';
import { seedMediaData } from '@/lib/media';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


const groupStructure: { name: string; order: number; series: { name: string; order: number }[] }[] = [
  {
    name: 'Nak Kopi',
    order: 1,
    series: [
      { name: 'Darjat Series', order: 1 },
      { name: 'Kopitiam Series', order: 2 },
      { name: 'Espresso Series', order: 3 },
    ],
  },
  {
    name: 'Taknak Kopi',
    order: 2,
    series: [
      { name: 'Coklat Series', order: 1 },
      { name: 'Matcha Series', order: 2 },
    ],
  },
  {
    name: 'Menet Series',
    order: 3,
    series: [{ name: 'Fruity Sparkling', order: 1 }],
  },
];


export default function DataSeedingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const firestore = useFirestore();
  const { toast } = useToast();

  const addStatus = (newStatus: string) => {
    setStatus(prev => [...prev, newStatus]);
  };

  const clearAllData = async () => {
    if (!firestore) return;
    addStatus('Clearing all existing menu & outlet data...');
    try {
      const batch = writeBatch(firestore);
      const collectionsToClear = ['outlets', 'menuGroups', 'menuCategories', 'menuItems', 'dailySpecials', 'promotions'];
      for (const col of collectionsToClear) {
        addStatus(`- Clearing ${col}...`);
        const snapshot = await getDocs(collection(firestore, col));
        snapshot.forEach(doc => batch.delete(doc.ref));
      }
      await batch.commit();
      addStatus('All old data has been cleared.');
      toast({ title: 'Collections Cleared', description: 'Old data removed successfully.' });
      return true;
    } catch (error: any) {
      console.error('Error clearing data:', error);
      addStatus(`ERROR clearing data: ${error.message}`);
      toast({ variant: 'destructive', title: 'Error Clearing Data', description: 'Could not clear data.' });
      return false;
    }
  };

  const handleMigrate = async () => {
    if (!firestore) return;
    if (!confirm('This will DELETE ALL current outlets, menu data, and promotions and replace it with the original curated dataset. Are you sure?')) return;
    
    setIsLoading(true);
    setStatus([]);

    try {
      // 1. Clear existing data first
      const cleared = await clearAllData();
      if (!cleared) {
        throw new Error("Failed to clear old data. Aborting migration.");
      }

      const batch = writeBatch(firestore);
      
      // 2. Seed Outlets
      addStatus(`Seeding 50+ outlets...`);
      const outletCollection = collection(firestore, 'outlets');
      const outletsSnapshot = await getDocs(outletCollection);
      const existingOutlets = outletsSnapshot.docs.map(d => ({...d.data(), id: d.id} as Outlet));
      const outletIds = existingOutlets.map(o => o.id);
      addStatus('Outlets seeded.');


      // 3. Create Groups & Categories
      addStatus('Creating menu groups and categories...');
      const groupMap = new Map<string, string>();
      const categoryMap = new Map<string, string>();
      for (const group of groupStructure) {
        const groupSlug = group.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const newGroup: Omit<MenuGroup, 'id' | 'createdAt' | 'updatedAt'> = { name: group.name, slug: groupSlug, displayOrder: group.order, status: 'published' };
        const groupDocRef = doc(collection(firestore, 'menuGroups'));
        batch.set(groupDocRef, { ...newGroup, createdAt: new Date(), updatedAt: new Date() });
        groupMap.set(group.name, groupDocRef.id);

        for (const series of group.series) {
          const categorySlug = series.name.toLowerCase().replace(/ /g, '-');
          const newCategory: Omit<MenuCategory, 'id'|'createdAt'|'updatedAt'> = { name: series.name, slug: categorySlug, description: `Items from the ${series.name}.`, groupId: groupDocRef.id, displayOrder: series.order, status: 'published' };
          const catDocRef = doc(collection(firestore, 'menuCategories'));
          batch.set(catDocRef, { ...newCategory, createdAt: new Date(), updatedAt: new Date() });
          categoryMap.set(series.name, catDocRef.id);
        }
      }
      addStatus('Groups and categories created.');

      // 4. Migrate items (drinks)
      addStatus('Migrating original menu items...');
      const createdItemRefs: DocumentReference[] = [];

      for(let i=0; i<allDrinks.length; i++) {
        const item = allDrinks[i];
        let categoryName: string | undefined = '';
        
        categoryName = item.tags.find(t => t.endsWith('Series'));

        const categoryId = categoryName ? categoryMap.get(categoryName) : null;
        if (!categoryId) {
          console.warn(`Could not find category for item: ${item.name}`);
          continue; 
        }

        let assignedOutletIds: string[] = [];
        const availabilityType = i % 4; // 0: All, 1: Exclusive, 2: Few, 3: Most
        if (availabilityType === 0) { // Available everywhere
            assignedOutletIds = []; 
        } else if (availabilityType === 1 && outletIds.length > 0) { // Exclusive to one
            assignedOutletIds = [outletIds[i % outletIds.length]];
        } else if (availabilityType === 2 && outletIds.length > 5) { // A few random
            assignedOutletIds = [...outletIds].sort(() => 0.5 - Math.random()).slice(0, 5);
        } else if (availabilityType === 3 && outletIds.length > 20) { // Most
            assignedOutletIds = [...outletIds].sort(() => 0.5 - Math.random()).slice(0, 20);
        } else {
             assignedOutletIds = []; // Default to all if not enough outlets
        }
        
        const newItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> = {
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: item.price,
          imageUrl: item.image,
          categoryId: categoryId,
          promotionIds: [],
          outletIds: assignedOutletIds,
          isGeneral: assignedOutletIds.length === 0,
          status: 'published',
          tags: 'tags' in item ? item.tags.filter(t => !t.endsWith('Series')) : [],
          isPopular: i < 10, // Mark first 10 as popular
          displayOrder: i + 1,
        };
        const itemDocRef = doc(collection(firestore, 'menuItems'));
        batch.set(itemDocRef, { ...newItem, createdAt: new Date(), updatedAt: new Date() });
        createdItemRefs.push(itemDocRef);
      }
      addStatus(`${createdItemRefs.length} items processed.`);

      // 5. Create Daily Specials
      const numSpecials = Math.min(15, createdItemRefs.length);
      addStatus(`Creating ${numSpecials} daily specials...`);
      const specialsToCreate = createdItemRefs.slice(0, numSpecials);
      for(const itemRef of specialsToCreate) {
        const specialRef = doc(collection(firestore, 'dailySpecials'));
        batch.set(specialRef, { menuItemId: itemRef.id, addedAt: new Date() });
      }

      // 6. Create Promotions
      const numPromos = Math.min(15, createdItemRefs.length);
      addStatus(`Creating ${numPromos} promotions...`);
      const promosToCreate = createdItemRefs.slice(0, numPromos);
      for(let i=0; i < promosToCreate.length; i++) {
        const itemRef = promosToCreate[i];
        const promoRef = doc(collection(firestore, 'promotions'));
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + (i + 1) * 2);

        let discountType: Promotion['discountType'] = 'percentage';
        let discountValue = 10;
        if (i % 3 === 1) {
            discountType = 'flat';
            discountValue = 2;
        } else if (i % 3 === 2) {
            discountType = 'bogo';
            discountValue = 0;
        }
        
        const newPromo: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
          title: `Special Offer on Item ${i+1}`,
          description: `Limited time deal!`,
          discountType,
          discountValue,
          startDate,
          endDate,
          menuItemIds: [itemRef.id],
          outletIds: [],
        };

        batch.set(promoRef, { ...newPromo, status: 'active', createdAt: new Date(), updatedAt: new Date() });
        batch.update(itemRef, { promotionIds: [promoRef.id] });
      }
      addStatus('Specials and promotions created.');

      // 7. Commit batch
      addStatus('Writing all data to database... This may take a moment.');
      await batch.commit();

      addStatus('----------------------------------');
      addStatus('Migration completed successfully!');
      toast({ title: 'Migration Complete', description: 'Database has been cleared and re-seeded with new data.', duration: 5000 });
    } catch (error: any) {
      console.error('Migration failed:', error);
      addStatus(`FATAL ERROR: ${error.message}`);
      toast({ variant: 'destructive', title: 'Migration Failed', description: 'Check the status log for details.', duration: 10000 });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSeedTestimonials = async () => {
    if (!firestore) return;
    if (!confirm('This will seed 3 testimonials into Firestore. Existing testimonials will not be affected. Continue?')) return;
    
    setIsLoading(true);
    setStatus(['Starting to seed testimonials...']);
    
    try {
      const batch = writeBatch(firestore);
      let count = 0;
      for (const testimonial of testimonialSeedData) {
        const { id, ...data } = testimonial; // Exclude static ID
        const docRef = doc(collection(firestore, 'testimonials'));
        batch.set(docRef, { ...data, createdAt: serverTimestamp() });
        addStatus(`- Preparing testimonial from "${data.name}"`);
        count++;
      }
      
      await batch.commit();
      addStatus('----------------------------------');
      addStatus(`${count} testimonials seeded successfully!`);
      toast({ title: 'Testimonials Seeded', description: `${count} testimonials have been added.` });
    } catch (error: any) {
      addStatus(`FATAL ERROR: ${error.message}`);
      toast({ variant: 'destructive', title: 'Testimonial Seeding Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedFaqs = async () => {
    if (!firestore) return;
    if (!confirm('This will seed 9 FAQ items into Firestore. Existing FAQs will not be affected. Continue?')) return;

    setIsLoading(true);
    setStatus(['Starting to seed FAQ items...']);

    try {
      const batch = writeBatch(firestore);
      let count = 0;
      for (const faq of faqSeedData) {
        const { id, ...data } = faq; // Exclude static ID
        const docRef = doc(collection(firestore, 'faq'));
        batch.set(docRef, { ...data, createdAt: serverTimestamp() });
        addStatus(`- Preparing FAQ: "${data.question}"`);
        count++;
      }
      
      await batch.commit();
      addStatus('----------------------------------');
      addStatus(`${count} FAQs seeded successfully!`);
      toast({ title: 'FAQs Seeded', description: `${count} FAQ items have been added.` });
    } catch (error: any) {
      addStatus(`FATAL ERROR: ${error.message}`);
      toast({ variant: 'destructive', title: 'FAQ Seeding Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSeedMedia = async () => {
    if (!firestore) return;
    if (!confirm('This will populate the Media Library from the original placeholder images. It will not delete existing media. Continue?')) return;
    
    setIsLoading(true);
    setStatus(['Starting to seed media assets into Firestore...']);

    try {
        const result = await seedMediaData(firestore);
        if (result.success) {
            if (result.error === 'already_seeded') {
                addStatus('Media data has already been seeded. No new assets were added.');
                toast({ title: 'Media Already Seeded', description: 'No action was taken as media assets appear to be in the database.' });
            } else {
                addStatus(`Successfully seeded ${result.count} media assets.`);
                toast({ title: 'Media Seeded', description: `${result.count} assets have been added to the Media Library.` });
            }
        } else {
            throw new Error(result.error || 'An unknown error occurred.');
        }
    } catch (error: any) {
        console.error('Error seeding media:', error);
        addStatus(`FATAL ERROR: ${error.message}`);
        toast({ variant: 'destructive', title: 'Media Seeding Failed', description: error.message });
    } finally {
        setIsLoading(false);
    }
};


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Master Data Seeding Tool</h1>
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database /> One-Click Data Setup</CardTitle>
          <CardDescription className="text-zinc-400">
            Use these tools to populate or reset your database with a full set of mock data. This is useful for initial setup or for resetting a development environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleMigrate} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Clear and Seed Full Menu
            </Button>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button disabled={isLoading} variant="destructive" className="w-full sm:w-auto">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Clear All Data Only
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">This will permanently delete all outlets, menu items, and promotions. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={clearAllData}>Yes, delete all data</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
           <div className="border-t border-zinc-700 pt-6">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-zinc-400 text-sm mb-4">Use these to add specific data without clearing everything.</p>
               <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleSeedTestimonials} disabled={isLoading} variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                  Seed Testimonials
                </Button>
                <Button onClick={handleSeedFaqs} disabled={isLoading} variant="secondary" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HelpCircle className="mr-2 h-4 w-4" />}
                  Seed FAQs
                </Button>
                <Button onClick={handleSeedMedia} disabled={isLoading} variant="secondary" className="bg-purple-600 hover:bg-purple-700 text-white">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                  Seed Media Assets
                </Button>
               </div>
            </div>
          {(isLoading || status.length > 0) && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-md max-h-60 overflow-y-auto">
              <h3 className="font-semibold text-zinc-300">Migration Status:</h3>
              <div className="mt-2 text-sm text-zinc-400 font-mono space-y-1">
                {status.map((s, i) => <p key={i}>{s}</p>)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
