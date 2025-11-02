
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
  const heroBg = PlaceHolderImages.find(p => p.id === 'contact-hero-bg');

  return (
    <>
      <div className="bg-zinc-900 text-white">
        {/* Hero Section */}
        <section className="relative h-[50vh] text-primary-foreground flex items-center justify-center text-center">
          <div className="absolute inset-0 z-[-2]">
            {heroBg && (
              <Image
                src={heroBg.imageUrl}
                alt={heroBg.description}
                fill
                className="object-cover"
                data-ai-hint={heroBg.imageHint}
              />
            )}
          </div>
          <div className="absolute inset-0 bg-black/70 z-[-1]"></div>
          <div className="container relative z-10 px-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-headline font-bold text-white drop-shadow-lg">
                Contact Us
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/80">
                Home / Contact
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Left: Form */}
              <div className="space-y-12 lg:col-span-3">
                <Card className="bg-zinc-900/50 border-zinc-800 p-8 rounded-2xl">
                  <h2 className="text-3xl font-headline font-bold text-primary">Get In Touch</h2>
                  <p className="text-muted-foreground mt-2 mb-6">We'd love to hear from you. Drop us a line below.</p>
                  <ContactForm />
                </Card>
              </div>

              {/* Right: Details & Map */}
              <div className="space-y-12 lg:col-span-2">
                 <div>
                   <p className="text-muted-foreground">
                      Have a question, a partnership proposal, or just want to say hello? Use the form or contact us through one of the methods below. We're always happy to connect with our community.
                   </p>
                   <ContactInfo />
                 </div>

                 <div className="bg-transparent border border-zinc-700 text-white p-6 rounded-2xl flex items-center justify-center gap-8">
                    <h3 className="font-headline text-xl font-semibold text-primary">Follow Us</h3>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <Facebook className="h-8 w-8 text-primary" />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <Instagram className="h-8 w-8 text-primary" />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                           <Music2 className="h-8 w-8 text-primary" />
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
