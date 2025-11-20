
'use client';

import { motion, AnimatePresence, useAnimate, useMotionValue, useMotionValueEvent, animate } from 'framer-motion';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [show, setShow] = useState(true);
  const [scope, animateStagger] = useAnimate();
  
  const counter = useMotionValue(0);
  const roundedCounter = useMotionValue(0);

  // Update rounded counter whenever the main counter changes
  useEffect(() => {
    const unsubscribe = counter.on("change", (latest) => {
        roundedCounter.set(Math.min(100, Math.floor(latest)));
    });
    return unsubscribe;
  }, [counter, roundedCounter]);


  useEffect(() => {
    const controls = animate(counter, 100, { 
      duration: 2, 
      ease: "easeInOut" 
    });
    
    // Check when animation is complete
    controls.then(() => {
      setIsAnimationComplete(true);
    });

    return () => controls.stop();
  }, [counter]);

  // This effect handles the exit logic
  useEffect(() => {
    const runExitSequence = async () => {
        // Stagger the animation of columns
        await animateStagger(
          "div.loader-column",
          { y: "-100%" },
          { duration: 0.4, delay: (i) => i * 0.1, ease: "easeInOut" }
        );
        // Fade out the entire container
        await animateStagger(scope.current, { opacity: 0 }, { duration: 0.5 });
        setShow(false);
    }
      
    if (isAnimationComplete && !isLoading) {
        runExitSequence();
    }
  }, [isAnimationComplete, isLoading, animateStagger, scope]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={scope}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-black"
        >
          {/* Columns for exit animation */}
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} className="loader-column bg-black h-full w-full" />
            ))}
          </div>
          
          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-48 h-48 sm:w-64 sm:h-64"
            >
                <Logo className="w-full h-full filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg] animate-spin-slow" />
            </motion.div>
          </div>

          {/* Counter */}
           <motion.div className="absolute bottom-6 left-6 z-30 font-mono text-7xl md:text-9xl text-white mix-blend-difference font-bold">
            {roundedCounter}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
