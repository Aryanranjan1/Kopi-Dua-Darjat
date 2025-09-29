"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  duration = 0.5,
  amount = 0.5,
  once = false,
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
