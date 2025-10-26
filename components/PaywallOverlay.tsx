'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CustomSignInButton } from '@/components/auth';
import { Crown, ArrowRight, X, Home, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PremiumBadge from './PremiumBadge';
import { Challenge } from '@/lib/mdx';
import { getUpgradeMessage } from '@/lib/subscription';
import { useRouter } from 'next/navigation';

interface PaywallOverlayProps {
  challenge: Challenge;
  onClose?: () => void;
}

export default function PaywallOverlay({
  challenge,
  onClose,
}: PaywallOverlayProps) {
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();

  // Price IDs for Pro tier
  const STRIPE_PRICE_IDS = {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
      'price_1S7fQJFOUeuyFeHJ9M2UCk6D',
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID ||
      'price_1S7fS7FOUeuyFeHJPY2Fmmqs',
  };

  const handleUpgrade = async () => {
    const priceId = isYearly
      ? STRIPE_PRICE_IDS.yearly
      : STRIPE_PRICE_IDS.monthly;
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          tier: challenge.tier,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoChallenges = () => {
    router.push('/challenges?tier=free');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
      }}
    >
      <Card className="relative shadow-2xl bg-background border max-w-2xl mx-auto">
        {/* Close button - only show if onClose is provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 bg-background border rounded-full p-2 shadow-lg hover:bg-muted transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <CardHeader className="text-center">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <PremiumBadge tier={challenge.tier} size="lg" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <CardTitle className="text-2xl">Unlock {challenge.title}</CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <CardDescription className="text-lg">
              {getUpgradeMessage(challenge)}
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Challenge Preview */}
          <motion.div
            className="p-4 bg-muted rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="font-semibold mb-2">Challenge Preview</h4>
            <p className="text-muted-foreground text-sm">{challenge.summary}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>
                <Badge variant="secondary" className="text-xs">
                  {challenge.difficulty}
                </Badge>
              </span>
              <span>{challenge.estimatedTime}</span>
              <span>{challenge.category}</span>
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center space-x-3 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Label
              htmlFor="paywall-billing-toggle"
              className={!isYearly ? 'font-semibold text-sm' : 'text-sm'}
            >
              Monthly
            </Label>
            <Switch
              id="paywall-billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label
              htmlFor="paywall-billing-toggle"
              className={isYearly ? 'font-semibold text-sm' : 'text-sm'}
            >
              Yearly
              <Badge className="ml-2 bg-green-500 text-white text-xs">
                Save 17%
              </Badge>
            </Label>
          </motion.div>

          {/* Subscription Plan */}
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{
                scale: 1.03,
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="relative ring-2 ring-amber-500/50 border-amber-200 dark:border-amber-800 bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20">
                <CardHeader className="text-center pb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">Upgrade to Pro</CardTitle>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`pro-price-${isYearly}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        ${isYearly ? '99.99' : '9.99'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {isYearly ? 'year' : 'month'}
                      </div>
                      {isYearly && (
                        <motion.div
                          className="text-xs text-muted-foreground mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          $8.33/month billed annually
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Unlock this premium challenge and get access to:
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Access to all 50+ challenges
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Detailed solutions & explanations
                    </li>
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                      size="lg"
                      onClick={handleUpgrade}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Pro - {isYearly ? '$99.99/yr' : '$9.99/mo'}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Sign in prompt for non-authenticated users */}
          {!isSignedIn && (
            <motion.div
              className="text-center p-3 bg-muted rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <p className="text-xs text-muted-foreground mb-2">
                Don&apos;t have an account yet?
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CustomSignInButton
                  variant="outline"
                  size="sm"
                  mode="modal"
                  showIcon={false}
                  className="hover:bg-card hover:text-card-foreground"
                >
                  Sign in to get started
                </CustomSignInButton>
              </motion.div>
            </motion.div>
          )}

          {/* Navigation Options */}
          <motion.div
            className="border-t pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Not ready to upgrade? You can:
            </p>
            <div className="flex gap-2 mb-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGoHome}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGoChallenges}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <List className="w-4 h-4" />
                  Browse Free Challenges
                </Button>
              </motion.div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Or press{' '}
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">
                Escape
              </kbd>{' '}
              to go back
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
