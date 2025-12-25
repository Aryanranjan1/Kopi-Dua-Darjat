
'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { TrendingUp, Users, Award, MapPin } from 'lucide-react';
import { useLanguage } from '../layout/LanguageProvider';

const AnimatedCounter = ({ to, duration = 2 }: { to: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    const totalSteps = duration * 60;
    const increment = to / totalSteps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const newCount = Math.min(to, Math.floor(increment * currentStep));
      setCount(newCount);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setCount(to);
      }
    }, (duration * 1000) / totalSteps);

    return () => clearInterval(timer);
  }, [isInView, to, duration]);

  return <span ref={ref}>{count}</span>;
};

const iconMap: { [key: string]: React.ElementType } = {
    'Outlets Nationwide': MapPin,
    'Happy Franchisees': Award,
    'Signature Drinks': Users,
    'Outlet Seluruh Negara': MapPin,
    'Francaisi Gembira': Award,
    'Minuman Istimewa': Users,
};

const StatItem = ({ icon: Icon, value, label, suffix }: { icon: React.ElementType, value: number, label: string, suffix?: string }) => (
    <div className="text-center">
        <Icon className="w-12 h-12 text-accent mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-4xl md:text-5xl font-bold font-headline text-white">
            <AnimatedCounter to={value} />{suffix}
        </p>
        <p className="mt-2 text-white/70">{label}</p>
    </div>
)

export default function Stats({ content }: { content: any }) {
    const { language } = useLanguage();
    if (!content) return null;
    
    const localizedContent = content[language]?.about?.stats;
    if (!localizedContent) return null;

    return (
        <section className="py-24 bg-black">
            <AnimateOnScroll animationType='fadeIn' className="container mx-auto px-6">
                <div className="grid grid-cols-3 gap-8">
                    {localizedContent.map((stat: any) => {
                        const Icon = iconMap[stat.label] || TrendingUp;
                        return <StatItem key={stat.label} icon={Icon} {...stat} />;
                    })}
                </div>
            </AnimateOnScroll>
        </section>
    )
}

    