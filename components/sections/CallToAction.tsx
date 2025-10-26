'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Rocket,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Lightbulb,
  Target,
} from 'lucide-react';
import {
  ExploreChallengesButton,
  RandomFreeChallengeButton,
} from '@/components/ui/ChallengeNavigationButtons';
import { useRef } from 'react';

const features = [
  {
    icon: Brain,
    title: 'Master Real Skills',
    description: 'No more tutorials. Build production-ready applications.',
  },
  {
    icon: Lightbulb,
    title: 'Learn by Doing',
    description: 'Practice with real-world scenarios and challenges.',
  },
  {
    icon: Target,
    title: 'Level Up Fast',
    description: 'Structured path from beginner to expert engineer.',
  },
];

const highlights = [
  'Portfolio-worthy projects',
  'Industry best practices',
  'Modern tech stack',
  'Expert guidance',
];

export default function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40"
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#2fbc77]/5 to-background" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(47,188,119,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(47,188,119,0.2) 0%, transparent 50%)',
          backgroundSize: '100% 100%',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#2fbc77]/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2fbc77]/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        style={{ scale, y }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2fbc77]/10 border border-[#2fbc77]/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#2fbc77]" />
            <span className="text-sm font-medium text-[#2fbc77]">
              Start Your Journey Today
            </span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
            Stop Learning.
            <br />
            <span className="relative inline-block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2fbc77] to-[#24d387]">
                Start Building.
              </span>
              <motion.span
                className="absolute -inset-2 bg-gradient-to-r from-[#2fbc77]/20 to-[#24d387]/20 blur-2xl -z-10"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </span>
          </h2>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto font-light leading-relaxed"
        >
          Join thousands of developers mastering their craft through{' '}
          <span className="text-foreground font-medium">real projects</span>,{' '}
          not endless tutorials.
        </motion.p>

        {/* Features grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
          className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="group relative bg-card/30 backdrop-blur-xl p-8 rounded-2xl border border-border/50 hover:border-[#2fbc77]/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2fbc77]/0 via-[#2fbc77]/5 to-[#2fbc77]/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2fbc77] to-[#24d387] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-[#2fbc77]/20 group-hover:shadow-xl group-hover:shadow-[#2fbc77]/30 transition-all duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 bg-card/40 backdrop-blur-sm rounded-full border border-border/30"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2fbc77]" />
              <span className="text-sm font-medium text-foreground">
                {highlight}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ExploreChallengesButton
              variant="default"
              size="lg"
              className="group relative bg-gradient-to-r from-[#2fbc77] to-[#24d387] hover:from-[#28a669] hover:to-[#1fc77b] text-white h-14 px-10 rounded-xl font-semibold shadow-xl shadow-[#2fbc77]/30 hover:shadow-2xl hover:shadow-[#2fbc77]/40 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Start Building Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </ExploreChallengesButton>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <RandomFreeChallengeButton
              variant="outline"
              size="lg"
              className="h-14 px-10 rounded-xl font-semibold border-2 border-border/50 bg-card/30 backdrop-blur-xl hover:bg-card/50 hover:border-[#2fbc77]/50 transition-all duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Rocket className="w-4 h-4" />
            <span>Start building real projects today</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
