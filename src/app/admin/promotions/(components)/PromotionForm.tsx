'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { collection, addDoc, doc, setDoc, serverTimestamp, writeBatch, getDoc } from 'firebase/firestore';
import type { Promotion, MenuItem, Outlet } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface PromotionFormProps {
  promotion?: Promotion;
  onSuccess: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  bannerImage: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.coerce.number().positive('Discount value must be positive.'),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date({ required_error: "An end date is required." }),
  menuItemIds: z.array(z.string()).optional(),
  outletIds: z.array(z.string()).optional(),
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after the start date.',
  path: ['endDate'],
});

type FormValues = z.infer<typeof formSchema>;

export default function PromotionForm({ promotion, onSuccess }: PromotionFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const { data: menuItems } = useCollection<MenuItem>(useMemoFirebase(() => firestore ? collection(firestore, 'menuItems') : null, [firestore]));
  const { data: outlets } = useCollection<Outlet>(useMemoFirebase(() => firestore ? collection(firestore, 'outlets') : null, [firestore]));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: promotion ? {
      ...promotion,
      startDate: promotion.startDate.toDate(),
      endDate: promotion.endDate.toDate(),
    } : {
      title: '',
      description: '',
      bannerImage: '',
      discountType: 'percentage',
      discountValue: 10,
      menuItemIds: [],
      outletIds: [],
    },
  });

  const { isSubmitting } = form.formState;

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
      const dataToSave = { ...values, status, updatedAt: serverTimestamp() };
      
      const oldMenuItemIds = promotion?.menuItemIds || [];
      const newMenuItemIds = values.menuItemIds || [];
      const idsToAdd = newMenuItemIds.filter(id => !oldMenuItemIds.includes(id));
      const idsToRemove = oldMenuItemIds.filter(id => !newMenuItemIds.includes(id));

      const batch = writeBatch(firestore);

      // Create or update promotion
      if (promotion) {
        const promoRef = doc(firestore, 'promotions', promotion.id);
        batch.set(promoRef, dataToSave, { merge: true });
      } else {
        const promoRef = doc(collection(firestore, 'promotions'));
        batch.set(promoRef, { ...dataToSave, createdAt: serverTimestamp() });
      }
      
      // Update menu items
      for (const itemId of idsToAdd) {
        const itemRef = doc(firestore, 'menuItems', itemId);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          const currentPromoIds = itemSnap.data().promotionIds || [];
          batch.update(itemRef, { promotionIds: [...currentPromoIds, promotion?.id] });
        }
      }

      for (const itemId of idsToRemove) {
          const itemRef = doc(firestore, 'menuItems', itemId);
          const itemSnap = await getDoc(itemRef);
          if (itemSnap.exists()) {
              const currentPromoIds = itemSnap.data().promotionIds || [];
              batch.update(itemRef, { promotionIds: currentPromoIds.filter((id: string) => id !== promotion?.id) });
          }
      }

      await batch.commit();

      toast({ title: `Promotion ${promotion ? 'Updated' : 'Created'}`, description: `"${values.title}" has been saved.` });
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="e.g., Weekend Special" {...field} className={inputStyles} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl><Textarea placeholder="Describe the promotion" {...field} className={inputStyles} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground", inputStyles)}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground", inputStyles)}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="menuItemIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linked Menu Items</FormLabel>
              <MultiSelectPopover
                title="Menu Items"
                options={menuItems?.map(item => ({ value: item.id, label: item.name })) || []}
                selected={field.value || []}
                onChange={field.onChange}
              />
              <FormDescription>Select which menu items this promotion applies to.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="outletIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linked Outlets</FormLabel>
               <MultiSelectPopover
                title="Outlets"
                options={outlets?.map(outlet => ({ value: outlet.id, label: outlet.name })) || []}
                selected={field.value || []}
                onChange={field.onChange}
              />
              <FormDescription>Select which outlets this promotion applies to. Leave empty for a global promotion.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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

function MultiSelectPopover({ title, options, selected, onChange }: {
    title: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
}) {
    const [open, setOpen] = React.useState(false);

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
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command className="bg-zinc-900 text-white border-zinc-800">
                    <CommandInput placeholder={`Search ${title}...`} />
                    <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-48">
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                        const newSelected = selected.includes(option.value)
                                            ? selected.filter((v) => v !== option.value)
                                            : [...selected, option.value];
                                        onChange(newSelected);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}