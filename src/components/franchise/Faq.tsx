
'use client';

import { faqItems } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function Faq() {
  return (
    <section className="py-24 sm:py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Have questions? We have answers. Here are some of the most common inquiries from potential franchisees.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="max-w-4xl mx-auto mt-16">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="bg-zinc-900 border-zinc-800 rounded-2xl px-6 border-none shadow-sm">
                <AccordionTrigger className="text-lg font-headline text-left hover:no-underline text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/60">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
