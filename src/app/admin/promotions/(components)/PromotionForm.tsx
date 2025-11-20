
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, writeBatch, getDoc, query } from 'firebase/firestore';
import type { Promotion, MenuItem, Outlet } from '@/lib/types';
import { cn, getLocalized } from '@/lib/utils';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface PromotionFormProps {
  promotion?: Promotion;
  outletId?: string; // If provided, promotion is exclusive to this outlet
  onSuccess: () => void;
}

const formSchema = z.object({
  translations: z.object({
    en: z.object({
      title: z.string().min(3, 'English title must be at least 3 characters.'),
      description: z.string().optional(),
      customDiscountDescription: z.string().optional(),
    }),
    ms: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      customDiscountDescription: z.string().optional(),
    })
  }),
  bannerImage: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  discountType: z.enum(['percentage', 'flat', 'bogo', 'custom']),
  discountValue: z.coerce.number().positive('Discount value must be positive.').optional(),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date({ required_error: "An end date is required." }),
  menuItemIds: z.array(z.string()).optional(),
  outletIds: z.array(z.string()).optional(),
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after the start date.',
  path: ['endDate'],
}).refine(data => {
    if (['percentage', 'flat'].includes(data.discountType)) {
        return data.discountValue !== undefined && data.discountValue > 0;
    }
    return true;
}, {
    message: 'Discount value is required for this discount type.',
    path: ['discountValue'],
}).refine(data => {
    if (data.discountType === 'custom') {
        const localized = getLocalized({ translations: data.translations } as any, 'en');
        return localized.customDiscountDescription && localized.customDiscountDescription.length > 0;
    }
    return true;
}, {
    message: 'Custom description is required for this discount type.',
    path: ['translations.en.customDiscountDescription'],
});


type FormValues = z.infer<typeof formSchema>;

