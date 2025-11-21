
import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import InteractiveMap from '@/components/home/InteractiveMap';
import { Card } from '@/components/ui/card';
import { CtaSection } from '@/components/shared/CtaSection';
import { Facebook, Instagram, Music2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Kopi Dua Darjat for inquiries, partnerships, or feedback.',
};

export default function ContactPage() {
  return (
    <>
      <div className="bg-zinc-900 text-white">
        {/* Hero Section */}
        <section className="relative h-[50vh] bg-primary text-primary-foreground flex items-center justify-center text-center">
          <div className="container relative z-10 px-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary-foreground drop-shadow-lg">
                Contact Us
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/80">
                We're here to help. Let's connect and start a conversation.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left: Form */}
              <div className="space-y-12">
                <Card className="bg-zinc-900/50 border-zinc-800 p-8 rounded-2xl h-full">
                  <h2 className="text-3xl font-headline font-bold text-primary">Get In Touch</h2>
                  <p className="text-white/80 mt-2 mb-6">We'd love to hear from you. Drop us a line below.</p>
                  <ContactForm />
                </Card>
              </div>

              {/* Right: Details & Map */}
              <div className="space-y-12">
                 <div>
                   <p className="text-white/80">
                      Have a question, a partnership proposal, or just want to say hello? Use the form or contact us through one of the methods below. We're always happy to connect with our community.
                   </p>
                   <ContactInfo />
                 </div>

                 <div className="bg-transparent border border-zinc-700 text-white p-4 rounded-2xl flex items-center justify-center gap-8">
                    <h3 className="font-headline text-xl font-semibold text-primary">Follow Us</h3>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <Facebook className="h-6 w-6 text-primary" />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <Instagram className="h-6 w-6 text-primary" />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                           <Music2 className="h-6 w-6 text-primary" />
                        </Link>
                    </div>
                 </div>

                 <Card className="overflow-hidden shadow-lg rounded-2xl aspect-video border-zinc-800">
                  <InteractiveMap />
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
      <CtaSection />
    </>
  );
}
