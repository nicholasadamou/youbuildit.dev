'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface SolutionPaywallOverlayProps {
  isSubscriptionLoading: boolean;
}

export default function SolutionPaywallOverlay({
  isSubscriptionLoading,
}: SolutionPaywallOverlayProps) {
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
    if (!isSubscriptionLoading) {
      const priceId = isYearly
        ? STRIPE_PRICE_IDS.yearly
        : STRIPE_PRICE_IDS.monthly;

      try {
        const response = await fetch('/api/subscriptions/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId,
            tier: 'PRO',
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
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex items-center justify-center overflow-hidden">
      <div className="text-center p-4 max-w-md mx-4">
        <div className="mb-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-[--brand] to-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Unlock Complete Solution
          </h3>
          <p className="text-gray-200 text-xs leading-relaxed">
            Get access to professional implementations and comprehensive tests.
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-white text-xs">
            <svg
              className="w-3 h-3 text-green-400 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Complete source code with tests
          </div>
          <div className="flex items-center text-white text-xs">
            <svg
              className="w-3 h-3 text-green-400 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Downloadable ZIP packages
          </div>
          <div className="flex items-center text-white text-xs">
            <svg
              className="w-3 h-3 text-green-400 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Access to all 50+ solutions
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Label
            htmlFor="solution-billing-toggle"
            className={
              !isYearly
                ? 'font-semibold text-xs text-white'
                : 'text-xs text-gray-300'
            }
          >
            Monthly
          </Label>
          <Switch
            id="solution-billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label
            htmlFor="solution-billing-toggle"
            className={
              isYearly
                ? 'font-semibold text-xs text-white'
                : 'text-xs text-gray-300'
            }
          >
            Yearly
            <Badge className="ml-1 bg-green-500 text-white text-[10px] px-1 py-0">
              Save 17%
            </Badge>
          </Label>
        </div>

        <div className="space-y-2">
          <button
            className="block w-full bg-gradient-to-r from-[--brand] to-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm text-center disabled:opacity-50"
            onClick={handleUpgrade}
            disabled={isSubscriptionLoading}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`solution-price-${isYearly}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                Upgrade to Pro - {isYearly ? '$99.99/yr' : '$9.99/mo'}
              </motion.span>
            </AnimatePresence>
          </button>
          <div className="text-[10px] text-gray-300 space-y-1">
            <p>Unlock all solution files instantly</p>
            {isYearly && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-green-300"
              >
                $8.33/month billed annually - Save 17%!
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
