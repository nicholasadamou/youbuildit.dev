'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransitions() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const animations: Animation[] = [];
    const reveal = (element: Element, distance: number) => {
      animations.push(
        element.animate(
          [
            { transform: `translateY(${distance}px)` },
            { transform: 'translateY(0)' },
          ],
          { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        )
      );
    };
    const content =
      document.querySelector('.docs-main') ??
      document.querySelector('#main > *');
    if (content && !location.hash) reveal(content, 6);
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target, 10);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 }
    );
    document
      .querySelectorAll(
        '.studio-home > section, .docs-main > h2, .docs-code, .docs-diagram'
      )
      .forEach(element => {
        // Already-visible content uses the page transition; later sections reveal once.
        if (element.getBoundingClientRect().top >= innerHeight)
          observer.observe(element);
      });
    const stop = () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
    };
    preference.addEventListener('change', stop);
    return () => {
      stop();
      preference.removeEventListener('change', stop);
    };
  }, [pathname]);
  return null;
}
