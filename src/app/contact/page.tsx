import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Kopi Dua Darjat for inquiries, partnerships, or feedback.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">Get In Touch</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Our contact form, HQ address, and other contact details will be available here soon.
      </p>
    </div>
  );
}
