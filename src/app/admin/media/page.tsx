
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Search, UploadCloud } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Media Library',
  description: 'Manage all media assets for Kopi Dua Darjat.',
};

export default function MediaPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Media Library</h1>
      
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="text-primary" />
            All Media Assets
          </CardTitle>
          <CardDescription className="text-zinc-400">
            This section is under construction. Soon, you will be able to manage all website images, videos, and icons from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex justify-center items-center flex-col gap-4 text-center p-12 border-2 border-dashed border-zinc-700 rounded-lg">
                <div className="bg-zinc-800 p-4 rounded-full">
                    <UploadCloud className="w-10 h-10 text-zinc-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-300">Visual Media Manager Coming Soon</h3>
                <p className="text-zinc-400 max-w-md">
                    The full media library will allow you to upload, replace, and organize all assets. Any changes made here will automatically update across the live website.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
