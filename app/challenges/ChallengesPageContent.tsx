'use client';

import StructuredData from '@/components/StructuredData';
import {
  generateCourseSchema,
  generateBreadcrumbSchema,
  combineSchemas,
} from '@/lib/structured-data';
import { getBaseUrl } from '@/lib/getBaseUrl';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { ClientChallenge } from '@/types/challenge';
import { useChallenges } from '@/hooks/useChallenges';
import Footer from '@/components/sections/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import DifficultyTag from '@/components/ui/DifficultyTag';
import {
  Search,
  Clock,
  Code,
  Tag,
  Filter,
  ArrowRight,
  Grid,
  List,
  Target,
  Crown,
} from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import PremiumBadge from '@/components/PremiumBadge';

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ChallengesPageContent() {
  const { challenges: allChallenges, loading } = useChallenges();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showPremiumOnly, setShowPremiumOnly] = useState<
    'All' | 'Free' | 'Premium'
  >('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Set initial filters based on URL parameters
  useEffect(() => {
    const tierParam = searchParams.get('tier');
    if (
      tierParam?.toLowerCase() === 'free' ||
      tierParam?.toUpperCase() === 'FREE'
    ) {
      setShowPremiumOnly('Free');
    } else if (
      tierParam?.toLowerCase() === 'premium' ||
      tierParam?.toLowerCase() === 'pro' ||
      tierParam?.toUpperCase() === 'PRO'
    ) {
      setShowPremiumOnly('Premium');
    }

    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== 'All') {
      setSelectedCategory(categoryParam);
    }

    const difficultyParam = searchParams.get('difficulty');
    if (difficultyParam && difficultyParam !== 'All') {
      setSelectedDifficulty(difficultyParam);
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Function to update URL parameters
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === 'All' || value === '') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const newUrl = search ? `${pathname}?${search}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Get unique categories for filtering
  const categories = Array.from(new Set(allChallenges.map(c => c.category)));

  // Filter and search challenges
  const filteredChallenges = useMemo(() => {
    return allChallenges.filter((challenge: ClientChallenge) => {
      const matchesSearch =
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.skills.some(skill =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'All' || challenge.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === 'All' ||
        challenge.difficulty === selectedDifficulty;
      const matchesPremiumFilter =
        showPremiumOnly === 'All' ||
        (showPremiumOnly === 'Free' &&
          (challenge.tier === 'free' || challenge.tier === 'FREE')) ||
        (showPremiumOnly === 'Premium' &&
          challenge.tier !== 'free' &&
          challenge.tier !== 'FREE');

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesPremiumFilter
      );
    });
  }, [
    allChallenges,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    showPremiumOnly,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--brand] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenges...</p>
        </div>
      </div>
    );
  }

  const ChallengeCard = ({
    challenge,
    index,
  }: {
    challenge: ClientChallenge;
    index: number;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
        whileHover={{
          y: viewMode === 'grid' ? -5 : 0,
          scale: viewMode === 'grid' ? 1.02 : 1,
        }}
        layout
      >
        <Link
          href={`/challenge/${challenge.slug}`}
          className={`group block ${
            viewMode === 'grid'
              ? 'p-6 bg-card border border-border rounded-lg hover:border-[--brand] hover:shadow-lg transition-all duration-200'
              : 'p-4 bg-card border-b border-border hover:bg-secondary transition-colors'
          }`}
        >
          <div
            className={`${viewMode === 'grid' ? 'flex flex-col' : 'flex items-center justify-between'}`}
          >
            <div className={viewMode === 'grid' ? 'mb-4' : 'flex-1'}>
              <div className="flex items-start justify-between mb-3">
                <h3
                  className={`font-semibold text-card-foreground group-hover:text-[--brand] transition-colors ${
                    viewMode === 'grid' ? 'text-xl' : 'text-lg'
                  }`}
                >
                  {challenge.title}
                </h3>
                <div
                  className={`flex ${
                    viewMode === 'grid'
                      ? 'flex-col gap-1 items-end'
                      : 'flex-row gap-2 items-center ml-4'
                  }`}
                >
                  <DifficultyTag
                    difficulty={challenge.difficulty}
                    size="sm"
                    animated={false}
                  />
                  <PremiumBadge tier={challenge.tier} size="sm" />
                </div>
              </div>

              <p
                className={`text-muted-foreground mb-4 ${viewMode === 'list' ? 'line-clamp-2' : ''}`}
              >
                {challenge.summary}
              </p>

              <div
                className={`flex ${viewMode === 'grid' ? 'flex-col gap-3' : 'items-center gap-6'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {challenge.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Code className="h-4 w-4" />
                    {challenge.category}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {challenge.skills
                    .slice(0, viewMode === 'grid' ? 4 : 3)
                    .map((skill: string, skillIndex: number) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  {challenge.skills.length > (viewMode === 'grid' ? 4 : 3) && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                      +{challenge.skills.length - (viewMode === 'grid' ? 4 : 3)}{' '}
                      more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`${viewMode === 'grid' ? 'mt-4 pt-4 border-t border-border' : ''} flex items-center justify-between`}
            >
              <span className="text-sm text-muted-foreground">
                {viewMode === 'grid' ? 'Click to start challenge' : ''}
              </span>
              <ArrowRight className="h-4 w-4 text-[--brand] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Generate structured data for the challenges page
  const baseUrl = getBaseUrl();
  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'Challenges', url: `${baseUrl}/challenges` },
  ];

  const structuredData = combineSchemas([
    generateCourseSchema(),
    generateBreadcrumbSchema(breadcrumbs),
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StructuredData data={structuredData} />
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-card-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Coding Challenges
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Build real applications and improve your programming skills with
                our hands-on coding challenges. Each challenge teaches practical
                concepts through building tools you&apos;ll actually use.
              </motion.p>
              <motion.div
                className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.span
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Code className="h-4 w-4" />
                  {allChallenges.length} Challenges
                </motion.span>
                <motion.span
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Tag className="h-4 w-4" />
                  {categories.length} Categories
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                className="flex flex-col md:flex-row gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {/* Search */}
                <motion.div
                  className="flex-1 relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search challenges by title, description, or skills..."
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      updateUrlParams({ search: e.target.value });
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg text-foreground bg-background placeholder-muted-foreground focus:ring-2 focus:ring-[--brand] focus:border-transparent"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {/* Filters */}
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <FilterDropdown
                      value={selectedCategory}
                      onValueChange={value => {
                        setSelectedCategory(value);
                        updateUrlParams({ category: value });
                      }}
                      options={['All', ...categories]}
                      placeholder="All Categories"
                      icon={
                        <Filter className="h-4 w-4 text-muted-foreground" />
                      }
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                  >
                    <FilterDropdown
                      value={selectedDifficulty}
                      onValueChange={value => {
                        setSelectedDifficulty(value);
                        updateUrlParams({ difficulty: value });
                      }}
                      options={difficulties}
                      placeholder="All Difficulties"
                      icon={
                        <Target className="h-4 w-4 text-muted-foreground" />
                      }
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                  >
                    <FilterDropdown
                      value={showPremiumOnly}
                      onValueChange={value => {
                        const newValue = value as 'All' | 'Free' | 'Premium';
                        setShowPremiumOnly(newValue);
                        updateUrlParams({
                          tier:
                            newValue === 'All' ? null : newValue.toLowerCase(),
                        });
                      }}
                      options={['All', 'Free', 'Premium']}
                      placeholder="All Content"
                      icon={<Crown className="h-4 w-4 text-muted-foreground" />}
                    />
                  </motion.div>
                </motion.div>

                {/* View Mode Toggle */}
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <motion.button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[--brand] text-white'
                        : 'bg-background text-muted-foreground hover:bg-secondary border border-input'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Grid className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[--brand] text-white'
                        : 'bg-background text-muted-foreground hover:bg-secondary border border-input'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <List className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Results Count */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <p className="text-muted-foreground">
                  Showing {filteredChallenges.length} of {allChallenges.length}{' '}
                  challenges
                  {searchQuery && (
                    <span className="ml-1">for &quot;{searchQuery}&quot;</span>
                  )}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Challenges Grid/List */}
        <motion.div
          className="max-w-7xl mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <AnimatePresence mode="wait">
            {filteredChallenges.length === 0 ? (
              <motion.div
                key="no-results"
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <div className="max-w-md mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  </motion.div>
                  <motion.h3
                    className="text-lg font-semibold text-foreground mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    No challenges found
                  </motion.h3>
                  <motion.p
                    className="text-muted-foreground mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    Try adjusting your search terms or filters to find what
                    you&apos;re looking for.
                  </motion.p>
                  <motion.button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedDifficulty('All');
                      setShowPremiumOnly('All');
                      updateUrlParams({
                        search: null,
                        category: null,
                        difficulty: null,
                        tier: null,
                      });
                    }}
                    className="text-[--brand] hover:underline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear all filters
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-0'
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {filteredChallenges.map(
                  (challenge: ClientChallenge, index: number) => (
                    <ChallengeCard
                      key={challenge.slug}
                      challenge={challenge}
                      index={index}
                    />
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer bgColor="bg-secondary" />
    </div>
  );
}
