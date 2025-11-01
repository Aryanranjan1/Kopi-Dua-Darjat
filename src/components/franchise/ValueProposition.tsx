'use client';

import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Award, Users, Megaphone, TrendingUp, CheckCircle } from 'lucide-react';

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
    <section className="py-24 sm:py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimateOnScroll animationType="slideInFromLeft" className="text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary leading-tight">
                    The Winning Choice for Your Entrepreneurial Journey
                </h2>
                <p className="mt-6 text-lg text-white/80">
                    Kopi Dua Darjat isn’t just another coffee brand. We are a movement built on heritage, quality, and community. We offer a proven, profitable, and accessible franchise model designed for your success.
                </p>
            </AnimateOnScroll>
            
            <AnimateOnScroll animationType="slideInFromRight">
                <div className="space-y-8">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="bg-primary/20 text-primary p-3 rounded-full mt-1">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-headline text-xl text-white">{feature.title}</h3>
                            <p className="text-white/70 mt-1">{feature.description}</p>
                        </div>
                    </div>
                ))}
                </div>
            </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
