'use client';

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
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const founderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  image: z.string().url('Must be a valid URL').or(z.literal('')),
  quote: z.string().optional(),
  contact: z.string().email('Must be a valid email').or(z.literal('')),
});

const formSchema = z.object({
  brand: z.object({
    name: z.string().min(1, 'Brand name is required'),
    favicon: z.string().url().or(z.literal('')),
    logoLight: z.string().url().or(z.literal('')),
    logoDark: z.string().url().or(z.literal('')),
    tagline: z.string().optional(),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
  }),
  founders: z.array(founderSchema),
  contact: z.object({
    email: z.string().email('Must be a valid email').or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    googleMapsLink: z.string().url().or(z.literal('')),
    businessHours: z.string().optional(),
  }),
  socials: z.object({
    instagram: z.string().url().or(z.literal('')),
    facebook: z.string().url().or(z.literal('')),
    tiktok: z.string().url().or(z.literal('')),
    youtube: z.string().url().or(z.literal('')),
    whatsapp: z.string().url().or(z.literal('')),
  }),
  automation: z.object({
    newsletterIntegration: z.boolean().default(false),
    googleBusinessSync: z.boolean().default(false),
    autoBackup: z.boolean().default(true),
    appCheckEnforced: z.boolean().default(true),
  }),
  meta: z.object({
    defaultTitle: z.string().optional(),
    defaultDescription: z.string().optional(),
    defaultImage: z.string().url().or(z.literal('')),
    keywords: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsForm() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'main') : null, [firestore]);
  const { data: settingsData, isLoading } = useDoc<SiteSettings>(settingsRef);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: settingsData ? {
        ...settingsData,
        meta: {
            ...settingsData.meta,
            keywords: settingsData.meta?.keywords?.join(', '),
        },
    } : undefined,
    defaultValues: {
        brand: { name: '', favicon: '', logoLight: '', logoDark: '', tagline: '' },
        founders: [],
        contact: { email: '', phone: '', address: '', googleMapsLink: '', businessHours: '' },
        socials: { instagram: '', facebook: '', tiktok: '', youtube: '', whatsapp: '' },
        automation: { newsletterIntegration: false, googleBusinessSync: false, autoBackup: true, appCheckEnforced: true },
        meta: { defaultTitle: '', defaultDescription: '', defaultImage: '', keywords: '' },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "founders",
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: FormValues) => {
    if (!firestore) return;
    try {
      const dataToSave = {
        ...values,
        meta: {
            ...values.meta,
            keywords: values.meta.keywords ? values.meta.keywords.split(',').map(kw => kw.trim()) : [],
        },
        lastUpdated: serverTimestamp(),
        // updatedBy: 'admin_user_id' // This should be the current admin's UID
      };

      await setDoc(settingsRef, dataToSave, { merge: true });
      toast({ title: 'Settings Updated', description: 'Global configuration has been saved.' });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="brand" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-zinc-800 mb-6">
                <TabsTrigger value="brand">Brand</TabsTrigger>
                <TabsTrigger value="founders">Founders</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="socials">Socials</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="automation">System</TabsTrigger>
            </TabsList>
            <TabsContent value="brand">
                <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle>Brand & Identity</CardTitle><CardDescription>Manage your brand's core visual assets and identity.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="brand.name" render={({ field }) => (
                            <FormItem><FormLabel>Brand Name</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                        )}/>
                        <FormField control={form.control} name="brand.tagline" render={({ field }) => (
                            <FormItem><FormLabel>Tagline</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                        )}/>
                        <FormField control={form.control} name="brand.logoLight" render={({ field }) => (
                            <FormItem><FormLabel>Logo Light URL</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormDescription>URL for logo used on dark backgrounds.</FormDescription><FormMessage/></FormItem>
                        )}/>
                        <FormField control={form.control} name="brand.logoDark" render={({ field }) => (
                            <FormItem><FormLabel>Logo Dark URL</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormDescription>URL for logo used on light backgrounds.</FormDescription><FormMessage/></FormItem>
                        )}/>
                        <FormField control={form.control} name="brand.favicon" render={({ field }) => (
                            <FormItem><FormLabel>Favicon URL</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                        )}/>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="founders">
                <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle>Founders</CardTitle><CardDescription>Manage information about the company founders.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-zinc-700 rounded-lg space-y-4 relative">
                            <h4 className="text-lg font-semibold">Founder {index + 1}</h4>
                             <FormField control={form.control} name={`founders.${index}.name`} render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name={`founders.${index}.role`} render={({ field }) => (
                                <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`founders.${index}.image`} render={({ field }) => (
                                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`founders.${index}.quote`} render={({ field }) => (
                                <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <Button type="button" variant="destructive" size="icon" className="absolute top-4 right-4" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => append({ name: '', role: '', image: '', quote: '', contact: '' })}><Plus className="mr-2 h-4 w-4" /> Add Founder</Button>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="contact">
                 <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle>Contact Info</CardTitle><CardDescription>Public contact and location details.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="contact.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Textarea {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.googleMapsLink" render={({ field }) => (<FormItem><FormLabel>Google Maps URL</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.businessHours" render={({ field }) => (<FormItem><FormLabel>Business Hours</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="socials">
                 <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle>Social Media</CardTitle><CardDescription>Links to your social media profiles.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="socials.instagram" render={({ field }) => (<FormItem><FormLabel>Instagram</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.facebook" render={({ field }) => (<FormItem><FormLabel>Facebook</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.tiktok" render={({ field }) => (<FormItem><FormLabel>TikTok</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.youtube" render={({ field }) => (<FormItem><FormLabel>YouTube</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.whatsapp" render={({ field }) => (<FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="seo">
                 <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle>SEO Defaults</CardTitle><CardDescription>Default metadata for search engine optimization.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="meta.defaultTitle" render={({ field }) => (<FormItem><FormLabel>Default Meta Title</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="meta.defaultDescription" render={({ field }) => (<FormItem><FormLabel>Default Meta Description</FormLabel><FormControl><Textarea {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="meta.defaultImage" render={({ field }) => (<FormItem><FormLabel>Default OG Image URL</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="meta.keywords" render={({ field }) => (<FormItem><FormLabel>Default Keywords</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormDescription>Comma-separated keywords.</FormDescription><FormMessage /></FormItem>)} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="automation">
                 <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle>Automation & System</CardTitle><CardDescription>System-level configurations and integrations.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                         <FormField control={form.control} name="automation.newsletterIntegration" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                                <div className="space-y-0.5"><FormLabel>Newsletter Integration</FormLabel><FormDescription>Enable or disable newsletter functionality.</FormDescription></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                         )} />
                          <FormField control={form.control} name="automation.googleBusinessSync" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                                <div className="space-y-0.5"><FormLabel>Google Business Sync</FormLabel><FormDescription>Automatically sync outlet info with Google Business Profile.</FormDescription></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                         )} />
                         <FormField control={form.control} name="automation.autoBackup" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                                <div className="space-y-0.5"><FormLabel>Automatic Backups</FormLabel><FormDescription>Enable daily automated backups of the Firestore database.</FormDescription></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                         )} />
                          <FormField control={form.control} name="automation.appCheckEnforced" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
                                <div className="space-y-0.5"><FormLabel>App Check Enforcement</FormLabel><FormDescription>Enforce Firebase App Check to protect backend resources.</FormDescription></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                         )} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save All Settings
            </Button>
        </div>
      </form>
    </Form>
  );
}
