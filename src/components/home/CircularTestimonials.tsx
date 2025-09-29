
'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import type { Testimonial } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
}

// This function calculates a dynamic gap for the image carousel based on container width.
// It's a bit complex and might be overkill, but it creates a nice responsive effect.
function calculateGap(width: number) {
  const minWidth = 300; // Corresponds to smaller mobile screens
  const maxWidth = 700; // Corresponds to the container size on md screens
  const minGap = 50;   // Gap for smaller screens
  const maxGap = 80;   // Gap for larger screens

  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return maxGap;
  
  // Linear interpolation between min and max gap
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
}: CircularTestimonialsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(700); // Default width

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex, testimonials]
  );
  
  // Update container width on resize for responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay functionality
  const startAutoplay = useCallback(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 5000);
    }
  }, [autoplay, testimonialsLength]);

  const resetAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    startAutoplay();
  }, [startAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [startAutoplay]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, testimonialsLength]); // Re-bind to get latest activeIndex

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    resetAutoplay();
  }, [testimonialsLength, resetAutoplay]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    resetAutoplay();
  }, [testimonialsLength, resetAutoplay]);
  
  // Compute transforms for each image
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.7; // How much the side images "stick up"

    const offset = (index - activeIndex + testimonialsLength) % testimonialsLength;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
      };
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      transform: `translateX(0) translateY(0) scale(0.5)`, // Default state for hidden items
    };
  }

  // Framer Motion variants
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center p-4">
        {/* Images */}
        <div ref={imageContainerRef} className="relative w-full h-80 md:h-96" style={{ perspective: '1000px' }}>
          {testimonials.map((testimonial, index) => {
            const image = PlaceHolderImages.find((img) => img.id === testimonial.image);
            return image ? (
              <div
                key={testimonial.id}
                className="absolute w-full h-full"
                style={{ ...getImageStyle(index), transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' }}
              >
                <Image
                  src={image.imageUrl}
                  alt={testimonial.name}
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  data-ai-hint={image.imageHint}
                />
              </div>
            ) : null;
          })}
        </div>

        {/* Content & Controls - Hidden because we are only showing the carousel */}
        <div className="relative w-full text-center mt-8 hidden">
           <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3 className="font-headline text-2xl font-bold text-primary">
                {activeTestimonial.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTestimonial.designation}
              </p>
              <motion.p className="mt-4 text-foreground/80 italic">
                "{activeTestimonial.quote}"
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-accent transition-colors"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <FaArrowLeft size={16} />
            </button>
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-accent transition-colors"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <FaArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
  );
};

export default CircularTestimonials;
