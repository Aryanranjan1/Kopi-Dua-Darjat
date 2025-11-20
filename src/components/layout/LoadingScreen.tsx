'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';

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
      ease: [0.22, 1, 0.36, 1], // A nice ease-out quint curve
    },
  },
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [show, setShow] = useState(true);

  // When isLoading becomes false, we'll eventually unmount the component
  useEffect(() => {
    if (!isLoading) {
      // Wait for the animation to finish before removing from the DOM
      const timer = setTimeout(() => {
        setShow(false);
      }, 1200); // A bit longer than the animation duration
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black pointer-events-none"
          initial="initial"
          animate={isLoading ? 'initial' : 'exit'}
          variants={loadingScreenVariants}
        >
          {/* LOGO */}
          <motion.div 
            className="w-48 sm:w-64"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Logo className="w-full h-auto filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
