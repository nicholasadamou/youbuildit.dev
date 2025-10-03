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
        defaultTheme="dark"
        enableSystem={false}
        themes={['dark']}
        forcedTheme="dark"
      >
        {children}
        <Toaster theme="dark" richColors closeButton position="top-right" />
      </NextThemesProvider>
    </ClerkProvider>
  );
}
