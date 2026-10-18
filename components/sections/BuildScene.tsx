import { Check } from 'lucide-react';
import { siGit } from 'simple-icons';

export default function BuildScene() {
  return (
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={siGit.path} />
          </svg>{' '}
          ~/your-next-project
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
  );
}
