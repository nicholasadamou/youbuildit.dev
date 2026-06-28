'use client';

import Link from 'next/link';
import { Menu, Zap, Search, Command } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import { ExploreChallengesButton } from '@/components/ui/ChallengeNavigationButtons';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import CommandSearch, { useCommandSearch } from '@/components/CommandSearch';
import { useSheetControl } from '@/hooks/useSheetControl';
import { useState, useEffect, memo } from 'react';

// Memoized navigation items to prevent re-renders
const NavItems = memo(function NavItems({
  openSearch,
}: {
  openSearch: () => void;
}) {
  return (
    <div className="hidden md:flex items-center space-x-3">
      {/* Search Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={openSearch}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline">Search challenges</span>
        <div className="hidden lg:flex items-center gap-0.5 ml-2">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </Button>

      {/* Explore Challenges Button */}
      <ExploreChallengesButton
        variant="default"
        className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white"
      />
    </div>
  );
});

export default function Navbar() {
  const { isOpen, openSearch, closeSearch } = useCommandSearch();
  const { isSheetOpen, openSheet, closeSheet } = useSheetControl();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <nav className="relative z-50">
        <div className="navbar-container w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="flex items-center space-x-3"
                aria-label="Go to homepage"
              >
                <Logo />
                <span className="text-xl font-bold text-foreground">
                  You Build It
                </span>
              </Link>
              {isMounted && <NavItems openSearch={openSearch} />}
              {isMounted && (
                <div className="md:hidden flex items-center space-x-2">
                  {/* Mobile Search Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={openSearch}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent"
                    aria-label="Search challenges"
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  {/* Mobile Menu */}
                  <Sheet
                    open={isSheetOpen}
                    onOpenChange={open => (open ? openSheet() : closeSheet())}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Open main menu"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={openSheet}
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 flex flex-col">
                      <SheetTitle className="sr-only">
                        Main Navigation Menu
                      </SheetTitle>
                      <SheetDescription className="sr-only">
                        Access search functionality and navigate to different
                        sections of the website.
                      </SheetDescription>

                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-8 mt-6">
                        <Logo />
                        <span className="text-xl font-bold text-foreground">
                          You Build It
                        </span>
                      </div>

                      {/* Search Section */}
                      <div className="mb-6">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Search
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            closeSheet();
                            openSearch();
                          }}
                          className="w-full flex items-center gap-3 justify-start px-3 py-2 text-sm text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                        >
                          <Search className="h-4 w-4" />
                          <span>Search challenges</span>
                          <div className="ml-auto flex items-center gap-0.5">
                            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                              <Command className="h-3 w-3" />K
                            </kbd>
                          </div>
                        </Button>
                      </div>

                      {/* Navigation */}
                      <nav className="flex-grow">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Navigation
                        </h3>
                        <div className="space-y-3">
                          <Link
                            href="/"
                            onClick={closeSheet}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
                              <span className="text-sm font-semibold text-muted-foreground">
                                🏠
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                Home
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Back to homepage
                              </p>
                            </div>
                          </Link>

                          <Link
                            href="/challenges"
                            onClick={closeSheet}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="w-8 h-8 bg-[var(--brand)]/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--brand)]/20 transition-colors">
                              <Zap className="h-4 w-4 text-[var(--brand)]" />
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                Explore Challenges
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Browse all coding challenges
                              </p>
                            </div>
                          </Link>
                        </div>
                      </nav>

                      {/* Footer */}
                      <div className="mt-8 pb-6 border-t border-border pt-6">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          Connect with us
                        </h3>
                        <div className="flex space-x-4">
                          <a
                            href="https://github.com/youbuildit"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeSheet}
                            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="You Build It on GitHub"
                          >
                            <GithubIcon className="h-5 w-5" />
                            <span className="text-sm font-medium">GitHub</span>
                          </a>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Command Search Modal */}
      <CommandSearch isOpen={isOpen} onClose={closeSearch} />
    </>
  );
}
