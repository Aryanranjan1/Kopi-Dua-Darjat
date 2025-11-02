
'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { TrendingUp, Coffee, MapPin, Users } from 'lucide-react';

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

const stats = [
    {
        icon: MapPin,
        value: 50,
        label: 'Outlets Nationwide',
        suffix: '+',
    },
    {
        icon: Coffee,
        value: 1000000,
        label: 'Cups Served',
        suffix: '+',
    },
    {
        icon: Users,
        value: 5000,
        label: 'Happy Customers Daily',
        suffix: '+',
    },
    {
        icon: TrendingUp,
        value: 100,
        label: 'Local Beans',
        suffix: '%',
    }
]

const StatItem = ({ icon: Icon, value, label, suffix }: (typeof stats)[0]) => (
    <div className="text-center">
        <Icon className="w-12 h-12 text-accent mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-4xl md:text-5xl font-bold font-headline text-foreground">
            <AnimatedCounter to={value} />{suffix}
        </p>
        <p className="mt-2 text-muted-foreground">{label}</p>
    </div>
)

export default function Stats() {
    return (
        <section className="py-24 bg-card/50">
            <AnimateOnScroll animationType='fadeIn' className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map(stat => (
                        <StatItem key={stat.label} {...stat} />
                    ))}
                </div>
            </AnimateOnScroll>
        </section>
    )
}
