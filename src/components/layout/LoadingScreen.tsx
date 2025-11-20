
'use client';

import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [scope, animate] = useAnimate();
  const [counter, setCounter] = useState(0);

  const getColumnCount = () => {
    if (isMobile) return 1;
    if (isTablet) return 3;
    return 5;
  };
  
  const columnCount = getColumnCount();

  useEffect(() => {
    if (isLoading) {
      const controls = animate(
        scope.current,
        {
          transform: [
            "translateX(-50vw) translateY(-50%)",
            "translateX(50vw) translateY(-50%)"
          ],
          rotate: [0, 360],
        },
        {
          duration: 2.5,
          ease: "linear",
          repeat: Infinity,
        }
      );
      return () => controls.stop();
    }
  }, [isLoading, animate, scope]);

  useEffect(() => {
    if (isLoading) {
        const interval = setInterval(() => {
            setCounter(prev => {
                const next = prev + 1;
                if (next > 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, 20); // 20ms * 100 = 2000ms = 2s for the counter

        return () => clearInterval(interval);
    }
  }, [isLoading]);


  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={true}
          exit={{}}
        >
          {/* Counter */}
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-4 z-30 font-mono text-7xl md:text-9xl text-white mix-blend-difference font-bold"
          >
            {String(counter).padStart(3, '0')}
          </motion.div>

          {/* Logo */}
          <motion.div
            ref={scope}
            initial={{ opacity: 1, scale: 2 }}
            exit={{ y: "-100%", transition: { duration: 1.5, ease: [0.8, 0, 0.2, 1] } }}
            className="absolute z-20 w-32 h-32"
            style={{ top: '50%', left: '50%' }}
          >
              <Logo className="filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg]" />
          </motion.div>
          
          {/* Columns */}
          <div className="absolute inset-0 w-full h-full flex">
            {[...Array(columnCount)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '0%' }}
                exit={{ 
                  y: '-100%',
                  transition: {
                    duration: 1.5,
                    ease: [0.8, 0, 0.2, 1], // Smoother easing
                    delay: (i * 0.1) + 0.5, // Staggered delay starts after 0.5s
                  }
                }}
                className={'w-full bg-black h-full'}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
