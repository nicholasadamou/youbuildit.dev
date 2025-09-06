'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  className?: string;
}

export default function LazySection({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  fallback,
  className,
}: LazySectionProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
          // Disconnect after loading to improve performance
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={ref} className={className}>
      {isIntersecting || hasLoaded
        ? children
        : fallback || (
            <div
              className="w-full h-32 bg-gray-50 animate-pulse flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
    </div>
  );
}
