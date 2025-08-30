'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { HeadingData } from '@/lib/toc-utils';

interface TocContextValue {
  headings: HeadingData[];
  hasTableOfContents: boolean;
}

const TocContext = createContext<TocContextValue | null>(null);

interface TocProviderProps {
  children: ReactNode;
  headings: HeadingData[];
  hasTableOfContents: boolean;
}

export function TocProvider({
  children,
  headings,
  hasTableOfContents,
}: TocProviderProps) {
  return (
    <TocContext.Provider value={{ headings, hasTableOfContents }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  const context = useContext(TocContext);
  if (!context) {
    return { headings: [], hasTableOfContents: false };
  }
  return context;
}
