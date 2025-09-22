'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Home,
  Book,
  Sparkles,
  Star,
  Crown,
  Calendar,
  Shield,
  Zap,
  Target,
  Users,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/sections/Footer';

interface SubscriptionInfo {
  tier: string;
  status: string;
  currentPeriodEnd: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    // Verify the session and get subscription details
    const verifySession = async () => {
      try {
        const response = await fetch(
          `/api/subscriptions/verify-session?session_id=${sessionId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSubscriptionInfo(data);

          // Trigger confetti effect with multiple bursts
          setTimeout(() => {
            // First burst
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10B981', '#06D6A0', '#F59E0B', '#EF4444', '#8B5CF6'],
            });

            // Second burst from left
            setTimeout(() => {
              confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0.1, y: 0.7 },
                colors: ['#10B981', '#06D6A0', '#F59E0B'],
              });
            }, 200);

            // Third burst from right
            setTimeout(() => {
              confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 0.9, y: 0.7 },
                colors: ['#EF4444', '#8B5CF6', '#06D6A0'],
              });
            }, 400);
          }, 1200);
        } else {
          setError('Failed to verify payment session');
        }
      } catch (err) {
        console.error('Error verifying session:', err);
        setError('An error occurred while verifying your payment');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId, router]);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[--brand]/5 via-background to-background" />

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-16 h-16 border-4 border-[--brand]/20 border-t-[--brand] rounded-full" />
              </motion.div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Verifying Payment
                </h2>
                <motion.p
                  className="text-muted-foreground"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  Just a moment while we confirm your payment...
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !subscriptionInfo) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-background" />

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            className="bg-card/80 backdrop-blur-sm border border-destructive/20 rounded-2xl p-8 shadow-lg max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              {/* Error Icon */}
              <motion.div
                className="bg-destructive/10 rounded-full p-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <svg
                    className="h-12 w-12 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Error Content */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-destructive">
                  Payment Verification Failed
                </h2>
                <p className="text-muted-foreground">
                  {error ||
                    'Unable to verify your payment. Please contact support.'}
                </p>
              </div>

              {/* Action Button */}
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[--brand] to-emerald-500 hover:from-[--brand]/90 hover:to-emerald-500/90 text-white border-0"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center mb-16"
            >
              {/* Success Icon with Floating Elements */}
              <motion.div
                className="relative inline-flex items-center justify-center mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <div className="relative">
                  {/* Main success icon */}
                  <div className="relative bg-gradient-to-r from-[--brand] to-emerald-500 rounded-full p-6 shadow-2xl">
                    <CheckCircle
                      className="h-16 w-16 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Tier badge */}
                  <motion.div
                    className="absolute -top-3 -right-3"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.8, type: 'spring' }}
                  >
                    {subscriptionInfo?.tier.toLowerCase() === 'pro' && (
                      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full p-2 shadow-lg">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                    )}
                    {subscriptionInfo?.tier.toLowerCase() === 'team' && (
                      <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-full p-2 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </motion.div>

                  {/* Enhanced Floating sparkles */}
                  {[
                    {
                      top: '15%',
                      left: '25%',
                      delay: 0,
                      type: 'sparkle',
                      size: 'sm',
                    },
                    {
                      top: '20%',
                      left: '75%',
                      delay: 0.8,
                      type: 'star',
                      size: 'md',
                    },
                    {
                      top: '65%',
                      left: '20%',
                      delay: 1.2,
                      type: 'sparkle',
                      size: 'lg',
                    },
                    {
                      top: '75%',
                      left: '80%',
                      delay: 1.8,
                      type: 'star',
                      size: 'sm',
                    },
                    {
                      top: '45%',
                      left: '85%',
                      delay: 0.4,
                      type: 'sparkle',
                      size: 'md',
                    },
                    {
                      top: '55%',
                      left: '10%',
                      delay: 1.6,
                      type: 'star',
                      size: 'sm',
                    },
                    {
                      top: '35%',
                      left: '5%',
                      delay: 2.2,
                      type: 'sparkle',
                      size: 'lg',
                    },
                    {
                      top: '85%',
                      left: '45%',
                      delay: 0.6,
                      type: 'star',
                      size: 'md',
                    },
                  ].map((sparkle, i) => {
                    const sizeClasses: Record<string, string> = {
                      sm: 'h-2 w-2',
                      md: 'h-3 w-3',
                      lg: 'h-4 w-4',
                    };

                    const colors = [
                      'text-[--brand]',
                      'text-emerald-400',
                      'text-yellow-400',
                      'text-blue-400',
                      'text-purple-400',
                    ];

                    return (
                      <motion.div
                        key={i}
                        className="absolute pointer-events-none"
                        style={{
                          top: sparkle.top,
                          left: sparkle.left,
                        }}
                        initial={{ opacity: 0, scale: 0, rotate: 0 }}
                        animate={{
                          opacity: [0, 0.8, 1, 0.8, 0],
                          scale: [0, 0.5, 1, 1.2, 0],
                          y: [-15, -25, -40, -55, -70],
                          x: [
                            0,
                            Math.sin(i) * 10,
                            Math.sin(i + 1) * 15,
                            Math.sin(i + 2) * 8,
                            0,
                          ],
                          rotate:
                            sparkle.type === 'sparkle'
                              ? [0, 180, 360, 540, 720]
                              : [0, 90, 180, 270, 360],
                        }}
                        transition={{
                          duration: 5 + Math.random() * 2,
                          repeat: Infinity,
                          delay: sparkle.delay + Math.random() * 0.5,
                          ease: 'easeOut',
                        }}
                      >
                        {sparkle.type === 'sparkle' ? (
                          <Sparkles
                            className={`${sizeClasses[sparkle.size]} ${colors[i % colors.length]} opacity-90 drop-shadow-sm`}
                          />
                        ) : (
                          <Star
                            className={`${sizeClasses[sparkle.size]} ${colors[(i + 2) % colors.length]} opacity-75 drop-shadow-sm`}
                          />
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Pulsing glow effect around the icon */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(55, 211, 136, 0.3)',
                        '0 0 40px rgba(55, 211, 136, 0.5)',
                        '0 0 20px rgba(55, 211, 136, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Subtle rotating ring */}
                  <motion.div
                    className="absolute inset-0 border-2 border-[--brand]/20 rounded-full"
                    style={{ transform: 'scale(1.4)' }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4 mb-12"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--brand] via-emerald-500 to-teal-500">
                    Welcome{' '}
                  </span>
                  <span className="text-white">Aboard!</span>
                </h1>
                <p className="text-xl md:text-3xl text-slate-800 dark:text-white max-w-2xl mx-auto font-medium">
                  🎉 You&apos;ve successfully upgraded to{' '}
                  <span className="font-bold text-[--brand] dark:text-emerald-400 capitalize">
                    {subscriptionInfo.tier}
                  </span>{' '}
                  and unlocked your engineering potential
                </p>
              </motion.div>
            </motion.div>

            {/* Modern Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              {/* Plan Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[--brand]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-[--brand]/10 rounded-lg p-2">
                      <Target className="h-5 w-5 text-[--brand]" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Plan
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold capitalize text-foreground">
                      {subscriptionInfo.tier}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Premium Access
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Status Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-emerald-500/10 rounded-lg p-2">
                      <Shield className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Status
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-emerald-500 capitalize">
                      {subscriptionInfo.status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      All Systems Go
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Next Billing Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-500/10 rounded-lg p-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Next Billing
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">
                      {new Date(
                        subscriptionInfo.currentPeriodEnd
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        subscriptionInfo.currentPeriodEnd
                      ).getFullYear()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Features Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12 mb-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  What You&apos;ve{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--brand] to-emerald-500">
                    Unlocked
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your journey to engineering excellence starts now
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: Zap,
                    title: 'Access to 50+ Challenges',
                    description:
                      'Real-world projects that build practical skills',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-500/10',
                  },
                  {
                    icon: Target,
                    title: 'Detailed Solutions',
                    description: 'Step-by-step explanations and best practices',
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-500/10',
                  },
                  {
                    icon: Star,
                    title: 'Progress Tracking',
                    description: 'Advanced analytics to monitor your growth',
                    color: 'text-purple-500',
                    bgColor: 'bg-purple-500/10',
                  },
                  {
                    icon: Shield,
                    title: 'Priority Support',
                    description: 'Direct access to our engineering team',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-500/10',
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`${feature.bgColor} rounded-lg p-3 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-[--brand] to-emerald-500 hover:from-[--brand]/90 hover:to-emerald-500/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[320px] h-16 text-xl font-bold"
              >
                <Link href="/challenges?tier=premium">
                  <Book className="w-6 h-6 mr-3" />
                  Start Building Now
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer with a distinct background */}
      <div className="relative bg-background border-t border-border/20">
        <Footer />
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-[#37d388]/20 border-t-[#37d388] rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading success page...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
