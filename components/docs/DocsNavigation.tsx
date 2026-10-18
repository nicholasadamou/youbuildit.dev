'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type Entry = { slug: string; title: string; group: string; href: string };

export default function DocsNavigation({ entries }: { entries: Entry[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const matches = entries.filter(entry =>
    entry.title.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <aside className="docs-sidebar">
      <button
        className="docs-menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="docs-navigation"
      >
        Browse documentation <span>{open ? '−' : '+'}</span>
      </button>
      <div
        id="docs-navigation"
        className={open ? 'docs-navigation is-open' : 'docs-navigation'}
      >
        <label className="docs-search-label" htmlFor="docs-search">
          Search documentation
        </label>
        <input
          id="docs-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Find a guide…"
        />
        <nav aria-label="Documentation pages">
          {['Start here', 'Guides', 'Development', 'Reference'].map(group => (
            <div className="docs-nav-group" key={group}>
              {matches.some(entry => entry.group === group) && <p>{group}</p>}
              {matches
                .filter(entry => entry.group === group)
                .map(entry => (
                  <Link
                    key={entry.slug}
                    href={entry.href}
                    aria-current={pathname === entry.href ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {entry.title}
                  </Link>
                ))}
            </div>
          ))}
          {matches.length === 0 && (
            <p role="status">No guides match. Try another search.</p>
          )}
        </nav>
        <Link className="docs-home" href="/challenges">
          Explore challenges
        </Link>
      </div>
    </aside>
  );
}
