'use client';

import HeroSection from '@/components/sections/HeroSection';
import Features from '@/components/sections/Features';
import TrustedCompanies from '@/components/sections/TrustedCompanies';
import Testimonials from '@/components/sections/Testimonials';
import PricingSection from '@/components/sections/PricingSection';
import CallToAction from '@/components/sections/CallToAction';
import Footer from '@/components/sections/Footer';
import StructuredData from '@/components/StructuredData';
import { SubscriptionStatusBanner } from '@/components/SubscriptionStatusBanner';
import { useSubscription } from '@/hooks/useSubscription';
import {
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateCourseSchema,
  generateFAQSchema,
  combineSchemas,
} from '@/lib/structured-data';
import React from 'react';

export default function Home() {
  const { hasActiveSubscription, isLoading, error } = useSubscription();

  // Generate structured data for the homepage
  const structuredData = combineSchemas([
    generateWebsiteSchema(),
    generateOrganizationSchema(),
    generateCourseSchema(),
    generateFAQSchema(),
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <HeroSection />

      {/* Show subscription status banner if there are service issues */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {error && <SubscriptionStatusBanner error={error} />}
      </div>

      <Features />
      <TrustedCompanies />
      <Testimonials />
      <CallToAction />
      {/* Only show pricing section if user doesn't have active subscription */}
      {!isLoading && !hasActiveSubscription && <PricingSection />}
      <Footer />
    </>
  );
}
