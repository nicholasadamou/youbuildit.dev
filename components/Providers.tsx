'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const Toaster = dynamic(() => import('sonner').then(module => module.Toaster), {
  ssr: false,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster theme="light" richColors closeButton position="top-right" />
    </>
  );
}
