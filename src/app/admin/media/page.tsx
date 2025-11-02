
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media Library',
  description: 'Manage all media assets for Kopi Dua Darjat.',
};

export default function MediaPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Media Library</h1>
      <p className="text-zinc-400">
        This section is under construction. Here you will be able to upload, organize, and manage all your images and videos.
      </p>
    </div>
  );
}
