import Link from 'next/link';
import {
  Braces,
  Terminal,
  Layers,
  Code2,
  Sprout,
  Network,
  Cpu,
  Compass,
  Clock,
  BookOpen,
} from 'lucide-react';
import { steps } from '@/lib/home-content';
import {
  siTypescript,
  siPython,
  siGo,
  siRust,
  siJavascript,
  siRedis,
  siJson,
} from 'simple-icons';
import Footer from '@/components/sections/Footer';
import BuildScene from '@/components/sections/BuildScene';

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
              <Compass size={17} aria-hidden="true" /> Find your next challenge
            </Link>
            <Link className="text-link" href="#choose-challenge">
              Help me choose
            </Link>
          </div>
          <p className="hero-note">
            Free to explore. No account. Just you and your editor.
          </p>
        </div>
        <BuildScene />
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
      <section className="site-wrap discovery-section" id="choose-challenge">
        <div className="section-heading">
          <div>
            <p className="eyebrow">There’s a starting point for everyone</p>
            <h2>What feels like your next step?</h2>
          </div>
          <p className="discovery-note">
            Pick a comfortable start. You can always turn up the difficulty.
          </p>
        </div>
        <div className="discovery-grid">
          {[
            [
              'Beginner',
              'Get your first win.',
              'Practice the fundamentals with a focused tool you can build and test locally.',
              'Browse beginner challenges',
            ],
            [
              'Intermediate',
              'Connect the pieces.',
              'Work with protocols, parsers, and data structures in a more involved project.',
              'Browse intermediate challenges',
            ],
            [
              'Advanced',
              'Go under the hood.',
              'Take on deeper systems problems and make your own implementation decisions.',
              'Browse advanced challenges',
            ],
          ].map(([level, title, description, action], index) => (
            <Link
              className="discovery-card"
              href={`/challenges?difficulty=${level}`}
              key={level}
            >
              <span className="discovery-icon" aria-hidden="true">
                {
                  [
                    <Sprout key="beginner" />,
                    <Network key="intermediate" />,
                    <Cpu key="advanced" />,
                  ][index]
                }
              </span>
              <span className="eyebrow">{level}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="card-action">{action}</span>
            </Link>
          ))}
        </div>
        <p className="discovery-help">
          Not sure yet?{' '}
          <Link href="/challenge/build-your-own-wc-tool">
            Start with a word counter
          </Link>{' '}
          — a small command-line tool with a clear finish line.
        </p>
      </section>
      <section className="featured-section">
        <div className="site-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A few places to begin</p>
              <h2>Small brief. Real software.</h2>
            </div>
            <Link className="text-link" href="/challenges">
              Browse all challenges
            </Link>
          </div>
          <div className="discovery-grid">
            {[
              [
                'build-your-own-wc-tool',
                'Build a word counter',
                'Beginner',
                '2–4 hours',
                'Read files, handle input, and recreate a tool you can use every day.',
                'File I/O · Text processing',
              ],
              [
                'build-your-own-json-parser',
                'Build a JSON parser',
                'Intermediate',
                '4–6 hours',
                'Turn raw text into structured data and understand what happens behind JSON.parse.',
                'Parsing · Data structures',
              ],
              [
                'build-your-own-redis',
                'Build your own Redis',
                'Intermediate',
                '6–8 hours',
                'Explore how an in-memory data store handles commands and serves clients.',
                'Databases · Networking',
              ],
            ].map(([slug, title, level, time, description, skills]) => (
              <Link
                className="discovery-card"
                key={slug}
                href={`/challenge/${slug}`}
              >
                <span className="discovery-icon" aria-hidden="true">
                  {slug === 'build-your-own-wc-tool' ? (
                    <Terminal />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d={
                          (slug === 'build-your-own-redis' ? siRedis : siJson)
                            .path
                        }
                      />
                    </svg>
                  )}
                </span>
                <div className="challenge-meta">
                  <span>{level}</span>
                  <span>
                    <Clock size={13} aria-hidden="true" /> {time}
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="challenge-skills">{skills}</span>
                <span className="card-action">
                  <BookOpen size={15} aria-hidden="true" /> Read the challenge
                  brief
                </span>
              </Link>
            ))}
          </div>
          <div className="discovery-help">
            <span>
              New to building from a brief? We’ll walk you through your first
              project.
            </span>
            <Link className="text-link" href="/docs/getting-started">
              Read the getting-started guide
            </Link>
          </div>
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
          {steps.map(([number, title, description, href, action]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
                <Link className="text-link step-action" href={href}>
                  {action}
                </Link>
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
                'Command Line',
                'Browse command-line projects',
              ],
              [
                Layers,
                'Systems from the inside',
                'Understand the pieces behind the interfaces you use, one implementation at a time.',
                'Systems Programming',
                'Browse systems projects',
              ],
              [
                Braces,
                'Ideas for the web',
                'Connect data, behavior, and an interface. Make something you can use and share.',
                'Web Development',
                'Browse web projects',
              ],
            ].map(([Icon, title, description, category, action]) => {
              const ProjectIcon = Icon as typeof Code2;
              return (
                <article key={String(title)}>
                  <ProjectIcon size={28} strokeWidth={1.3} />
                  <h3>{String(title)}</h3>
                  <p>{String(description)}</p>
                  <Link
                    className="text-link step-action"
                    href={`/challenges?category=${encodeURIComponent(String(category))}`}
                  >
                    {String(action)}
                  </Link>
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
        <Link className="studio-button" href="/challenges?difficulty=Beginner">
          <Sprout size={17} aria-hidden="true" /> Find a beginner challenge
        </Link>
        <Link className="text-link" href="/challenges">
          Browse the full library
        </Link>
      </section>
      <Footer />
    </div>
  );
}
