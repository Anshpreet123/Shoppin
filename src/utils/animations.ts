import type { Variants } from 'framer-motion';

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Scale up animation
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Slide in from bottom
export const slideInBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Animation for recording pulse
export const pulseAnimation = {
  scale: [1, 1.1, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 1.5,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: 'loop' as const
  }
};

// Animation for Google recording dots
export const googleDots = {
  initial: { scale: 0.8, opacity: 0.5 },
  animate: (i: number) => ({
    scale: [0.8, 1, 0.8],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: 'loop',
      delay: i * 0.2
    }
  })
};
