'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CustomSignInButton } from '@/components/auth';
import { Crown, Users, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const handleUpgrade = async (priceId: string) => {
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

  const isPro = challenge.tier.toUpperCase() === 'PRO';
  const isTeam = challenge.tier.toUpperCase() === 'TEAM';

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

              {/* Subscription Plans */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Pro Plan */}
                <Card
                  className={`relative ${isPro ? 'ring-2 ring-amber-500' : ''}`}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-amber-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-5 h-5 text-amber-500" />
                      <CardTitle>Pro</CardTitle>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">$9.99</div>
                      <div className="text-sm text-muted-foreground">
                        per month
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        Access to all 50+ challenges
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        Detailed solutions & explanations
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        Priority support
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        Progress analytics
                      </li>
                    </ul>
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade('price_pro_monthly')}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Upgrade to Pro'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Team Plan */}
                <Card
                  className={`relative ${
                    isTeam ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {isTeam && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white">
                        <Users className="w-3 h-3 mr-1" />
                        Required
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      <CardTitle>Team</CardTitle>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">$29.99</div>
                      <div className="text-sm text-muted-foreground">
                        per month
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        Everything in Pro
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        Team dashboard
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        Custom challenge requests
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                        Enterprise support
                      </li>
                    </ul>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleUpgrade('price_team_monthly')}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Upgrade to Team'}
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
