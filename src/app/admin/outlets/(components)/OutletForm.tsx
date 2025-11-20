
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronsUpDown, Trash2, Edit, PlusCircle, Check, MapPin, Star as StarIcon, RefreshCw } from 'lucide-react';
import { useFirestore, errorEmitter, FirestorePermissionError, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection, query, where, addDoc, deleteDoc, writeBatch, getDocs, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import type { Outlet, Testimonial, Promotion, MenuItem, Review, ReviewDocument } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import slugify from 'slugify';
import { useEffect, useState, useMemo } from 'react';
import ImageUpload from '@/components/shared/ImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PromotionForm from '../../promotions/(components)/PromotionForm';
import { Badge } from '@/components/ui/badge';
import { cn, getDiscountDisplay, getLocalized } from '@/lib/utils';
import { format, fromUnixTime } from 'date-fns';
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
import TestimonialForm from '../../shared/TestimonialForm';


interface OutletFormProps {
  outlet?: Outlet;
  allItems: MenuItem[];
  onSuccess: () => void;
}

const formSchema = z.object({
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with no spaces'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  phone: z.string().optional(),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  heroImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  interiorImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  cardImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  mapsLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  whatsappLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  chatbotEmbed: z.string().optional(),
  isChatbotEnabled: z.boolean().default(false),
  placeId: z.string().optional(),
  menuItemIds: z.array(z.string()).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  socials: z.object({
    instagram: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
    tiktok: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
    facebook: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  }).optional(),
  translations: z.object({
    en: z.object({
        name: z.string().min(3, 'Outlet name is required'),
        address: z.string().min(10, 'Full address is required'),
        city: z.string().min(2, 'City is required'),
        state: z.string().min(2, 'State is required'),
        hours: z.string().min(5, 'Operating hours are required'),
        tagline: z.string().optional(),
    }),
    ms: z.object({
        name: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        hours: z.string().optional(),
        tagline: z.string().optional(),
    })
  }),
});

type FormValues = z.infer<typeof formSchema>;

function MultiSelectPopover({ title, options, selected, onChange }: {
    title: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectAll = () => {
        onChange(options.map(opt => opt.value));
    }
    const handleDeselectAll = () => {
        onChange([]);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                    <span className="truncate">
                    {selected.length === 0
                        ? `Select ${title}...`
                        : selected.length === options.length
                        ? `All ${title}`
                        : `${selected.length} of ${options.length} selected`}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[60]" align="start">
                <div className="bg-zinc-900 text-white border border-zinc-800 rounded-md">
                    <div className="p-2 border-b border-zinc-800">
                        <Input 
                            placeholder={`Search ${title.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-800 border-zinc-700"
                            autoFocus
                        />
                    </div>
                     <div className="p-2 border-b border-zinc-800 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={handleSelectAll} className="flex-1">Select All</Button>
                        <Button size="sm" variant="ghost" onClick={handleDeselectAll} className="flex-1">Deselect All</Button>
                    </div>
                    <ScrollArea className="h-48">
                        <div className="p-2 space-y-1">
                        {filteredOptions.length > 0 ? filteredOptions.map((option) => {
                            const isSelected = selected.includes(option.value);
                            return (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-zinc-800 cursor-pointer"
                                    onClick={() => {
                                        const newSelected = isSelected
                                            ? selected.filter((v) => v !== option.value)
                                            : [...selected, option.value];
                                        onChange(newSelected);
                                    }}
                                >
                                    <Checkbox
                                        id={`check-${option.value}`}
                                        checked={isSelected}
                                        readOnly
                                    />
                                    <label htmlFor={`check-${option.value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                        {option.label}
                                    </label>
                                </div>
                            )
                        }) : (
                            <p className="p-2 text-sm text-center text-zinc-500">No {title.toLowerCase()} found.</p>
                        )}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
}


export default function OutletForm({ outlet, allItems, onSuccess }: OutletFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isFetching, setIsFetching] = useState(false);
  
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | undefined>(undefined);
  
  const { data: promotions } = useCollection<Promotion>(
    useMemoFirebase(() => outlet ? query(collection(firestore, 'promotions'), where('outletIds', 'array-contains', outlet.id)) : null, [firestore, outlet])
  );
  
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  
  const reviewDocRef = useMemoFirebase(() => (outlet?.id && firestore) ? doc(firestore, 'reviews', outlet.id) : null, [outlet, firestore]);
  const { data: reviewData, isLoading: isLoadingReviews } = useDoc<ReviewDocument>(reviewDocRef);

  const [currentReviews, setCurrentReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (reviewData?.reviews) {
      setCurrentReviews(reviewData.reviews);
    } else {
      setCurrentReviews([]);
    }
  }, [reviewData]);


  const handleFetchFromGoogle = async () => {
      const placeId = form.getValues('placeId');
      if (!placeId) {
          toast({ variant: 'destructive', title: 'Missing Place ID', description: 'Please enter a Google Place ID to fetch data.' });
          return;
      }
      setIsFetching(true);
      try {
          const response = await fetch('/api/fetch-google-place-details', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ placeId }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          const currentTranslations = form.getValues('translations');
          form.reset({
            ...form.getValues(),
            translations: {
              ...currentTranslations,
              en: {
                ...currentTranslations.en,
                name: data.name || currentTranslations.en.name,
                address: data.address || currentTranslations.en.address,
                city: data.city || currentTranslations.en.city,
                state: data.state || currentTranslations.en.state,
                hours: data.hours || currentTranslations.en.hours,
              }
            },
            lat: data.lat || form.getValues('lat'),
            lng: data.lng || form.getValues('lng'),
            phone: data.phone || form.getValues('phone'),
            mapsLink: data.mapsLink || form.getValues('mapsLink'),
          });
          
          if (data.reviews && data.reviews.length > 0) {
            const googleReviews: Review[] = data.reviews.map((r: any) => ({
                source: 'google',
                author_name: r.author_name,
                rating: r.rating,
                time: r.time,
                profile_photo_url: r.profile_photo_url,
                relative_time_description: r.relative_time_description,
                translations: {
                  en: { text: r.text },
                  ms: { text: r.text },
                },
            }));
            
            const manualReviews = currentReviews.filter(r => r.source === 'manual');
            setCurrentReviews([...manualReviews, ...googleReviews]);
          }

          toast({ title: 'Data Fetched', description: `Successfully updated data for ${data.name}. Review and save.` });
      } catch (error: any) {
          toast({ variant: 'destructive', title: 'Fetch Failed', description: error.message });
      } finally {
          setIsFetching(false);
      }
  };

  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: '', lat: 0, lng: 0, phone: '', email: '',
      status: 'active', heroImage: '', interiorImage: '', cardImage: '', mapsLink: '', whatsappLink: '',
      chatbotEmbed: '', isChatbotEnabled: false, placeId: '', menuItemIds: [],
      seo: { title: '', description: '', keywords: '' },
      socials: { instagram: '', tiktok: '', facebook: '' },
      translations: { en: { name: '', address: '', city: '', state: '', hours: '', tagline: ''}, ms: { name: '', address: '', city: '', state: '', hours: '', tagline: ''}},
    },
  });
  
  useEffect(() => {
    if (outlet) {
      form.reset({
        slug: outlet.slug,
        lat: outlet.lat,
        lng: outlet.lng,
        phone: outlet.phone || '',
        email: outlet.email || '',
        status: outlet.status,
        heroImage: outlet.heroImage || '',
        interiorImage: outlet.interiorImage || '',
        cardImage: outlet.cardImage || '',
        mapsLink: outlet.mapsLink || '',
        whatsappLink: outlet.whatsappLink || '',
        chatbotEmbed: outlet.chatbotEmbed || '',
        isChatbotEnabled: outlet.isChatbotEnabled || false,
        placeId: outlet.placeId || '',
        menuItemIds: allItems.filter(item => item.outletIds?.includes(outlet.id)).map(item => item.id),
        seo: {
          title: outlet.seo?.title || '',
          description: outlet.seo?.description || '',
          keywords: outlet.seo?.keywords || '',
        },
        socials: {
          instagram: outlet.socials?.instagram || '',
          tiktok: outlet.socials?.tiktok || '',
          facebook: outlet.socials?.facebook || '',
        },
        translations: {
            en: getLocalized(outlet, 'en'),
            ms: getLocalized(outlet, 'ms'),
        }
      });
    } else {
        form.reset({
            slug: '', lat: 0, lng: 0, phone: '', email: '',
            status: 'active', heroImage: '', interiorImage: '', cardImage: '', mapsLink: '', whatsappLink: '',
            chatbotEmbed: '', isChatbotEnabled: false, placeId: '', menuItemIds: [],
            seo: { title: '', description: '', keywords: '' },
            socials: { instagram: '', tiktok: '', facebook: '' },
            translations: { en: { name: '', address: '', city: '', state: '', hours: '', tagline: ''}, ms: { name: '', address: '', city: '', state: '', hours: '', tagline: ''}},
        })
    }
  }, [outlet, allItems, form]);


  const { isSubmitting, watch, setValue, formState } = form;
  const watchedName = watch('translations.en.name');
  const watchedMenuItemIds = watch('menuItemIds') || [];

  useEffect(() => {
    if (watchedName && !formState.dirtyFields.slug) {
        setValue('slug', slugify(watchedName, { lower: true, strict: true }));
    }
  }, [watchedName, setValue, formState.dirtyFields.slug]);

  const handleCopyToMalay = () => {
    const en = form.getValues('translations.en');
    form.setValue('translations.ms', en);
    toast({ title: "Content Copied", description: "English content has been copied to the Malay fields." });
  }

  const onSubmit = async (values: FormValues) => {
    if (!firestore) return;
    
    const docId = values.slug;
    const outletRef = doc(firestore, 'outlets', docId);
    
    // Calculate new aggregate rating based on currentReviews
    const totalRating = currentReviews.reduce((acc, review) => acc + review.rating, 0);
    const aggregateRating = currentReviews.length > 0 ? totalRating / currentReviews.length : 0;

    const dataToSave = {
      slug: values.slug,
      lat: values.lat,
      lng: values.lng,
      phone: values.phone || null,
      email: values.email || null,
      status: values.status,
      heroImage: values.heroImage || null,
      interiorImage: values.interiorImage || null,
      cardImage: values.cardImage || null,
      mapsLink: values.mapsLink || null,
      whatsappLink: values.whatsappLink || null,
      chatbotEmbed: values.chatbotEmbed || null,
      isChatbotEnabled: values.isChatbotEnabled,
      placeId: values.placeId || null,
      socials: values.socials || null,
      seo: {
        title: values.seo?.title || null,
        description: values.seo?.description || null,
        keywords: values.seo?.keywords || null,
      },
      updatedAt: serverTimestamp(),
      rating: aggregateRating,
      reviewCount: currentReviews.length,
      reviewsPath: `reviews/${docId}`,
      translations: {
          en: values.translations.en,
          ms: values.translations.ms
      },
      ...(outlet ? {} : { createdAt: serverTimestamp() }),
    };
    
    const batch = writeBatch(firestore);

    // --- Menu Item Linking Logic ---
    const newLinkedIds = new Set(values.menuItemIds || []);
    const oldLinkedIds = new Set(outlet ? allItems.filter(i => i.outletIds?.includes(outlet.id)).map(i => i.id) : []);

    const allAffectedItemIds = new Set([...newLinkedIds, ...oldLinkedIds]);

    for (const itemId of allAffectedItemIds) {
      const itemRef = doc(firestore, 'menuItems', itemId);
      const currentItem = allItems.find(i => i.id === itemId);
      if (!currentItem) continue;

      const currentOutletIds = new Set(currentItem.outletIds || []);
      const shouldBeLinked = newLinkedIds.has(itemId);

      if (shouldBeLinked) {
        currentOutletIds.add(docId);
      } else {
        currentOutletIds.delete(docId);
      }
      
      const updatedOutletIds = Array.from(currentOutletIds);
      
      batch.update(itemRef, {
        outletIds: updatedOutletIds,
        isGeneral: updatedOutletIds.length === 0,
      });
    }
    // --- End Menu Item Logic ---

    // Save reviews to their own document
    const reviewDocRef = doc(firestore, 'reviews', docId);
    batch.set(reviewDocRef, {
        outletId: docId,
        aggregate: {
            ratingValue: aggregateRating,
            reviewCount: currentReviews.length
        },
        reviews: currentReviews,
    }, { merge: true });

    batch.set(outletRef, dataToSave, { merge: true });

    try {
      await batch.commit();
      toast({
        title: `Outlet ${outlet ? 'Updated' : 'Created'}`,
        description: `"${values.translations.en.name}" has been successfully saved.`,
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      const permissionError = new FirestorePermissionError({
        path: outletRef.path,
        operation: 'write',
        requestResourceData: dataToSave,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const handleDeletePromotion = async (promoId: string) => {
    if(!firestore) return;
    await deleteDoc(doc(firestore, "promotions", promoId));
    toast({ title: "Promotion Deleted" });
  }

  const handleDeleteReview = (reviewToDelete: Review) => {
    const isGoogleReview = reviewToDelete.source === 'google';
    const identifier = isGoogleReview ? reviewToDelete.time.toString() : reviewToDelete.id;

    setCurrentReviews(prev => prev.filter(r => {
        const currentIdentifier = r.source === 'google' ? r.time.toString() : r.id;
        return currentIdentifier !== identifier;
    }));
    toast({ title: "Review Removed", description: "The review will be permanently deleted when you save." });
  };
  
  const handleSaveTestimonial = (review: Omit<Review, 'source' | 'time' | 'id'> & { id?: string }) => {
      const newReview: Review = {
        ...review,
        id: review.id || `manual_${Date.now()}`,
        source: 'manual',
        time: serverTimestamp(),
      };
      
      const existingIndex = currentReviews.findIndex(r => r.id === newReview.id);

      if(existingIndex > -1) { // Editing existing
          setCurrentReviews(prev => prev.map((r, index) => index === existingIndex ? newReview : r));
      } else { // Adding new
          setCurrentReviews(prev => [...prev, newReview]);
      }
      setIsTestimonialDialogOpen(false);
  }

  const [selectedTestimonial, setSelectedTestimonial] = useState<Review | undefined>(undefined);

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
        <ScrollArea className="flex-grow pr-4">
          <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 bg-zinc-800">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="socials">Socials</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="promotions" disabled={!outlet}>Promotions</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <TabsContent value="general">
                    <div className="space-y-6">
                       <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2 pt-4">Google Places Integration</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="placeId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Google Place ID</FormLabel>
                                <FormControl><Input placeholder="Starts with ChIJ..." {...field} value={field.value || ''} className={inputStyles}/></FormControl>
                                <FormDescription>Used to fetch ratings and reviews.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <div className="self-end">
                            <Button type="button" onClick={handleFetchFromGoogle} disabled={isFetching} className="w-full">
                                {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Fetch from Google
                            </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-b border-primary/50 pb-2">
                        <h3 className="text-lg font-medium text-primary">Core Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <h3 className="font-medium text-lg text-zinc-300">English (EN)</h3>
                           <FormField control={form.control} name="translations.en.name" render={({ field }) => (
                              <FormItem><FormLabel>Outlet Name</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                            )}/>
                            <FormField control={form.control} name="translations.en.address" render={({ field }) => (
                                <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                            )}/>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="translations.en.city" render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                                )}/>
                                <FormField control={form.control} name="translations.en.state" render={({ field }) => (
                                    <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                                )}/>
                            </div>
                             <FormField control={form.control} name="translations.en.hours" render={({ field }) => (
                              <FormItem><FormLabel>Operating Hours</FormLabel><FormControl><Input placeholder="e.g. 8 AM - 10 PM" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                            )}/>
                             <FormField control={form.control} name="translations.en.tagline" render={({ field }) => (
                                <FormItem><FormLabel>Tagline</FormLabel><FormControl><Input placeholder="A catchy tagline for this outlet" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                            )}/>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                             <h3 className="font-medium text-lg text-zinc-300">Malay (MS)</h3>
                             <Button type="button" size="sm" onClick={handleCopyToMalay} className="bg-primary text-primary-foreground border border-black hover:bg-primary">Copy from EN</Button>
                           </div>
                           <FormField control={form.control} name="translations.ms.name" render={({ field }) => (
                              <FormItem><FormLabel>Nama Outlet</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                            )}/>
                            <FormField control={form.control} name="translations.ms.address" render={({ field }) => (
                                <FormItem><FormLabel>Alamat Penuh</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                            )}/>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="translations.ms.city" render={({ field }) => (
                                    <FormItem><FormLabel>Bandar</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                                )}/>
                                <FormField control={form.control} name="translations.ms.state" render={({ field }) => (
                                    <FormItem><FormLabel>Negeri</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                                )}/>
                            </div>
                             <FormField control={form.control} name="translations.ms.hours" render={({ field }) => (
                              <FormItem><FormLabel>Waktu Operasi</FormLabel><FormControl><Input placeholder="cth. 8 PG - 10 MLM" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                            )}/>
                             <FormField control={form.control} name="translations.ms.tagline" render={({ field }) => (
                                <FormItem><FormLabel>Tagline</FormLabel><FormControl><Input placeholder="Tagline menarik untuk outlet ini" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                            )}/>
                        </div>
                      </div>

                      <FormField control={form.control} name="slug" render={({ field }) => (
                          <FormItem><FormLabel>Slug (URL Identifier)</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormDescription>Auto-generated from name. Must be unique.</FormDescription><FormMessage/></FormItem>
                      )}/>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="lat" render={({ field }) => (
                              <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name="lng" render={({ field }) => (
                              <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                      </div>

                      <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2 pt-4">Contact & Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="whatsappLink" render={({ field }) => (
                              <FormItem><FormLabel>WhatsApp Link</FormLabel><FormControl><Input placeholder="https://wa.me/..." {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                      </div>

                      <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2 pt-4">Microsite & Card Images</h3>
                      <div className="space-y-4">
                          <FormField control={form.control} name="heroImage" render={({ field }) => (
                              <ImageUpload label="Microsite Hero Image" value={field.value || ''} onChange={field.onChange} folderName={`outlets/${outlet?.slug || 'new'}/hero`} />
                          )}/>
                           <FormField control={form.control} name="cardImage" render={({ field }) => (
                              <ImageUpload label="Outlet Card Image" value={field.value || ''} onChange={field.onChange} folderName={`outlets/${outlet?.slug || 'new'}/card`} />
                           )}/>
                          <FormField control={form.control} name="interiorImage" render={({ field }) => (
                              <ImageUpload label="Interior/Secondary Image" value={field.value || ''} onChange={field.onChange} folderName={`outlets/${outlet?.slug || 'new'}/interior`} />
                          )}/>
                      </div>
                      
                      <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2 pt-4">System</h3>
                      <FormField control={form.control} name="status" render={({ field }) => (
                              <FormItem><FormLabel>Status</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl><SelectTrigger className={inputStyles}><SelectValue /></SelectTrigger></FormControl>
                                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                          <SelectItem value="active">Active</SelectItem>
                                          <SelectItem value="inactive">Inactive</SelectItem>
                                      </SelectContent>
                                  </Select>
                              <FormMessage/></FormItem>
                          )}/>
                    </div>
                </TabsContent>
                <TabsContent value="socials">
                   <div className="space-y-6">
                    <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2">Outlet Social Media</h3>
                    <FormField control={form.control} name="socials.instagram" render={({ field }) => (
                        <FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="socials.tiktok" render={({ field }) => (
                        <FormItem><FormLabel>TikTok URL</FormLabel><FormControl><Input placeholder="https://tiktok.com/..." {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="socials.facebook" render={({ field }) => (
                        <FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input placeholder="https://facebook.com/..." {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </TabsContent>
                <TabsContent value="seo">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2">Search Engine Optimization</h3>
                     <FormField control={form.control} name="seo.title" render={({ field }) => (
                        <FormItem><FormLabel>Meta Title</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormDescription>If empty, the outlet name will be used.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seo.description" render={({ field }) => (
                        <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seo.keywords" render={({ field }) => (
                        <FormItem><FormLabel>Keywords</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormDescription>Comma-separated keywords relevant to this outlet.</FormDescription><FormMessage /></FormItem>
                    )} />
                  </div>
                </TabsContent>
                <TabsContent value="menu">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2">Menu Management</h3>
                         <FormField
                          control={form.control}
                          name="menuItemIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link Menu Items</FormLabel>
                              <MultiSelectPopover
                                title="Menu Items"
                                options={allItems?.map(item => ({ value: item.id, label: getLocalized(item, 'en').name || '' })) || []}
                                selected={field.value || []}
                                onChange={field.onChange}
                              />
                              <FormDescription>Select which menu items are available at this outlet. Leave empty for it to be available everywhere.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {watchedMenuItemIds?.map(itemId => {
                                const item = allItems.find(i => i.id === itemId);
                                if (!item) return null;
                                const localizedItem = getLocalized(item, 'en');
                                return (
                                    <div key={item.id} className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Image src={item.imageUrl} alt={localizedItem.name || ''} width={40} height={40} className="rounded-md object-contain p-1 bg-zinc-700"/>
                                            <div>
                                                <p className="font-semibold">{localizedItem.name}</p>
                                                <p className="text-sm text-zinc-400">RM{item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setValue('menuItemIds', watchedMenuItemIds?.filter(id => id !== itemId), { shouldDirty: true })}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="promotions">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-primary">Outlet Promotions</h3>
                        <Button type="button" size="sm" onClick={() => { setSelectedPromo(undefined); setIsPromoDialogOpen(true); }}>
                            <PlusCircle className="mr-2 h-4 w-4" /> New Promotion
                        </Button>
                     </div>
                     {promotions?.length === 0 && <p className="text-zinc-500 text-center py-8">No promotions for this outlet yet.</p>}
                     <div className="space-y-2">
                        {promotions?.map(promo => {
                            const status = promo.status;
                            return (
                            <div key={promo.id} className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                <Badge variant={status === 'active' ? 'default' : status === 'expired' ? 'destructive' : 'secondary'} className={cn( status === 'active' && 'bg-green-600', status === 'expired' && 'bg-red-700', status === 'scheduled' && 'bg-blue-600' )}>
                                    {status}
                                </Badge>
                                <div>
                                    <p className="font-semibold">{promo.title}</p>
                                    <p className="text-sm text-zinc-400">{getDiscountDisplay(promo)} | Expires: {format(promo.endDate.toDate(), 'PPP')}</p>
                                </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => { setSelectedPromo(promo); setIsPromoDialogOpen(true); }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button type="button" variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">This will permanently delete "{promo.title}".</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeletePromotion(promo.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            )
                        })}
                     </div>
                  </div>
                </TabsContent>
                 <TabsContent value="reviews">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-primary">Reviews for {getLocalized(outlet || {}, 'en').name}</h3>
                            <Button type="button" size="sm" onClick={() => { setSelectedTestimonial(undefined); setIsTestimonialDialogOpen(true); }}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Manual Review
                            </Button>
                        </div>
                        {isLoadingReviews && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin"/></div>}
                        
                        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                            {currentReviews.sort((a,b) => {
                                const timeA = typeof a.time === 'number' ? a.time : a.time.seconds;
                                const timeB = typeof b.time === 'number' ? b.time : b.time.seconds;
                                return timeB - timeA;
                            }).map((review, index) => {
                                const localizedReview = getLocalized(review, 'en');
                                return (
                                <div key={review.id || index} className="bg-zinc-800 p-3 rounded-lg flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                             <Badge variant={review.source === 'google' ? 'secondary' : 'default'} className={review.source === 'google' ? 'bg-blue-600' : 'bg-emerald-600'}>
                                                {review.source}
                                            </Badge>
                                            <p className="font-semibold">{review.author_name}</p>
                                        </div>
                                        <p className="text-sm text-zinc-300 mt-2">"{localizedReview.text}"</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span>{review.rating}</span>
                                            <span className="text-xs text-zinc-500">{review.time ? format(fromUnixTime(typeof review.time === 'number' ? review.time : review.time.seconds), 'PPP') : ''}</span>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {review.source === 'manual' && (
                                            <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => {setSelectedTestimonial(review); setIsTestimonialDialogOpen(true);}}>
                                                <Edit className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        )}
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button type="button" variant="ghost" size="icon" className="shrink-0"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                            <AlertDialogHeader><AlertDialogTitle>Delete Review?</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">This will remove this review from your website.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteReview(review)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                 </TabsContent>
              </div>
          </Tabs>
        </ScrollArea>
        <div className="flex-shrink-0 pt-6">
            <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {outlet ? 'Save Changes' : 'Create Outlet'}
            </Button>
        </div>
      </form>
    </Form>

     <Dialog open={isPromoDialogOpen} onOpenChange={setIsPromoDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPromo ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
            <DialogDescription>
              This promotion will be exclusive to {getLocalized(outlet || {}, 'en').name || 'this outlet'}.
            </DialogDescription>
          </DialogHeader>
          <PromotionForm 
            promotion={selectedPromo}
            outletId={outlet?.id}
            onSuccess={() => setIsPromoDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
       <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTestimonial ? 'Edit Manual Review' : 'Add New Manual Review'}</DialogTitle>
          </DialogHeader>
           <TestimonialForm 
            testimonial={selectedTestimonial}
            onSave={handleSaveTestimonial}
            onSuccess={() => {}}
            onCancel={() => setIsTestimonialDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

    

    

