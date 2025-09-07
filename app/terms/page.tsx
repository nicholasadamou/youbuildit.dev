'use client';

import { motion } from 'framer-motion';
import Footer from '@/components/sections/Footer';
import {
  Shield,
  FileText,
  Users,
  Copyright,
  Eye,
  GraduationCap,
  AlertTriangle,
  Scale,
  FileX,
  Gavel,
  MapPin,
  Mail,
} from 'lucide-react';

export default function TermsOfUsePage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.04, 0.62, 0.23, 0.98] as const,
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98] as const,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: 'backOut' as const,
      },
    },
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.6,
      },
    },
  };

  const sections = [
    {
      id: 1,
      title: 'Acceptance of Terms',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      iconColor: 'bg-blue-500',
      textColor: 'text-blue-500',
      glowColor: 'bg-blue-500/20',
      content:
        'By accessing and using You Build It ("the Platform"), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform.',
    },
    {
      id: 2,
      title: 'Description of Service',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      iconColor: 'bg-green-500',
      textColor: 'text-green-500',
      glowColor: 'bg-green-500/20',
      content:
        'You Build It is a platform that provides coding challenges designed to help software engineers improve their skills through practical, real-world application development. The Platform offers various coding challenges, tutorials, and educational content.',
    },
    {
      id: 3,
      title: 'User Responsibilities',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      iconColor: 'bg-purple-500',
      textColor: 'text-purple-500',
      glowColor: 'bg-purple-500/20',
      content: 'By using the Platform, you agree to:',
      listItems: [
        'Use the Platform for lawful purposes only',
        'Not attempt to gain unauthorized access to any part of the Platform',
        "Not interfere with or disrupt the Platform's functionality",
        'Not use the Platform to distribute malicious code or content',
        'Respect the intellectual property rights of others',
        'Not engage in any activity that could harm other users or the Platform',
      ],
    },
    {
      id: 4,
      title: 'Intellectual Property',
      icon: Copyright,
      color: 'from-orange-500 to-orange-600',
      iconColor: 'bg-orange-500',
      textColor: 'text-orange-500',
      glowColor: 'bg-orange-500/20',
      content:
        'Platform Content: The challenges, tutorials, and educational content provided on the Platform are owned by You Build It and are protected by copyright and other intellectual property laws. You may use this content for personal learning and development purposes. User Submissions: Any code, solutions, or content you create or submit while using the Platform remains your intellectual property. However, you grant You Build It a non-exclusive license to use your submissions for educational purposes and Platform improvement. Open Source: The Platform encourages open source development. Challenge solutions and related code may be shared publicly as part of the learning process.',
    },
    {
      id: 5,
      title: 'Privacy and Data Collection',
      icon: Eye,
      color: 'from-indigo-500 to-indigo-600',
      iconColor: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      glowColor: 'bg-indigo-500/20',
      content:
        'We respect your privacy and are committed to protecting your personal information. The Platform may collect anonymous usage data to improve the service and user experience. We do not collect personal information unless explicitly provided by you.',
    },
    {
      id: 6,
      title: 'Educational Use',
      icon: GraduationCap,
      color: 'from-teal-500 to-teal-600',
      iconColor: 'bg-teal-500',
      textColor: 'text-teal-500',
      glowColor: 'bg-teal-500/20',
      content:
        'The Platform is designed for educational purposes. The challenges and content are meant to help users learn and improve their software development skills. While we strive for accuracy, the content should not be considered as professional advice or production-ready solutions without proper review and testing.',
    },
    {
      id: 7,
      title: 'Disclaimer of Warranties',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-yellow-600',
      iconColor: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      glowColor: 'bg-yellow-500/20',
      content:
        'The Platform is provided "as is" without warranties of any kind, either express or implied. We make no guarantees about the availability, accuracy, or reliability of the Platform. Use of the Platform is at your own risk.',
    },
    {
      id: 8,
      title: 'Limitation of Liability',
      icon: Scale,
      color: 'from-red-500 to-red-600',
      iconColor: 'bg-red-500',
      textColor: 'text-red-500',
      glowColor: 'bg-red-500/20',
      content:
        'To the fullest extent permitted by law, You Build It shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Platform. Our total liability shall not exceed the amount you paid to use the Platform (if any).',
    },
    {
      id: 9,
      title: 'Modifications to Terms',
      icon: FileX,
      color: 'from-pink-500 to-pink-600',
      iconColor: 'bg-pink-500',
      textColor: 'text-pink-500',
      glowColor: 'bg-pink-500/20',
      content:
        'We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting on the Platform. Your continued use of the Platform after changes are posted constitutes acceptance of the revised terms.',
    },
    {
      id: 10,
      title: 'Termination',
      icon: Gavel,
      color: 'from-gray-500 to-gray-600',
      iconColor: 'bg-gray-500',
      textColor: 'text-gray-500',
      glowColor: 'bg-gray-500/20',
      content:
        'We reserve the right to terminate or suspend access to the Platform at any time, with or without cause or notice. Upon termination, your right to use the Platform will cease immediately.',
    },
    {
      id: 11,
      title: 'Governing Law',
      icon: MapPin,
      color: 'from-cyan-500 to-cyan-600',
      iconColor: 'bg-cyan-500',
      textColor: 'text-cyan-500',
      glowColor: 'bg-cyan-500/20',
      content:
        'These Terms of Use shall be governed by and construed in accordance with the laws of the jurisdiction where You Build It is operated, without regard to conflict of law principles.',
    },
    {
      id: 12,
      title: 'Contact Information',
      icon: Mail,
      color: 'from-emerald-500 to-emerald-600',
      iconColor: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      glowColor: 'bg-emerald-500/20',
      content:
        'If you have any questions about these Terms of Use, please contact us through our GitHub repository at',
      link: {
        href: 'https://github.com/youbuildit/youbuildit.dev',
        text: 'github.com/youbuildit/youbuildit.dev',
      },
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-[--brand]/10 to-transparent rounded-full blur-3xl"
          animate={{
            y: [-20, 30, -20],
            x: [-10, 15, -10],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-32 left-10 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl"
          animate={{
            y: [25, -25, 25],
            x: [15, -15, 15],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="container mx-auto px-6 py-16 max-w-6xl relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div className="text-center mb-16" variants={headerVariants}>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-[--brand] to-foreground bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Terms of Use
            </motion.h1>
            <motion.div
              className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3 text-muted-foreground"
              variants={itemVariants}
            >
              <div className="w-2 h-2 bg-[--brand] rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Last updated:{' '}
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </motion.div>
          </motion.div>

          {/* Terms Sections - Consistent List Flow */}
          <motion.div
            className="space-y-8 md:space-y-12 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isLongContent =
                section.listItems || section.content.length > 200;

              return (
                <motion.div
                  key={section.id}
                  className="group"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  {/* Section Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className={`w-14 h-14 ${section.iconColor} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      variants={iconVariants}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-baseline gap-3 flex-wrap">
                        <span
                          className={`${section.textColor} font-mono text-lg md:text-xl flex-shrink-0`}
                        >
                          {section.id.toString().padStart(2, '0')}.
                        </span>
                        <span className="break-words">{section.title}</span>
                      </h2>
                      {/* Subtle accent line under title */}
                      <motion.div
                        className={`h-0.5 bg-gradient-to-r ${section.color} rounded-full mb-4`}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className={`ml-18 ${isLongContent ? 'space-y-4' : ''}`}>
                    <div className="text-muted-foreground leading-relaxed text-base md:text-lg">
                      {section.content && !section.link && (
                        <p className="mb-4">{section.content}</p>
                      )}
                      {section.content && section.link && (
                        <p className="mb-4">
                          {section.content}{' '}
                          <a
                            href={section.link.href}
                            className={`${section.textColor} hover:underline font-medium transition-colors duration-200`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {section.link.text}
                          </a>
                          .
                        </p>
                      )}
                      {section.listItems && (
                        <ul className="space-y-3 mt-4">
                          {section.listItems.map((item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              className="flex items-start gap-4 group/item hover:translate-x-1 transition-transform duration-200"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + itemIndex * 0.1 }}
                            >
                              <div
                                className={`w-2 h-2 ${section.iconColor} rounded-full mt-2.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200`}
                              />
                              <span className="flex-1">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Subtle separator line */}
                  {index < sections.length - 1 && (
                    <motion.div
                      className="mt-8 md:mt-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
