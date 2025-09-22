'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        themes={['light', 'dark']}
      >
        {children}
        <Toaster theme="system" richColors closeButton position="top-right" />
      </NextThemesProvider>
    </ClerkProvider>
  );
}
