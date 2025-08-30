'use client';

import { Clock, Laptop, Code } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Easy to Get Started',
    description:
      'Coding challenges designed to create an application in less than 8 hours, perfect for busy schedules.',
    icon: Clock,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500',
    glowColor: 'bg-green-500/20',
  },
  {
    title: 'Real-World Applications',
    description:
      'Focus on creating practical software that addresses real-world challenges, rather than developing toy applications.',
    icon: Laptop,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500',
    glowColor: 'bg-green-500/20',
  },
  {
    title: 'Language Agnostic',
    description:
      'Choose your preferred programming language or tackle challenges in multiple languages to broaden your skills.',
    icon: Code,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500',
    glowColor: 'bg-green-500/20',
  },
];

export default function Features() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 0.6,
      },
    },
  };

  const headerVariants = {
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

  const featureVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.98,
      y: -2,
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
      },
    },
    hover: {
      scale: 1.2,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.6,
      },
    },
  };

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.5, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: -3,
      transition: {
        delay: 0.1,
        duration: 0.8,
      },
    },
    hover: {
      scale: 1.1,
      rotate: -5,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.section
      className="bg-white mt-8 sm:mt-12 py-12 sm:py-16 md:py-20 relative overflow-hidden w-full max-w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-16 right-10 w-40 h-40 bg-gradient-to-br from-[--brand]/10 to-transparent rounded-full blur-2xl"
        animate={{
          y: [-15, 25, -15],
          x: [-8, 12, -8],
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 left-8 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-xl"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12 px-4"
          variants={headerVariants}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Why Choose Our{' '}
            <motion.span
              className="text-[--brand] inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{
                scale: 1.1,
                textShadow: '0 0 8px rgba(47, 188, 119, 0.6)',
                transition: { duration: 0.3 },
              }}
            >
              Challenges?
            </motion.span>
          </motion.h2>
          <motion.p
            className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Designed to help you grow as a software engineer through practical,
            real-world projects.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                className="relative group cursor-pointer"
                variants={featureVariants}
                whileHover="hover"
                whileTap="tap"
                style={{ perspective: '1000px' }}
              >
                {/* Animated background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-lg transform -skew-y-3 opacity-90`}
                  variants={backgroundVariants}
                  whileHover="hover"
                />

                {/* Floating glow effect */}
                <motion.div
                  className={`absolute -inset-2 ${feature.glowColor} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 1.2,
                  }}
                />

                {/* Content card */}
                <motion.div
                  className="relative bg-white p-6 sm:p-8 rounded-lg shadow-xl h-full flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {/* Icon with animated background */}
                  <motion.div
                    className={`w-14 h-14 sm:w-16 sm:h-16 ${feature.bgColor} rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg`}
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </motion.div>

                  {/* Text content */}
                  <div className="text-center flex-1 flex flex-col">
                    <motion.h3
                      className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground flex-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    >
                      {feature.description}
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
