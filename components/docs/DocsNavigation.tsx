'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

type Entry = { slug: string; title: string; group: string; href: string };
export default function DocsNavigation({ entries }: { entries: Entry[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const search = () => {
      setQuery('');
      setMode('search');
    };
    const menu = () => {
      setQuery('');
      setMode('menu');
    };
    window.addEventListener('docs-search', search);
    window.addEventListener('docs-menu', menu);
    return () => {
      window.removeEventListener('docs-search', search);
      window.removeEventListener('docs-menu', menu);
    };
  }, []);
  useEffect(() => {
    if (!mode) return;
    const element = dialog.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousFocus = document.activeElement as HTMLElement;
    element?.showModal();
    root.style.overflow = 'hidden';
    return () => {
      element?.close();
      root.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [mode]);
  const matches = entries.filter(entry =>
    entry.title.toLowerCase().includes(query.toLowerCase())
  );
  const navigation = (items: Entry[]) => (
    <nav aria-label="Documentation pages">
      {['Start here', 'Guides', 'Development', 'Reference'].map(group => (
        <div className="docs-nav-group" key={group}>
          {items.some(entry => entry.group === group) && <p>{group}</p>}
          {items
            .filter(entry => entry.group === group)
            .map(entry => (
              <Link
                key={entry.slug}
                href={entry.href}
                aria-current={pathname === entry.href ? 'page' : undefined}
                onClick={() => setMode('')}
              >
                {entry.title}
              </Link>
            ))}
        </div>
      ))}
      {!items.length && (
        <p role="status">No guides match. Try another search.</p>
      )}
    </nav>
  );
  return (
    <>
      <aside className="docs-sidebar">
        <Link
          className="docs-overview"
          href="/docs/api"
          aria-current={pathname === '/docs/api' ? 'page' : undefined}
        >
          API overview
        </Link>
        {navigation(entries.filter(entry => entry.slug !== 'api'))}
        <Link className="docs-home" href="/challenges">
          Explore challenges
        </Link>
      </aside>
      <dialog
        ref={dialog}
        id="docs-navigation-dialog"
        className={`docs-navigation-dialog ${mode === 'menu' ? 'docs-drawer' : ''}`}
        aria-labelledby="docs-dialog-title"
        onCancel={() => setMode('')}
        onClick={event => {
          if (event.target === event.currentTarget) setMode('');
        }}
      >
        <header>
          <h2 id="docs-dialog-title">
            {mode === 'search' ? 'Search documentation' : 'Documentation'}
          </h2>
          <button onClick={() => setMode('')} aria-label="Close documentation">
            <X size={20} />
          </button>
        </header>
        <label className="sr-only" htmlFor="docs-search">
          Find a guide
        </label>
        <input
          id="docs-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Find a guide…"
          autoFocus
        />
        {navigation(matches)}
      </dialog>
    </>
  );
}
