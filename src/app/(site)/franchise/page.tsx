import type { Metadata } from 'next';
import FranchiseHero from '@/components/franchise/FranchiseHero';
import ValueProposition from '@/components/franchise/ValueProposition';
import FranchiseModel from '@/components/franchise/FranchiseModel';
import Investment from '@/components/franchise/Investment';
import Testimonials from '@/app/(site)/franchise/Testimonials';
import SupportAndTraining from '@/components/franchise/SupportAndTraining';
import Faq from '@/components/franchise/Faq';
import FinalCta from '@/components/franchise/FinalCta';


export const metadata: Metadata = {
  title: 'Franchise',
  description: 'Join the Kopi Dua Darjat family. Learn more about our franchise opportunities.',
};

export default function FranchisePage() {
  return (
    <div className="bg-background text-foreground">
      <FranchiseHero />
      <ValueProposition />
      <FranchiseModel />
      <Investment />
      <Testimonials />
      <SupportAndTraining />
      <Faq />
      <FinalCta />
    </div>
  );
}