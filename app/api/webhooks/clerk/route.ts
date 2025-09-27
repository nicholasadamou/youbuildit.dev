import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Type definitions for Clerk webhook events
interface ClerkEmailAddress {
  id: string;
  email_address: string;
  verification?: {
    status: string;
    strategy: string;
  };
}

interface ClerkUserData {
  id: string;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  created_at: number;
}

interface ClerkWebhookEvent {
  data: ClerkUserData;
  type: string;
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: ClerkWebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Clerk Webhook: ${eventType} for user ${id}`);

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }

  return new NextResponse('Webhook processed successfully', { status: 200 });
}

async function handleUserCreated(userData: ClerkUserData) {
  const { id, email_addresses, first_name, last_name, image_url, created_at } =
    userData;

  const primaryEmail = email_addresses.find(
    (email: ClerkEmailAddress) => email.id === userData.primary_email_address_id
  );
  const email = primaryEmail?.email_address;

  if (!email) {
    console.error('No email found for user:', id);
    return;
  }

  // Combine first and last name for the 'name' field
  const fullName = [first_name, last_name].filter(Boolean).join(' ') || null;

  try {
    // Create user in database
    const user = await prisma.user.create({
      data: {
        id: id, // Use Clerk user ID
        email: email,
        name: fullName,
        image: image_url || null,
        subscriptionTier: 'FREE', // Default tier
        subscriptionStatus: 'FREE', // Default status
        createdAt: new Date(created_at),
        updatedAt: new Date(),
      },
    });

    console.log('Created user in database:', user.id);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function handleUserUpdated(userData: ClerkUserData) {
  const { id, email_addresses, first_name, last_name, image_url } = userData;

  const primaryEmail = email_addresses.find(
    (email: ClerkEmailAddress) => email.id === userData.primary_email_address_id
  );
  const email = primaryEmail?.email_address;

  if (!email) {
    console.error('No email found for user:', id);
    return;
  }

  // Combine first and last name for the 'name' field
  const fullName = [first_name, last_name].filter(Boolean).join(' ') || null;

  try {
    // Update user in database
    const user = await prisma.user.upsert({
      where: { id: id },
      update: {
        email: email,
        name: fullName,
        image: image_url || null,
        updatedAt: new Date(),
      },
      create: {
        id: id,
        email: email,
        name: fullName,
        image: image_url || null,
        subscriptionTier: 'FREE',
        subscriptionStatus: 'FREE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('Updated user in database:', user.id);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function handleUserDeleted(userData: ClerkUserData) {
  const { id } = userData;

  try {
    // Delete user from database
    await prisma.user.delete({
      where: { id: id },
    });

    console.log('Deleted user from database:', id);
  } catch {
    // User might not exist in database, which is fine
    console.log('User not found in database for deletion:', id);
  }
}
