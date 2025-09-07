'use client';

import { motion } from 'framer-motion';

const difficultyColors = {
  Beginner:
    'bg-gradient-to-r from-green-400 to-green-600 text-white dark:bg-green-800 dark:text-green-100 dark:border-green-600',
  Intermediate:
    'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white dark:bg-orange-800 dark:text-orange-100 dark:border-orange-600',
  Advanced:
    'bg-gradient-to-r from-red-400 to-red-600 text-white dark:bg-red-800 dark:text-red-100 dark:border-red-600',
};

const isDifficulty = (
  difficulty: string
): difficulty is keyof typeof difficultyColors => {
  return difficulty in difficultyColors;
};

interface DifficultyTagProps {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  size?: 'sm' | 'md';
  animated?: boolean;
}

export default function DifficultyTag({
  difficulty,
  size = 'sm',
  animated = false,
}: DifficultyTagProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';
  const baseClasses = `inline-flex items-center rounded-full font-medium ${sizeClasses}`;

  const className = `${baseClasses} ${
    isDifficulty(difficulty)
      ? `${difficultyColors[difficulty]}`
      : 'bg-secondary text-secondary-foreground border border-border'
  }`;

  if (animated) {
    return (
      <motion.span
        className={className}
        whileHover={{
          scale: 1.05,
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      >
        {difficulty}
      </motion.span>
    );
  }

  return <span className={className}>{difficulty}</span>;
}
