

'use client';

import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { FileText, UserCheck, Warehouse, Rocket, BarChart2 } from 'lucide-react';
import { siteContentData } from '@/lib/site-content';

const iconMap: { [key: string]: React.ElementType } = {
    'Apply': FileText,
    'Interview': UserCheck,
    'Setup': Warehouse,
    'Launch': Rocket,
    'Grow': BarChart2,
};


export default function FranchiseModel() {
  const { title, subtitle, steps } = siteContentData.franchise.franchiseModel;

  return (
    <section className="py-24 sm:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-foreground">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {subtitle}
          </p>
        </AnimateOnScroll>

        {/* --- Desktop & Tablet View --- */}
        <div className="relative mt-20 max-w-5xl mx-auto hidden md:block px-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex justify-center w-40">
              <svg width="104" height="100%" viewBox="0 0 104 780" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M52 0V110C52 110 -11 199 52 333C115 467 52 560 52 560V780" stroke="hsl(var(--foreground))" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="8 8"/>
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
                                    <h3 className="text-3xl font-headline mt-1 text-foreground">{step.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                                </div>
                                
                                {/* Icon aligned with the wave */}
                                <div className={`col-start-2 row-start-1 flex items-center justify-center`}>
                                    <div className="relative z-10 bg-background text-foreground w-20 h-20 flex items-center justify-center rounded-full border-4 border-accent shadow-lg">
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
             <div className="relative w-full max-w-md mx-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-border/50"></div>

                <div className="relative flex flex-col gap-16">
                    {steps.map((step, index) => {
                        const Icon = iconMap[step.title] || FileText;
                        return (
                            <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1}>
                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                                    {index % 2 === 0 ? (
                                        <>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                                                <h3 className="text-2xl font-headline mt-1 text-foreground">{step.title}</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                                            </div>
                                            <div className="relative z-10 bg-background text-foreground w-16 h-16 flex items-center justify-center rounded-full border-4 border-accent shadow-lg">
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <div></div>
                                        </>
                                    ) : (
                                        <>
                                            <div></div>
                                             <div className="relative z-10 bg-background text-foreground w-16 h-16 flex items-center justify-center rounded-full border-4 border-accent shadow-lg">
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                                                <h3 className="text-2xl font-headline mt-1 text-foreground">{step.title}</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                                            </div>
                                        </>
                                    )}
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
