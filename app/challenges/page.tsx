'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { ClientChallenge } from '@/types/challenge';
import Footer from '@/components/sections/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  Code,
  Tag,
  Filter,
  ArrowRight,
  Grid,
  List,
} from 'lucide-react';

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Advanced: 'bg-red-100 text-red-800 border-red-200',
};

const isDifficulty = (
  difficulty: string
): difficulty is keyof typeof difficultyColors => {
  return difficulty in difficultyColors;
};

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ChallengesPage() {
  const [allChallenges, setAllChallenges] = useState<ClientChallenge[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [allChallenges, searchQuery, selectedCategory, selectedDifficulty]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--brand] mx-auto mb-4" />
          <p className="text-gray-600">Loading challenges...</p>
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
              ? 'p-6 bg-white border border-gray-200 rounded-lg hover:border-[--brand] hover:shadow-lg transition-all duration-200'
              : 'p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors'
          }`}
        >
          <div
            className={`${viewMode === 'grid' ? 'flex flex-col' : 'flex items-center justify-between'}`}
          >
            <div className={viewMode === 'grid' ? 'mb-4' : 'flex-1'}>
              <div className="flex items-start justify-between mb-3">
                <h3
                  className={`font-semibold text-gray-900 group-hover:text-[--brand] transition-colors ${
                    viewMode === 'grid' ? 'text-xl' : 'text-lg'
                  }`}
                >
                  {challenge.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    isDifficulty(challenge.difficulty)
                      ? difficultyColors[challenge.difficulty]
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } ${viewMode === 'list' ? 'ml-4' : ''}`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <p
                className={`text-gray-600 mb-4 ${viewMode === 'list' ? 'line-clamp-2' : ''}`}
              >
                {challenge.summary}
              </p>

              <div
                className={`flex ${viewMode === 'grid' ? 'flex-col gap-3' : 'items-center gap-6'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {challenge.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
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
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  {challenge.skills.length > (viewMode === 'grid' ? 4 : 3) && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-500">
                      +{challenge.skills.length - (viewMode === 'grid' ? 4 : 3)}{' '}
                      more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`${viewMode === 'grid' ? 'mt-4 pt-4 border-t border-gray-100' : ''} flex items-center justify-between`}
            >
              <span className="text-sm text-gray-500">
                {viewMode === 'grid' ? 'Click to start challenge' : ''}
              </span>
              <ArrowRight className="h-4 w-4 text-[--brand] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Coding Challenges
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Build real applications and improve your programming skills with
                our hands-on coding challenges. Each challenge teaches practical
                concepts through building tools you&apos;ll actually use.
              </motion.p>
              <motion.div
                className="flex items-center justify-center gap-4 text-sm text-gray-500"
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search challenges by title, description, or skills..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white placeholder-gray-400 focus:ring-2 focus:ring-[--brand] focus:border-transparent"
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
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      id="category-filter"
                      name="category"
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[--brand] focus:border-transparent"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.select
                    id="difficulty-filter"
                    name="difficulty"
                    value={selectedDifficulty}
                    onChange={e => setSelectedDifficulty(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[--brand] focus:border-transparent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </motion.select>
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
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
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
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
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
                <p className="text-gray-600">
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
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  </motion.div>
                  <motion.h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    No challenges found
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 mb-4"
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
      <Footer bgColor="bg-white" />
    </div>
  );
}
