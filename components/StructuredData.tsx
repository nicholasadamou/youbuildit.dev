'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: object | object[];
}

export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Clean up any existing structured data scripts from this component
    const existingScripts = document.querySelectorAll(
      'script[data-structured-data="true"]'
    );
    existingScripts.forEach(script => script.remove());

    // Create new script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'true');
    script.textContent = JSON.stringify(data, null, 2);

    // Append to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector(
        'script[data-structured-data="true"]'
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  // This component doesn't render anything visible
  return null;
}
