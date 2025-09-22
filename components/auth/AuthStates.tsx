'use client';

import { useUser } from '@clerk/nextjs';

interface AuthStateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function CustomSignedIn({ children, fallback }: AuthStateProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return fallback ? <>{fallback}</> : null;
  }

  return isSignedIn ? <>{children}</> : fallback ? <>{fallback}</> : null;
}

export function CustomSignedOut({ children, fallback }: AuthStateProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return fallback ? <>{fallback}</> : null;
  }

  return !isSignedIn ? <>{children}</> : fallback ? <>{fallback}</> : null;
}
