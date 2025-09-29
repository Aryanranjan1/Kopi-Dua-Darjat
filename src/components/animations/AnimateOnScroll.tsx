"use client";

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

type AnimationType =
  | 'fadeIn'
  | 'slideInFromLeft'
  | 'slideInFromRight'
  | 'slideInFromTop'
  | 'slideInFromBottom';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  animationType?: AnimationType;
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideInFromLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  slideInFromRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  slideInFromTop: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  slideInFromBottom: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
};

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  duration = 0.5,
  amount = 0.5,
  once = false,
  animationType = 'slideInFromBottom',
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  const variants = animationVariants[animationType] || animationVariants.slideInFromBottom;

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
