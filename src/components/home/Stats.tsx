'use client';

import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 50, label: 'Outlets Nationwide', symbol: '+' },
  { value: 2020, label: 'Serving Heritage Coffee', symbol: 'Since' },
  { value: 3, label: 'Quality Kopi Kampung', symbol: 'From RM' },
];

const StatCounter = ({ end, duration = 2000, symbol, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const endValue = end;
    const startTime = Date.now();

    const animateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const currentValue = Math.floor(progress * endValue);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);

  }, [isVisible, end, duration, symbol]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tighter">
        {symbol === 'Since' && `${symbol} `}
        {symbol === 'From RM' && `${symbol}`}
        {count}
        {symbol === '+' && `${symbol}`}
      </p>
      <p className="mt-1 text-sm md:text-base text-muted-foreground">{label}</p>
    </div>
  );
};

export default function Stats() {
  return (
    <div className="relative pb-8 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 max-w-4xl">
            {stats.map((stat, index) => (
                <StatCounter key={index} end={stat.value} symbol={stat.symbol} label={stat.label} />
            ))}
        </div>
    </div>
  );
}
