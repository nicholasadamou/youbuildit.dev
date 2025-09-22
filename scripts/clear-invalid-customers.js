import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearInvalidCustomers() {
  try {
    console.log('🧹 Clearing invalid Stripe customer IDs from database...');

    const result = await prisma.user.updateMany({
      data: {
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStatus: 'FREE',
        subscriptionTier: 'FREE',
      },
    });

    console.log(`✅ Cleared ${result.count} user records`);
    console.log('All users will get fresh Stripe customers on next checkout');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearInvalidCustomers();
