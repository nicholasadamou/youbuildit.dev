'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { InfiniteCarousel } from '@/components/InfiniteCarousel';

type CompanyConfig = {
  name: string;
  width: number;
  height: number;
  hasDarkVariant?: boolean;
  className?: string;
};

const COMPANIES: CompanyConfig[] = [
  { name: '1password', width: 120, height: 20 },
  { name: 'airbnb', width: 120, height: 20 },
  { name: 'amazon', width: 120, height: 20 },
  { name: 'facebook', width: 120, height: 20 },
  { name: 'google', width: 120, height: 20 },
  { name: 'instagram', width: 120, height: 20 },
  { name: 'linkedin', width: 120, height: 20 },
  { name: 'meta', width: 120, height: 20, hasDarkVariant: true },
  { name: 'microsoft', width: 120, height: 20 },
  { name: 'netflix', width: 120, height: 20 },
  { name: 'twitch', width: 120, height: 20 },
  { name: 'youtube', width: 120, height: 20, hasDarkVariant: true },
];

const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const BASE_LOGO_CLASSES =
  'transition-all duration-300 ease-in-out filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100';

export default function TrustedCompanies() {
  const { resolvedTheme } = useTheme();

  const getLogoSrc = (company: CompanyConfig): string => {
    const { name, hasDarkVariant } = company;
    const isDark = resolvedTheme === 'dark';
    const suffix = hasDarkVariant && isDark ? '-dark' : '';
    return `/logos/${name}${suffix}.svg`;
  };

  const getLogoClassName = (company: CompanyConfig): string => {
    const { className = '' } = company;
    return `${BASE_LOGO_CLASSES} ${className}`.trim();
  };

  return (
    <section className="bg-muted py-16 sm:py-24 w-full max-w-full overflow-x-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full"
        {...ANIMATION_CONFIG}
      >
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          Trusted by Engineers from Top Companies
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Our platform is used by software engineers from leading tech companies
          worldwide.
        </p>
      </motion.div>

      <div className="relative overflow-hidden mt-6 sm:mt-8">
        <div className="h-20 flex items-center">
          <InfiniteCarousel pauseOnHover gap={48}>
            {COMPANIES.map(company => (
              <Link
                key={company.name}
                href={`https://www.${company.name}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center justify-center"
              >
                <Image
                  src={getLogoSrc(company)}
                  alt={`${company.name} logo`}
                  width={company.width}
                  height={company.height}
                  className={getLogoClassName(company)}
                />
              </Link>
            ))}
          </InfiniteCarousel>
        </div>
      </div>
    </section>
  );
}
