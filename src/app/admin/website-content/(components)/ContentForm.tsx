
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

// --- Schema Generation ---
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

// --- Rendering Components ---
const RenderField = ({ path, label, value }: { path: string; label: string; value: any }) => {
  const { control } = useFormContext();
  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  if (label.toLowerCase().includes('image') || label.toLowerCase().includes('logo') || label.toLowerCase().includes('favicon')) {
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
    );
  }

  if (typeof value === 'boolean') {
    return (
      <FormField
        control={control}
        name={path}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-4">
            <div className="space-y-0.5"><FormLabel>{label}</FormLabel></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )}
      />
    );
  }

  if (path.endsWith('.type') && path.includes('community.items')) {
    return (
      <FormField
        control={control}
        name={path}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
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
    );
  }

  const isTextArea = typeof value === 'string' && (value.length > 80 || ['description', 'content', 'quote', 'subtitle', 'visionText', 'text'].includes(label.toLowerCase().replace(/\s/g, '')));
  
  if (isTextArea) {
    return (
      <FormField
        control={control}
        name={path}
        render={({ field }) => (
          <FormItem><FormLabel>{label}</FormLabel><FormControl><Textarea {...field} className={inputStyles} rows={4} /></FormControl><FormMessage /></FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name={path}
      render={({ field }) => (
        <FormItem><FormLabel>{label}</FormLabel><FormControl><Input {...field} className={inputStyles} /></FormControl><FormMessage /></FormItem>
      )}
    />
  );
};


const RenderObjectFields = ({ obj, pathPrefix }: { obj: any; pathPrefix: string }) => {
  const { watch } = useFormContext();
  
  return (
    <>
      {Object.keys(obj).map(key => {
        const currentPath = `${pathPrefix}.${key}`;
        const value = obj[key];
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        if (Array.isArray(value)) {
          return (
             <div key={currentPath}>
                <FieldArrayManager 
                    arrayPath={currentPath} 
                    newItemShape={value[0] || ''} 
                    title={label}
                />
             </div>
          );
        }
        
        if (typeof value === 'object' && value !== null) {
          if (pathPrefix.match(/community\.items\[\d+\]$/)) {
            const itemType = watch(pathPrefix + '.type');
            if (itemType === 'portrait' && ['quote', 'role', 'textColor'].includes(key)) return null;
            if (itemType === 'logo' && ['quote', 'role', 'textColor', 'bgColor'].includes(key)) return null;
          }
          return (
            <div key={currentPath} className="space-y-4 p-4 border border-zinc-800 rounded-lg">
              <h4 className="font-semibold capitalize text-lg text-primary">{label}</h4>
              <RenderObjectFields obj={value} pathPrefix={currentPath} />
            </div>
          );
        }
        
        if (pathPrefix.match(/community\.items\[\d+\]$/)) {
            const itemType = watch(pathPrefix + '.type');
            if (itemType === 'portrait' && ['quote', 'role', 'textColor'].includes(key)) return null;
            if (itemType === 'logo' && ['quote', 'role', 'textColor', 'bgColor'].includes(key)) return null;
        }

        return <RenderField key={currentPath} path={currentPath} label={label} value={value} />;
      })}
    </>
  );
};

const FieldArrayManager = ({ arrayPath, newItemShape, title }: { arrayPath: string; newItemShape: any; title: string }) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: arrayPath });
    const isStringArray = typeof newItemShape === 'string';

    return (
      <div className="space-y-4 p-4 border border-zinc-800 rounded-lg">
        <h4 className="font-semibold capitalize text-lg text-primary">{title}</h4>
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                    <h5 className="font-medium text-sm text-zinc-400">Item {index + 1}</h5>
                    {isStringArray ? (
                        <RenderField path={`${arrayPath}[${index}]`} label={`Value`} value="" />
                    ) : (
                        <RenderObjectFields obj={newItemShape} pathPrefix={`${arrayPath}[${index}]`} />
                    )}
                </div>
            ))}
             <Button type="button" variant="outline" onClick={() => append(newItemShape)} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-black text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
        </div>
      </div>
    );
};


// --- Main Form ---
interface ContentFormProps {
  initialData: any;
}

export default function ContentForm({ initialData }: ContentFormProps) {
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
            body: JSON.stringify(data),
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
          {Object.keys(initialData).map(sectionKey => (
            <AccordionItem key={sectionKey} value={sectionKey} className="bg-zinc-900 border-zinc-800 rounded-lg px-6">
              <AccordionTrigger className="text-xl font-headline hover:no-underline text-white">
                {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <RenderObjectFields obj={initialData[sectionKey]} pathPrefix={sectionKey} />
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
