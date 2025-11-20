
'use client';

import { motion, AnimatePresence, useAnimate, animate } from 'framer-motion';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';
import { useMotionValue } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [isCounterAnimationComplete, setIsCounterAnimationComplete] = useState(false);
  const [show, setShow] = useState(true);
  const [scope, animate] = useAnimate();

  const counter = useMotionValue(0);
  const roundedCounter = useMotionValue(0);

  /* --- COUNTER LOGIC --- */
  useEffect(() => {
    const unsub = counter.on("change", latest => {
      roundedCounter.set(Math.min(100, Math.floor(latest)));
    });
    return unsub;
  }, [roundedCounter, counter]);

  useEffect(() => {
    const controls = animate(counter, 100, {
      duration: 2,
      ease: "easeInOut"
    });

    controls.then(() => setIsCounterAnimationComplete(true));
    return () => controls.stop();
  }, [counter]);

  /* 🧩 -------- EXIT SLICE ANIMATION LOGIC ---------- */
  useEffect(() => {
    // This effect runs when either the counter finishes or the app stops loading
    if (isCounterAnimationComplete && !isLoading) {
      const runExit = async () => {
        // Stagger the animation of columns
        await animate(
          "div.loader-column",
          { y: "-100%" },
          { duration: 0.4, delay: (i) => i * 0.1, ease: "easeInOut" }
        );
        // Fade out the entire container
        await animate(scope.current, { opacity: 0 }, { duration: 0.5 });
        setShow(false);
      };

      runExit();
    }
  }, [isCounterAnimationComplete, isLoading, animate, scope]);

  /* ---------------------- RENDER ---------------------- */

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={scope}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black pointer-events-none"
        >
          {/* RESPONSIVE SLICE COLUMNS */}
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="loader-column bg-black h-full w-full will-change-transform"
              />
            ))}
          </div>

          {/* LOGO */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div className="w-48 sm:w-64">
              <Logo className="w-full h-auto filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg] animate-spin-slow" />
            </motion.div>
          </div>

          {/* COUNTER */}
          <motion.div className="absolute bottom-6 left-6 z-30 font-mono text-7xl md:text-9xl text-white mix-blend-difference font-bold">
            {roundedCounter}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
