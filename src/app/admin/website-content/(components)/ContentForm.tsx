
'use client';

import React from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { siteContentData } from '@/lib/site-content';

// --- Schema Generation ---
const createSchemaFromObject = (obj: any): z.ZodType<any> => {
  if (Array.isArray(obj)) {
    if (obj.length > 0 && typeof obj[0] !== 'string') {
      return z.array(createSchemaFromObject(obj[0])).optional();
    }
    return z.array(z.string()).optional();
  }
  if (typeof obj === 'object' && obj !== null) {
    const shape: { [key: string]: z.ZodType<any> } = {};
    for (const key in obj) {
      shape[key] = createSchemaFromObject(obj[key]);
    }
    return z.object(shape);
  }
  if (typeof obj === 'boolean') {
    return z.boolean().optional();
  }
  if (typeof obj === 'number') {
    return z.coerce.number().optional();
  }
  return z.string().optional().or(z.literal(''));
};

const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

const colorOptions = [
    { label: 'Cyan', value: 'bg-cyan-300' },
    { label: 'Yellow', value: 'bg-yellow-300' },
    { label: 'Green', value: 'bg-green-400' },
    { label: 'Orange', value: 'bg-orange-400' },
    { label: 'Blue', value: 'bg-blue-400' },
    { label: 'Black', value: 'bg-black' },
    { label: 'White', value: 'bg-white' },
];

const textColorOptions = [
    { label: 'Black', value: 'text-black' },
    { label: 'White', value: 'text-white' },
];


const ColorSelector = ({ path, label }: { path: string; label: string }) => {
    const { control } = useFormContext();
    const isTextColor = label.toLowerCase().includes('text');
    const options = isTextColor ? textColorOptions : colorOptions;

    return (
        <FormField
            control={control}
            name={path}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                     <div className="flex items-center gap-2">
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                                <SelectTrigger className={inputStyles}>
                                    <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {options.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className={cn("h-10 w-10 rounded-md border", field.value)} />
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

// --- FIELD RENDERING COMPONENTS ---

const RenderField = ({ path, label }: { path: string; label: string }) => {
    const { control } = useFormContext();
    const isTextArea = ['description', 'content', 'quote', 'subtitle', 'visionText', 'text'].some(keyword => label.toLowerCase().includes(keyword));
    const isImage = ['image', 'logo', 'favicon'].some(keyword => label.toLowerCase().includes(keyword));

    if (isImage) {
        return (
             <FormField
                control={control}
                name={path}
                render={({ field }) => (
                  <ImageUpload
                      label={label}
                      value={field.value || ''}
                      onChange={field.onChange}
                      folderName={`static-content/${path.replace(/\./g, '/')}`}
                  />
                )}
            />
        )
    }

    if (isTextArea) {
        return (
            <FormField control={control} name={path} render={({ field }) => (
                <FormItem><FormLabel>{label}</FormLabel><FormControl><Textarea {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
            )} />
        );
    }

    return (
        <FormField control={control} name={path} render={({ field }) => (
            <FormItem><FormLabel>{label}</FormLabel><FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl><FormMessage /></FormItem>
        )} />
    );
}

// --- Specific Array Item Components ---

const FounderItem = ({ index, onRemove }: { index: number; onRemove: () => void; }) => (
    <div className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
        <Button type="button" variant="destructive" size="icon" onClick={onRemove} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
        <h5 className="font-medium text-sm text-zinc-400">Founder {index + 1}</h5>
        <RenderField path={`about.founders.items[${index}].name`} label="Name" />
        <RenderField path={`about.founders.items[${index}].quote`} label="Quote" />
        <RenderField path={`about.founders.items[${index}].imageId`} label="Image ID" />
    </div>
);

const MilestoneItem = ({ index, onRemove }: { index: number; onRemove: () => void; }) => (
    <div className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
        <Button type="button" variant="destructive" size="icon" onClick={onRemove} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
        <h5 className="font-medium text-sm text-zinc-400">Milestone {index + 1}</h5>
        <RenderField path={`about.milestones.items[${index}].year`} label="Year" />
        <RenderField path={`about.milestones.items[${index}].title`} label="Title" />
        <RenderField path={`about.milestones.items[${index}].description`} label="Description" />
        <RenderField path={`about.milestones.items[${index}].imageId`} label="Image ID" />
    </div>
);

const CommunityItem = ({ index, onRemove }: { index: number; onRemove: () => void; }) => {
    const { control, watch } = useFormContext();
    const itemType = watch(`home.community.items[${index}].type`);

    return (
        <div className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
            <Button type="button" variant="destructive" size="icon" onClick={onRemove} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
            <h5 className="font-medium text-sm text-zinc-400">Community Item {index + 1}</h5>
            <FormField
                control={control}
                name={`home.community.items[${index}].type`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'portrait'}>
                            <FormControl><SelectTrigger className={inputStyles}><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="portrait">Portrait</SelectItem>
                                <SelectItem value="logo">Logo</SelectItem>
                                <SelectItem value="quote">Quote</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            
            <RenderField path={`home.community.items[${index}].name`} label="Name" />
            
            {itemType === 'portrait' && (
                <>
                    <RenderField path={`home.community.items[${index}].imageUrl`} label="Image URL" />
                    <ColorSelector path={`home.community.items[${index}].bgColor`} label="Background Color" />
                </>
            )}
            {itemType === 'logo' && <RenderField path={`home.community.items[${index}].imageUrl`} label="Image URL" />}
            {itemType === 'quote' && (
                <>
                    <RenderField path={`home.community.items[${index}].quote`} label="Quote" />
                    <RenderField path={`home.community.items[${index}].role`} label="Role" />
                    <ColorSelector path={`home.community.items[${index}].bgColor`} label="Background Color" />
                    <ColorSelector path={`home.community.items[${index}].textColor`} label="Text Color" />
                </>
            )}
            <RenderField path={`home.community.items[${index}].className`} label="Grid Class Name" />
        </div>
    );
};

const StringListItem = ({ path, onRemove }: { path: string; onRemove: () => void; }) => {
    const { control } = useFormContext();
     return (
        <div className="flex items-center gap-2">
           <FormField
                control={control}
                name={path}
                render={({ field }) => (
                    <FormItem className="flex-grow">
                        <FormControl><Input {...field} value={field.value || ''} className={inputStyles} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="button" variant="ghost" size="icon" onClick={onRemove}><Trash2 className="h-4 w-4 text-red-500" /></Button>
        </div>
    )
};


// --- Generic FieldArray Manager ---
const FieldArrayManager = ({ path, title, newItemShape, ItemComponent }: { path: string; title: string; newItemShape: any, ItemComponent: React.FC<any> }) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: path });

    return (
        <div className="space-y-4 p-4 border border-zinc-800 rounded-lg">
            <h4 className="font-semibold capitalize text-lg text-primary">{title}</h4>
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <ItemComponent key={field.id} index={index} onRemove={() => remove(index)} />
                ))}
                <Button type="button" variant="outline" onClick={() => append(newItemShape)} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white hover:text-black">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>
        </div>
    );
};

