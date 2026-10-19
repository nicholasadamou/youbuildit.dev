'use client';

import { useState } from 'react';
import { Code2, FileText, TestTube } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import MDXComponents from '@/components/mdx/MDXComponents';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from '@/components/docs/CopyButton';

export interface SolutionFile {
  type: 'SOURCE' | 'TEST' | 'FIXTURE' | 'README' | 'CONFIG';
  filename: string;
  content: string;
  relativePath: string;
}
const priority = { README: 0, SOURCE: 1, TEST: 2, CONFIG: 3, FIXTURE: 4 };
const languages: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  py: 'python',
  rb: 'ruby',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin',
  scala: 'scala',
  sh: 'bash',
  bash: 'bash',
  yml: 'yaml',
  yaml: 'yaml',
  json: 'json',
  xml: 'xml',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sql: 'sql',
  md: 'markdown',
};

export default function SolutionFiles({ files }: { files: SolutionFile[] }) {
  const ordered = [...files].sort(
    (a, b) =>
      priority[a.type] - priority[b.type] ||
      a.filename.localeCompare(b.filename)
  );
  const [path, setPath] = useState(ordered[0]?.relativePath);
  const [renderMarkdown, setRenderMarkdown] = useState(true);
  const selected =
    ordered.find(file => file.relativePath === path) ?? ordered[0];
  if (!selected)
    return <p className="solution-empty">No preview files are available.</p>;
  return (
    <div className="solution-browser">
      <nav className="solution-file-list" aria-label="Solution files">
        <h4>
          Files <span>{files.length}</span>
        </h4>
        <div>
          {ordered.map(file => {
            const Icon =
              file.type === 'SOURCE'
                ? Code2
                : file.type === 'TEST'
                  ? TestTube
                  : FileText;
            return (
              <button
                key={file.relativePath}
                aria-pressed={selected.relativePath === file.relativePath}
                onClick={() => {
                  setPath(file.relativePath);
                  setRenderMarkdown(true);
                }}
              >
                <Icon size={17} />
                <span>
                  <strong>{file.filename}</strong>
                  {file.relativePath !== file.filename && (
                    <small>
                      {file.relativePath.slice(
                        0,
                        file.relativePath.lastIndexOf('/')
                      )}
                      <br />
                    </small>
                  )}
                  <small>{file.type.toLowerCase()}</small>
                </span>
                <small>{file.content.split('\n').length} lines</small>
              </button>
            );
          })}
        </div>
      </nav>
      <div className="solution-viewer">
        <header>
          <span className="solution-file-path" title={selected.relativePath}>
            <Code2 size={16} />
            {selected.relativePath}
          </span>
          <div className="solution-file-actions">
            {selected.type === 'README' && (
              <div role="group" aria-label="README display">
                {['Preview', 'Code'].map((label, index) => (
                  <button
                    key={label}
                    aria-pressed={renderMarkdown === (index === 0)}
                    onClick={() => setRenderMarkdown(index === 0)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <CopyButton
              key={selected.relativePath}
              text={selected.content}
              label="Copy file"
            />
          </div>
        </header>
        <div
          className={`solution-file-content ${selected.type === 'README' && renderMarkdown ? 'is-markdown' : ''}`}
          tabIndex={0}
          aria-label={`${selected.filename} content`}
        >
          {selected.type === 'README' && renderMarkdown ? (
            <ReactMarkdown components={MDXComponents}>
              {selected.content}
            </ReactMarkdown>
          ) : (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={
                languages[
                  selected.filename.split('.').pop()?.toLowerCase() ?? ''
                ] ?? 'text'
              }
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '13px',
                lineHeight: '1.7',
                minHeight: '100%',
              }}
              showLineNumbers
            >
              {selected.content}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </div>
  );
}
