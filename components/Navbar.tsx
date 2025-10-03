'use client';

import Link from 'next/link';
import { Menu, Zap, Github, Search, Command } from 'lucide-react';
import {
  CustomUserButton,
  CustomSignInButton,
  CustomSignedIn,
  CustomSignedOut,
} from '@/components/auth';
import { ExploreChallengesButton } from '@/components/ui/ChallengeNavigationButtons';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import CommandSearch, { useCommandSearch } from '@/components/CommandSearch';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const { isOpen, openSearch, closeSearch } = useCommandSearch();
  const [isFixed, setIsFixed] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['hsla(var(--background) / 0)', 'hsla(var(--background) / 0.9)']
  );

  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ['none', '0 1px 3px 0 rgba(0, 0, 0, 0.1)']
  );

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const navTop = navRef.current.offsetTop;
        const scrollTop = window.scrollY;

        // Make navbar fixed when we scroll past its initial position
        setIsFixed(scrollTop > navTop);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`transition-all duration-300 z-50 will-change-transform ${
          isFixed
            ? 'fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border shadow-lg'
            : 'relative bg-transparent'
        }`}
        style={{
          contain: 'layout style paint',
          backgroundColor: isFixed ? undefined : backgroundColor.get(),
          boxShadow: isFixed ? undefined : boxShadow.get(),
        }}
        initial={{ y: 0 }}
        animate={{ y: isFixed ? 0 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="navbar-container w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
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
              </motion.div>
              <div className="hidden md:flex items-center space-x-3">
                {/* Search Button */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
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
                </motion.div>

                {/* Explore Challenges Button */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ExploreChallengesButton
                    variant="default"
                    className="bg-[--brand] hover:bg-[--brand-dark] text-white"
                  />
                </motion.div>

                {/* Authentication */}
                <motion.div
                  className="flex items-center h-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <CustomSignedOut>
                    <CustomSignInButton
                      variant="outline"
                      className="flex items-center space-x-2 h-8"
                      mode="modal"
                    >
                      Sign In
                    </CustomSignInButton>
                  </CustomSignedOut>
                  <CustomSignedIn>
                    <div className="flex items-center justify-center h-8">
                      <CustomUserButton
                        size="sm"
                        afterSignOutUrl="/"
                        className="h-8 w-8"
                      />
                    </div>
                  </CustomSignedIn>
                </motion.div>
              </div>
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
                <Sheet>
                  <SheetTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Open main menu"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </motion.div>
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
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openSearch}
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
                      </SheetClose>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-grow">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Navigation
                      </h3>
                      <div className="space-y-3">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <SheetClose asChild>
                            <Link
                              href="/"
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
                          </SheetClose>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <SheetClose asChild>
                            <Link
                              href="/challenges"
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                            >
                              <div className="w-8 h-8 bg-[--brand]/10 rounded-lg flex items-center justify-center group-hover:bg-[--brand]/20 transition-colors">
                                <Zap className="h-4 w-4 text-[--brand]" />
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
                          </SheetClose>
                        </motion.div>
                      </div>
                    </nav>

                    {/* Authentication Section */}
                    <div className="mb-6">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Account
                      </h3>
                      <CustomSignedOut>
                        <SheetClose asChild>
                          <CustomSignInButton
                            variant="outline"
                            className="w-full flex items-center space-x-2"
                            mode="modal"
                          >
                            Sign In
                          </CustomSignInButton>
                        </SheetClose>
                      </CustomSignedOut>
                      <CustomSignedIn>
                        <div className="flex items-center space-x-3">
                          <CustomUserButton
                            size="md"
                            afterSignOutUrl="/"
                            className="h-10 w-10"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              Account
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Manage profile & billing
                            </span>
                          </div>
                        </div>
                      </CustomSignedIn>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pb-6 border-t border-border pt-6">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Connect with us
                      </h3>
                      <div className="flex space-x-4">
                        <SheetClose asChild>
                          <motion.a
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            href="https://github.com/youbuildit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="You Build It on GitHub"
                          >
                            <Github className="h-5 w-5" />
                            <span className="text-sm font-medium">GitHub</span>
                          </motion.a>
                        </SheetClose>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Command Search Modal */}
      <CommandSearch isOpen={isOpen} onClose={closeSearch} />
    </>
  );
}
