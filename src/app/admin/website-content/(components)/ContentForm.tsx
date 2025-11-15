
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
import { Trash2, PlusCircle } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';
import { Switch } from '@/components/ui/switch';
import { siteContentData } from '@/lib/site-content';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Schema Generation (from previous implementation) ---
const createSchemaFromObject = (obj: any): z.ZodType<any> => {
  const shape: { [key: string]: z.ZodType<any> } = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      shape[key] = z.string().optional().or(z.literal(''));
    } else if (typeof value === 'number') {
      shape[key] = z.coerce.number().optional();
    } else if (typeof value === 'boolean') {
      shape[key] = z.boolean().optional();
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        shape[key] = z.array(createSchemaFromObject(value[0])).optional();
      } else {
        shape[key] = z.array(z.string()).optional();
      }
    } else if (typeof value === 'object' && value !== null) {
      shape[key] = createSchemaFromObject(value);
    }
  }
  return z.object(shape);
};


// --- Child Components for Rendering Fields ---

const RenderField = ({ form, path, label }: { form: any; path: string; label: string }) => {
  const { control } = form;
  const value = form.getValues(path);
  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

  // Check if the label suggests this is an image URL
  if (label.toLowerCase().includes('image') || label.toLowerCase().includes('logo')) {
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

  // Handle booleans with a Switch component
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

  // Use a textarea for longer strings
  const isTextArea = typeof value === 'string' && (value.length > 80 || ['description', 'content', 'quote', 'subtitle', 'visiontext'].includes(label.toLowerCase().replace(/\s/g, '')));
  
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
  
  // Default to a standard text input
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

const CommunityItemFields = ({ form, index }: { form: any; index: number }) => {
    const itemType = form.watch(`home.community.items[${index}].type`);
    const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

    return (
        <>
            <FormField
              control={form.control}
              name={`home.community.items[${index}].type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputStyles}>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
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
            <RenderField form={form} path={`home.community.items[${index}].name`} label="Name" />
            <RenderField form={form} path={`home.community.items[${index}].imageUrl`} label="Image Url" />
            
            {itemType === 'quote' && (
                <>
                    <RenderField form={form} path={`home.community.items[${index}].quote`} label="Quote" />
                    <RenderField form={form} path={`home.community.items[${index}].role`} label="Role" />
                    <RenderField form={form} path={`home.community.items[${index}].textColor`} label="Text Color" />
                </>
            )}

            {(itemType === 'portrait' || itemType === 'quote') && (
                 <RenderField form={form} path={`home.community.items[${index}].bgColor`} label="Bg Color" />
            )}

            <RenderField form={form} path={`home.community.items[${index}].className`} label="Class Name" />
        </>
    );
}

const FieldArrayManager = ({ form, arrayPath, newItemShape, title, isCommunityItems = false, isStringArray = false }: { form: any; arrayPath: string; newItemShape: any, title: string, isCommunityItems?: boolean, isStringArray?: boolean }) => {
    const { fields, append, remove } = useFieldArray({ control: form.control, name: arrayPath });

    return (
      <div className="space-y-4 p-4 border border-zinc-800 rounded-lg">
        <h4 className="font-semibold capitalize text-lg text-primary">{title}</h4>
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                    <h5 className="font-medium text-sm text-zinc-400">Item {index + 1}</h5>
                    {isCommunityItems ? (
                        <CommunityItemFields form={form} index={index} />
                    ) : isStringArray ? (
                        <RenderField form={form} path={`${arrayPath}[${index}]`} label={`Value`} />
                    ) : (
                        <RenderObjectFields form={form} obj={newItemShape} pathPrefix={`${arrayPath}[${index}]`} />
                    )}
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append(newItemShape)} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
        </div>
      </div>
    );
};

const RenderObjectFields = ({ form, obj, pathPrefix }: { form: any; obj: any; pathPrefix: string }) => {
  return (
    <>
      {Object.keys(obj).map(key => {
        const currentPath = `${pathPrefix}.${key}`;
        const value = obj[key];
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        if (Array.isArray(value)) {
          const isCommunity = currentPath === 'home.community.items';
          const isStringArray = value.length > 0 && typeof value[0] === 'string';
          return (
             <div key={currentPath}>
                <FieldArrayManager 
                    form={form} 
                    arrayPath={currentPath} 
                    newItemShape={value[0] || ''} 
                    title={label}
                    isCommunityItems={isCommunity}
                    isStringArray={isStringArray}
                />
             </div>
          );
        }
        
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={currentPath} className="space-y-4 p-4 border border-zinc-800 rounded-lg">
              <h4 className="font-semibold capitalize text-lg text-primary">{label}</h4>
              <RenderObjectFields form={form} obj={value} pathPrefix={currentPath} />
            </div>
          );
        }
        
        return <RenderField key={currentPath} form={form} path={currentPath} label={label} />;
      })}
    </>
  );
};


// --- Main Form Component ---

interface ContentFormProps {
  initialData: any;
  onFormSubmit: (data: any) => void;
}

export default function ContentForm({ initialData, onFormSubmit }: ContentFormProps) {
  const formSchema = createSchemaFromObject(initialData);
  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

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
                <RenderObjectFields form={formMethods} obj={initialData[sectionKey]} pathPrefix={sectionKey} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="flex justify-end pt-4">
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
