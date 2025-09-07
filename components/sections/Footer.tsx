'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GitCommit, Github, Shuffle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Logo from '@/components/Logo';
import RandomChallengeLink from '@/components/RandomChallengeLink';

interface FooterProps {
  bgColor?: string;
}

export default function Footer({ bgColor = 'bg-card' }: FooterProps) {
  const [commitHash, setCommitHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommitHash = async () => {
      try {
        const response = await fetch('/api/commit');
        if (response.ok) {
          const data = await response.json();
          setCommitHash(data.commitHash);
        } else {
          console.error('Failed to fetch commit hash');
        }
      } catch (error) {
        console.error('Error fetching commit hash:', error);
      }
    };

    fetchCommitHash();
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <motion.footer
      className={`${bgColor || 'bg-card'} w-full max-w-full overflow-hidden`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div
        className="container mx-auto px-6 py-6"
        variants={itemVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <motion.div variants={logoVariants}>
              <Link
                href="/"
                aria-label="Go to homepage"
                className="inline-flex items-center group w-fit"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Logo />
                </motion.div>
                <motion.span
                  className="ml-3 text-xl font-semibold text-card-foreground"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  You Build It
                </motion.span>
              </Link>
            </motion.div>

            <motion.p
              className="mt-4 text-sm text-muted-foreground"
              variants={itemVariants}
            >
              Helping you become a better software engineer through coding
              challenges that build real applications.
            </motion.p>

            <motion.nav
              className="mt-4 flex gap-4 items-center"
              variants={itemVariants}
            >
              {commitHash && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          className={`text-sm transition-colors duration-200 text-muted-foreground flex items-center gap-1 bg-card border border-border py-1 px-2 rounded-full hover:text-accent-foreground ${
                            bgColor
                              ? 'hover:bg-primary hover:text-secondary'
                              : 'hover:bg-accent'
                          }`}
                          href={`https://github.com/nicholasadamou/youbuildit.dev/commit/${commitHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitCommit className="w-4 h-4" />
                          <span className="font-mono">
                            {commitHash.slice(0, 7)}
                          </span>
                        </Link>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View latest commit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  className={`text-sm transition-colors duration-200 text-muted-foreground flex items-center gap-1 p-2 rounded-full hover:text-accent-foreground ${
                    bgColor && bgColor !== 'bg-card'
                      ? 'hover:bg-card'
                      : 'hover:bg-accent'
                  }`}
                  href="https://github.com/nicholasadamou/youbuildit.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.nav>

            <motion.p
              className="mt-4 text-sm text-muted-foreground"
              variants={itemVariants}
            >
              © {new Date().getFullYear()} You Build It. All rights reserved.
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-md font-semibold mb-4 text-card-foreground"
              variants={itemVariants}
            >
              Quick Links
            </motion.h3>
            <motion.ul className="space-y-2" variants={containerVariants}>
              <motion.li variants={itemVariants}>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href="/challenges"
                    className="text-muted-foreground transition-colors hover:text-card-foreground"
                  >
                    Challenges
                  </Link>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <RandomChallengeLink
                  className="text-muted-foreground transition-colors hover:text-card-foreground text-left"
                  icon={<Shuffle className="w-4 h-4" />}
                >
                  Random Challenge
                </RandomChallengeLink>
              </motion.li>
            </motion.ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-md font-semibold mb-4 text-card-foreground"
              variants={itemVariants}
            >
              Connect
            </motion.h3>
            <motion.ul className="space-y-2" variants={containerVariants}>
              <motion.li variants={itemVariants}>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <a
                    href="https://github.com/youbuildit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-card-foreground flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href="/terms"
                    className="text-muted-foreground transition-colors hover:text-card-foreground flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Terms of Use
                  </Link>
                </motion.div>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.footer>
  );
}
