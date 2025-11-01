'use client';

import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Award, Users, Megaphone, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Strong Brand Identity',
    description: 'Trusted by youth and working professionals across Malaysia.',
  },
  {
    icon: DollarSign,
    title: 'Low Start-up Cost',
    description: 'Start small and scale fast with our affordable franchise model.',
  },
  {
    icon: Users,
    title: 'Full Training Provided',
    description: 'We make barista and operations skills easy to master.',
  },
  {
    icon: Megaphone,
    title: 'Marketing Support',
    description: 'We handle social media and brand awareness to drive customers to you.',
  },
  {
    icon: TrendingUp,
    title: 'High Return Potential',
    description: 'Benefit from a proven business model with high profitability.',
  },
];

export default function ValueProposition() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">Why Join Us?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Here’s why Kopi Dua Darjat is the winning choice for your entrepreneurial journey.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1}>
              <Card className="text-center h-full bg-card/50 hover:bg-card transition-all duration-300 transform hover:-translate-y-2 shadow-sm hover:shadow-xl rounded-2xl">
                <CardHeader className="items-center">
                    <div className="bg-primary text-primary-foreground p-4 rounded-full mb-4">
                        <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                    <CardDescription className="pt-2">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
