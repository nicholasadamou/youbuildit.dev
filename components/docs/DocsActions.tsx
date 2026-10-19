'use client';
import { ArrowUp, Copy, MessageSquare, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import GithubIcon from '@/components/icons/GithubIcon';
import CopyButton from './CopyButton';

export default function DocsActions({
  slug,
  markdown,
}: {
  slug: string;
  markdown: string;
}) {
  const url = `https://youbuildit.dev/docs${slug === 'README' ? '' : `/${slug}`}`;
  const prompt = encodeURIComponent(
    `Help me use You Build It based on this documentation: ${url}`
  );
  return (
    <div className="doc-actions">
      <a
        href={`https://github.com/youbuildit/youbuildit.dev/edit/main/docs/${slug}.md`}
      >
        <GithubIcon className="h-[19px] w-[19px]" />
        Edit on GitHub
      </a>
      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'instant'
              : 'smooth',
          })
        }
      >
        <ArrowUp size={18} />
        Scroll to top
      </button>
      <div className="doc-copy">
        <Copy size={18} />
        <CopyButton text={markdown} label="Copy as Markdown" />
      </div>
      <details>
        <summary>
          <MessageSquare size={18} />
          Open in chat
          <ChevronDown size={12} />
        </summary>
        <div className="chat-providers">
          {[
            ['ChatGPT', 'chatgpt', 'https://chatgpt.com/?prompt='],
            ['Claude', 'claude', 'https://claude.ai/new?q='],
            ['v0', 'v0', 'https://v0.app/?q='],
            ['T3 Chat', 't3', 'https://t3.chat/new?q='],
            ['Scira', 'scira', 'https://scira.ai/?q='],
            ['Cursor', 'cursor', 'https://cursor.com/link/prompt?text='],
          ].map(([name, icon, href]) => (
            <a
              key={name}
              href={`${href}${prompt}`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={`/brands/chat/${icon}.svg`}
                width={19}
                height={19}
                alt=""
              />
              {name}
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}
