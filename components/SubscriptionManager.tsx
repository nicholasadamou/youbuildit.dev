'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import {
  Loader2,
  CreditCard,
  Calendar,
  AlertCircle,
  Check,
  Crown,
} from 'lucide-react';
import { getSubscriptionBenefits } from '@/lib/subscription';

interface SubscriptionManagerProps {
  showHeader?: boolean;
  compact?: boolean;
}

export function SubscriptionManager({
  showHeader = true,
  compact = false,
}: SubscriptionManagerProps) {
  const { user } = useUser();
  const { subscription, isLoading, error } = useSubscription();
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);

  const handleManageBilling = async () => {
    if (!user || !subscription?.stripeCustomerId) return;

    setIsLoadingPortal(true);
    try {
      const response = await fetch('/api/subscriptions/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: subscription.stripeCustomerId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error: unknown) {
      console.error('Error opening billing portal:', error);

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('not configured')) {
        alert('Billing portal is not yet configured. Please contact support.');
      } else {
        alert('Unable to open billing portal. Please try again later.');
      }
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleUpgrade = async (tier: 'PRO') => {
    if (!user) return;

    setIsLoadingUpgrade(true);
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoadingUpgrade(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'PRO':
        return <Crown className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PRO':
        return 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 pointer-events-none';
      default:
        return 'bg-green-100 text-green-900 border border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30 hover:bg-green-100 dark:hover:bg-green-500/20 pointer-events-none';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'TRIALING':
        return 'bg-green-100 text-green-900 border border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30 hover:bg-green-100 dark:hover:bg-green-500/20 pointer-events-none';
      case 'PAST_DUE':
        return 'bg-yellow-100 text-yellow-900 border border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 pointer-events-none';
      case 'CANCELED':
        return 'bg-red-100 text-red-900 border border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20 pointer-events-none';
      default:
        return 'bg-gray-100 text-gray-900 border border-gray-300 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30 hover:bg-gray-100 dark:hover:bg-gray-500/20 pointer-events-none';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-card border border-border shadow-lg rounded-lg overflow-hidden">
        {!showHeader && (
          <div className="bg-gradient-to-r from-[#37d388]/5 to-[#37d388]/10 px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#37d388]/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-[#37d388]" />
              </div>
              <div className="h-6 bg-muted/50 rounded animate-pulse w-48" />
            </div>
          </div>
        )}

        <CardContent className={compact ? 'p-4' : 'p-6'}>
          <div className="space-y-6">
            {/* Loading skeleton for Current Plan */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="h-5 bg-muted/50 rounded animate-pulse w-32 mb-4" />
              <div className="flex gap-3 mb-4">
                <div className="h-7 bg-[#37d388]/20 rounded-lg animate-pulse w-20" />
                <div className="h-7 bg-muted/50 rounded-lg animate-pulse w-16" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted/50 rounded animate-pulse w-4" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-40" />
              </div>
            </div>

            {/* Loading skeleton for Benefits */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="h-5 bg-muted/50 rounded animate-pulse w-28 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-4 w-4 bg-[#37d388]/30 rounded animate-pulse mt-0.5 flex-shrink-0" />
                    <div className="h-4 bg-muted/50 rounded animate-pulse flex-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Loading skeleton for Actions */}
            <div className="space-y-3">
              <div className="h-10 bg-[#37d388]/20 rounded-md animate-pulse w-full" />
              <div className="h-10 bg-muted/50 rounded-md animate-pulse w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>Error loading subscription: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) return null;

  const benefits = getSubscriptionBenefits(subscription.tier);

  return (
    <Card
      className={`bg-card border border-border shadow-lg rounded-lg overflow-hidden ${compact ? '' : ''}`}
    >
      {showHeader && (
        <div className="bg-gradient-to-r from-[#37d388]/5 to-[#37d388]/10 px-6 py-4 border-b border-border">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 bg-[#37d388]/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-[#37d388]" />
            </div>
            Subscription & Billing
          </CardTitle>
          <CardDescription className="mt-1 text-muted-foreground">
            Manage your subscription, billing, and account preferences with
            ease.
          </CardDescription>
        </div>
      )}

      {!showHeader && (
        <div className="bg-gradient-to-r from-[#37d388]/5 to-[#37d388]/10 px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 bg-[#37d388]/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-[#37d388]" />
            </div>
            Subscription & Billing
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your subscription, billing, and account preferences with
            ease.
          </p>
        </div>
      )}

      <CardContent className={compact ? 'p-4' : 'p-6'}>
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Current Plan
            </h3>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                className={`${getTierColor(subscription.tier)} flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-lg`}
              >
                {getTierIcon(subscription.tier)}
                {subscription.tier}
              </Badge>
              <Badge
                className={`${getStatusColor(subscription.status)} px-3 py-1 text-sm font-medium rounded-lg`}
              >
                {subscription.status}
              </Badge>
            </div>

            {subscription.currentPeriodEnd && subscription.tier !== 'FREE' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {subscription.status === 'CANCELED'
                    ? 'Access ends'
                    : 'Renews'}{' '}
                  on {formatDate(subscription.currentPeriodEnd)}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Benefits */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h4 className="text-lg font-semibold mb-4 text-foreground">
              Plan Benefits
            </h4>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#37d388] mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            {subscription.tier === 'FREE' ? (
              <Button
                onClick={() => handleUpgrade('PRO')}
                className="w-full bg-[#37d388] hover:bg-[#2aa86b] text-white font-medium"
                disabled={isLoadingUpgrade}
              >
                {isLoadingUpgrade && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            ) : (
              subscription.stripeCustomerId && (
                <Button
                  onClick={handleManageBilling}
                  variant="outline"
                  className="w-full font-medium"
                  disabled={isLoadingPortal}
                >
                  {isLoadingPortal && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SubscriptionManager;
