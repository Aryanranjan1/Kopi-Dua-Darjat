
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 639px)');
  
  const getColumnCount = () => {
    if (isMobile) return 1;
    if (isTablet) return 3;
    return 5;
  };
  
  const columnCount = getColumnCount();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={true}
          exit={{}} // The parent motion div does not need an exit prop here
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5, delay: 0.5 }}}
            className="absolute z-20 w-24 h-24 md:w-32 md:h-32"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Logo className="filter brightness-0 invert sepia saturate-[5000%] hue-rotate-[3deg]" />
            </motion.div>
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
                    duration: 0.8,
                    ease: [0.6, 0.01, -0.05, 0.9],
                    delay: i * 0.1,
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
