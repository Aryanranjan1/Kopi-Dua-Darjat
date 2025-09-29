
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { featuredDrinks as allFeaturedDrinks } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

      const [newMain, ...rest] = newOrder;
      const oldMain = prevDrinks[0];
      const finalRest = rest.filter(d => d.id !== oldMain.id);
      finalRest.push(oldMain);
      
      return [newMain, ...finalRest];
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

  const mainDrinkImage = PlaceHolderImages.find((img) => img.id === mainDrink.image);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <section className="overflow-hidden bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          {/* Left Column: Text Content */}
          <div className="text-center md:text-left h-80 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mainDrink.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={textVariants}
                className="h-48"
              >
                <h2 className="font-headline text-4xl font-normal text-muted-foreground md:text-5xl">
                  {mainDrink.tags[0] || "It's not just Kopi."}
                </h2>
                <h1 className="font-headline text-5xl font-bold text-primary md:text-6xl">
                  {mainDrink.name}
                </h1>
                <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground md:mx-0">
                  {mainDrink.description}
                </p>
              </motion.div>
            </AnimatePresence>
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5}} className="mt-8">
              <Button asChild size="lg">
                <Link href="/menu">
                  View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Images */}
          <div className="relative flex h-full min-h-[50vh] flex-col items-center justify-center">
            {/* Main Drink Image */}
            <AnimatePresence>
              {mainDrinkImage && (
                <motion.div
                  key={mainDrink.id}
                  initial={{ opacity: 0, y: -50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.8 }}
                  transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                  className="relative z-10 aspect-[4/5] w-[70%] max-w-sm drop-shadow-2xl"
                >
                  <Image
                    src={mainDrinkImage.imageUrl}
                    alt={mainDrink.name}
                    fill
                    className="object-contain"
                    data-ai-hint={mainDrinkImage.imageHint}
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Other Drink Images */}
            <div className="absolute bottom-[-60px] z-20 flex w-full justify-center gap-1 md:gap-2">
              <AnimatePresence>
                {otherDrinks.map((drink, index) => {
                  const img = PlaceHolderImages.find((i) => i.id === drink.image);
                  if (!img) return null;
                  return (
                    <motion.div
                      key={drink.id}
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.3 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      onClick={() => handleSelectDrink(drink.id)}
                      className="relative h-20 w-16 md:h-24 md:w-20 cursor-pointer drop-shadow-xl transition-transform duration-300 hover:scale-110 hover:!rotate-0 hover:z-30"
                      style={{ transform: `rotate(${index === 0 ? -8 : index === 2 ? 8 : 0}deg)` }}
                    >
                      <Image
                        src={img.imageUrl}
                        alt={drink.name}
                        fill
                        className="object-contain"
                        data-ai-hint={img.imageHint}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
