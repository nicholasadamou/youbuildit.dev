'use client';

import Image from 'next/image';
import Link from 'next/link';
import { InfiniteCarousel } from '@/components/InfiniteCarousel';
import { motion } from 'framer-motion';
import React from 'react';

const companies = [
  '1password',
  'airbnb',
  'amazon',
  'facebook',
  'google',
  'instagram',
  'linkedin',
  'meta',
  'microsoft',
  'netflix',
  'twitch',
  'youtube',
];

export default function TrustedCompanies() {
  return (
    <section className="bg-[#fafafa] py-16 sm:py-24 w-full max-w-full overflow-x-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Trusted by Engineers from Top Companies
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Our platform is used by software engineers from leading tech companies
          worldwide.
        </p>
      </motion.div>
      <div className="relative overflow-hidden mt-6 sm:mt-8">
        <div className="h-16 flex items-center">
          <InfiniteCarousel pauseOnHover gap={48}>
            {companies.map(company => (
              <Link
                key={company}
                href={`https://www.${company}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center justify-center"
              >
                <Image
                  src={`/logos/${company}.svg`}
                  alt={`${company} logo`}
                  width={120}
                  height={20}
                  className="transition-all duration-300 ease-in-out filter grayscale-[0.85] hover:grayscale-0"
                />
              </Link>
            ))}
          </InfiniteCarousel>
        </div>
      </div>
    </section>
  );
}
