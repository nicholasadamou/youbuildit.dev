import type { SVGProps } from 'react';
import { siGithub } from 'simple-icons';

// lucide-react 1.x removed brand icons, so the GitHub mark is rendered from
// simple-icons (already a dependency) instead. Decorative by default
// (aria-hidden) since it sits next to a text label; callers can override.
export default function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={siGithub.path} />
    </svg>
  );
}
