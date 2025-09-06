'use client';

import { useEffect } from 'react';

// Web Vitals monitoring for performance tracking
export default function WebVitals() {
  useEffect(() => {
    // Only run in production and if Web Vitals API is available
    if (process.env.NODE_ENV === 'production' && 'web-vital' in window) {
      import('web-vitals')
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          function sendToAnalytics(metric: {
            name: string;
            value: number;
            id: string;
          }) {
            // You can send these metrics to your analytics service
            // For now, we'll just log them in development
            if (process.env.NODE_ENV === 'development') {
              console.log('[Web Vitals]', metric);
            }

            // Example: Send to Google Analytics 4
            if (typeof gtag !== 'undefined') {
              (window as { gtag: (...args: unknown[]) => void }).gtag(
                'event',
                metric.name,
                {
                  value: Math.round(
                    metric.name === 'CLS' ? metric.value * 1000 : metric.value
                  ),
                  event_label: metric.id,
                  non_interaction: true,
                }
              );
            }

            // Example: Send to custom analytics endpoint
            // fetch('/api/analytics/web-vitals', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(metric),
            // }).catch(console.error);
          }

          // Measure all Web Vitals
          getCLS(sendToAnalytics);
          getFID(sendToAnalytics);
          getFCP(sendToAnalytics);
          getLCP(sendToAnalytics);
          getTTFB(sendToAnalytics);
        })
        .catch(error => {
          console.warn('Failed to load web-vitals:', error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
}

// Optional: Export a hook for component-level performance monitoring
export function useWebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor specific performance metrics
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            console.log(`[Performance] ${entry.name}: ${entry.duration}ms`);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, []);
}
