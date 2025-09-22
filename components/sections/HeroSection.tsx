'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { ClientChallenge } from '@/types/challenge';
import { useChallenges } from '@/hooks/useChallenges';
import { InfiniteCarousel } from '@/components/InfiniteCarousel';
import ChallengeCard from '@/components/ChallengeCard';
import FadeIn from '@/components/FadeIn';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 100,
      duration: 0.8,
    },
  },
};

const gradientVariants = {
  hidden: {
    opacity: 0,
    backgroundPosition: '200% center',
  },
  visible: {
    opacity: 1,
    backgroundPosition: '0% center',
    transition: {
      type: 'spring' as const,
      damping: 15,
      stiffness: 80,
      delay: 0.4,
      duration: 1.2,
    },
  },
};

const HeroHeading = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="text-center"
    >
      <motion.h1
        variants={itemVariants}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 sm:mb-6 text-white"
        style={{ lineHeight: '1.2' }}
      >
        <motion.div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 text-center">
          <motion.span variants={itemVariants} className="sm:whitespace-nowrap">
            Become a
          </motion.span>
          <motion.span
            variants={gradientVariants}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[--brand] to-[--brand-dark] bg-[length:200%_100%] sm:whitespace-nowrap"
          >
            Great Engineer
          </motion.span>
          <motion.span variants={itemVariants} className="inline w-auto">
            Through Real Challenges
          </motion.span>
        </motion.div>
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="mt-4 sm:mt-6 text-xl sm:text-xl md:text-2xl text-white px-4 sm:px-0"
      >
        Master software engineering by building real applications not toys.
      </motion.p>
    </motion.div>
  );
};

// Loading animation variants
const loadingVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      damping: 15,
      stiffness: 200,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
    },
  },
};

const carouselVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 1,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 100,
      delay: 0.2,
      duration: 0.8,
    },
  },
};

export default function HeroSection() {
  const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null);
  const { challenges: allChallenges, loading } = useChallenges();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [0.3, 0.2, 0.1]
  );

  return (
    <div
      ref={sectionRef}
      className="relative mt-0 md:pt-16 pb-8 sm:pb-12 flex flex-col w-full max-w-full overflow-hidden"
    >
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/40 dark:from-slate-950 dark:via-green-950/30 dark:to-emerald-950/40" />

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[--brand]/10 via-transparent to-blue-500/5" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-br from-[--brand]/15 to-emerald-400/10 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-48 -right-48 w-96 h-96 bg-gradient-to-tl from-blue-400/10 to-[--brand]/15 rounded-full filter blur-3xl"
          animate={{
            x: [0, -120, 0],
            y: [0, 60, 0],
            scale: [1.3, 1, 1.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Additional accent orb */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full filter blur-2xl"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Parallax layer for scroll effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[--brand]/8 to-transparent"
          style={{
            y: backgroundY,
            opacity: backgroundOpacity,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col">
        <div className="flex flex-col">
          {/* Hero Section */}
          <motion.div
            className="flex items-center justify-center p-4 sm:p-8 pb-8 sm:pb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto w-full">
              <HeroHeading />
            </div>
          </motion.div>

          {/* Popular Challenges Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="py-4 sm:py-6 overflow-hidden"
          >
            <div className="max-w-full mx-auto">
              <div className="relative">
                {loading ? (
                  <motion.div
                    variants={loadingVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col justify-center items-center h-64 space-y-4"
                  >
                    <motion.div
                      className="w-12 h-12 border-4 border-[--brand] border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <motion.p
                      className="text-secondary-foreground text-lg"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      Loading amazing challenges...
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={carouselVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <InfiniteCarousel pauseOnHover reverseDirection gap={32}>
                      {allChallenges.map(
                        (challenge: ClientChallenge, index: number) => (
                          <FadeIn
                            key={challenge.slug}
                            delay={index * 0.1}
                            duration={0.6}
                            className="flex-shrink-0 items-center justify-center carousel-item"
                          >
                            <ChallengeCard
                              challenge={challenge}
                              isHovered={hoveredChallenge === challenge.slug}
                              onHover={setHoveredChallenge}
                            />
                          </FadeIn>
                        )
                      )}
                    </InfiniteCarousel>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
