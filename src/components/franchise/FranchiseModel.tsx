
'use client';

import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { FileText, UserCheck, Warehouse, Rocket, BarChart2 } from 'lucide-react';
import { siteContentData } from '@/lib/site-content';
import { siteContentDataMs } from '@/lib/site-content-ms';
import { useLanguage } from '../layout/LanguageProvider';

const iconMap: { [key: string]: React.ElementType } = {
    'Apply': FileText,
    'Interview': UserCheck,
    'Setup': Warehouse,
    'Launch': Rocket,
    'Grow': BarChart2,
    'Mohon': FileText,
    'Temuduga': UserCheck,
    'Persediaan': Warehouse,
    'Pelancaran': Rocket,
    'Berkembang': BarChart2,
};


export default function FranchiseModel() {
  const { language } = useLanguage();
  const content = language === 'ms' ? siteContentDataMs.franchise.franchiseModel : siteContentData.franchise.franchiseModel;
  const { title, subtitle, steps } = content;

  return (
    <section className="py-24 sm:py-32 bg-primary text-black">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">{title}</h2>
          <p className="mt-4 text-lg text-black/70">
            {subtitle}
          </p>
        </AnimateOnScroll>

        {/* --- Desktop & Tablet View --- */}
        <div className="relative mt-20 max-w-5xl mx-auto hidden md:block px-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex justify-center w-40">
              <svg width="104" height="100%" viewBox="0 0 104 780" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-full">
                  <path d="M52 38V110C52 110 -11 199 52 333C115 467 52 560 52 560V742" stroke="black" strokeWidth="2" strokeDasharray="8 8"/>
              </svg>
            </div>
            <div className="relative flex flex-col gap-16">
                {steps.map((step, index) => {
                    const Icon = iconMap[step.title] || FileText;
                    const isEven = index % 2 === 0;
                    return (
                        <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1}>
                            <div className="grid grid-cols-[1fr_10rem_1fr] items-center gap-x-20">
                                {/* Text Content */}
                                <div className={`relative z-10 ${isEven ? 'col-start-1 text-right' : 'col-start-3 text-left'}`}>
                                    <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                                    <h3 className="text-3xl font-headline mt-1 text-black">{step.title}</h3>
                                    <p className="mt-2 text-black/70">{step.description}</p>
                                </div>
                                
                                {/* Icon aligned with the wave */}
                                <div className={`col-start-2 row-start-1 flex items-center justify-center`}>
                                    <div className="relative z-10 bg-white text-black w-20 h-20 flex items-center justify-center rounded-full border-4 border-accent shadow-lg">
                                        <Icon className="w-10 h-10" />
                                    </div>
                                </div>
                            </div>
                        </AnimateOnScroll>
                    )
                })}
            </div>
        </div>

        {/* --- Mobile View --- */}
        <div className="mt-16 md:hidden">
          <div className="relative">
              <div className="absolute top-0 bottom-0 left-8 w-px bg-black" aria-hidden="true"></div>
              <div className="space-y-12">
                  {steps.map((step, index) => {
                      const Icon = iconMap[step.title] || FileText;
                      return (
                          <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1}>
                              <div className="relative flex items-start gap-6">
                                  <div className="relative z-10 bg-white text-black w-16 h-16 flex items-center justify-center rounded-full border-4 border-accent shadow-lg flex-shrink-0">
                                      <Icon className="w-8 h-8" />
                                  </div>
                                  <div className="pt-1.5">
                                      <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                                      <h3 className="text-2xl font-headline mt-1 text-black">{step.title}</h3>
                                      <p className="mt-1 text-sm text-black/70">{step.description}</p>
                                  </div>
                              </div>
                          </AnimateOnScroll>
                      )
                  })}
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
