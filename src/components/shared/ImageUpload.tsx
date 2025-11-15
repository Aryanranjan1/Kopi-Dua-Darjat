'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folderName?: string; // Kept for prop consistency, though not used for upload
  label?: string;
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export default function ImageUpload({ value, onChange, label = "Image URL" }: ImageUploadProps) {
  
  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
      </label>
      <div className="flex items-center gap-4">
        {value && isValidUrl(value) && (
            <div className="relative w-20 h-20 shrink-0">
                <Image src={value} alt="Current image" fill className="object-cover rounded-md bg-zinc-800" />
            </div>
        )}
        <div className="flex-grow">
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://..."
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary"
            />
        </div>
        <div className="flex-shrink-0 flex gap-2">
          {value && (
             <Button type="button" variant="destructive" size="icon" onClick={handleRemoveImage}>
                <Trash2 className="h-4 w-4" />
             </Button>
          )}
        </div>
      </div>
    </div>
  );
}
