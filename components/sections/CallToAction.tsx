'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Code, Trophy, ArrowRight, Star, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const stats = [
  {
    icon: Code,
    number: '18+',
    label: 'Coding Challenges',
    color: 'text-blue-500',
  },
  {
    icon: Zap,
    number: '8hrs',
    label: 'Average Completion',
    color: 'text-green-500',
  },
  {
    icon: Trophy,
    number: '100%',
    label: 'Practical Focus',
    color: 'text-yellow-500',
  },
];

const benefits = [
  'Build real-world applications, not toy projects',
  'Learn industry-standard practices and patterns',
  'Get hands-on experience with modern technologies',
  'Create impressive portfolio projects that showcase your skills',
];

export default function CallToAction() {
  const router = useRouter();
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  // Handle random challenge selection
  const handleRandomChallenge = async () => {
    setIsLoadingRandom(true);
    try {
      const response = await fetch('/api/challenges');
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }
      const challenges = await response.json();

      if (challenges.length > 0) {
        const randomIndex = Math.floor(Math.random() * challenges.length);
        const randomChallenge = challenges[randomIndex];
        router.push(`/challenge/${randomChallenge.slug}`);
      } else {
        // Fallback to challenges page if no challenges found
        router.push('/challenges');
      }
    } catch (error) {
      console.error('Error selecting random challenge:', error);
      // Fallback to challenges page on error
      router.push('/challenges');
    } finally {
      setIsLoadingRandom(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.95,
      y: 0,
    },
  };

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.2 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
    hover: {
      y: -5,
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };

  const benefitVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      className="bg-[#fafafa] py-16 sm:py-20 md:py-32 relative overflow-hidden w-full max-w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Enhanced Background with subtle gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#fafafa] via-[#f5f5f5] to-[#fafafa]"
        variants={backgroundVariants}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          variants={itemVariants}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 sm:mb-8 leading-tight sm:leading-loose"
            variants={titleVariants}
          >
            Ready to Become a{' '}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#2fbc77] to-[#2fb676] inline-block py-0 md:py-2 overflow-visible"
              style={{ lineHeight: 'inherit' }}
              variants={highlightVariants}
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 12px rgba(47, 188, 119, 0.8)',
                transition: { duration: 0.3 },
              }}
            >
              Better Engineer?
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Transform your programming skills through hands-on challenges that
            mirror real-world development scenarios. Join thousands of
            developers who have accelerated their careers with our practical
            approach to learning.
          </motion.p>
        </motion.div>

        {/* Benefits List */}
        <motion.div
          className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200/50 hover:border-[#2fbc77]/30"
              variants={benefitVariants}
              whileHover={{
                scale: 1.02,
                y: -3,
                boxShadow:
                  '0 12px 35px rgba(47, 188, 119, 0.15), 0 4px 15px rgba(0,0,0,0.08)',
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="w-6 h-6 bg-[--brand] rounded-full flex items-center justify-center flex-shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <Star className="w-4 h-4 text-white" fill="currentColor" />
              </motion.div>
              <span className="text-primary font-medium text-sm sm:text-base">
                {benefit}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16 max-w-3xl mx-auto"
          variants={containerVariants}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200/40 hover:border-[#2fbc77]/40 hover:shadow-xl"
                variants={statsVariants}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  boxShadow:
                    '0 20px 40px rgba(47, 188, 119, 0.12), 0 8px 25px rgba(0,0,0,0.08)',
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${stat.color} bg-gray-100 rounded-2xl flex items-center justify-center`}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </motion.div>
                <motion.div
                  className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.15, duration: 0.5 }}
                >
                  {stat.number}
                </motion.div>
                <motion.div
                  className="text-xs sm:text-sm text-muted-foreground font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 + index * 0.15, duration: 0.5 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
        {/* Call to Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          variants={itemVariants}
        >
          {/* Primary CTA - Explore Challenges */}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              asChild
              variant="default"
              size="lg"
              className="bg-[--brand] hover:bg-[#175535] text-white h-12 px-8 rounded-md"
            >
              <Link
                href="/challenges"
                className="inline-flex items-center group"
              >
                <motion.span
                  className="text-base sm:text-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                >
                  Explore Challenges
                </motion.span>
                <motion.div
                  className="ml-3 group-hover:translate-x-1 transition-transform duration-200"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0, duration: 0.4 }}
                >
                  <ArrowRight className="h-6 w-6 sm:h-7 sm:w-7" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>

          {/* Secondary CTA - Random Challenge */}
          <motion.div
            variants={buttonVariants}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleRandomChallenge}
              disabled={isLoadingRandom}
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-md text-gray-700 hover:text-gray-800 border-gray-300"
            >
              <div className="inline-flex items-center group">
                <motion.div
                  className={`mr-3 transition-transform duration-300 ${
                    isLoadingRandom ? 'animate-spin' : 'group-hover:rotate-180'
                  }`}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                >
                  <Shuffle className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.div>
                <motion.span
                  className="text-base sm:text-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0, duration: 0.4 }}
                >
                  {isLoadingRandom
                    ? 'Finding Challenge...'
                    : 'Try Random Challenge'}
                </motion.span>
              </div>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
