import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

// Stripe product and price IDs - these would be created in your Stripe dashboard
export const STRIPE_CONFIG = {
  plans: {
    pro: {
      monthly: {
        priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_xxx',
        amount: 999, // $9.99
      },
      yearly: {
        priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_yyy',
        amount: 9999, // $99.99
      },
    },
    team: {
      monthly: {
        priceId: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID || 'price_zzz',
        amount: 2999, // $29.99
      },
      yearly: {
        priceId: process.env.STRIPE_TEAM_YEARLY_PRICE_ID || 'price_zzz_yearly',
        amount: 29999, // $299.99
      },
    },
  },
};

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  return customers.data[0] || null;
};

export const createStripeCustomer = async (email: string, name?: string) => {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      created_via: 'youbuildit_platform',
    },
  });
};

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) => {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      customerId,
    },
  });
};

export const createCustomerPortalSession = async (
  customerId: string,
  returnUrl: string
) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
};

export const getSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.retrieve(subscriptionId);
};

export const cancelSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.cancel(subscriptionId);
};
