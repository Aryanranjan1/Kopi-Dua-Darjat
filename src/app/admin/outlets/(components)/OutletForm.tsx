
'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Loader2, ChevronsUpDown, Trash2, Edit, PlusCircle, Check, MapPin } from 'lucide-react';
import { useFirestore, errorEmitter, FirestorePermissionError, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection, query, where, addDoc, deleteDoc, writeBatch, getDocs } from 'firebase/firestore';
import type { Outlet, Testimonial, Promotion, MenuItem } from '@/lib/types';
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
import { cn, getDiscountDisplay } from '@/lib/utils';
import { format } from 'date-fns';
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


interface OutletFormProps {
  outlet?: Outlet;
  allItems: MenuItem[];
  allTestimonials: Testimonial[];
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(3, 'Outlet name is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with no spaces'),
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  hours: z.string().min(5, 'Operating hours are required'),
  phone: z.string().optional(),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  heroImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  interiorImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tagline: z.string().optional(),
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


export default function OutletForm({ outlet, allItems, allTestimonials, onSuccess }: OutletFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isFetching, setIsFetching] = useState(false);
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | undefined>(undefined);

  const { data: promotions } = useCollection<Promotion>(
    useMemoFirebase(() => outlet ? query(collection(firestore, 'promotions'), where('outletIds', 'array-contains', outlet.id)) : null, [firestore, outlet])
  );
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', slug: '', address: '', city: '', state: '', lat: 0, lng: 0, hours: '', phone: '', email: '',
      status: 'active', heroImage: '', interiorImage: '', tagline: '', mapsLink: '', whatsappLink: '',
      chatbotEmbed: '', isChatbotEnabled: false, placeId: '', menuItemIds: [],
      seo: { title: '', description: '', keywords: '' },
    },
  });
  
  useEffect(() => {
    if (outlet) {
      form.reset({
        ...outlet,
        phone: outlet.phone || '',
        email: outlet.email || '',
        heroImage: outlet.heroImage || '',
        interiorImage: outlet.interiorImage || '',
        tagline: outlet.tagline || '',
        mapsLink: outlet.mapsLink || '',
        whatsappLink: outlet.whatsappLink || '',
        chatbotEmbed: outlet.chatbotEmbed || '',
        placeId: outlet.placeId || '',
        menuItemIds: allItems?.filter(item => item.outletIds?.includes(outlet.id)).map(item => item.id) || [],
        seo: {
          title: outlet.seo?.title || '',
          description: outlet.seo?.description || '',
          keywords: outlet.seo?.keywords || '',
        },
      });
    } else {
        form.reset({
            name: '', slug: '', address: '', city: '', state: '', lat: 0, lng: 0, hours: '', phone: '', email: '',
            status: 'active', heroImage: '', interiorImage: '', tagline: '', mapsLink: '', whatsappLink: '',
            chatbotEmbed: '', isChatbotEnabled: false, placeId: '', menuItemIds: [],
            seo: { title: '', description: '', keywords: '' },
        })
    }
  }, [outlet, allItems, form]);


  const { isSubmitting, watch, setValue } = form;
  const watchedName = watch('name');
  const watchedMenuItemIds = watch('menuItemIds');

  useEffect(() => {
    if (watchedName && !form.formState.dirtyFields.slug) {
        setValue('slug', slugify(watchedName, { lower: true, strict: true }));
    }
  }, [watchedName, setValue, form.formState.dirtyFields.slug]);

  const handleFetchFromGoogle = async () => {
    const placeId = form.getValues('placeId');
    if (!placeId) {
      toast({
        variant: 'destructive',
        title: 'Missing Place ID',
        description: 'Please enter a Google Place ID before fetching.',
      });
      return;
    }

    setIsFetching(true);
    toast({
      title: 'Fetching Data...',
      description: `Fetching details for Place ID: ${placeId}`,
    });

    try {
      const response = await fetch('/api/fetch-google-place-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      form.setValue('name', data.name, { shouldValidate: true });
      form.setValue('address', data.address, { shouldValidate: true });
      form.setValue('city', data.city, { shouldValidate: true });
      form.setValue('state', data.state, { shouldValidate: true });
      form.setValue('lat', data.lat, { shouldValidate: true });
      form.setValue('lng', data.lng, { shouldValidate: true });
      form.setValue('phone', data.phone, { shouldValidate: true });
      form.setValue('hours', data.hours, { shouldValidate: true });
      form.setValue('mapsLink', data.mapsLink, { shouldValidate: true });

      toast({
        title: 'Data Fetched!',
        description: 'The form has been populated with data from Google. Please review and save.',
      });

    } catch (error: any) {
      console.error('Error calling fetchGooglePlaceDetails API:', error);
      toast({
        variant: 'destructive',
        title: 'Fetch Failed',
        description: error.message || 'Could not fetch data from Google Places.',
        duration: 9000,
      });
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!firestore) return;
    
    const docId = values.slug;
    const outletRef = doc(firestore, 'outlets', docId);
    
    const dataToSave = {
      ...values,
      phone: values.phone || null,
      email: values.email || null,
      heroImage: values.heroImage || null,
      interiorImage: values.interiorImage || null,
      tagline: values.tagline || null,
      mapsLink: values.mapsLink || null,
      whatsappLink: values.whatsappLink || null,
      chatbotEmbed: values.chatbotEmbed || null,
      placeId: values.placeId || null,
      seo: {
        title: values.seo?.title || null,
        description: values.seo?.description || null,
        keywords: values.seo?.keywords || null,
      },
      updatedAt: serverTimestamp(),
      ...(outlet ? {} : { createdAt: serverTimestamp() }),
    };

    delete (dataToSave as any).menuItemIds;
    
    const batch = writeBatch(firestore);

    // --- Menu Item Linking Logic ---
    const newLinkedIds = new Set(values.menuItemIds || []);
    // Correctly determine old linked items for the specific outlet being edited
    const oldLinkedIds = new Set(outlet ? allItems.filter(i => i.outletIds?.includes(outlet.id)).map(i => i.id) : []);

    const allAffectedItemIds = new Set([...newLinkedIds, ...oldLinkedIds]);

    for (const itemId of allAffectedItemIds) {
      const itemRef = doc(firestore, 'menuItems', itemId);
      const currentItem = allItems.find(i => i.id === itemId);
      if (!currentItem) continue;

      const currentOutletIds = new Set(currentItem.outletIds || []);
      const shouldBeLinked = newLinkedIds.has(itemId);

      if (shouldBeLinked) {
        currentOutletIds.add(docId); // Use current outlet's ID (slug)
      } else {
        currentOutletIds.delete(docId); // Use current outlet's ID (slug)
      }
      
      const updatedOutletIds = Array.from(currentOutletIds);
      
      batch.update(itemRef, {
        outletIds: updatedOutletIds,
        isGeneral: updatedOutletIds.length === 0,
      });
    }
    // --- End Menu Item Logic ---

    batch.set(outletRef, dataToSave, { merge: true });

    try {
      await batch.commit();
      toast({
        title: `Outlet ${outlet ? 'Updated' : 'Created'}`,
        description: `"${values.name}" has been successfully saved.`,
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

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";
  const outletReviews = useMemo(() => allTestimonials.filter(t => t.outletId === outlet?.id), [allTestimonials, outlet]);

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
        <ScrollArea className="flex-grow pr-4">
          <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-zinc-800">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <TabsContent value="general">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2">Core Information</h3>
                      <FormField control={form.control} name="placeId" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Google Place ID</FormLabel>
                              <div className="flex items-center gap-2">
                                  <FormControl>
                                      <Input placeholder="ChIJ..." {...field} value={field.value || ''} className={inputStyles}/>
                                  </FormControl>
                                  <Button type="button" onClick={handleFetchFromGoogle} disabled={isFetching}>
                                      {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch'}
                                  </Button>
                              </div>
                              <FormDescription>Enter a Place ID and click 'Fetch' to auto-populate data.</FormDescription>
                              <FormMessage/>
                          </FormItem>
                      )}/>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="name" render={({ field }) => (
                              <FormItem><FormLabel>Outlet Name</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name="slug" render={({ field }) => (
                              <FormItem><FormLabel>Slug (URL Identifier)</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormDescription>Auto-generated from name. Must be unique.</FormDescription><FormMessage/></FormItem>
                          )}/>
                      </div>
                      <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                      )}/>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="city" render={({ field }) => (
                              <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name="state" render={({ field }) => (
                              <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="lat" render={({ field }) => (
                              <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name="lng" render={({ field }) => (
                              <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                      </div>

                      <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2 pt-4">Contact & Hours</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="hours" render={({ field }) => (
                              <FormItem><FormLabel>Operating Hours</FormLabel><FormControl><Input placeholder="e.g. 8 AM - 10 PM" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name="whatsappLink" render={({ field }) => (
                              <FormItem><FormLabel>WhatsApp Link</FormLabel><FormControl><Input placeholder="https://wa.me/..." {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                          )}/>
                      </div>

                      <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2 pt-4">Microsite Content</h3>
                      <FormField control={form.control} name="tagline" render={({ field }) => (
                          <FormItem><FormLabel>Tagline</FormLabel><FormControl><Input placeholder="A catchy tagline for this outlet" {...field} value={field.value || ''} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                      )}/>
                      <div className="space-y-4">
                          <FormField
                              control={form.control}
                              name="heroImage"
                              render={({ field }) => (
                                  <ImageUpload
                                      label="Hero Image"
                                      value={field.value || ''}
                                      onChange={field.onChange}
                                      folderName={`outlets/${outlet?.slug || 'new'}/hero`}
                                  />
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="interiorImage"
                              render={({ field }) => (
                                  <ImageUpload
                                      label="Interior Image"
                                      value={field.value || ''}
                                      onChange={field.onChange}
                                      folderName={`outlets/${outlet?.slug || 'new'}/interior`}
                                  />
                              )}
                          />
                      </div>
                      <FormField control={form.control} name="chatbotEmbed" render={({ field }) => (
                          <FormItem>
                              <div className="flex items-center justify-between">
                                  <FormLabel>Chatbot Embed Code</FormLabel>
                                  <FormField
                                      control={form.control}
                                      name="isChatbotEnabled"
                                      render={({ field }) => (
                                          <FormItem className="flex items-center gap-2 space-y-0">
                                              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                              <FormLabel className="text-sm !mt-0">{field.value ? "Enabled" : "Disabled"}</FormLabel>
                                          </FormItem>
                                      )}
                                  />
                              </div>
                              <FormControl><Textarea placeholder="<script>...</script>" {...field} value={field.value || ''} className={`${inputStyles} font-mono`} /></FormControl>
                              <FormDescription>Paste the full embed code for a chatbot if applicable.</FormDescription>
                              <FormMessage/>
                          </FormItem>
                      )}/>

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
                                options={allItems?.map(item => ({ value: item.id, label: item.name })) || []}
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
                                return (
                                    <div key={item.id} className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md object-contain p-1 bg-zinc-700"/>
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
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
                  <p className="text-zinc-400">Manage reviews for this outlet here. You can hide reviews that are not suitable.</p>
                   <div className="space-y-2 mt-4">
                        {outletReviews.map(review => (
                            <div key={review.id} className="bg-zinc-800 rounded-lg p-3">
                                <p className="text-sm italic">"{review.quote}"</p>
                                <p className="text-xs text-right font-semibold mt-2">- {review.name}, {review.designation}</p>
                            </div>
                        ))}
                        {outletReviews.length === 0 && <p className="text-zinc-500 text-center py-8">No reviews linked to this outlet yet.</p>}
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
              This promotion will be exclusive to {outlet?.name || 'this outlet'}.
            </DialogDescription>
          </DialogHeader>
          <PromotionForm 
            promotion={selectedPromo}
            outletId={outlet?.id}
            onSuccess={() => setIsPromoDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
