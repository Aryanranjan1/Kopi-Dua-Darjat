
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage site-wide settings for Kopi Dua Darjat.',
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Settings</h1>
      <p className="text-zinc-400">
        This section is under construction. Here you will manage global settings like logos, founder information, and social media links.
      </p>
    </div>
  );
}
