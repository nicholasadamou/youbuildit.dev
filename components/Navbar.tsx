'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import {
  BookOpen,
  Compass,
  Grid2X2,
  Menu,
  Search,
  X,
  Code2,
} from 'lucide-react';
import Brand from '@/components/Brand';
import GithubIcon from '@/components/icons/GithubIcon';
import dynamic from 'next/dynamic';
import { useCommandSearch } from '@/hooks/useCommandSearch';

const CommandSearch = dynamic(() => import('@/components/CommandSearch'));

const repository = 'https://github.com/youbuildit/youbuildit.dev';
const links = [
  ['/challenges', 'Explore challenges'],
  ['/docs/getting-started', 'Getting started'],
  ['/docs', 'Documentation'],
];

export default function Navbar() {
  const pathname = usePathname();
  const isDocs = pathname.startsWith('/docs');
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen, openSearch, closeSearch } = useCommandSearch();
  function closeMenu() {
    dialog.current?.close();
    setMenuOpen(false);
    document.body.style.overflow = '';
    trigger.current?.focus();
  }
  function showMenu() {
    dialog.current?.showModal();
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  }
  function search() {
    if (menuOpen) closeMenu();
    openSearch();
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        className={isDocs ? 'site-header docs-header' : 'site-header'}
        id="top"
      >
        <div className="site-wrap header-inner">
          <Brand />
          {isDocs && <span className="docs-header-label">Documentation</span>}
          <nav className="desktop-nav" aria-label="Main navigation">
            {(isDocs
              ? [
                  ['/docs/api', 'API reference'],
                  ['/docs/getting-started', 'Getting started'],
                ]
              : links
            ).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            className="header-search-trigger"
            onClick={search}
            aria-label="Search challenges"
            aria-haspopup="dialog"
          >
            <Search size={17} />
            <span>Search</span>
            <kbd>⌘ K</kbd>
          </button>
          <a className="github-link" href={repository}>
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <button
            ref={trigger}
            className="menu-toggle"
            onClick={showMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
          >
            Menu <Menu size={18} />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-dialog"
        aria-labelledby="mobile-title"
        onCancel={closeMenu}
      >
        <div className="mobile-panel-heading">
          <Brand />
          <button
            className="close-overlay"
            onClick={closeMenu}
            aria-label="Close navigation"
            autoFocus
          >
            <X size={20} />
          </button>
        </div>
        <div className="mobile-panel-body">
          <p className="eyebrow">A little direction goes a long way</p>
          <h2 id="mobile-title">What’s next?</h2>
          <button className="mobile-search-trigger" onClick={search}>
            <Search size={18} />
            <span>Search challenges</span>
            <kbd>⌘ K</kbd>
          </button>
          <nav className="mobile-primary" aria-label="Mobile navigation">
            <Link
              className="mobile-feature-card"
              href="/challenges"
              onClick={closeMenu}
            >
              <Grid2X2 size={22} />
              <span>
                <strong>Explore challenges</strong>
                <small>Find your next thing to build.</small>
              </span>
            </Link>
            <div className="mobile-resource-grid">
              <Link href="/docs/getting-started" onClick={closeMenu}>
                <BookOpen size={20} />
                <strong>Getting started</strong>
                <small>From a blank editor to your first build.</small>
              </Link>
              <Link href="/docs" onClick={closeMenu}>
                <Compass size={20} />
                <strong>Documentation</strong>
                <small>A little guidance, when you need it.</small>
              </Link>
            </div>
          </nav>
          <section className="mobile-tasks">
            <div className="mobile-section-label">
              <h3>Build your own way</h3>
              <span>Start with an outcome</span>
            </div>
            <nav aria-label="Resources">
              {[
                ['/docs/getting-started', 'Choose a challenge'],
                ['/docs/solutions', 'Learn from solutions'],
                ['/docs/local-development', 'Run locally'],
                ['/docs/contributing', 'Contribute a change'],
              ].map(([href, label]) => (
                <Link key={href} href={href} onClick={closeMenu}>
                  <Code2 size={18} />
                  {label}
                </Link>
              ))}
            </nav>
          </section>
          <aside className="mobile-starter">
            <p className="eyebrow">Not sure where to begin?</p>
            <h3>Something small is a good start.</h3>
            <p>Pick one challenge. Make it work. Make it yours.</p>
            <Link href="/docs/getting-started" onClick={closeMenu}>
              Read the getting started guide
            </Link>
          </aside>
        </div>
        <div className="mobile-panel-footer">
          <a href={repository}>
            <GithubIcon className="h-4 w-4" /> GitHub
          </a>
          <a href={`${repository}/issues`}>Feedback & issues</a>
        </div>
      </dialog>
      {isOpen && <CommandSearch isOpen={isOpen} onClose={closeSearch} />}
    </>
  );
}
