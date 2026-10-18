import Link from 'next/link';
import Brand from '@/components/Brand';
import GithubIcon from '@/components/icons/GithubIcon';

const repository = 'https://github.com/youbuildit/youbuildit.dev';
const groups = [
  [
    'The challenges',
    [
      ['All challenges', '/challenges'],
      ['Getting started', '/docs/getting-started'],
      ['Solutions', '/docs/solutions'],
    ],
  ],
  [
    'Resources',
    [
      ['Documentation', '/docs'],
      ['Run locally', '/docs/local-development'],
      ['API reference', '/docs/api'],
      ['Architecture', '/docs/architecture'],
      ['Contributing', '/docs/contributing'],
    ],
  ],
  [
    'In the open',
    [
      ['GitHub repository', repository],
      ['Feedback & issues', `${repository}/issues`],
      ['Terms of use', '/terms'],
      ['License', `${repository}/blob/main/LICENSE`],
    ],
  ],
] as const;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              A little challenge.
              <br />A lot of possibility.
            </p>
            <span>Practical projects for curious builders.</span>
          </div>
          {groups.map(([title, links]) => (
            <nav key={title} aria-label={`Footer ${title}`}>
              <h2>{title}</h2>
              {links.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label === 'GitHub repository' && (
                    <GithubIcon className="inline h-3 w-3 mr-2" />
                  )}
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} You Build It</span>
          <a href={`${repository}/blob/main/LICENSE`}>
            PolyForm Shield license
          </a>
          <span className="footer-note">Built for the way you learn.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
