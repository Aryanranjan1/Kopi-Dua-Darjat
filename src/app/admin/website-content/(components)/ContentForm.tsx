
'use client';

import React from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// --- Schema Generation (Keep as is) ---
const createSchemaFromObject = (obj: any): z.ZodType<any> => {
  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      return z.array(createSchemaFromObject(obj[0])).optional();
    }
    return z.array(z.any()).optional();
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

// --- FIELD RENDERING COMPONENTS ---

// Generic field for simple types (string, number, boolean)
const RenderField = ({ path, label }: { path: string, label: string }) => {
    const { control } = useFormContext();
    const isTextArea = ['description', 'content', 'quote', 'subtitle', 'visionText', 'text'].includes(label.toLowerCase().replace(/\s/g, ''));
    const isImage = label.toLowerCase().includes('image') || label.toLowerCase().includes('logo') || label.toLowerCase().includes('favicon');
    
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
                <FormItem><FormLabel>{label}</FormLabel><FormControl><Textarea {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
            )} />
        );
    }
    return (
        <FormField control={control} name={path} render={({ field }) => (
            <FormItem><FormLabel>{label}</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
        )} />
    );
}

// --- ARRAY ITEM COMPONENTS ---

const FounderItem = ({ index }: { index: number }) => (
    <div className="space-y-4">
        <RenderField path={`founders.items[${index}].name`} label="Name" />
        <RenderField path={`founders.items[${index}].quote`} label="Quote" />
        <RenderField path={`founders.items[${index}].imageId`} label="Image ID" />
    </div>
);

const MilestoneItem = ({ index }: { index: number }) => (
    <div className="space-y-4">
        <RenderField path={`milestones.items[${index}].year`} label="Year" />
        <RenderField path={`milestones.items[${index}].title`} label="Title" />
        <RenderField path={`milestones.items[${index}].description`} label="Description" />
        <RenderField path={`milestones.items[${index}].imageId`} label="Image ID" />
    </div>
);

const CommunityItem = ({ index }: { index: number }) => {
    const { control, watch } = useFormContext();
    const itemType = watch(`community.items[${index}].type`);

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name={`community.items[${index}].type`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            
            <RenderField path={`community.items[${index}].name`} label="Name" />
            
            {itemType === 'portrait' && (
                <>
                    <RenderField path={`community.items[${index}].imageUrl`} label="Image URL" />
                    <RenderField path={`community.items[${index}].bgColor`} label="Background Color" />
                </>
            )}

            {itemType === 'logo' && (
                <RenderField path={`community.items[${index}].imageUrl`} label="Image URL" />
            )}

            {itemType === 'quote' && (
                <>
                    <RenderField path={`community.items[${index}].quote`} label="Quote" />
                    <RenderField path={`community.items[${index}].role`} label="Role" />
                    <RenderField path={`community.items[${index}].bgColor`} label="Background Color" />
                    <RenderField path={`community.items[${index}].textColor`} label="Text Color" />
                </>
            )}

            <RenderField path={`community.items[${index}].className`} label="Class Name" />
        </div>
    );
};

const VisionMissionItem = ({ index }: { index: number }) => (
    <FormField
        control={useFormContext().control}
        name={`visionMission.missionItems[${index}]`}
        render={({ field }) => (
            <FormItem>
                <FormControl><Textarea {...field} className={inputStyles} /></FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

const FeatureItem = ({ index }: { index: number }) => (
     <div className="space-y-4">
        <RenderField path={`valueProposition.features[${index}].title`} label="Title" />
        <RenderField path={`valueProposition.features[${index}].description`} label="Description" />
    </div>
);

const FranchiseStepItem = ({ index }: { index: number }) => (
     <div className="space-y-4">
        <RenderField path={`franchiseModel.steps[${index}].title`} label="Title" />
        <RenderField path={`franchiseModel.steps[${index}].description`} label="Description" />
    </div>
);

const SupportItem = ({ index }: { index: number }) => (
    <FormField
        control={useFormContext().control}
        name={`support.items[${index}]`}
        render={({ field }) => (
            <FormItem>
                <FormControl><Textarea {...field} className={inputStyles} /></FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);


const componentMap: { [key: string]: React.FC<{ index: number }> } = {
    'founders.items': FounderItem,
    'milestones.items': MilestoneItem,
    'community.items': CommunityItem,
    'visionMission.missionItems': VisionMissionItem,
    'valueProposition.features': FeatureItem,
    'franchiseModel.steps': FranchiseStepItem,
    'support.items': SupportItem,
};

// Generic component to manage arrays of fields
const FieldArrayManager = ({ path, title, newItemShape }: { path: string; title: string; newItemShape: any }) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: path });
    const ItemComponent = componentMap[path];
    const isStringArray = typeof newItemShape === 'string';

    return (
        <div className="space-y-4 p-4 border border-zinc-800 rounded-lg">
            <h4 className="font-semibold capitalize text-lg text-primary">{title}</h4>
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                        <h5 className="font-medium text-sm text-zinc-400">Item {index + 1}</h5>
                        {ItemComponent ? <ItemComponent index={index} /> : isStringArray ? <RenderField path={`${path}[${index}]`} label="Value" /> : <p>Unknown Item Type</p>}
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append(newItemShape)} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white hover:text-black">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>
        </div>
    );
};


// Recursive component to render object fields
const RenderObjectFields = ({ path, data }: { path: string; data: any }) => {
    return (
        <>
            {Object.entries(data).map(([key, value]) => {
                const currentPath = `${path}.${key}`;
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                if (Array.isArray(value)) {
                    return (
                        <div key={currentPath}>
                            <FieldArrayManager 
                                path={currentPath}
                                title={label}
                                newItemShape={value[0] || {}}
                            />
                        </div>
                    )
                }
                
                if (typeof value === 'object' && value !== null) {
                    return (
                        <div key={currentPath} className="space-y-4 p-4 border border-zinc-800 rounded-lg">
                            <h4 className="font-semibold capitalize text-lg text-primary">{label}</h4>
                            <RenderObjectFields path={currentPath} data={value} />
                        </div>
                    );
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
                <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={Object.keys(initialData)[0]}>
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
