
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/firestore/getSiteContent';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import FranchiseHero from '@/components/franchise/FranchiseHero';
import ValueProposition from '@/components/franchise/ValueProposition';
import FranchiseModel from '@/components/franchise/FranchiseModel';
import Investment from '@/components/franchise/Investment';
import Testimonials from './Testimonials';
import SupportAndTraining from '@/components/franchise/SupportAndTraining';
import Faq from './Faq';
import FinalCta from '@/components/franchise/FinalCta';
import { getServerLanguage } from '@/lib/getServerLanguage';

export const metadata: Metadata = {
  title: 'Franchise',
  description: 'Join the Kopi Dua Darjat family. Learn more about our franchise opportunities.',
};

export const revalidate = 60; // Revalidate the data every 60 seconds

export default async function FranchisePage() {
  const allContent = await getSiteContent();

  if (!allContent) {
    notFound();
  }
  
  const lang = getServerLanguage();
  const pageContent = allContent[lang];

  return (
    <div className="bg-black text-foreground">
      <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <FranchiseHero content={pageContent} />
        <ValueProposition content={pageContent} />
        <FranchiseModel content={pageContent} />
        <Investment content={pageContent} />
        <Testimonials />
        <SupportAndTraining content={pageContent} />
        <Faq content={pageContent} />
        <FinalCta content={pageContent} />
      </Suspense>
    </div>
  );
}
