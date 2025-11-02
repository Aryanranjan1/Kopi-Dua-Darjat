
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Management',
  description: 'Manage blog posts for Kopi Dua Darjat.',
};

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Blog Management</h1>
      <p className="text-zinc-400">
        This section is under construction. Here you will be able to write, edit, and publish blog posts using a rich text editor.
      </p>
    </div>
  );
}
