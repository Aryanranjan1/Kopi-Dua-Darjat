
'use client';

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
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Outlet } from '@/lib/types';
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
import { useEffect } from 'react';

interface OutletFormProps {
  outlet?: Outlet;
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
});

type FormValues = z.infer<typeof formSchema>;

export default function OutletForm({ outlet, onSuccess }: OutletFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: outlet || {
      name: '',
      slug: '',
      address: '',
      city: '',
      state: '',
      lat: 0,
      lng: 0,
      hours: '',
      phone: '',
      email: '',
      status: 'active',
      heroImage: '',
      interiorImage: '',
      tagline: '',
      mapsLink: '',
      whatsappLink: '',
      chatbotEmbed: '',
      isChatbotEnabled: false,
    },
  });

  const { isSubmitting, watch, setValue } = form;
  const watchedName = watch('name');

  useEffect(() => {
    if (watchedName && !form.formState.dirtyFields.slug) {
        setValue('slug', slugify(watchedName, { lower: true, strict: true }));
    }
  }, [watchedName, setValue, form.formState.dirtyFields.slug]);

  const onSubmit = async (values: FormValues) => {
    if (!firestore) return;
    try {
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
        updatedAt: serverTimestamp(),
        ...(outlet ? {} : { createdAt: serverTimestamp() }),
      };

      await setDoc(outletRef, dataToSave, { merge: true });

      toast({
        title: `Outlet ${outlet ? 'Updated' : 'Created'}`,
        description: `"${values.name}" has been successfully saved.`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error saving outlet:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
        <ScrollArea className="flex-grow pr-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2">Core Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Outlet Name</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem><FormLabel>Slug (URL Identifier)</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormDescription>Auto-generated from name. Must be unique.</FormDescription><FormMessage/></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="lat" render={({ field }) => (
                    <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="lng" render={({ field }) => (
                    <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
            </div>

            <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2 pt-4">Contact & Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="hours" render={({ field }) => (
                    <FormItem><FormLabel>Operating Hours</FormLabel><FormControl><Input placeholder="e.g. 8 AM - 10 PM" {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
                 <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="whatsappLink" render={({ field }) => (
                    <FormItem><FormLabel>WhatsApp Link</FormLabel><FormControl><Input placeholder="https://wa.me/..." {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
            </div>

            <h3 className="text-lg font-medium text-primary border-b border-primary/50 pb-2 pt-4">Microsite Content</h3>
             <FormField control={form.control} name="tagline" render={({ field }) => (
                <FormItem><FormLabel>Tagline</FormLabel><FormControl><Input placeholder="A catchy tagline for this outlet" {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="heroImage" render={({ field }) => (
                    <FormItem><FormLabel>Hero Image URL</FormLabel><FormControl><Input type="url" {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="interiorImage" render={({ field }) => (
                    <FormItem><FormLabel>Interior Image URL</FormLabel><FormControl><Input type="url" {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                )}/>
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
                    <FormControl><Textarea placeholder="<script>...</script>" {...field} className={`${inputStyles} font-mono`} /></FormControl>
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
        </ScrollArea>
        <div className="flex-shrink-0 pt-6">
            <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {outlet ? 'Save Changes' : 'Create Outlet'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
