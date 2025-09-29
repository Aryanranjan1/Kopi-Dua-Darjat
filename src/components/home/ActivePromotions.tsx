'use client';

import { ScratchCard } from './ScratchCard';

const prizes = [
  {
    prize: 'RM3 Any Signature Kopi',
    promoCode: 'KOPI3',
  },
  {
    prize: 'Buy 1 Get 1 Free',
    promoCode: 'BOGOKOPI',
  },
  {
    prize: 'Free Topping Upgrade',
    promoCode: 'FREETOP',
  },
  {
    prize: 'Double Loyalty Points',
    promoCode: 'POINTSX2',
  },
  {
    prize: '15% Off Your Order',
    promoCode: 'SAVE15',
  },
];

export default function ActivePromotions() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-repeat opacity-10"
          style={{ backgroundImage: 'url("/img/coffee-beans-bg.png")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-headline font-bold text-primary">
            🎁 Scratch & Sip
          </h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Play daily to reveal exclusive kopi deals. You get one scratch per day!
          </p>
        </div>

        <div className="flex justify-center">
          <ScratchCard prizes={prizes} />
        </div>
      </div>
    </section>
  );
}
