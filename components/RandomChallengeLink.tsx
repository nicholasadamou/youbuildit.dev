'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface RandomChallengeLinkProps {
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function RandomChallengeLink({
  className,
  children,
  icon,
}: RandomChallengeLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRandomChallenge = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/challenges/random');
      if (response.ok) {
        const challenge = await response.json();
        router.push(`/challenge/${challenge.slug}`);
      } else {
        console.error('Failed to fetch random challenge');
        // Fallback to challenges page
        router.push('/challenges');
      }
    } catch (error) {
      console.error('Error fetching random challenge:', error);
      // Fallback to challenges page
      router.push('/challenges');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={{
        hover: {
          scale: 1.05,
          transition: {
            duration: 0.2,
          },
        },
        tap: {
          scale: 0.95,
        },
      }}
    >
      <button
        onClick={handleRandomChallenge}
        disabled={isLoading}
        className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} flex items-center gap-2`}
      >
        {isLoading ? (
          'Loading...'
        ) : (
          <>
            {icon && icon}
            {children}
          </>
        )}
      </button>
    </motion.div>
  );
}
