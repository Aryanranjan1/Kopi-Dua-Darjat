
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMedia } from '@/lib/media';

const founderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  imageId: z.string().optional(),
  quote: z.string().optional(),
  contact: z.string().email('Must be a valid email').or(z.literal('')),
});

const formSchema = z.object({
  brand: z.object({
    name: z.string().min(1, 'Brand name is required'),
    favicon: z.string().optional(),
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
    instagramSyncEnabled: z.boolean().default(false),
    instagramApiKey: z.string().optional(),
    marketingEngineEnabled: z.boolean().default(false),
    marketingApiKey: z.string().optional(),
    analyticsEnabled: z.boolean().default(false),
    analyticsApiKey: z.string().optional(),
    appCheckEnforced: z.boolean().default(true),
    recaptchaSiteKey: z.string().optional(),
  }),
  meta: z.object({
    defaultTitle: z.string().optional(),
    defaultDescription: z.string().optional(),
    defaultImageId: z.string().optional(),
    keywords: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: media, isLoading: isLoadingMedia } = useMedia();

  const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'main') : null, [firestore]);
  const { data: settingsData, isLoading: isLoadingSettings } = useDoc<SiteSettings>(settingsRef);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: settingsData ? {
        ...settingsData,
        brand: {
            ...settingsData.brand,
        },
        founders: settingsData.founders?.map(f => ({ ...f, imageId: f.imageId || '' })) || [],
        meta: {
            ...settingsData.meta,
            keywords: settingsData.meta?.keywords?.join(', '),
            defaultImageId: settingsData.meta?.defaultImageId || '',
        },
        automation: {
            ...settingsData.automation,
            instagramApiKey: settingsData.automation?.instagramApiKey || '',
            marketingApiKey: settingsData.automation?.marketingApiKey || '',
            analyticsApiKey: settingsData.automation?.analyticsApiKey || '',
            recaptchaSiteKey: settingsData.automation?.recaptchaSiteKey || '',
        }
    } : undefined,
    defaultValues: {
        brand: { name: '', tagline: '' },
        founders: [],
        contact: { email: '', phone: '', address: '', googleMapsLink: '', businessHours: '' },
        socials: { instagram: '', facebook: '', tiktok: '', youtube: '', whatsapp: '' },
        automation: { 
            instagramSyncEnabled: false,
            instagramApiKey: '',
            marketingEngineEnabled: false,
            marketingApiKey: '',
            analyticsEnabled: false,
            analyticsApiKey: '',
            appCheckEnforced: true,
            recaptchaSiteKey: '',
        },
        meta: { defaultTitle: '', defaultDescription: '', keywords: '', defaultImageId: '' },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "founders",
  });
  
  const watchedAutomation = form.watch("automation");

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: FormValues) => {
    if (!firestore || !settingsRef) return;
    try {
      const dataToSave = {
        ...values,
        meta: {
            ...values.meta,
            keywords: values.meta.keywords ? values.meta.keywords.split(',').map(kw => kw.trim()) : [],
        },
        lastUpdated: serverTimestamp(),
      };

      await setDoc(settingsRef, dataToSave, { merge: true });
      toast({ title: 'Settings Updated', description: 'Global configuration has been saved.' });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const isLoading = isLoadingSettings || isLoadingMedia;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-white">
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
                    <CardHeader><CardTitle className="text-primary">Brand & Identity</CardTitle><CardDescription className="text-zinc-400">Manage your brand's core visual assets and identity.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="brand.name" render={({ field }) => (
                            <FormItem><FormLabel className="text-white">Brand Name</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                        )}/>
                        <FormField control={form.control} name="brand.tagline" render={({ field }) => (
                            <FormItem><FormLabel className="text-white">Tagline</FormLabel><FormControl><Input {...field} className={inputStyles}/></FormControl><FormMessage/></FormItem>
                        )}/>
                         <FormField control={form.control} name="brand.favicon" render={({ field }) => (
                            <FormItem><FormLabel className="text-white">Favicon</FormLabel><FormControl><Textarea placeholder="<svg>...</svg>" {...field} className={`${inputStyles} font-mono`} rows={5} /></FormControl><FormDescription>Paste raw SVG code for the site icon.</FormDescription><FormMessage/></FormItem>
                        )}/>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="founders">
                <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle className="text-primary">Founders</CardTitle><CardDescription className="text-zinc-400">Manage information about the company founders.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-zinc-700 rounded-lg space-y-4 relative">
                            <h4 className="text-lg font-semibold text-primary">Founder {index + 1}</h4>
                             <FormField control={form.control} name={`founders.${index}.name`} render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Name</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name={`founders.${index}.role`} render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Role</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`founders.${index}.imageId`} render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Image</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select an image" /></SelectTrigger></FormControl>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">{media?.map(m => <SelectItem key={m.id} value={m.id}>{m.id}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`founders.${index}.quote`} render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Quote</FormLabel><FormControl><Textarea {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <Button type="button" variant="destructive" size="icon" className="absolute top-4 right-4" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => append({ name: '', role: '', imageId: '', quote: '', contact: '' })}><Plus className="mr-2 h-4 w-4" /> Add Founder</Button>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="contact">
                 <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle className="text-primary">Contact Info</CardTitle><CardDescription className="text-zinc-400">Public contact and location details.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="contact.email" render={({ field }) => (<FormItem><FormLabel className="text-white">Email</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.phone" render={({ field }) => (<FormItem><FormLabel className="text-white">Phone</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.address" render={({ field }) => (<FormItem><FormLabel className="text-white">Address</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.googleMapsLink" render={({ field }) => (<FormItem><FormLabel className="text-white">Google Maps URL</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.businessHours" render={({ field }) => (<FormItem><FormLabel className="text-white">Business Hours</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="socials">
                 <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle className="text-primary">Social Media</CardTitle><CardDescription className="text-zinc-400">Links to your social media profiles.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="socials.instagram" render={({ field }) => (<FormItem><FormLabel className="text-white">Instagram</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.facebook" render={({ field }) => (<FormItem><FormLabel className="text-white">Facebook</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.tiktok" render={({ field }) => (<FormItem><FormLabel className="text-white">TikTok</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.youtube" render={({ field }) => (<FormItem><FormLabel className="text-white">YouTube</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.whatsapp" render={({ field }) => (<FormItem><FormLabel className="text-white">WhatsApp</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="seo">
                 <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle className="text-primary">SEO Defaults</CardTitle><CardDescription className="text-zinc-400">Default metadata for search engine optimization.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="meta.defaultTitle" render={({ field }) => (<FormItem><FormLabel className="text-white">Default Meta Title</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="meta.defaultDescription" render={({ field }) => (<FormItem><FormLabel className="text-white">Default Meta Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="meta.defaultImageId" render={({ field }) => (
                            <FormItem><FormLabel className="text-white">Default OG Image</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select an image" /></SelectTrigger></FormControl>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">{media?.map(m => <SelectItem key={m.id} value={m.id}>{m.id}</SelectItem>)}</SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="meta.keywords" render={({ field }) => (<FormItem><FormLabel className="text-white">Default Keywords</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormDescription>Comma-separated keywords.</FormDescription><FormMessage /></FormItem>)} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="automation">
                 <Card className="bg-transparent border-none">
                    <CardHeader><CardTitle className="text-primary">Automation & System</CardTitle><CardDescription className="text-zinc-400">System-level configurations and integrations.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2 p-4 border border-zinc-700 rounded-lg">
                             <FormField control={form.control} name="automation.instagramSyncEnabled" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5"><FormLabel className="text-white">Instagram Sync</FormLabel><FormDescription className="text-zinc-400">Enable automatic daily sync from Instagram.</FormDescription></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                             )} />
                             {watchedAutomation.instagramSyncEnabled && (
                                <FormField control={form.control} name="automation.instagramApiKey" render={({ field }) => (
                                    <FormItem><FormLabel className="text-white/70">Instagram API Key</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             )}
                        </div>
                        <div className="space-y-2 p-4 border border-zinc-700 rounded-lg">
                             <FormField control={form.control} name="automation.marketingEngineEnabled" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5"><FormLabel className="text-white">Marketing Engine</FormLabel><FormDescription className="text-zinc-400">Enable automated marketing features.</FormDescription></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                             )} />
                             {watchedAutomation.marketingEngineEnabled && (
                                <FormField control={form.control} name="automation.marketingApiKey" render={({ field }) => (
                                    <FormItem><FormLabel className="text-white/70">Marketing API Key</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             )}
                        </div>
                        <div className="space-y-2 p-4 border border-zinc-700 rounded-lg">
                             <FormField control={form.control} name="automation.analyticsEnabled" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5"><FormLabel className="text-white">Analytics</FormLabel><FormDescription className="text-zinc-400">Enable website performance analytics.</FormDescription></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                             )} />
                             {watchedAutomation.analyticsEnabled && (
                                <FormField control={form.control} name="automation.analyticsApiKey" render={({ field }) => (
                                    <FormItem><FormLabel className="text-white/70">Analytics API Key</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             )}
                        </div>
                         <div className="space-y-2 p-4 border border-zinc-700 rounded-lg">
                             <FormField control={form.control} name="automation.appCheckEnforced" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5"><FormLabel className="text-white">App Check Enforcement</FormLabel><FormDescription className="text-zinc-400">Enforce Firebase App Check to protect backend resources.</FormDescription></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                             )} />
                             {watchedAutomation.appCheckEnforced && (
                                <FormField control={form.control} name="automation.recaptchaSiteKey" render={({ field }) => (
                                    <FormItem><FormLabel className="text-white/70">reCAPTCHA v3 Site Key</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             )}
                        </div>
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
