import Link from 'next/link';
import { Braces, Terminal, Layers, Check, Code2 } from 'lucide-react';
import {
  siTypescript,
  siPython,
  siGo,
  siRust,
  siJavascript,
} from 'simple-icons';
import Footer from '@/components/sections/Footer';

const steps = [
  [
    '01',
    'Find your next challenge.',
    'Choose a project that sparks your curiosity. Filter by difficulty, category, or a skill you want to practice.',
  ],
  [
    '02',
    'Build it your way.',
    'Start with a clear brief. Pick your language, open your editor, and turn the requirements into working software.',
  ],
  [
    '03',
    'See another perspective.',
    'Compare with a reference solution when one is available. Understand the trade-offs, then make your version better.',
  ],
];

export default function Home() {
  return (
    <div className="studio-home">
      <section className="site-wrap home-hero">
        <div>
          <p className="eyebrow">
            <span className="status-dot" /> Learn by making something real
          </p>
          <h1>
            Less watching.
            <br />
            More <em>building.</em>
          </h1>
          <p className="hero-lead">
            Get out of the tutorial loop. Build real tools, explore new ideas,
            and become the developer you want to be.
          </p>
          <div className="hero-actions">
            <Link className="studio-button" href="/challenges">
              Find your next challenge
            </Link>
            <Link className="text-link" href="/docs/getting-started">
              How it works
            </Link>
          </div>
          <p className="hero-note">
            Free to explore. No account. Just you and your editor.
          </p>
        </div>
        <div
          className="build-scene"
          aria-label="Illustration of a project brief and a working terminal"
        >
          <div className="brief-window">
            <div className="window-bar">
              <span />
              <span />
              <span />
              <small>your-next-project.md</small>
            </div>
            <div className="brief-content">
              <span className="eyebrow">From idea to implementation</span>
              <h2>
                A tool you’ll
                <br />
                actually use.
              </h2>
              <p>Start small. Understand every piece.</p>
              <ul>
                <li>
                  <Check size={16} /> Read the requirements
                </li>
                <li>
                  <Check size={16} /> Build the first version
                </li>
                <li>
                  <span className="empty-check" /> Make it your own
                </li>
              </ul>
              <div className="brief-tags">
                <span>Your language</span>
                <span>Your pace</span>
              </div>
            </div>
          </div>
          <div className="terminal-window">
            <div className="terminal-heading">
              <Terminal size={16} /> ~/your-next-project
            </div>
            <p>
              <span>$</span> git init
            </p>
            <p className="terminal-muted">A good place to start.</p>
            <p>
              <span>$</span> <span className="cursor-block" />
            </p>
          </div>
          <span className="scene-caption">
            A small project. A real step forward.
          </span>
        </div>
      </section>
      <section
        className="language-strip site-wrap"
        aria-label="Use your favorite language"
      >
        <span>YOUR EDITOR. YOUR STACK.</span>
        <div>
          {[siTypescript, siPython, siGo, siRust, siJavascript].map(icon => (
            <span key={icon.slug}>
              <svg role="img" aria-label={icon.title} viewBox="0 0 24 24">
                <path d={icon.path} />
              </svg>
              {icon.title}
            </span>
          ))}
        </div>
      </section>
      <section className="site-wrap learning-section" id="how-it-works">
        <div className="section-intro">
          <p className="eyebrow">The best way to learn is to build</p>
          <h2>
            A little structure.
            <br />
            <em>A lot of discovery.</em>
          </h2>
          <p>
            No endless playlist. No perfect setup. Just a clear starting point
            and room to figure things out.
          </p>
        </div>
        <div className="learning-steps">
          {steps.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="project-section">
        <div className="site-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Build something that stays with you</p>
              <h2>Practice with a purpose.</h2>
            </div>
            <Link className="text-link" href="/challenges">
              Explore the challenge library
            </Link>
          </div>
          <div className="project-grid">
            {[
              [
                Terminal,
                'Tools for your terminal',
                'Get closer to the command line. Learn how small utilities turn input into something useful.',
              ],
              [
                Layers,
                'Systems from the inside',
                'Understand the pieces behind the interfaces you use, one implementation at a time.',
              ],
              [
                Braces,
                'Ideas for the web',
                'Connect data, behavior, and an interface. Make something you can use and share.',
              ],
            ].map(([Icon, title, description]) => {
              const ProjectIcon = Icon as typeof Code2;
              return (
                <article key={String(title)}>
                  <ProjectIcon size={28} strokeWidth={1.3} />
                  <h3>{String(title)}</h3>
                  <p>{String(description)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="site-wrap home-cta">
        <p className="eyebrow">Your next project is waiting</p>
        <h2>
          You don’t need another tutorial.
          <br />
          <em>You need a place to start.</em>
        </h2>
        <Link className="studio-button" href="/challenges">
          Let’s build something
        </Link>
        <Link className="text-link" href="/docs">
          Read the docs
        </Link>
      </section>
      <Footer />
    </div>
  );
}
