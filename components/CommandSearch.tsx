'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useChallenges } from '@/hooks/useChallenges';

export default function CommandSearch({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { challenges, loading, error, refetch } = useChallenges({
    autoLoad: isOpen,
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const matches = challenges.filter(challenge =>
    `${challenge.title} ${challenge.summary} ${challenge.skills.join(' ')}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );
  useEffect(() => {
    const element = dialog.current;
    if (!isOpen) {
      element?.close();
      return;
    }
    const previousFocus = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    const { scrollX, scrollY } = window;
    element?.showModal();
    root.style.overflow = 'hidden';
    input.current?.focus({ preventScroll: true });
    window.scrollTo(scrollX, scrollY);
    return () => {
      element?.close();
      root.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen]);
  useEffect(() => {
    dialog.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, query, loading]);
  const select = (slug: string) => {
    router.push(`/challenge/${slug}`);
    onClose();
  };
  return (
    <dialog
      ref={dialog}
      className="search-dialog"
      aria-labelledby="search-title"
      onCancel={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="search-heading">
        <h2 id="search-title">Find your next challenge</h2>
        <button
          onClick={onClose}
          className="close-overlay"
          aria-label="Close search"
        >
          <X size={18} />
        </button>
      </div>
      <label className="search-input">
        <Search size={18} />
        <span className="sr-only">Search challenges</span>
        <input
          ref={input}
          role="combobox"
          aria-expanded="true"
          aria-controls={!loading && !error ? 'challenge-options' : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            !loading && !error && matches[selectedIndex]
              ? `challenge-option-${selectedIndex}`
              : undefined
          }
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            setSelectedIndex(0);
          }}
          placeholder="Try shell, web server, or JSON…"
          onKeyDown={event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setSelectedIndex(
                index =>
                  (index +
                    (event.key === 'ArrowDown' ? 1 : -1) +
                    matches.length) %
                  Math.max(matches.length, 1)
              );
            }
            if (event.key === 'Enter' && matches[selectedIndex]) {
              event.preventDefault();
              select(matches[selectedIndex].slug);
            }
          }}
        />
      </label>
      <div className="search-results">
        {loading ? (
          <p role="status">Loading challenges…</p>
        ) : error ? (
          <div>
            <p role="alert">Challenges could not be loaded.</p>
            <button className="text-link" onClick={() => void refetch()}>
              Try again
            </button>
          </div>
        ) : (
          <div
            id="challenge-options"
            role="listbox"
            aria-label="Matching challenges"
          >
            {matches.map((challenge, index) => (
              <button
                type="button"
                role="option"
                id={`challenge-option-${index}`}
                aria-selected={index === selectedIndex}
                tabIndex={-1}
                className="search-result"
                key={challenge.slug}
                onMouseMove={() => setSelectedIndex(index)}
                onMouseDown={event => event.preventDefault()}
                onClick={() => select(challenge.slug)}
              >
                <strong>{challenge.title}</strong>
                <span>{challenge.summary}</span>
                <small>
                  {challenge.difficulty} · {challenge.category}
                </small>
              </button>
            ))}
            {!matches.length && (
              <p role="status">No challenges match. Try another search.</p>
            )}
          </div>
        )}
      </div>
      <div className="search-footer">
        <Link href="/docs" onClick={onClose}>
          Read the documentation
        </Link>
        <span>↑ ↓ navigate · Enter select · Esc close</span>
      </div>
    </dialog>
  );
}
