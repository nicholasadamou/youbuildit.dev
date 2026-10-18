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
  const matches = challenges
    .filter(challenge =>
      `${challenge.title} ${challenge.summary} ${challenge.skills.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .slice(0, 6);
  useEffect(() => {
    const element = dialog.current;
    if (!isOpen) {
      element?.close();
      return;
    }
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [isOpen]);
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
          autoFocus
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
              router.push(`/challenge/${matches[selectedIndex].slug}`);
              onClose();
            }
          }}
        />
      </label>
      <div className="search-results" aria-live="polite">
        {loading ? (
          <p>Loading challenges…</p>
        ) : error ? (
          <div>
            <p>Challenges could not be loaded.</p>
            <button className="text-link" onClick={() => void refetch()}>
              Try again
            </button>
          </div>
        ) : matches.length ? (
          matches.map((challenge, index) => (
            <Link
              className={
                index === selectedIndex
                  ? 'search-result selected'
                  : 'search-result'
              }
              key={challenge.slug}
              href={`/challenge/${challenge.slug}`}
              onClick={onClose}
            >
              <strong>{challenge.title}</strong>
              <span>{challenge.summary}</span>
              <small>{challenge.difficulty}</small>
            </Link>
          ))
        ) : (
          <p>No challenges match. Try another search.</p>
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
