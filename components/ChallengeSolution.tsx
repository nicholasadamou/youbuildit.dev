'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Code2,
  FileText,
  TestTube,
  Gauge,
  CheckCircle,
  Eye,
  Loader2,
  AlertCircle,
  BookOpen,
  FileCode,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import MDXComponents from '@/components/mdx/MDXComponents';
import { useSubscription } from '@/hooks/useSubscription';
import { hasAccessToChallenge } from '@/lib/subscription';

interface SolutionFile {
  type: 'SOURCE' | 'TEST' | 'FIXTURE' | 'README' | 'CONFIG';
  filename: string;
  content: string;
  relativePath: string;
}

interface SolutionMetadata {
  linesOfCode: number;
  testCoverage: number;
  keyFeatures: string[];
  implementationNotes: string[];
}

interface SolutionData {
  language: string;
  files: SolutionFile[];
  metadata: SolutionMetadata | null;
}

interface ChallengeSolutionProps {
  challengeSlug: string;
  challengeTier: string;
  hasSolutionAvailable?: boolean;
  challenge?: { tier: string }; // Minimal challenge object for access check
  hasAccess?: boolean; // External access state from parent
}

export default function ChallengeSolution({
  challengeSlug,
  challengeTier,
  hasSolutionAvailable = false,
  hasAccess: externalHasAccess,
}: ChallengeSolutionProps) {
  const { subscription } = useSubscription();
  const [solutionData, setSolutionData] = useState<SolutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<SolutionFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(true); // Default to preview for README

  // Check if user has access - use external access state if provided, otherwise compute internally
  const hasAccess =
    externalHasAccess !== undefined
      ? externalHasAccess
      : subscription
        ? hasAccessToChallenge(
            {
              subscriptionTier: subscription.tier,
              subscriptionStatus: subscription.status,
              stripeCurrentPeriodEnd: subscription.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd)
                : null,
            },
            { tier: challengeTier } as never // Minimal challenge object - hasAccessToChallenge normalizes tier internally
          )
        : challengeTier.toUpperCase() !== 'PRO';

  // Auto-select README when solution data is loaded
  useEffect(() => {
    if (solutionData?.files && !selectedFile) {
      const readmeFile = solutionData.files.find(f => f.type === 'README');
      if (readmeFile) {
        console.log('Auto-selecting README file:', readmeFile.filename);
        setSelectedFile(readmeFile);
        setShowMarkdownPreview(true);
      }
    }
  }, [solutionData, selectedFile]); // Include selectedFile to fix React Hook warning

  // Reset markdown preview state when switching to README files
  useEffect(() => {
    if (selectedFile?.type === 'README') {
      console.log('Switching to README, enabling preview mode');
      setShowMarkdownPreview(true);
    }
  }, [selectedFile?.type, selectedFile?.relativePath]); // Include type to fix React Hook warning

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await fetch(
          `/api/challenges/${challengeSlug}/solution`
        );

        if (!response.ok) {
          if (response.status === 404) {
            const errorData = await response.json().catch(() => ({}));
            // Check if it's "User not found" error (treat as unauthenticated)
            if (errorData.error === 'User not found') {
              // User exists in Clerk but not in database - treat as unauthenticated
              setSolutionData({
                language: 'python',
                files: [
                  {
                    type: 'SOURCE',
                    filename: 'main.py',
                    content:
                      '# Complete Python implementation\n# with error handling, CLI interface,\n# and comprehensive test coverage\n\nimport argparse\nimport sys\n\n# ... implementation details ...\n\nif __name__ == "__main__":\n    main()',
                    relativePath: 'src/main.py',
                  },
                  {
                    type: 'TEST',
                    filename: 'test_main.py',
                    content:
                      '# Comprehensive test suite\n# covering edge cases and functionality\n\nimport pytest\n\n# ... test implementation ...\n\ndef test_basic_functionality():\n    # Test implementation\n    pass',
                    relativePath: 'tests/test_main.py',
                  },
                  {
                    type: 'README',
                    filename: 'README.md',
                    content:
                      '# Challenge Solution\n\nComplete implementation with:\n- Error handling\n- CLI interface\n- Test coverage\n- Documentation\n\n## Setup\n\n```bash\npip install -r requirements.txt\n```\n\n## Usage\n\n```bash\npython src/main.py [options]\n```',
                    relativePath: 'README.md',
                  },
                ],
                metadata: {
                  linesOfCode: 150,
                  testCoverage: 95,
                  keyFeatures: [
                    'CLI Interface',
                    'Error Handling',
                    'Unicode Support',
                    'Comprehensive Tests',
                  ],
                  implementationNotes: [
                    'Professional Python implementation',
                    'Follows best practices',
                    'Production-ready code',
                  ],
                },
              });
              setError(null);
            } else {
              // Actually no solution available
              setSolutionData(null);
              setError(null);
            }
          } else if (response.status === 401 && !hasAccess) {
            // User doesn't have access - create mock data for preview
            setSolutionData({
              language: 'python',
              files: [
                {
                  type: 'SOURCE',
                  filename: 'main.py',
                  content:
                    '# Complete Python implementation\n# with error handling, CLI interface,\n# and comprehensive test coverage\n\nimport argparse\nimport sys\n\n# ... implementation details ...\n\nif __name__ == "__main__":\n    main()',
                  relativePath: 'src/main.py',
                },
                {
                  type: 'TEST',
                  filename: 'test_main.py',
                  content:
                    '# Comprehensive test suite\n# covering edge cases and functionality\n\nimport pytest\n\n# ... test implementation ...\n\ndef test_basic_functionality():\n    # Test implementation\n    pass',
                  relativePath: 'tests/test_main.py',
                },
                {
                  type: 'README',
                  filename: 'README.md',
                  content:
                    '# Challenge Solution\n\nComplete implementation with:\n- Error handling\n- CLI interface\n- Test coverage\n- Documentation\n\n## Setup\n\n```bash\npip install -r requirements.txt\n```\n\n## Usage\n\n```bash\npython src/main.py [options]\n```',
                  relativePath: 'README.md',
                },
              ],
              metadata: {
                linesOfCode: 150,
                testCoverage: 95,
                keyFeatures: [
                  'CLI Interface',
                  'Error Handling',
                  'Unicode Support',
                  'Comprehensive Tests',
                ],
                implementationNotes: [
                  'Professional Python implementation',
                  'Follows best practices',
                  'Production-ready code',
                ],
              },
            });
            setError(null);
          } else {
            throw new Error(`Failed to fetch solution: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setSolutionData(data);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setSolutionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [challengeSlug, hasAccess]);

  // Don't show component if no solution is available
  if (!hasSolutionAvailable) {
    return null;
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `/api/challenges/${challengeSlug}/solution/download`
      );
      if (!response.ok) {
        throw new Error('Failed to download solution');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${challengeSlug}-solution.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'SOURCE':
        return <Code2 className="h-4 w-4" />;
      case 'TEST':
        return <TestTube className="h-4 w-4" />;
      case 'README':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Always show the component, but with different behavior based on access

  if (loading) {
    return (
      <motion.div
        className="mt-8 p-6 bg-card rounded-lg border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Loading solution...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="mt-8 p-6 bg-card rounded-lg border border-destructive/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center text-destructive mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">Error Loading Solution</h3>
        </div>
        <p className="text-sm text-muted-foreground">{error}</p>
      </motion.div>
    );
  }

  if (!solutionData) {
    // Show placeholder content for blurring when no solution data but solution should be available
    if (hasSolutionAvailable) {
      return (
        <motion.div
          className="mt-8 relative overflow-hidden rounded-lg border border-border bg-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <Code2 className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Complete Solution
                </h3>
                <p className="text-sm text-muted-foreground">
                  Professional implementation with tests and documentation
                </p>
              </div>
            </div>
            <div className="py-12 text-center text-muted-foreground">
              <p>Solution content will be available here</p>
            </div>
          </div>
        </motion.div>
      );
    }
    return null; // No solution available at all
  }

  const { files, metadata } = solutionData;
  const sourceFiles = files.filter(f => f.type === 'SOURCE');
  const testFiles = files.filter(f => f.type === 'TEST');

  return (
    <motion.div
      className="mt-8 relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary/40 via-secondary/30 to-secondary/20 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[--brand]/5 via-transparent to-blue-500/5 pointer-events-none" />
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-xl shadow-inner opacity-20" />

      {/* Solution Content */}
      <div className="relative p-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[--brand]/20 rounded-xl blur-md" />
              <div className="relative p-3 bg-gradient-to-br from-[--brand]/10 to-[--brand]/20 rounded-xl">
                <Code2 className="h-6 w-6 text-[--brand]" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                Complete Solution
                <div className="px-2 py-1 bg-[--brand]/10 rounded-md">
                  <span className="text-xs font-medium text-[--brand] uppercase tracking-wide">
                    {solutionData.language}
                  </span>
                </div>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Professional implementation with comprehensive tests and
                documentation
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 shrink-0">
            <motion.button
              onClick={() => setShowPreview(!showPreview)}
              className="group relative px-4 py-2 text-sm font-medium bg-secondary/80 hover:bg-secondary rounded-lg transition-all duration-200 overflow-hidden shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[--brand]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground group-hover:text-[--brand] transition-colors" />
                <span className="text-muted-foreground group-hover:text-card-foreground transition-colors">
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </span>
              </div>
            </motion.button>

            <motion.button
              onClick={handleDownload}
              className="group relative px-4 py-2 text-sm font-medium bg-[--brand] hover:bg-[--brand-dark] text-white rounded-lg transition-all duration-200 overflow-hidden shadow-lg hover:shadow-[--brand]/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                <span>Download</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Solution Stats */}
        {metadata && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              className="group relative p-5 bg-secondary/40 hover:bg-secondary/60 rounded-xl transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[--brand]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center">
                <div className="text-2xl font-bold text-card-foreground mb-1 flex items-center justify-center gap-2">
                  <Code2 className="h-5 w-5 text-[--brand] opacity-70" />
                  {metadata.linesOfCode}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Lines of Code
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative p-5 bg-secondary/40 hover:bg-secondary/60 rounded-xl transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[--brand]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center">
                <div className="text-2xl font-bold text-card-foreground mb-1 flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-[--brand] opacity-70" />
                  {sourceFiles.length}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Source Files
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative p-5 bg-secondary/40 hover:bg-secondary/60 rounded-xl transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[--brand]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center">
                <div className="text-2xl font-bold text-card-foreground mb-1 flex items-center justify-center gap-2">
                  <TestTube className="h-5 w-5 text-[--brand] opacity-70" />
                  {testFiles.length}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Test Files
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative p-5 bg-secondary/40 hover:bg-secondary/60 rounded-xl transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[--brand]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center">
                <div className="text-2xl font-bold text-card-foreground mb-1 flex items-center justify-center gap-2">
                  {metadata.testCoverage}%
                  <Gauge className="h-5 w-5 text-[--brand] opacity-70" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Test Coverage
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Key Features */}
        {metadata?.keyFeatures && metadata.keyFeatures.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[--brand]/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-[--brand]" />
              </div>
              <h4 className="text-base font-semibold text-card-foreground">
                Key Features Implemented
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {metadata.keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative p-3 bg-gradient-to-br from-[--brand]/5 to-[--brand]/10 rounded-lg transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[--brand]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[--brand] rounded-full" />
                    <span className="text-xs font-medium text-card-foreground">
                      {feature}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* File Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-secondary/30 pt-6"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* File List */}
              <div className="lg:w-1/3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[--brand]/10 rounded-lg">
                    <FileText className="h-4 w-4 text-[--brand]" />
                  </div>
                  <h4 className="text-base font-semibold text-card-foreground">
                    Solution Files ({files.length})
                  </h4>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {files
                    .sort((a, b) => {
                      // README files first
                      if (a.type === 'README' && b.type !== 'README') return -1;
                      if (b.type === 'README' && a.type !== 'README') return 1;
                      // Then SOURCE files
                      if (
                        a.type === 'SOURCE' &&
                        b.type !== 'SOURCE' &&
                        b.type !== 'README'
                      )
                        return -1;
                      if (
                        b.type === 'SOURCE' &&
                        a.type !== 'SOURCE' &&
                        a.type !== 'README'
                      )
                        return 1;
                      // Then TEST files
                      if (
                        a.type === 'TEST' &&
                        b.type !== 'TEST' &&
                        b.type !== 'README' &&
                        b.type !== 'SOURCE'
                      )
                        return -1;
                      if (
                        b.type === 'TEST' &&
                        a.type !== 'TEST' &&
                        a.type !== 'README' &&
                        a.type !== 'SOURCE'
                      )
                        return 1;
                      // Finally alphabetical by filename
                      return a.filename.localeCompare(b.filename);
                    })
                    .map((file, index) => (
                      <button
                        key={`file-${index}-${file.relativePath}`}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Selecting file:', file.filename);
                          setSelectedFile(file);
                        }}
                        className={`group w-full p-4 text-left rounded-xl transition-all duration-200 ${
                          selectedFile?.relativePath === file.relativePath
                            ? 'bg-secondary/40 shadow-md'
                            : 'hover:bg-secondary/40 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="relative">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`p-1.5 rounded-lg ${
                                selectedFile?.relativePath === file.relativePath
                                  ? 'bg-[--brand]/20'
                                  : 'bg-secondary/50 group-hover:bg-[--brand]/10'
                              }`}
                            >
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium truncate text-card-foreground block">
                                {file.filename}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {file.relativePath}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-2 py-1 rounded-md ${
                                selectedFile?.relativePath === file.relativePath
                                  ? 'bg-[--brand]/10 text-[--brand]'
                                  : 'bg-secondary/50 text-muted-foreground'
                              }`}
                            >
                              {file.type.toLowerCase()}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {file.content.split('\n').length} lines
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* File Content */}
              <div className="lg:w-2/3">
                {selectedFile ? (
                  <div className="bg-secondary/20 rounded-xl overflow-hidden shadow-lg">
                    {/* File Header */}
                    <div className="px-6 py-4 bg-secondary/40 border-b border-secondary/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-[--brand]/10 rounded-lg">
                          {getFileIcon(selectedFile.type)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-card-foreground block">
                            {selectedFile.filename}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {selectedFile.relativePath}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {selectedFile.type === 'README' && (
                          <div className="flex items-center bg-secondary/60 rounded-lg p-1">
                            <button
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(
                                  'Code button clicked, setting showMarkdownPreview to false'
                                );
                                setShowMarkdownPreview(false);
                              }}
                              className={`group px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                                !showMarkdownPreview
                                  ? 'bg-[--brand] text-white shadow-sm'
                                  : 'text-muted-foreground hover:text-card-foreground hover:bg-secondary/50'
                              }`}
                              title="Show raw markdown"
                            >
                              <FileCode className="h-3 w-3" />
                              <span>Code</span>
                            </button>
                            <button
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(
                                  'Preview button clicked, setting showMarkdownPreview to true'
                                );
                                setShowMarkdownPreview(true);
                              }}
                              className={`group px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                                showMarkdownPreview
                                  ? 'bg-[--brand] text-white shadow-sm'
                                  : 'text-muted-foreground hover:text-card-foreground hover:bg-secondary/50'
                              }`}
                              title="Show preview"
                            >
                              <BookOpen className="h-3 w-3" />
                              <span>Preview</span>
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-[--brand]/10 rounded-md text-[--brand] font-medium">
                            {selectedFile.type.toLowerCase()}
                          </span>
                          <span className="font-mono">
                            {selectedFile.content.split('\n').length} lines
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* File Content */}
                    {(() => {
                      console.log('Rendering content:', {
                        fileType: selectedFile.type,
                        showMarkdownPreview,
                        shouldShowPreview:
                          selectedFile.type === 'README' && showMarkdownPreview,
                      });
                      return (
                        selectedFile.type === 'README' && showMarkdownPreview
                      );
                    })() ? (
                      <div className="p-6 text-sm max-h-96 overflow-y-auto bg-card/50">
                        <ReactMarkdown components={MDXComponents}>
                          {selectedFile.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="relative">
                        <pre className="p-6 text-sm overflow-x-auto max-h-96 overflow-y-auto bg-secondary/10 text-card-foreground font-mono leading-relaxed">
                          <code className="whitespace-pre-wrap">
                            {selectedFile.content}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-80 bg-secondary/20 rounded-xl border-2 border-dashed border-secondary/40">
                    <div className="text-center">
                      <div className="p-4 bg-[--brand]/5 rounded-xl w-fit mx-auto mb-4">
                        <Code2 className="h-8 w-8 text-[--brand] mx-auto" />
                      </div>
                      <h3 className="text-base font-medium text-card-foreground mb-2">
                        Select a File
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a file from the list to preview its contents
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Implementation Notes */}
        {metadata?.implementationNotes &&
          metadata.implementationNotes.length > 0 && (
            <div className="mt-8 pt-6 border-t border-secondary/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                </div>
                <h4 className="text-base font-semibold text-card-foreground">
                  Implementation Details
                </h4>
              </div>
              <div className="bg-secondary/20 rounded-xl p-5 shadow-inner">
                <ul className="space-y-3">
                  {metadata.implementationNotes.map((note, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-sm text-card-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                      <span>{note}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          )}
      </div>
    </motion.div>
  );
}
