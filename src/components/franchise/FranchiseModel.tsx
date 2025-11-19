
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

        <div className="relative mt-20 max-w-4xl mx-auto">
            <div className="relative flex flex-col gap-24">
                {steps.map((step, index) => {
                    const Icon = iconMap[step.title] || FileText;
                    const isEven = index % 2 === 0;
                    return (
                        <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1}>
                            <div className="grid grid-cols-[1fr_10rem_1fr] items-center gap-8">
                                {/* Text Content */}
                                <div className={`relative z-10 ${isEven ? 'order-1 text-right' : 'order-3 text-left'}`}>
                                    <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                                    <h3 className="text-3xl font-headline mt-1 text-foreground">{step.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                                </div>
                                
                                {/* Wavy Line and Icon Column */}
                                <div className="relative order-2 h-full flex items-center justify-center">
                                    {/* Vertical Line Segment */}
                                    <div className="absolute top-1/2 -translate-y-1/2 h-full w-px bg-foreground/20" />
                                    
                                    {/* Icon aligned with the wave */}
                                    <div className="relative z-10 bg-background text-foreground w-28 h-28 flex items-center justify-center rounded-full border-4 border-accent shadow-lg">
                                        <Icon className="w-12 h-12" />
                                    </div>
                                </div>

                                {/* Empty column for spacing */}
                                <div className={`${isEven ? 'order-3' : 'order-1'}`} />
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
