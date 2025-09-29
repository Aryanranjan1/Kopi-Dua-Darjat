
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { featuredDrinks as allFeaturedDrinks } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeaturedDrinks() {
  const [drinks, setDrinks] = useState(allFeaturedDrinks);

  const handleSelectDrink = (id: string) => {
    setDrinks((prevDrinks) => {
      const selectedIndex = prevDrinks.findIndex((d) => d.id === id);
      if (selectedIndex <= 0) return prevDrinks; // Already main or not found

      const newOrder = [...prevDrinks];
      const [selectedDrink] = newOrder.splice(selectedIndex, 1);
      newOrder.unshift(selectedDrink);
      
      return newOrder;
    });
  };

  const cycleDrinks = useCallback(() => {
    setDrinks((prevDrinks) => {
      const newOrder = [...prevDrinks];
      const first = newOrder.shift();
      if(first) newOrder.push(first);
      return newOrder;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      cycleDrinks();
    }, 5000); // Autoplay every 5 seconds
    return () => clearInterval(interval);
  }, [cycleDrinks]);

  const mainDrink = drinks[0];
  const otherDrinks = drinks.slice(1);

  const imageVariants = {
    hidden: { opacity: 0, x: 100, y: -100, scale: 0.8, rotate: 15 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
    exit: { opacity: 0, x: 100, y: -100, scale: 0.8, rotate: -15, transition: { duration: 0.7, ease: 'easeInOut' } },
  };

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          {/* Left Column: Text Content */}
          <div className="text-center md:text-left h-80 flex flex-col justify-center">
            <div className="h-48">
              <h2 className="font-headline text-4xl font-normal text-muted-foreground md:text-5xl">
                It's not just Kopi.
              </h2>
              <h1 className="font-headline text-5xl font-bold text-primary md:text-6xl">
                It's Dua Darjat.
              </h1>
              <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground md:mx-0">
                Since 2020, our passion has been about quality and heritage. We ethically source the finest local coffee beans and roast them with great care. Our passion for coffee is rivaled only by our love of sharing it.
              </p>
            </div>
            <div className="mt-12">
              <Button asChild size="lg">
                <Link href="/menu">
                  View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="relative flex h-full min-h-[50vh] flex-col items-center justify-center">
            {/* Main Drink Image */}
            <AnimatePresence mode="wait">
              {mainDrink && (
                <motion.div
                  key={mainDrink.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={imageVariants}
                  className="relative z-10 h-full w-[80%] max-w-md -rotate-[25deg]"
                >
                  <Image
                    src={mainDrink.image}
                    alt={mainDrink.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Other Drink Images - Now centered relative to the section */}
      <div className="absolute bottom-12 left-0 right-0 z-20 flex w-full justify-center gap-1 md:gap-2">
        <AnimatePresence>
          {otherDrinks.map((drink, index) => {
            if (!drink.image) return null;
            return (
              <motion.div
                key={drink.id}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                onClick={() => handleSelectDrink(drink.id)}
                className="relative h-24 w-20 cursor-pointer transition-transform duration-300 hover:scale-110 hover:!rotate-0 hover:z-30"
                style={{ transform: `rotate(${index === 0 ? -8 : index === 2 ? 8 : 0}deg)` }}
              >
                <Image
                  src={drink.image}
                  alt={drink.name}
                  fill
                  className="object-contain drop-shadow-xl"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
