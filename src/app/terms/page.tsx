import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms of service for Kopi Dua Darjat.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <div className="prose prose-lg max-w-4xl mx-auto">
        <h1 className="font-headline text-primary">Terms of Service</h1>
        <p>
          Our terms of service are currently being reviewed and will be available on this page soon. These terms will govern your use of our website and services.
        </p>
        <p>
          Please check back later for the full details regarding your rights and obligations when interacting with our platform.
        </p>
      </div>
    </div>
  );
}
