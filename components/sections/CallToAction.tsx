'use client';

import { motion } from 'framer-motion';
import { Code, Trophy, Star, Zap } from 'lucide-react';
import {
  ExploreChallengesButton,
  RandomFreeChallengeButton,
} from '@/components/ui/ChallengeNavigationButtons';

const stats = [
  {
    icon: Code,
    number: '30+',
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
      className="relative overflow-hidden w-full max-w-full py-16 sm:py-20 md:py-32 bg-gradient-to-br from-background via-secondary/30 to-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Modern animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        variants={backgroundVariants}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,188,119,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(47,188,119,0.1),transparent_50%)]" />
      </motion.div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          variants={itemVariants}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight tracking-tight"
            variants={titleVariants}
          >
            Ready to Become a{' '}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#2fbc77] via-[#2fc77f] to-[#24d387] inline-block relative"
              variants={highlightVariants}
              whileHover={{
                scale: 1.02,
                filter: 'brightness(1.2)',
                transition: { duration: 0.3 },
              }}
            >
              Better Engineer?
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-[#2fbc77]/20 via-[#2fc77f]/20 to-[#24d387]/20 blur-xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light"
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
              className="group relative flex items-center space-x-3 bg-card/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-border/50 hover:border-[#2fbc77]/50 transition-all duration-300"
              variants={benefitVariants}
              whileHover={{
                scale: 1.02,
                y: -3,
                transition: { duration: 0.2 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2fbc77]/0 via-[#2fbc77]/5 to-[#2fbc77]/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                className="relative w-8 h-8 bg-gradient-to-br from-[#2fbc77] to-[#24d387] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#2fbc77]/20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <Star className="w-4 h-4 text-white" fill="currentColor" />
              </motion.div>
              <span className="relative text-card-foreground font-medium text-sm sm:text-base">
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
                className="group relative text-center bg-card/30 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border/30 hover:border-[#2fbc77]/60 transition-all duration-300 overflow-hidden"
                variants={statsVariants}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#2fbc77]/0 via-[#2fbc77]/5 to-[#2fbc77]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className={`relative w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 ${stat.color} bg-gradient-to-br from-secondary/80 to-secondary rounded-3xl flex items-center justify-center shadow-xl shadow-black/5 group-hover:shadow-2xl group-hover:shadow-[#2fbc77]/10 transition-all duration-300`}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
                >
                  <Icon className="w-7 h-7 sm:w-10 sm:h-10" />
                </motion.div>
                <motion.div
                  className="relative text-3xl sm:text-4xl font-bold text-foreground mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.15, duration: 0.5 }}
                >
                  {stat.number}
                </motion.div>
                <motion.div
                  className="relative text-xs sm:text-sm text-muted-foreground font-medium"
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
            <ExploreChallengesButton
              variant="default"
              size="lg"
              className="relative bg-gradient-to-r from-[#2fbc77] to-[#24d387] hover:from-[#28a669] hover:to-[#1fc77b] text-white h-12 sm:h-14 px-8 sm:px-10 rounded-xl font-semibold shadow-lg shadow-[#2fbc77]/30 hover:shadow-xl hover:shadow-[#2fbc77]/40 transition-all duration-300"
            />
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
            <RandomFreeChallengeButton
              variant="outline"
              size="lg"
              className="h-12 sm:h-14 px-8 sm:px-10 rounded-xl font-semibold text-foreground border-2 border-border/50 bg-card/30 backdrop-blur-xl hover:bg-card/50 hover:border-[#2fbc77]/50 transition-all duration-300 group"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
