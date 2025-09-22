'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CustomSignInButton } from '@/components/auth';
import { useRouter } from 'next/navigation';
import { Crown, Users, Check, ArrowRight, Star, Zap } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

// Price IDs from environment variables
const STRIPE_PRICE_IDS = {
  pro: {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
      'price_1S7fQJFOUeuyFeHJ9M2UCk6D',
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID ||
      'price_1S7fS7FOUeuyFeHJPY2Fmmqs',
  },
  team: {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID ||
      'price_1S7fQdFOUeuyFeHJwBC9222W',
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID ||
      'price_1S7fRpFOUeuyFeHJ9mBmKvGs',
  },
};

export default function PricingSection() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string, planName: string) => {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(planName);
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      if (stripe && sessionId) {
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error('Failed to load Stripe or missing session ID');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      icon: Zap,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      features: [
        'Access to 20+ beginner challenges',
        'Community support via GitHub',
      ],
      cta: 'Browse Free Challenges',
      popular: false,
      priceId: null,
    },
    {
      name: 'Pro',
      description: 'For serious developers',
      price: { monthly: 9.99, yearly: 99.99 },
      icon: Crown,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500',
      features: [
        'Access to all 50+ challenges',
        'Premium challenges with detailed solutions',
        'Step-by-step explanations',
        'Advanced progress analytics',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      priceId: {
        monthly: STRIPE_PRICE_IDS.pro.monthly,
        yearly: STRIPE_PRICE_IDS.pro.yearly,
      },
    },
    {
      name: 'Team',
      description: 'For teams and organizations',
      price: { monthly: 29.99, yearly: 299.99 },
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500',
      features: [
        'Everything in Pro',
        'Team dashboard and progress tracking',
        'Advanced analytics and reporting',
      ],
      cta: 'Upgrade to Team',
      popular: false,
      priceId: {
        monthly: STRIPE_PRICE_IDS.team.monthly,
        yearly: STRIPE_PRICE_IDS.team.yearly,
      },
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Choose the perfect plan to accelerate your coding journey. Start
            free and upgrade as you grow.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center space-x-3"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <Label
              htmlFor="billing-toggle"
              className={!isYearly ? 'font-semibold' : ''}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label
              htmlFor="billing-toggle"
              className={isYearly ? 'font-semibold' : ''}
            >
              Yearly
              <Badge className="ml-2 bg-green-500 text-white">Save 17%</Badge>
            </Label>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto items-end justify-center md:py-4 mt-2">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const currentPrice = isYearly
              ? plan.price.yearly
              : plan.price.monthly;
            const priceId = plan.priceId
              ? isYearly
                ? plan.priceId.yearly
                : plan.priceId.monthly
              : null;

            return (
              <motion.div
                key={plan.name}
                className={`relative flex-1 max-w-sm ${
                  plan.popular
                    ? 'md:-mt-12 md:scale-110' // Elevate and slightly scale the popular plan
                    : 'md:mt-12' // Lower the side plans
                }`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: 'easeOut',
                  type: 'spring',
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`flex flex-col h-full transition-shadow duration-300 hover:shadow-lg ${plan.popular ? 'ring-2 ring-amber-500' : ''}`}
                  >
                    {plan.popular && (
                      <motion.div
                        className="absolute -top-4 left-0 right-0 flex justify-center z-20"
                        initial={{ opacity: 0, y: -10, scale: 0.8 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.15 + 0.3,
                        }}
                        viewport={{ once: true }}
                        animate={{
                          y: [0, -2, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          },
                        }}
                      >
                        <Badge
                          className={`${plan.bgColor} text-white px-4 py-1 shadow-lg flex items-center justify-center whitespace-nowrap`}
                        >
                          <motion.div
                            animate={{
                              rotate: [0, 5, -5, 0],
                              transition: {
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                          >
                            <Star className="w-3 h-3 mr-1" />
                          </motion.div>
                          Most Popular
                        </Badge>
                      </motion.div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="flex items-center justify-center gap-2 mb-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.15 + 0.4,
                        }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                            rotate: 5,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <Icon className={`w-6 h-6 ${plan.color}`} />
                        </motion.div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </motion.div>

                      <motion.div
                        className="space-y-1 mb-3"
                        key={`${plan.name}-${isYearly}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${plan.name}-price-${isYearly}`}
                            className="text-3xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                          >
                            ${currentPrice}
                            {plan.name !== 'Free' && (
                              <span className="text-base font-normal text-muted-foreground">
                                /{isYearly ? 'year' : 'month'}
                              </span>
                            )}
                          </motion.div>
                        </AnimatePresence>
                        {isYearly && plan.name !== 'Free' && (
                          <motion.div
                            className="text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            ${(currentPrice / 12).toFixed(2)}/month billed
                            annually
                          </motion.div>
                        )}
                      </motion.div>

                      <CardDescription className="text-sm">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
                      <div className="flex-1">
                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <motion.li
                              key={featureIndex}
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.15 + 0.6 + featureIndex * 0.1,
                              }}
                              viewport={{ once: true }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              </motion.div>
                              <span className="text-sm">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <motion.div
                        className="pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay:
                            index * 0.15 + 0.8 + plan.features.length * 0.1,
                        }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {!isSignedIn && plan.name !== 'Free' ? (
                            <CustomSignInButton
                              mode="modal"
                              redirectUrl={
                                typeof window !== 'undefined'
                                  ? window.location.href
                                  : '/'
                              }
                              variant={plan.popular ? 'default' : 'outline'}
                              size="lg"
                              className="w-full group"
                              showIcon={false}
                            >
                              {plan.cta}
                              <motion.div
                                className="ml-2"
                                animate={{ x: [0, 4, 0] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              >
                                <ArrowRight className="w-4 h-4" />
                              </motion.div>
                            </CustomSignInButton>
                          ) : (
                            <Button
                              className="w-full group"
                              variant={plan.popular ? 'default' : 'outline'}
                              size="lg"
                              onClick={() => {
                                if (plan.name === 'Free') {
                                  router.push('/challenges?tier=free');
                                } else if (priceId) {
                                  handleUpgrade(priceId, plan.name);
                                }
                              }}
                              disabled={isLoading === plan.name}
                            >
                              {isLoading === plan.name ? (
                                <div className="flex items-center gap-2">
                                  <motion.div
                                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: 'linear',
                                    }}
                                  />
                                  <span>Processing...</span>
                                </div>
                              ) : (
                                <>
                                  {plan.cta}
                                  <motion.div
                                    className="ml-2"
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                    }}
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </motion.div>
                                </>
                              )}
                            </Button>
                          )}
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
