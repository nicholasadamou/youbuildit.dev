'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ClientChallenge } from '@/types/challenge';
import { Search, Clock, Code, ArrowRight } from 'lucide-react';
import DifficultyTag from '@/components/ui/DifficultyTag';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allChallenges, setAllChallenges] = useState<ClientChallenge[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load challenges
  useEffect(() => {
    async function loadChallenges() {
      try {
        const response = await fetch('/api/challenges');
        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }
        const challenges = await response.json();
        setAllChallenges(challenges);
      } catch (error) {
        console.error('Error loading challenges:', error);
      }
    }
    loadChallenges();
  }, []);

  // Filter challenges based on search query
  const filteredChallenges = allChallenges
    .filter(
      (challenge: ClientChallenge) =>
        challenge.title.toLowerCase().includes(query.toLowerCase()) ||
        challenge.summary.toLowerCase().includes(query.toLowerCase()) ||
        challenge.skills.some(skill =>
          skill.toLowerCase().includes(query.toLowerCase())
        )
    )
    .slice(0, 5); // Limit to 5 results for better UX

  // Handle challenge selection
  const handleSelectChallenge = useCallback(
    (challenge: ClientChallenge) => {
      router.push(`/challenge/${challenge.slug}`);
      onClose();
    },
    [router, onClose]
  );

  // Store scroll position
  const [scrollY, setScrollY] = useState(0);

  // Reset state when modal opens and handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);

      // Get and store current scroll position
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Save original styles
      const originalBodyStyle = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        overflow: document.body.style.overflow,
        width: document.body.style.width,
        height: document.body.style.height,
      };

      const originalHtmlStyle = {
        overflow: document.documentElement.style.overflow,
        height: document.documentElement.style.height,
      };

      // Enhanced scroll locking with better backdrop blur support
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';

      // Lock html element for better mobile support
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';

      // Prevent touchmove events on the body to stop elastic scrolling
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };

      // Add passive: false to ensure preventDefault works
      document.body.addEventListener('touchmove', preventTouchMove, {
        passive: false,
      });
      document.documentElement.addEventListener('touchmove', preventTouchMove, {
        passive: false,
      });

      // Focus the input after the modal animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Cleanup function to restore scroll when modal closes
      return () => {
        // Remove touch event listeners
        document.body.removeEventListener('touchmove', preventTouchMove);
        document.documentElement.removeEventListener(
          'touchmove',
          preventTouchMove
        );

        // Restore original styles
        Object.assign(document.body.style, originalBodyStyle);
        Object.assign(document.documentElement.style, originalHtmlStyle);

        // Restore scroll position
        window.scrollTo(0, currentScrollY);
      };
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < filteredChallenges.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : filteredChallenges.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredChallenges[selectedIndex]) {
            handleSelectChallenge(filteredChallenges[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    filteredChallenges,
    selectedIndex,
    onClose,
    handleSelectChallenge,
  ]);

  // Update selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent touch scrolling on the backdrop while allowing modal content to scroll
  const handleBackdropTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling on the backdrop
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  // Calculate modal positioning based on scroll position
  const modalTopOffset = Math.max(60, 200 - scrollY * 0.3); // Adaptive positioning

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      style={{ paddingTop: `${modalTopOffset}px` }}
      onClick={handleBackdropClick}
      onTouchMove={handleBackdropTouchMove}
    >
      {/* Backdrop with enhanced blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md backdrop-saturate-150"
        style={{
          backdropFilter: 'blur(8px) saturate(150%)',
          WebkitBackdropFilter: 'blur(8px) saturate(150%)',
        }}
      />
      {/* Modal content */}
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-lg shadow-2xl border border-border overflow-hidden animate-in fade-in-0 slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search challenges..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-lg text-card-foreground placeholder-muted-foreground bg-transparent border-none outline-none"
          />
          {query && (
            <span className="text-sm text-muted-foreground ml-2">
              {filteredChallenges.length} result
              {filteredChallenges.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Results */}
        <div
          className="max-h-96 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {query === '' ? (
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                Search for challenges
              </p>
              <p className="text-sm text-muted-foreground/70">
                Try searching for &quot;shell&quot;, &quot;web server&quot;, or
                &quot;JSON parser&quot;
              </p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">No challenges found</p>
              <p className="text-sm text-muted-foreground/70">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="py-2">
              {filteredChallenges.map(
                (challenge: ClientChallenge, index: number) => (
                  <button
                    key={challenge.slug}
                    onClick={() => handleSelectChallenge(challenge)}
                    className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
                      index === selectedIndex ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-card-foreground truncate">
                            {challenge.title}
                          </h3>
                          <DifficultyTag
                            difficulty={challenge.difficulty}
                            size="sm"
                            animated={false}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {challenge.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {challenge.estimatedTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Code className="h-3 w-3" />
                            {challenge.category}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-4 flex-shrink-0" />
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {query !== '' && (
          <div className="px-4 py-3 border-t border-border bg-secondary">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 rotate-90" />
                  <ArrowRight className="h-3 w-3 -rotate-90" />
                  to navigate
                </span>
                <span className="flex items-center gap-1">↵ to select</span>
              </div>
              <span>ESC to close</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to trigger the command search
export function useCommandSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K on Mac, Ctrl+K on Windows/Linux
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    openSearch: () => setIsOpen(true),
    closeSearch: () => setIsOpen(false),
  };
}
