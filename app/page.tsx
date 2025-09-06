'use client';

import HeroSection from '@/components/sections/HeroSection';
import Features from '@/components/sections/Features';
import TrustedCompanies from '@/components/sections/TrustedCompanies';
import Testimonials from '@/components/sections/Testimonials';
import CallToAction from '@/components/sections/CallToAction';
import Footer from '@/components/sections/Footer';
import StructuredData from '@/components/StructuredData';
import {
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateCourseSchema,
  generateFAQSchema,
  combineSchemas,
} from '@/lib/structured-data';
import React from 'react';

export default function Home() {
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
      <Features />
      <TrustedCompanies />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
