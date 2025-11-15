
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

// --- Schema Generation ---
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

const RenderField = ({ path, label }: { path: string; label: string }) => {
  const { control, getValues } = useFormContext();
  const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";
  const value = getValues(path);

  if (label.toLowerCase().includes('image')) {
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

  const isTextArea = typeof value === 'string' && (value.length > 80 || label.toLowerCase().includes('description') || label.toLowerCase().includes('content') || label.toLowerCase().includes('quote'));
  
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

const CommunityItemFields = ({ index }: { index: number }) => {
    const { watch } = useFormContext();
    const itemType = watch(`home.community.items[${index}].type`);

    return (
        <>
            <RenderField path={`home.community.items[${index}].type`} label="Type" />
            <RenderField path={`home.community.items[${index}].name`} label="Name" />
            <RenderField path={`home.community.items[${index}].imageUrl`} label="Image URL" />
            
            {itemType === 'quote' && (
                <>
                    <RenderField path={`home.community.items[${index}].quote`} label="Quote" />
                    <RenderField path={`home.community.items[${index}].role`} label="Role" />
                </>
            )}

            <RenderField path={`home.community.items[${index}].bgColor`} label="Background Color" />
            <RenderField path={`home.community.items[${index}].className`} label="Class Name" />
        </>
    );
}

const FieldArrayManager = ({ arrayPath, newItemShape, isCommunityItems = false }: { arrayPath: string; newItemShape: any, isCommunityItems?: boolean }) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: arrayPath });
    const isStringArray = typeof newItemShape === 'string';

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                    <h5 className="font-medium text-sm text-zinc-400">Item {index + 1}</h5>
                    {isCommunityItems ? (
                        <CommunityItemFields index={index} />
                    ) : isStringArray ? (
                        <RenderField path={`${arrayPath}[${index}]`} label={`Value`} />
                    ) : (
                        <RenderObjectFields obj={newItemShape} pathPrefix={`${arrayPath}[${index}]`} />
                    )}
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append(newItemShape)} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-black">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
        </div>
    );
};

const RenderObjectFields = ({ obj, pathPrefix }: { obj: any; pathPrefix: string }) => {
  return (
    <>
      {Object.keys(obj).map(key => {
        const currentPath = `${pathPrefix}.${key}`;
        const value = obj[key];
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        if (Array.isArray(value)) {
          const isCommunity = currentPath === 'home.community.items';
          return (
             <div key={currentPath} className="space-y-4 p-4 border border-zinc-800 rounded-lg">
                <h4 className="font-semibold capitalize text-lg text-primary">{label}</h4>
                <FieldArrayManager arrayPath={currentPath} newItemShape={value[0] || ''} isCommunityItems={isCommunity} />
             </div>
          );
        }
        
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={currentPath} className="space-y-4 p-4 border border-zinc-800 rounded-lg">
              <h4 className="font-semibold capitalize text-lg text-primary">{label}</h4>
              <RenderObjectFields obj={value} pathPrefix={currentPath} />
            </div>
          );
        }
        
        return <RenderField key={currentPath} path={currentPath} label={label} />;
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
              <AccordionContent className="space-y-6">
                <RenderObjectFields obj={initialData[sectionKey]} pathPrefix={sectionKey} />
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
