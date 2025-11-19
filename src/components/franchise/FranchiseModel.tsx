
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
            {/* Wavy line background SVG */}
            <svg width="104" height="665" viewBox="0 0 104 665" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-auto">
                <path d="M1.5 1C1.5 1 116.5 210 51.5 332.5C-13.5 455 102.5 569 102.5 664" stroke="hsl(var(--foreground))" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="8 8"/>
            </svg>

            <div className="relative flex flex-col gap-12">
                {steps.map((step, index) => {
                    const Icon = iconMap[step.title] || FileText;
                    const isEven = index % 2 === 0;
                    return (
                        <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1}>
                            <div className="grid grid-cols-2 items-center gap-16">
                                {/* Text Content */}
                                <div className={`relative z-10 ${isEven ? 'order-1 text-right' : 'order-2 text-left'}`}>
                                    <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                                    <h3 className="text-3xl font-headline mt-1 text-foreground">{step.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                                </div>
                                
                                {/* Icon aligned with the wave */}
                                <div className={`relative flex items-center justify-center ${isEven ? 'order-2 justify-start' : 'order-1 justify-end'}`}>
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
            <div className="relative flex flex-col items-center gap-12">
                {/* Vertical Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-foreground/20"></div>

                {steps.map((step, index) => {
                    const Icon = iconMap[step.title] || FileText;
                    return (
                        <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1} className="w-full">
                           <div className="flex flex-col items-center text-center">
                                <div className="relative z-10 bg-background text-foreground w-20 h-20 flex items-center justify-center rounded-full border-4 border-accent shadow-lg">
                                    <Icon className="w-10 h-10" />
                                </div>
                                <div className="mt-4">
                                     <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                                    <h3 className="text-2xl font-headline mt-1 text-foreground">{step.title}</h3>
                                    <p className="mt-2 text-muted-foreground max-w-xs mx-auto">{step.description}</p>
                                </div>
                           </div>
                        </AnimateOnScroll>
                    )
                })}
            </div>
        </div>
      </div>
    </section>
  );
}
