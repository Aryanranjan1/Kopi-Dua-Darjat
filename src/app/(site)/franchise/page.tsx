
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/firestore/getSiteContent';
import { getServerLanguage } from '@/lib/getServerLanguage';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import FranchiseHero from '@/components/franchise/FranchiseHero';
import ValueProposition from '@/components/franchise/ValueProposition';
import FranchiseModel from '@/components/franchise/FranchiseModel';
import Investment from '@/components/franchise/Investment';
import Testimonials from '@/app/(site)/franchise/Testimonials';
import SupportAndTraining from '@/components/franchise/SupportAndTraining';
import Faq from '@/app/(site)/franchise/Faq';
import FinalCta from '@/components/franchise/FinalCta';


export const metadata: Metadata = {
  title: 'Franchise',
  description: 'Join the Kopi Dua Darjat family. Learn more about our franchise opportunities.',
};

export const revalidate = 60; // Revalidate the data every 60 seconds

export default async function FranchisePage() {
  const lang = getServerLanguage();
  const allContent = await getSiteContent();

  if (!allContent) {
    notFound();
  }

  const franchiseContent = allContent[lang]?.franchise;
  if (!franchiseContent) {
    notFound();
  }

  return (
    <div className="bg-black text-foreground">
      <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <FranchiseHero content={franchiseContent.hero} />
        <ValueProposition content={franchiseContent.valueProposition} />
        <FranchiseModel content={franchiseContent.franchiseModel} />
        <Investment content={franchiseContent.investment} />
        <Testimonials />
        <SupportAndTraining content={franchiseContent.support} />
        <Faq content={franchiseContent.faq} />
        <FinalCta content={franchiseContent.finalCta} />
      </Suspense>
    </div>
  );
}
