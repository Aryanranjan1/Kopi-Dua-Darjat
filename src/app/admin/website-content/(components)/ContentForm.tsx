
'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cloneDeep } from 'lodash';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- Schema Generation ---
const createSchemaFromObject = (obj: any): z.ZodType<any> => {
  if (Array.isArray(obj)) {
    if (obj.length > 0 && typeof obj[0] === 'object') {
      return z.array(createSchemaFromObject(obj[0])).optional();
    }
    // Handle array of strings
    return z.array(z.string()).optional();
  }
  if (typeof obj === 'object' && obj !== null) {
    const shape: { [key: string]: z.ZodType<any> } = {};
    for (const key in obj) {
      shape[key] = createSchemaFromObject(obj[key]);
    }
    return z.object(shape);
  }
  return z.string().optional().or(z.literal(''));
};

const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

// --- Field Rendering Components ---

const RenderField = ({ path, label }: { path: string; label: string }) => {
    const { control } = useFormContext();
    const isTextArea = ['description', 'content', 'quote', 'subtitle', 'visionText', 'text'].some(keyword => label.toLowerCase().includes(keyword));
    const pathEn = `en.${path}`;
    const pathMs = `ms.${path}`;

    const FieldComponent = isTextArea ? Textarea : Input;

    return (
      <div className="space-y-2">
        <FormLabel>{label}</FormLabel>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name={pathEn} render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-xs text-zinc-400">English</FormLabel>
                    <FormControl><FieldComponent {...field} value={field.value || ''} className={inputStyles} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name={pathMs} render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-xs text-zinc-400">Malay</FormLabel>
                    <FormControl><FieldComponent {...field} value={field.value || ''} className={inputStyles} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
      </div>
    );
}