export default function PromotionForm({ promotion, outletId, onSuccess }: PromotionFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const { data: menuItems } = useCollection<MenuItem>(useMemoFirebase(() => firestore ? query(collection(firestore, 'menuItems')) : null, [firestore]));
  const { data: outlets } = useCollection<Outlet>(useMemoFirebase(() => firestore ? query(collection(firestore, 'outlets')) : null, [firestore]));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: promotion ? {
      translations: {
        en: getLocalized(promotion, 'en'),
        ms: getLocalized(promotion, 'ms'),
      },
      bannerImage: promotion.bannerImage,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      startDate: promotion.startDate.toDate(),
      endDate: promotion.endDate.toDate(),
      menuItemIds: promotion.menuItemIds || [],
      outletIds: promotion.outletIds || [],
    } : {
      translations: { en: { title: '', description: '', customDiscountDescription: '' }, ms: { title: '', description: '', customDiscountDescription: '' } },
      bannerImage: '',
      discountType: 'percentage',
      discountValue: 10,
      menuItemIds: [],
      outletIds: outletId ? [outletId] : [],
    },
  });

  const { isSubmitting, watch, control } = form;
  const discountType = watch("discountType");
  
  const handleCopyToMalay = () => {
    const en = form.getValues('translations.en');
    form.setValue('translations.ms', en);
    toast({ title: "Content Copied", description: "English content has been copied to the Malay fields." });
  }

  const getStatus = (start: Date, end: Date): 'scheduled' | 'active' | 'expired' => {
      const now = new Date();
      if (now < start) return 'scheduled';
      if (now > end) return 'expired';
      return 'active';
  }

  const onSubmit = async (values: FormValues) => {
    if (!firestore) return;

    try {
      const status = getStatus(values.startDate, values.endDate);
      const dataToSave = {
          translations: values.translations,
          bannerImage: values.bannerImage,
          discountType: values.discountType,
          startDate: values.startDate,
          endDate: values.endDate,
          menuItemIds: values.menuItemIds,
          outletIds: outletId ? [outletId] : (values.outletIds || []),
          discountValue: (values.discountType === 'bogo' || values.discountType === 'custom') ? 0 : values.discountValue,
          status, 
          updatedAt: serverTimestamp()
      };
      
      const oldMenuItemIds = promotion?.menuItemIds || [];
      const newMenuItemIds = values.menuItemIds || [];
      const idsToAdd = newMenuItemIds.filter(id => !oldMenuItemIds.includes(id));
      const idsToRemove = oldMenuItemIds.filter(id => !newMenuItemIds.includes(id));

      const batch = writeBatch(firestore);
      let promoId = promotion?.id;

      // Create or update promotion
      if (promotion) {
        const promoRef = doc(firestore, 'promotions', promotion.id);
        batch.set(promoRef, dataToSave, { merge: true });
      } else {
        const promoRef = doc(collection(firestore, 'promotions'));
        promoId = promoRef.id;
        batch.set(promoRef, { ...dataToSave, createdAt: serverTimestamp() });
      }
      
      if(promoId) {
        // Update menu items
        for (const itemId of idsToAdd) {
            const itemRef = doc(firestore, 'menuItems', itemId);
            const itemSnap = await getDoc(itemRef);
            if (itemSnap.exists()) {
            const currentPromoIds = itemSnap.data().promotionIds || [];
            batch.update(itemRef, { promotionIds: [...currentPromoIds, promoId] });
            }
        }

        for (const itemId of idsToRemove) {
            const itemRef = doc(firestore, 'menuItems', itemId);
            const itemSnap = await getDoc(itemRef);
            if (itemSnap.exists()) {
                const currentPromoIds = itemSnap.data().promotionIds || [];
                batch.update(itemRef, { promotionIds: currentPromoIds.filter((id: string) => id !== promoId) });
            }
        }
      }

      await batch.commit();

      toast({ title: `Promotion ${promotion ? 'Updated' : 'Created'}`, description: `"${values.translations.en.title}" has been saved.` });
      onSuccess();

    } catch (error: any) {
      console.error('Error saving promotion:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-white">
        <ScrollArea className="h-[70vh] pr-4">
        <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg text-zinc-300">English (EN)</h3>
            <FormField control={form.control} name="translations.en.title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Weekend Special" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="translations.en.description" render={({ field }) => (
              <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea placeholder="Describe the promotion" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg text-zinc-300">Malay (MS)</h3>
              <Button type="button" size="sm" onClick={handleCopyToMalay} className="bg-primary text-primary-foreground border border-black hover:bg-primary">Copy from EN</Button>
            </div>
             <FormField control={form.control} name="translations.ms.title" render={({ field }) => (
              <FormItem><FormLabel>Tajuk</FormLabel><FormControl><Input placeholder="cth., Istimewa Hujung Minggu" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="translations.ms.description" render={({ field }) => (
              <FormItem><FormLabel>Penerangan (Pilihan)</FormLabel><FormControl><Textarea placeholder="Terangkan promosi" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className={inputStyles}><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat (RM)</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {['percentage', 'flat'].includes(discountType) && (
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} className={inputStyles} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {discountType === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="translations.en.customDiscountDescription" render={({ field }) => (
                  <FormItem><FormLabel>Custom Discount Description (EN)</FormLabel><FormControl><Input placeholder="e.g. Buy 3, Get 1 Free" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="translations.ms.customDiscountDescription" render={({ field }) => (
                  <FormItem><FormLabel>Custom Discount Description (MS)</FormLabel><FormControl><Input placeholder="cth. Beli 3, Dapat 1 Percuma" {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateTimePicker fieldName="startDate" label="Start Date" control={control} />
            <DateTimePicker fieldName="endDate" label="End Date" control={control} />
        </div>

        <FormField
          control={form.control}
          name="menuItemIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linked Menu Items</FormLabel>
              <MultiSelectPopover
                title="Menu Items"
                options={menuItems?.map(item => ({ value: item.id, label: getLocalized(item, 'en').name || '' })) || []}
                selected={field.value || []}
                onChange={field.onChange}
              />
              <FormDescription>Select which menu items this promotion applies to.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!outletId && (
            <FormField
            control={form.control}
            name="outletIds"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Linked Outlets</FormLabel>
                <MultiSelectPopover
                    title="Outlets"
                    options={outlets?.map(outlet => ({ value: outlet.id, label: getLocalized(outlet, 'en').name || '' })) || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                />
                <FormDescription>Select which outlets this promotion applies to. Leave empty for a global promotion.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
        </div>
        </ScrollArea>
        <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {promotion ? 'Save Changes' : 'Create Promotion'}
        </Button>
      </form>
    </Form>
  );
}

const DateTimePicker = ({ fieldName, label, control }: { fieldName: "startDate" | "endDate", label: string, control: any }) => {
    const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";
    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground", inputStyles)}>
                        {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    <div className="p-2 border-t border-zinc-800">
                        <Input 
                            type="time"
                            value={field.value ? format(field.value, 'HH:mm') : ''}
                            onChange={(e) => {
                                const newTime = e.target.value;
                                const [hours, minutes] = newTime.split(':').map(Number);
                                const newDate = field.value ? new Date(field.value) : new Date();
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                            }}
                            className={inputStyles}
                        />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
        />
    )
}

function MultiSelectPopover({ title, options, selected, onChange }: {
    title: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredOptions = options.filter(option => 
        option.label?.toLowerCase().includes(searchQuery.toLowerCase())
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
