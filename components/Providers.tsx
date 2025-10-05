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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: 'hsl(var(--primary))',
          colorBackground: 'hsl(var(--background))',
          colorInputBackground: 'hsl(var(--background))',
          colorInputText: 'hsl(var(--foreground))',
          colorText: 'hsl(var(--foreground))',
          colorTextSecondary: 'hsl(var(--muted-foreground))',
        },
        elements: {
          card: 'bg-background border border-border',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton:
            'bg-background border border-border text-foreground hover:bg-accent',
          formButtonPrimary:
            'bg-primary text-primary-foreground hover:bg-primary/90',
          footerActionLink: 'text-primary hover:text-primary/80',
        },
      }}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
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
