'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  hover?: boolean;
}

export const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0,
  duration = 0.5,
  hover = true 
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration,
        delay,
        ease: 'easeOut'
      }}
      whileHover={hover ? { 
        scale: 1.05, 
        transition: { duration: 0.2 } 
      } : undefined}
      whileTap={hover ? { 
        scale: 0.95 
      } : undefined}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  index: number;
}

export const AnimatedListItem = ({ 
  children, 
  className = '', 
  index 
}: AnimatedListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
}

export const AnimatedContainer = ({ 
  children, 
  className = '',
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.5 }
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedButton = ({ 
  children, 
  className = '', 
  onClick,
  disabled = false 
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </motion.button>
  );
};