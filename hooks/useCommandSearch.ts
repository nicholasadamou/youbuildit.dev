'use client';
import { useState, useEffect, useCallback } from 'react';

export function useCommandSearch() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === 'k' &&
        !document.querySelector('dialog[open]')
      ) {
        event.preventDefault();
        if (location.pathname.startsWith('/docs'))
          window.dispatchEvent(new Event('docs-search'));
        else setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  return {
    isOpen,
    openSearch: useCallback(() => setIsOpen(true), []),
    closeSearch: useCallback(() => setIsOpen(false), []),
  };
}
