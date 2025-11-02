import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy policy for Kopi Dua Darjat.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1 className="font-headline text-primary">Privacy Policy</h1>
        <p>
          Our full privacy policy is being drafted by our legal team and will be published here shortly. We are committed to protecting your data and privacy.
        </p>
        <p>
          This policy will detail the types of personal information we collect, how we use it, and the steps we take to ensure its security. It will cover data collected through our website, franchise applications, and any other interactions with Kopi Dua Darjat.
        </p>
      </div>
    </div>
  );
}
