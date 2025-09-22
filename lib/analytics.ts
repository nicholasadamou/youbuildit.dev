import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnalyticsEvent {
  userId?: string;
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

// Track subscription events
export async function trackSubscriptionEvent(
  event:
    | 'subscription_started'
    | 'subscription_upgraded'
    | 'subscription_canceled'
    | 'payment_failed',
  userId: string,
  properties?: Record<string, unknown>
) {
  try {
    // You can implement your preferred analytics service here
    // For now, we'll just log to console and potentially store in database

    console.log('Subscription Event:', {
      event,
      userId,
      properties,
      timestamp: new Date(),
    });

    // Example: Send to Google Analytics, Mixpanel, or your analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        user_id: userId,
        ...properties,
      });
    }

    // You could also store these events in your database for internal analytics
    // await prisma.analyticsEvent.create({
    //   data: {
    //     userId,
    //     event,
    //     properties: JSON.stringify(properties),
    //     timestamp: new Date(),
    //   },
    // });
  } catch (error) {
    console.error('Error tracking subscription event:', error);
  }
}

// Track challenge interaction events
export async function trackChallengeEvent(
  event:
    | 'challenge_viewed'
    | 'challenge_started'
    | 'challenge_completed'
    | 'paywall_shown'
    | 'upgrade_clicked',
  challengeSlug: string,
  userId?: string,
  properties?: Record<string, unknown>
) {
  try {
    const eventData = {
      event,
      challengeSlug,
      userId,
      properties,
      timestamp: new Date(),
    };

    console.log('Challenge Event:', eventData);

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        challenge_slug: challengeSlug,
        user_id: userId,
        ...properties,
      });
    }

    // Track in your database
    if (userId) {
      // Update or create challenge progress
      if (event === 'challenge_completed') {
        await prisma.challengeProgress.upsert({
          where: {
            userId_challengeId: {
              userId,
              challengeId: challengeSlug,
            },
          },
          update: {
            completed: true,
            completedAt: new Date(),
          },
          create: {
            userId,
            challengeId: challengeSlug,
            completed: true,
            completedAt: new Date(),
          },
        });
      } else if (event === 'challenge_started') {
        await prisma.challengeProgress.upsert({
          where: {
            userId_challengeId: {
              userId,
              challengeId: challengeSlug,
            },
          },
          update: {},
          create: {
            userId,
            challengeId: challengeSlug,
            completed: false,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error tracking challenge event:', error);
  }
}

// Get subscription analytics
export async function getSubscriptionAnalytics(days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Active subscribers by tier
    const activeSubscribers = await prisma.user.groupBy({
      by: ['subscriptionTier'],
      where: {
        subscriptionStatus: 'ACTIVE',
      },
      _count: {
        id: true,
      },
    });

    // New subscriptions in the period
    const newSubscriptions = await prisma.user.count({
      where: {
        subscriptionStatus: 'ACTIVE',
        updatedAt: {
          gte: startDate,
        },
      },
    });

    // Cancellations in the period
    const cancellations = await prisma.user.count({
      where: {
        subscriptionStatus: 'CANCELED',
        updatedAt: {
          gte: startDate,
        },
      },
    });

    // Calculate MRR (Monthly Recurring Revenue)
    const proPricing = 9.99;
    const teamPricing = 29.99;

    const proCount =
      activeSubscribers.find(s => s.subscriptionTier === 'PRO')?._count.id || 0;
    const teamCount =
      activeSubscribers.find(s => s.subscriptionTier === 'TEAM')?._count.id ||
      0;

    const mrr = proCount * proPricing + teamCount * teamPricing;

    return {
      activeSubscribers: activeSubscribers.reduce(
        (sum, tier) => sum + tier._count.id,
        0
      ),
      subscriptionsByTier: activeSubscribers,
      newSubscriptions,
      cancellations,
      churnRate:
        newSubscriptions > 0 ? (cancellations / newSubscriptions) * 100 : 0,
      mrr,
    };
  } catch (error) {
    console.error('Error getting subscription analytics:', error);
    return null;
  }
}

// Get challenge analytics
export async function getChallengeAnalytics(challengeSlug?: string) {
  try {
    const whereClause = challengeSlug ? { challengeId: challengeSlug } : {};

    const totalStarted = await prisma.challengeProgress.count({
      where: whereClause,
    });

    const totalCompleted = await prisma.challengeProgress.count({
      where: {
        ...whereClause,
        completed: true,
      },
    });

    const completionRate =
      totalStarted > 0 ? (totalCompleted / totalStarted) * 100 : 0;

    // Most popular challenges
    if (!challengeSlug) {
      const popularChallenges = await prisma.challengeProgress.groupBy({
        by: ['challengeId'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      });

      return {
        totalStarted,
        totalCompleted,
        completionRate,
        popularChallenges: popularChallenges.map(c => ({
          challengeSlug: c.challengeId,
          attempts: c._count.id,
        })),
      };
    }

    return {
      totalStarted,
      totalCompleted,
      completionRate,
    };
  } catch (error) {
    console.error('Error getting challenge analytics:', error);
    return null;
  }
}

// Client-side analytics helper
export function initClientAnalytics() {
  if (typeof window === 'undefined') return;

  // Initialize Google Analytics if GTAG_ID is available
  if (process.env.NEXT_PUBLIC_GA_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID);
  }
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
