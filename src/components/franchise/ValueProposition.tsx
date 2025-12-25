
'use client';

import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { DollarSign, Award, Users, Megaphone, TrendingUp, CheckCircle } from 'lucide-react';
import { useLanguage } from '../layout/LanguageProvider';

const iconMap: { [key: string]: React.ElementType } = {
    'Strong Brand Identity': Award,
    'Low Start-up Cost': DollarSign,
    'Full Training Provided': Users,
    'Marketing Support': Megaphone,
    'High Return Potential': TrendingUp,
    'Identiti Jenama yang Kukuh': Award,
    'Kos Permulaan yang Rendah': DollarSign,
    'Latihan Penuh Disediakan': Users,
    'Sokongan Pemasaran': Megaphone,
    'Potensi Pulangan Tinggi': TrendingUp,
};

export default function ValueProposition({ content }: { content: any }) {
  const { language } = useLanguage();
  if (!content) return null;

  const localizedContent = content[language]?.franchise?.valueProposition;
  if (!localizedContent) return null;

  const { title, subtitle, features } = localizedContent;

  return (
    <section className="py-24 sm:py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimateOnScroll animationType="slideInFromLeft" className="text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary leading-tight">
                    {title}
                </h2>
                <p className="mt-6 text-lg text-white/80">
                    {subtitle}
                </p>
            </AnimateOnScroll>
            
            <AnimateOnScroll animationType="slideInFromRight">
                <div className="space-y-8">
                {features.map((feature: any, index: number) => {
                    const Icon = iconMap[feature.title] || CheckCircle;
                    return (
                        <div key={index} className="flex items-start gap-4">
                            <div className="bg-primary/20 text-primary p-3 rounded-full mt-1">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-headline text-xl text-white">{feature.title}</h3>
                                <p className="text-white/70 mt-1">{feature.description}</p>
                            </div>
                        </div>
                    );
                })}
                </div>
            </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

    