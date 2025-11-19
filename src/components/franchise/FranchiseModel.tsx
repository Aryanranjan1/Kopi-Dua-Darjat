
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

        <div className="relative mt-20 max-w-3xl mx-auto px-8">
            {/* Wavy Line SVG */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-40" aria-hidden="true">
                <svg width="100%" height="100%" viewBox="0 0 160 1000" preserveAspectRatio="none" className="h-full w-full">
                    <path 
                        d="M 80,0 
                           C 0,100 160,200 80,300 
                           S 0,400 80,500 
                           160,600 80,700 
                           0,800 80,900 
                           160,1000 80,1000" 
                        fill="none" 
                        stroke="hsl(var(--foreground) / 0.2)" 
                        strokeWidth="4" 
                        strokeDasharray="10 10" 
                    />
                </svg>
            </div>

            <div className="relative flex flex-col gap-24">
                {steps.map((step, index) => {
                    const Icon = iconMap[step.title] || FileText;
                    return (
                        <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1}>
                            <div className="grid grid-cols-2 gap-16 items-center">
                                {/* Icon aligned with the wave */}
                                <div className={`flex items-center ${index % 2 === 0 ? 'order-1 justify-end' : 'order-2 justify-start'}`}>
                                    <div className="relative z-10 bg-background text-foreground w-28 h-28 flex items-center justify-center rounded-full border-4 border-accent shadow-lg">
                                        <Icon className="w-12 h-12" />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className={`relative z-10 ${index % 2 === 0 ? 'order-2 text-left' : 'order-1 text-right'}`}>
                                    <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                                    <h3 className="text-3xl font-headline mt-1 text-foreground">{step.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{step.description}</p>
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
