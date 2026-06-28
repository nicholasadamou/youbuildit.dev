import { siGithub } from 'simple-icons';

interface GithubIconProps {
  className?: string;
}

// lucide-react 1.x removed brand icons, so the GitHub mark is rendered from
// simple-icons (already a dependency) instead.
export default function GithubIcon({ className }: GithubIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={siGithub.path} />
    </svg>
  );
}
