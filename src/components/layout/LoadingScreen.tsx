
'use client';

import { motion, AnimatePresence, useAnimate, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [scope, animate] = useAnimate();
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  
  // Use a motion value to track the logo's x position
  const x = useMotionValue("-50vw");
  const [counter, setCounter] = useState(0);

  // Listen to the x motion value and update the counter
  useMotionValueEvent(x, "change", (latest) => {
      // Assuming the motion is from -50vw to 50vw.
      // Normalize the value from -50 to 50, then scale to 0-100.
      const vwValue = latest.endsWith('vw') ? parseFloat(latest.slice(0, -2)) : 0;
      const normalized = (vwValue + 50); // range 0 - 100
      setCounter(Math.min(100, Math.max(0, Math.floor(normalized))));
  });

  useEffect(() => {
    const animation = async () => {
      if (isLoading) {
         // Reset for re-entry if needed
        setIsAnimatingOut(false);
        setCounter(0);
        x.set("-50vw");

        // Start the main loading animation
        await animate(
          scope.current,
          { x: ["-50vw", "50vw"] },
          { duration: 2, ease: "linear" }
        );
        
        // This part runs AFTER the animation is complete.
        // It signals that the animation part of the loading is done.
        setIsAnimatingOut(true);

      }
    };
    animation();
  }, [isLoading, animate, scope, x]);

  // The loader should only be considered "finished" when BOTH the animation is over
  // AND the parent component says isLoading is false.
  const isFinished = isAnimatingOut && !isLoading;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={true}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-black"
        >
          {/* Counter */}
           <div className="absolute bottom-4 left-4 z-30 font-mono text-7xl md:text-9xl text-white mix-blend-difference font-bold">
            {String(counter).padStart(3, '0')}
          </div>

          {/* Logo */}
          <motion.div
            ref={scope}
            className="absolute z-20 w-48 h-48 sm:w-64 sm:h-64"
            style={{ 
              top: '60%', 
              left: '50%', 
              x: x, 
              y: "-50%",
              scale: 2,
            }}
          >
              <Logo className="filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg] animate-spin-slow" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
