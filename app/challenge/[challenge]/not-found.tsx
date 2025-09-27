'use client';

import Link from 'next/link';
import { Search, Home, Layers } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import Footer from '@/components/sections/Footer';

export default function NotFound() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-[calc(100vh+200px)] bg-secondary/30 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div
          className="max-w-lg mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Icon */}
          <motion.div className="mb-8" variants={itemVariants}>
            <motion.div
              className="mx-auto w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6 shadow-sm"
              variants={iconVariants}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Search className="h-16 w-16 text-muted-foreground" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold text-foreground mb-3"
              variants={itemVariants}
            >
              404
            </motion.h1>

            <motion.h2
              className="text-xl md:text-2xl font-semibold text-foreground mb-4"
              variants={itemVariants}
            >
              Challenge Not Found
            </motion.h2>

            <motion.p
              className="text-muted-foreground text-lg leading-relaxed"
              variants={itemVariants}
            >
              The challenge you&apos;re looking for doesn&apos;t exist or may
              have been moved. Let&apos;s get you back on track!
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/challenges"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[--brand] text-white font-medium rounded-lg hover:bg-[--brand-dark] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Layers className="h-4 w-4" />
                  Browse Challenges
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card text-card-foreground border border-border font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </motion.div>
            </div>

            <motion.p
              className="text-sm text-muted-foreground mt-6"
              variants={itemVariants}
            >
              Need help? Check out our{' '}
              <Link
                href="/challenges"
                className="text-[--brand] hover:text-[--brand-dark] underline transition-colors"
              >
                full collection of challenges
              </Link>{' '}
              or start from the{' '}
              <Link
                href="/"
                className="text-[--brand] hover:text-[--brand-dark] underline transition-colors"
              >
                homepage
              </Link>
              .
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
