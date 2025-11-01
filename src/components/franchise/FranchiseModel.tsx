'use client';

import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { FileText, UserCheck, Warehouse, Rocket, BarChart2 } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Apply',
    description: 'Fill out the form below to express interest.',
  },
  {
    icon: UserCheck,
    title: 'Interview',
    description: 'Our team will reach out to discuss your goals.',
  },
  {
    icon: Warehouse,
    title: 'Setup',
    description: 'Choose your stall location and start setup.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Grand opening with our support and marketing.',
  },
  {
    icon: BarChart2,
    title: 'Grow',
    description: 'Continuous support, seasonal menus, and local collabs.',
  },
];

export default function FranchiseModel() {
  return (
    <section className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our process is transparent and designed to get you started quickly and efficiently.
          </p>
        </AnimateOnScroll>

        <div className="relative mt-16">
          {/* Dashed Line Connector for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
             <svg width="100%" height="2">
                <line x1="0" y1="1" x2="100%" y2="1" strokeWidth="2" stroke="hsl(var(--border))" strokeDasharray="8 8"/>
            </svg>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.15}>
                <div className="text-center relative">
                  <div className="flex justify-center items-center">
                    <div className="relative z-10 bg-background w-24 h-24 flex items-center justify-center rounded-full border-4 border-primary shadow-lg">
                      <step.icon className="w-12 h-12 text-accent" />
                    </div>
                  </div>
                  <div className="mt-4">
                     <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
                    <h3 className="text-2xl font-headline mt-1">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
