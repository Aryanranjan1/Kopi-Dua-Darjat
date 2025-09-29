'use client';

import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 50, label: 'Outlets Nationwide', symbol: '+' },
  { value: 100, label: 'Local Beans', symbol: '%' },
  { value: 3, label: 'Starting Price', symbol: 'RM' },
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
      const currentValue = Math.floor(progress * (endValue - start) + start);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animateCount);

  }, [isVisible, end, duration, symbol]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tighter">
        {symbol === 'RM' && `${symbol}`}
        {count}
        {(symbol === '+' || symbol === '%') && `${symbol}`}
      </p>
      <p className="mt-1 text-sm md:text-base text-muted-foreground">{label}</p>
    </div>
  );
};

export default function Stats() {
  return (
    <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
            {stats.map((stat, index) => (
                <StatCounter key={index} end={stat.value} symbol={stat.symbol} label={stat.label} />
            ))}
        </div>
    </div>
  );
}
