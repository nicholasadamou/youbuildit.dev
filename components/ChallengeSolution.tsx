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
    if (solutionData?.files) {
      const readmeFile = solutionData.files.find(f => f.type === 'README');
      if (readmeFile && !selectedFile) {
        setSelectedFile(readmeFile);
        setShowMarkdownPreview(true);
      }
    }
  }, [solutionData, selectedFile]);

  // Reset markdown preview state when switching files
  useEffect(() => {
    if (selectedFile?.type === 'README') {
      setShowMarkdownPreview(true);
    }
  }, [selectedFile]);

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

  const getFileTypeColor = () => {
    // Use the same styling as skill tags in ChallengeCard
    return 'bg-secondary text-secondary-foreground';
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
      className={`mt-8 relative overflow-hidden rounded-lg border border-border transition-all duration-200 ${
        hasAccess ? 'p-6 bg-card' : 'bg-card'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Solution Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <Code2 className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                Complete Solution
              </h3>
              <p className="text-sm text-muted-foreground">
                {solutionData.language} implementation with tests
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-sm font-medium text-emerald-400 bg-transparent border border-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              {showPreview ? 'Hide' : 'Preview'}
            </motion.button>
            <motion.button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Download
            </motion.button>
          </div>
        </div>

        {/* Solution Stats */}
        {metadata && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-white">
                {metadata.linesOfCode}
              </div>
              <div className="text-xs text-gray-400 mt-1">Lines of Code</div>
            </div>
            <div className="text-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-white">
                {sourceFiles.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Source Files</div>
            </div>
            <div className="text-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-white">
                {testFiles.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Test Files</div>
            </div>
            <div className="text-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white">
                {metadata.testCoverage}%
                <Gauge className="h-5 w-5" />
              </div>
              <div className="text-xs text-gray-400 mt-1">Est. Coverage</div>
            </div>
          </div>
        )}

        {/* Key Features */}
        {metadata?.keyFeatures && metadata.keyFeatures.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Key Features Implemented
            </h4>
            <div className="flex flex-wrap gap-2">
              {metadata.keyFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-sm"
                >
                  {feature}
                </span>
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
            className="border-t border-border/50 pt-6"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* File List */}
              <div className="lg:w-1/3">
                <h4 className="text-sm font-medium text-gray-100 mb-3 font-semibold">
                  Solution Files ({files.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedFile?.relativePath === file.relativePath
                          ? 'border-emerald-400 bg-emerald-900/20'
                          : 'border-border hover:border-border/80 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {getFileIcon(file.type)}
                        <span className="text-sm font-medium truncate text-gray-100">
                          {file.filename}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-2 py-1 rounded ${getFileTypeColor()}`}
                        >
                          {file.type.toLowerCase()}
                        </span>
                        <span className="text-xs text-gray-300">
                          {file.content.split('\n').length} lines
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Content */}
              <div className="lg:w-2/3">
                {selectedFile ? (
                  <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-100">
                        {selectedFile.relativePath}
                      </span>
                      <div className="flex items-center gap-2">
                        {selectedFile.type === 'README' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setShowMarkdownPreview(false)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                !showMarkdownPreview
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                              title="Show raw markdown"
                            >
                              <FileCode className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setShowMarkdownPreview(true)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                showMarkdownPreview
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                              title="Show preview"
                            >
                              <BookOpen className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded ${getFileTypeColor()}`}
                        >
                          {selectedFile.type.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    {selectedFile.type === 'README' && showMarkdownPreview ? (
                      <div className="p-6 text-sm max-h-96 overflow-y-auto bg-card">
                        <ReactMarkdown components={MDXComponents}>
                          {selectedFile.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <pre className="p-4 text-sm overflow-x-auto max-h-96 overflow-y-auto bg-gray-900">
                        <code className="text-gray-200">
                          {selectedFile.content}
                        </code>
                      </pre>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-secondary/30 rounded-lg border-2 border-dashed border-border">
                    <div className="text-center">
                      <Code2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Select a file to preview its contents
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
            <div className="mt-6 pt-4 border-t border-border/50">
              <h4 className="text-sm font-medium text-card-foreground mb-2">
                Implementation Details
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {metadata.implementationNotes.map((note, index) => (
                  <li key={index}>• {note}</li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </motion.div>
  );
}
