'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CustomSignInButton } from '@/components/auth';
import { Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
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
import Footer from '@/components/sections/Footer';
import { Challenge } from '@/lib/mdx';
import { getUpgradeMessage } from '@/lib/subscription';

interface PaywallProps {
  challenge: Challenge;
  className?: string;
}

export default function Paywall({ challenge }: PaywallProps) {
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

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
      // Will be handled by SignInButton
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <PremiumBadge tier={challenge.tier} size="lg" />
              </div>
              <CardTitle className="text-2xl">{challenge.title}</CardTitle>
              <CardDescription className="text-lg">
                {getUpgradeMessage(challenge)}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Challenge Preview */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Challenge Summary</h4>
                <p className="text-muted-foreground">{challenge.summary}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>
                    Difficulty:{' '}
                    <Badge variant="secondary">{challenge.difficulty}</Badge>
                  </span>
                  <span>Estimated time: {challenge.estimatedTime}</span>
                  <span>Category: {challenge.category}</span>
                </div>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Label
                  htmlFor="paywall-billing-toggle-main"
                  className={!isYearly ? 'font-semibold' : ''}
                >
                  Monthly
                </Label>
                <Switch
                  id="paywall-billing-toggle-main"
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <Label
                  htmlFor="paywall-billing-toggle-main"
                  className={isYearly ? 'font-semibold' : ''}
                >
                  Yearly
                  <Badge className="ml-2 bg-green-500 text-white">
                    Save 17%
                  </Badge>
                </Label>
              </div>

              {/* Subscription Plan */}
              <div className="max-w-md mx-auto">
                {/* Pro Plan */}
                <Card className="relative ring-2 ring-amber-500/50 border-amber-200 dark:border-amber-800 bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20">
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                        <Crown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-3">
                      Upgrade to Pro
                    </CardTitle>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`main-pro-price-${isYearly}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1"
                      >
                        <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                          ${isYearly ? '99.99' : '9.99'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          per {isYearly ? 'year' : 'month'}
                        </div>
                        {isYearly && (
                          <motion.div
                            className="text-sm text-muted-foreground"
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
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        Unlock this premium challenge and get access to:
                      </p>
                    </div>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-3">
                        <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Access to all 50+ challenges
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Detailed solutions & explanations
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Priority support
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Progress analytics
                      </li>
                    </ul>
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                      size="lg"
                      onClick={handleUpgrade}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Crown className="w-5 h-5 mr-2" />
                          Upgrade to Pro - $
                          {isYearly ? '$99.99/yr' : '$9.99/mo'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sign in prompt for non-authenticated users */}
              {!isSignedIn && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Don&apos;t have an account yet?
                  </p>
                  <CustomSignInButton
                    variant="outline"
                    mode="modal"
                    showIcon={false}
                  >
                    Sign in to get started
                  </CustomSignInButton>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer bgColor="bg-secondary" />
    </div>
  );
}