const StringListManager = ({ path, title }: { path: string; title: string; }) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: path });

    return (
        <div className="space-y-4 p-4 border border-zinc-800 rounded-lg">
            <h4 className="font-semibold capitalize text-lg text-primary">{title}</h4>
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <StringListItem key={field.id} path={`${path}[${index}]`} onRemove={() => remove(index)} />
                ))}
                 <Button type="button" variant="outline" onClick={() => append('')} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white hover:text-black">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>
        </div>
    )
}

// --- Recursive Object Renderer ---
const RenderObjectFields = ({ path, data }: { path: string; data: any }) => {
    return (
        <>
            {Object.entries(data).map(([key, value]) => {
                const currentPath = path ? `${path}.${key}` : key;
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                // Specific handlers for known complex arrays
                if (currentPath === 'about.founders.items') {
                    return <FieldArrayManager key={currentPath} path={currentPath} title="Founders" newItemShape={{ name: '', quote: '', imageId: '' }} ItemComponent={FounderItem} />
                }
                if (currentPath === 'about.milestones.items') {
                    return <FieldArrayManager key={currentPath} path={currentPath} title="Milestones" newItemShape={{ year: '', title: '', description: '', imageId: '' }} ItemComponent={MilestoneItem} />
                }
                if (currentPath === 'home.community.items') {
                    return <FieldArrayManager key={currentPath} path={currentPath} title="Community Items" newItemShape={{ type: 'portrait', name: '', quote: '', role: '', imageUrl: '', bgColor: '', textColor: '', className: '' }} ItemComponent={CommunityItem} />
                }
                if (currentPath === 'about.visionMission.missionItems' || currentPath === 'franchise.support.items') {
                    return <StringListManager key={currentPath} path={currentPath} title={label} />
                }
                 if (currentPath === 'franchise.valueProposition.features' || currentPath === 'franchise.franchiseModel.steps') {
                    return <FieldArrayManager key={currentPath} path={currentPath} title={label} newItemShape={{ title: '', description: '' }} ItemComponent={({ index, onRemove }: { index: number, onRemove: () => void }) => (
                         <div className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
                            <Button type="button" variant="destructive" size="icon" onClick={onRemove} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                            <h5 className="font-medium text-sm text-zinc-400">Item {index + 1}</h5>
                            <RenderField path={`${currentPath}[${index}].title`} label="Title" />
                            <RenderField path={`${currentPath}[${index}].description`} label="Description" />
                        </div>
                    )} />
                }

                if (Array.isArray(value)) {
                    return null; // Skip unknown arrays for now
                }
                
                if (typeof value === 'object' && value !== null) {
                    return (
                        <div key={currentPath} className="space-y-4 p-4 border border-zinc-800 rounded-lg">
                            <h4 className="font-semibold capitalize text-lg text-primary">{label}</h4>
                            <RenderObjectFields path={currentPath} data={value} />
                        </div>
                    );
                }

                const isColorField = label.toLowerCase().includes('color');
                if (isColorField) {
                    return <ColorSelector key={currentPath} path={currentPath} label={label} />
                }

                return <RenderField key={currentPath} path={currentPath} label={label} />;
            })}
        </>
    );
};

// --- Main Form Component ---
export default function ContentForm({ initialData }: { initialData: any }) {
    const formSchema = createSchemaFromObject(initialData);
    const formMethods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });
    const { toast } = useToast();

    const onFormSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/update-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data, null, 2),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Failed to save content.');
            }

            toast({
                title: 'Content Saved!',
                description: 'Your changes have been written to the content file.',
            });
        } catch (error: any) {
            console.error("Error saving content:", error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: error.message || 'Could not save the content file.',
            });
        }
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onFormSubmit)} className="space-y-6">
                <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="home">
                {Object.entries(initialData).map(([sectionKey, sectionData]) => (
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
