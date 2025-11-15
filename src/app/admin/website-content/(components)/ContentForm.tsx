
'use client';

import React from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext, Control, FieldPath, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';
import { Switch } from '@/components/ui/switch';


// Helper to dynamically create a Zod schema from an object shape.
const createSchemaFromObject = (obj: any): z.ZodType<any> => {
  const shape: { [key: string]: z.ZodType<any> } = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      shape[key] = z.string().optional();
    } else if (typeof value === 'number') {
      shape[key] = z.coerce.number().optional();
    } else if (typeof value === 'boolean') {
      shape[key] = z.boolean().optional();
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        if (typeof value[0] === 'object' && value[0] !== null) {
          shape[key] = z.array(createSchemaFromObject(value[0])).optional();
        } else {
          // Handle array of strings
          shape[key] = z.array(z.string()).optional();
        }
      } else {
        // Default to array of strings if empty
        shape[key] = z.array(z.string()).optional();
      }
    } else if (typeof value === 'object' && value !== null) {
      shape[key] = createSchemaFromObject(value);
    }
  }
  return z.object(shape);
};


// --- Child Components for Rendering Fields ---

const RenderField = ({ fieldKey, path }: { fieldKey: string, path: string }) => {
    const { control, getValues } = useFormContext();
    const label = fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

    if (fieldKey.toLowerCase().includes('image')) {
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
  
    const value = getValues(path);

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

    if (typeof value === 'string' && value.length > 100) {
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

const FieldArrayManager = ({ path, objShape, itemShape }: { path: string, objShape: any, itemShape: any }) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: path });

    // This is the fix: check if the item is a simple string.
    const isStringArray = typeof itemShape === 'string';
    
    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="border border-zinc-700 p-4 rounded-lg space-y-4 relative">
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                    {isStringArray ? (
                        <FormField
                            control={control}
                            name={`${path}[${index}]`}
                            render={({ field: stringField }) => (
                                <FormItem>
                                    <FormLabel>Item {index + 1}</FormLabel>
                                    <FormControl><Input {...stringField} className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <RenderObjectFields obj={itemShape} pathPrefix={`${path}[${index}]`} />
                    )}
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append(isStringArray ? '' : itemShape)}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
        </div>
    );
};

const RenderObjectFields = ({ obj, pathPrefix = '' }: { obj: any, pathPrefix?: string }) => {
    return (
        <>
            {Object.keys(obj).map(key => {
                const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
                const value = obj[key];

                if (Array.isArray(value)) {
                    // Pass the shape of the array item (e.g., a string or an object)
                    return <FieldArrayManager key={currentPath} path={currentPath} objShape={value} itemShape={value[0]} />;
                }
                
                if (typeof value === 'object' && value !== null) {
                    return (
                        <div key={currentPath} className="space-y-4 p-4 border border-zinc-800 rounded-lg">
                            <h4 className="font-semibold capitalize text-lg text-primary">{key}</h4>
                            <RenderObjectFields obj={value} pathPrefix={currentPath} />
                        </div>
                    );
                }
                
                return <RenderField key={currentPath} fieldKey={key} path={currentPath} />;
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
          <Button type="submit" disabled={true}>
            Save Changes (Disabled)
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
