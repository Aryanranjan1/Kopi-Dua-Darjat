'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { featuredDrinks } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedDrinks() {
  const mainDrink = featuredDrinks.find((d) => d.id === '1');
  const otherDrinks = featuredDrinks.filter((d) => d.id !== '1');

  const mainDrinkImage = mainDrink
    ? PlaceHolderImages.find((img) => img.id === mainDrink.image)
    : undefined;
  const otherDrinkImages = otherDrinks.map((drink) =>
    PlaceHolderImages.find((img) => img.id === drink.image)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section className="overflow-hidden bg-background py-24 sm:py-32">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          {/* Left Column: Text Content */}
          <div className="text-center md:text-left">
            <motion.h2
              variants={itemVariants}
              className="font-headline text-4xl font-normal text-muted-foreground md:text-5xl"
            >
              It's not just Kopi.
            </motion.h2>
            <motion.h1
              variants={itemVariants}
              className="font-headline text-5xl font-bold text-primary md:text-6xl"
            >
              It's Dua Darjat.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-md text-base text-muted-foreground md:mx-0"
            >
              Since 2020, our passion has been about quality and heritage. We ethically
              source the finest local coffee beans and roast them with great care.
              Our passion for coffee is rivaled only by our love of sharing it.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8">
              <Button asChild size="lg">
                <Link href="/menu">
                  View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Images */}
          <div className="relative flex h-full min-h-[50vh] items-center justify-center">
            {/* Main Drink Image */}
            {mainDrinkImage && (
              <motion.div
                variants={imageVariants}
                className="relative z-10 aspect-[4/5] w-[70%] max-w-sm drop-shadow-2xl"
              >
                <Image
                  src={mainDrinkImage.imageUrl}
                  alt={mainDrink?.name || 'Signature Drink'}
                  fill
                  className="object-contain"
                  data-ai-hint={mainDrinkImage.imageHint}
                  priority
                />
              </motion.div>
            )}

            {/* Other Drink Images */}
            <motion.div
              variants={containerVariants}
              className="absolute bottom-[-20px] z-20 flex w-full justify-center gap-4"
            >
              {otherDrinkImages.map(
                (img, index) =>
                  img && (
                    <motion.div
                      key={img.id}
                      variants={imageVariants}
                      className="relative h-28 w-24 cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-30 md:h-36 md:w-32"
                    >
                      <Image
                        src={img.imageUrl}
                        alt={otherDrinks[index].name}
                        fill
                        className="object-contain drop-shadow-xl"
                        data-ai-hint={img.imageHint}
                      />
                    </motion.div>
                  )
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
