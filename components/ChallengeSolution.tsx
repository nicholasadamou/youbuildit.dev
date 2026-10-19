'use client';

import { useEffect, useId, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  Code2,
  Download,
  Loader2,
} from 'lucide-react';
import SolutionFiles, {
  type SolutionFile,
} from '@/components/solution/SolutionFiles';
import '@/styles/solution.css';

interface SolutionData {
  language: string;
  files: SolutionFile[];
  metadata: {
    linesOfCode: number;
    testCoverage: number;
    keyFeatures: string[];
    implementationNotes: string[];
  } | null;
}

export default function ChallengeSolution({
  challengeSlug,
  hasSolutionAvailable = false,
}: {
  challengeSlug: string;
  hasSolutionAvailable?: boolean;
}) {
  const [data, setData] = useState<SolutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const id = useId();
  useEffect(() => {
    if (!hasSolutionAvailable) return;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setData(null);
    setOpen(false);
    setDownloadError('');
    async function load() {
      try {
        const response = await fetch(
          `/api/challenges/${challengeSlug}/solution`,
          { signal: controller.signal }
        );
        if (response.status === 404) return;
        if (!response.ok)
          throw new Error(
            'The solution could not be loaded. Please try again.'
          );
        setData(await response.json());
      } catch (error) {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : 'The solution could not be loaded.'
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [challengeSlug, hasSolutionAvailable, attempt]);

  async function download() {
    setDownloading(true);
    setDownloadError('');
    try {
      const response = await fetch(
        `/api/challenges/${challengeSlug}/solution/download`
      );
      if (!response.ok) throw new Error('Download failed. Please try again.');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = `${challengeSlug}-solution.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : 'Download failed. Please try again.'
      );
    } finally {
      setDownloading(false);
    }
  }
  if (!hasSolutionAvailable) return null;
  if (loading)
    return (
      <div className="solution-panel solution-empty" role="status">
        <Loader2 size={18} className="animate-spin" />
        Loading reference solution…
      </div>
    );
  if (error)
    return (
      <div className="solution-panel solution-empty">
        <p role="alert">{error}</p>
        <button className="text-link" onClick={() => setAttempt(attempt + 1)}>
          Try again
        </button>
      </div>
    );
  if (!data)
    return (
      <div className="solution-panel solution-empty">
        The reference solution is not available yet.
      </div>
    );
  const { files, metadata } = data;
  const stats = [
    ['Source files', files.filter(file => file.type === 'SOURCE').length],
    ['Test files', files.filter(file => file.type === 'TEST').length],
    ...(metadata
      ? [
          ['Lines of code', metadata.linesOfCode],
          ['Reported coverage', `${metadata.testCoverage}%`],
        ]
      : []),
  ];
  return (
    <section className="solution-panel" aria-labelledby={`${id}-title`}>
      <header className="solution-heading">
        <div>
          <p className="solution-eyebrow">
            <Code2 size={16} />
            Study the implementation<span>{data.language}</span>
          </p>
          <h3 id={`${id}-title`}>Reference solution</h3>
          <p>
            Compare approaches, explore the files, and run the tests in your own
            environment.
          </p>
        </div>
        <div className="solution-actions">
          <button
            aria-expanded={open}
            aria-controls={`${id}-files`}
            onClick={() => setOpen(!open)}
          >
            <BookOpen size={17} />
            {open ? 'Hide files' : 'Browse files'}
            <ChevronDown size={15} className={open ? 'is-open' : ''} />
          </button>
          <button
            className="solution-download"
            disabled={downloading}
            onClick={() => void download()}
          >
            {downloading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Download size={17} />
            )}
            {downloading ? 'Preparing ZIP…' : 'Download ZIP'}
          </button>
        </div>
      </header>
      {downloadError && (
        <p className="solution-download-error" role="alert">
          {downloadError}
        </p>
      )}
      <dl className="solution-stats">
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {!!metadata?.keyFeatures.length && (
        <div className="solution-features">
          <h4>What’s included</h4>
          <ul>
            {metadata.keyFeatures.map(feature => (
              <li key={feature}>
                <Check size={14} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div id={`${id}-files`} hidden={!open}>
        <SolutionFiles key={challengeSlug} files={files} />
      </div>
      {metadata && (
        <details className="solution-notes">
          <summary>
            Implementation notes
            <ChevronDown size={16} />
          </summary>
          <p>
            Coverage is supplied or estimated metadata. Run the included tests
            to verify behavior.
          </p>
          {!!metadata.implementationNotes.length && (
            <ul>
              {metadata.implementationNotes.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </details>
      )}
    </section>
  );
}
