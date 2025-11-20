'use client';

import { motion, AnimatePresence, useAnimate, animate } from 'framer-motion';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';
import { useMotionValue } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [show, setShow] = useState(true);
  const [scope, animateStagger] = useAnimate();

  const counter = useMotionValue(0);
  const roundedCounter = useMotionValue(0);

  /* --- COUNTER LOGIC --- */
  useEffect(() => {
    const unsub = counter.on("change", latest => {
      roundedCounter.set(Math.min(100, Math.floor(latest)));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const controls = animate(counter, 100, {
      duration: 2,
      ease: "easeInOut"
    });

    controls.then(() => setIsAnimationComplete(true));
    return () => controls.stop();
  }, []);

  /* 🧩 -------- EXIT SLICE ANIMATION LOGIC ---------- */
  useEffect(() => {
    if (!isAnimationComplete || isLoading) return;

    const runExit = async () => {
      const columns = scope.current?.querySelectorAll('.loader-column');
      if (!columns) return;

      let prevColumn = null;

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];

        // Start animating column i
        const controls = animate(col, { y: "-100%" }, { duration: 0.7, ease: "easeInOut" });

        // Wait until this column reaches 30% of screen height
        await new Promise(resolve => {
          const interval = setInterval(() => {
            const transform = col.style.transform;
            if (transform.includes("matrix")) {
              const value = parseFloat(transform.split(",")[5]) || 0;
              const percent = Math.abs(value) / window.innerHeight;

              if (percent >= 0.3) {
                clearInterval(interval);
                resolve(null);
              }
            }
          }, 10);
        });

        // Now trigger the next column
        if (i < columns.length - 1) continue;
      }

      // Fade out wrapper
      await animate(scope.current, { opacity: 0 }, { duration: 0.5 });
      setShow(false);
    };

    runExit();
  }, [isAnimationComplete, isLoading, scope]);

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
