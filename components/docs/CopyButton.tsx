'use client';
import { useState } from 'react';

export default function CopyButton({
  text,
  label = 'Copy',
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState('');
  return (
    <button
      type="button"
      aria-live="polite"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setStatus('Copied');
        } catch {
          setStatus('Copy failed. Select the text to copy.');
        }
      }}
    >
      {status || label}
    </button>
  );
}
