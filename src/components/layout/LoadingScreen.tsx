
'use client';

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
        <motion.div
          className="fixed inset-0 z-[100] bg-black pointer-events-none"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Rotating Logo */}
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute z-10 w-24 h-24 md:w-32 md:h-32"
            >
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
               >
                <Logo className="filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg]" />
              </motion.div>
            </motion.div>

            {/* Staggered Columns */}
            <div className="absolute inset-0 w-full h-full flex">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0 }}
                  exit={{ y: '-100%' }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeInOut',
                    delay: i * 0.1, // Stagger effect
                  }}
                  className={cn(
                    'w-1/5 bg-black h-full',
                    // This setup ensures columns reduce correctly on smaller screens
                    // On md (tablets), the last 2 are hidden. On sm (mobile), the last 4 are hidden.
                    i >= 1 && 'hidden sm:block', // columns 2-5 hidden on xs
                    i >= 3 && 'sm:hidden md:block' // columns 4-5 hidden on sm
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
