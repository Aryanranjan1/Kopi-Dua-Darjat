'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Rotating Logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute z-10 w-24 h-24 md:w-32 md:h-32"
            >
              <Logo className="filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg]" />
            </motion.div>

            {/* Staggered Columns */}
            <div className="absolute inset-0 w-full h-full flex">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0 }}
                  exit={{ y: '-100vh' }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeInOut',
                    delay: i * 0.1, // Stagger effect
                  }}
                  className={cn(
                    'w-1/5 bg-black h-full',
                    // Responsive column visibility
                    'sm:hidden md:hidden lg:block', // Only all 5 on lg and up
                    i < 3 && 'md:w-1/3', // 3 columns for md
                    i < 1 && 'sm:w-full' // 1 column for sm
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
