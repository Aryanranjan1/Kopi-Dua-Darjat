
'use client';

import { motion, AnimatePresence, animate } from 'framer-motion';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';
import { useMotionValue } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const loadingScreenVariants = {
  initial: {
    y: '0%',
  },
  exit: {
    y: '-100%',
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [show, setShow] = useState(true);

  const counter = useMotionValue(0);
  const roundedCounter = useMotionValue(0);

  // --- Counter Animation ---
  useEffect(() => {
    const unsub = counter.on("change", latest => {
      roundedCounter.set(Math.min(100, Math.floor(latest)));
    });
    return unsub;
  }, [roundedCounter, counter]);

  useEffect(() => {
    const controls = animate(counter, 100, {
      duration: 2, // This matches the 2000ms timer in AppLayout
      ease: "easeInOut"
    });

    controls.then(() => setIsAnimationComplete(true));

    return () => controls.stop();
  }, [counter]);

  // --- Unmount Logic ---
  useEffect(() => {
    // Wait for both the counter to finish AND the app to finish loading
    if (isAnimationComplete && !isLoading) {
      // Allow the slide-out animation to finish before removing from DOM
      const timer = setTimeout(() => {
        setShow(false);
      }, 1200); // Should be slightly longer than the 'exit' transition duration

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAnimationComplete]);
  

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black pointer-events-none"
          initial="initial"
          animate={isLoading ? 'initial' : 'exit'}
          variants={loadingScreenVariants}
        >
          {/* Logo */}
          <motion.div className="w-48 sm:w-64">
             <Logo className="w-full h-auto filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg] animate-spin-slow" />
          </motion.div>
          
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
