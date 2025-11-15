
'use client';

import React, { useState, useRef } from 'react';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folderName?: string;
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

export default function ImageUpload({ value, onChange, folderName = 'uploads', label = "Image URL" }: ImageUploadProps) {
  const storage = useStorage();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = (file: File) => {
    if (!storage) {
      setError('Storage service is not available.');
      return;
    }
    
    // Basic file type validation
    if (!file.type.startsWith('image/')) {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please select an image file (e.g., JPG, PNG, GIF).',
        });
        return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const storageRef = ref(storage, `${folderName}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        setError(`Upload failed: ${error.message}`);
        setIsUploading(false);
        setUploadProgress(null);
        toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onChange(downloadURL);
          setIsUploading(false);
          setUploadProgress(100);
          toast({ title: 'Upload Successful', description: 'Image has been uploaded and URL is saved.' });
          setTimeout(() => setUploadProgress(null), 2000); // Hide progress bar after a delay
        });
      }
    );
  };
  
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
                placeholder="https://... or upload a file"
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary"
            />
        </div>
        <div className="flex-shrink-0 flex gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="animate-spin h-4 w-4"/> : <Upload className="h-4 w-4" />}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
          {value && (
             <Button type="button" variant="destructive" size="icon" onClick={handleRemoveImage} disabled={isUploading}>
                <Trash2 className="h-4 w-4" />
             </Button>
          )}
        </div>
      </div>
      {uploadProgress !== null && (
        <div className="flex items-center gap-2 text-sm">
          <Progress value={uploadProgress} className="w-full" />
          <span className="text-zinc-400">{Math.round(uploadProgress)}%</span>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4"/> {error}
        </p>
      )}
    </div>
  );
}