const StringArrayManager = ({ path, title }: { path: string; title: string }) => {
    const { control, getValues, setValue } = useFormContext();
    const { toast } = useToast();
    const pathEn = `en.${path}`;
    const pathMs = `ms.${path}`;

    const handleCopy = () => {
        const enValue = getValues(pathEn);
        setValue(pathMs, enValue);
        toast({ title: "Copied!", description: `Copied ${title} from English to Malay.` });
    };

    return (
        <div className="space-y-4 p-4 border border-zinc-800 rounded-lg">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold capitalize text-lg text-primary">{title}</h4>
                <Button type="button" onClick={handleCopy} size="sm" className="bg-primary text-primary-foreground border border-black hover:bg-primary">Copy EN to MS</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={control}
                    name={pathEn}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-zinc-400">English (One item per line)</FormLabel>
                            <FormControl>
                                <Textarea
                                    className={inputStyles}
                                    rows={5}
                                    value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                    onChange={(e) => field.onChange(e.target.value.split('\n'))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name={pathMs}
                    render={({ field }) => (
                        <FormItem>
                             <FormLabel className="text-xs text-zinc-400">Malay (Satu item setiap baris)</FormLabel>
                            <FormControl>
                                <Textarea
                                    className={inputStyles}
                                    rows={5}
                                    value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                    onChange={(e) => field.onChange(e.target.value.split('\n'))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};


const ObjectArrayManager = ({ path, title, newItemShape, ItemComponent }: { path: string; title: string; newItemShape: any, ItemComponent: React.FC<any> }) => {
    const { control, getValues, setValue } = useFormContext();
    const { toast } = useToast();

    const { fields: fieldsEn, append: appendEn, remove: removeEn } = useFieldArray({ control, name: `en.${path}` });
    const { fields: fieldsMs, append: appendMs, remove: removeMs } = useFieldArray({ control, name: `ms.${path}` });
    
    const handleAppend = () => {
        appendEn(newItemShape);
        appendMs(newItemShape);
    };

    const handleRemove = (index: number) => {
        removeEn(index);
        removeMs(index);
    };
    
    const handleCopy = () => {
      const enValues = getValues(`en.${path}`);
      setValue(`ms.${path}`, cloneDeep(enValues));
      toast({ title: "Copied!", description: `Copied ${title} from English to Malay.`});
    }

    return (
        <div className="space-y-4 p-4 border border-zinc-800 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold capitalize text-lg text-primary">{title}</h4>
               <Button type="button" onClick={handleCopy} size="sm" className="bg-primary text-primary-foreground border border-black hover:bg-primary">Copy EN to MS</Button>
            </div>
            <div className="space-y-4">
                {fieldsEn.map((field, index) => (
                    <ItemComponent key={field.id} index={index} onRemove={() => handleRemove(index)} />
                ))}
                <Button type="button" variant="outline" onClick={handleAppend} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>
        </div>
    );
};


// --- Recursive Object Renderer ---
const RenderObjectFields = ({ path, data }: { path: string; data: any }) => {
    const { getValues, setValue } = useFormContext();
    const { toast } = useToast();

    return (
        <>
            {Object.entries(data).map(([key, value]) => {
                const currentPath = path ? `${path}.${key}` : key;
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                if (Array.isArray(value)) {
                    if (value.length > 0 && typeof value[0] === 'string') {
                         return <StringArrayManager key={currentPath} path={currentPath} title={label} />;
                    }
                    return <ObjectArrayManager 
                              key={currentPath} 
                              path={currentPath} 
                              title={label} 
                              newItemShape={value[0] || {}} 
                              ItemComponent={({ index, onRemove }: { index: number, onRemove: () => void }) => (
                                <div className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
                                    <Button type="button" variant="destructive" size="icon" onClick={onRemove} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                                    <h5 className="font-medium text-sm text-zinc-400">Item {index + 1}</h5>
                                    <RenderObjectFields path={`${currentPath}[${index}]`} data={value[0]} />
                                </div>
                              )} 
                           />
                }
                
                if (typeof value === 'object' && value !== null) {
                    return (
                        <div key={currentPath} className="space-y-4 p-4 border border-zinc-800 rounded-lg">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold capitalize text-lg text-primary">{label}</h4>
                              <Button type="button" onClick={() => {
                                  const enValues = getValues(`en.${currentPath}`);
                                  setValue(`ms.${currentPath}`, cloneDeep(enValues));
                                  toast({ title: "Copied!", description: `Copied '${label}' from English to Malay.`});
                              }} size="sm" className="bg-primary text-primary-foreground border border-black hover:bg-primary">Copy EN to MS</Button>
                            </div>
                            <RenderObjectFields path={currentPath} data={value} />
                        </div>
                    );
                }

                return <RenderField key={currentPath} path={currentPath} label={label} />;
            })}
        </>
    );
};


const ContentFormInner = ({ contentData }: { contentData: any }) => {
    const { en, ms } = contentData;

    const combinedSchema = z.object({
        en: createSchemaFromObject(en),
        ms: createSchemaFromObject(ms),
    });

    const formMethods = useForm({
        resolver: zodResolver(combinedSchema),
        values: { en, ms },
    });
    
    const { toast } = useToast();
    const firestore = useFirestore();

    const onFormSubmit = async (data: any) => {
        if (!firestore) return;

        try {
            const docRef = doc(firestore, 'settings', 'content');
            await setDoc(docRef, data);
            toast({
                title: 'Content Saved!',
                description: 'Your changes have been saved to Firestore.',
            });
        } catch (error: any) {
            console.error("Error saving content:", error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: error.message || 'Could not save content to Firestore.',
            });
        }
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onFormSubmit)} className="space-y-6">
                <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="home">
                {Object.entries(en).map(([sectionKey, sectionData]) => (
                    <AccordionItem key={sectionKey} value={sectionKey} className="bg-zinc-900 border-zinc-800 rounded-lg px-6">
                    <AccordionTrigger className="text-xl font-headline hover:no-underline text-white">
                        {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <RenderObjectFields path={sectionKey} data={sectionData} />
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
                <div className="flex justify-end pt-4">
                <Button type="submit" disabled={formMethods.formState.isSubmitting}>
                    {formMethods.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
                </div>
            </form>
        </FormProvider>
    );
}

// --- Main Form Component ---
export default function ContentForm() {
    const firestore = useFirestore();
    const contentRef = useMemoFirebase(
      () => (firestore ? doc(firestore, 'settings', 'content') : null),
      [firestore]
    );
    const { data: contentData, isLoading } = useDoc<any>(contentRef);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!contentData) {
        return <div className="text-center text-red-500">Error: Could not load content from Firestore. Please ensure the 'content' document exists in the 'settings' collection.</div>;
    }

    return <ContentFormInner contentData={contentData} />;
}
