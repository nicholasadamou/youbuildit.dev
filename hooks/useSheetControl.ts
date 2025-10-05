'use client';

import { useState, useCallback } from 'react';

export function useSheetControl() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openSheet = useCallback(() => setIsSheetOpen(true), []);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  return {
    isSheetOpen,
    openSheet,
    closeSheet,
  };
}
