import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DifficultyTag from '../DifficultyTag';

describe('DifficultyTag', () => {
  it('should render beginner difficulty', () => {
    render(<DifficultyTag difficulty="Beginner" />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  it('should render intermediate difficulty', () => {
    render(<DifficultyTag difficulty="Intermediate" />);
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  it('should render advanced difficulty', () => {
    render(<DifficultyTag difficulty="Advanced" />);
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('should apply correct base classes', () => {
    render(<DifficultyTag difficulty="Beginner" />);
    const tag = screen.getByText('Beginner');
    expect(tag).toHaveClass('inline-flex', 'items-center', 'rounded-full');
  });

  it('should apply small size classes by default', () => {
    render(<DifficultyTag difficulty="Beginner" />);
    const tag = screen.getByText('Beginner');
    expect(tag).toHaveClass('text-xs', 'px-2', 'py-1');
  });

  it('should apply medium size classes when specified', () => {
    render(<DifficultyTag difficulty="Beginner" size="md" />);
    const tag = screen.getByText('Beginner');
    expect(tag).toHaveClass('text-sm', 'px-3', 'py-1');
  });

  it('should apply beginner color classes', () => {
    const { container } = render(<DifficultyTag difficulty="Beginner" />);
    const tag = container.querySelector('span');
    expect(tag?.className).toContain('from-green-400');
  });

  it('should apply intermediate color classes', () => {
    const { container } = render(<DifficultyTag difficulty="Intermediate" />);
    const tag = container.querySelector('span');
    expect(tag?.className).toContain('from-yellow-400');
  });

  it('should apply advanced color classes', () => {
    const { container } = render(<DifficultyTag difficulty="Advanced" />);
    const tag = container.querySelector('span');
    expect(tag?.className).toContain('from-red-400');
  });

  it('should render as motion span when animated', () => {
    render(<DifficultyTag difficulty="Beginner" animated />);
    const tag = screen.getByText('Beginner');
    expect(tag).toBeInTheDocument();
  });

  it('should render as regular span when not animated', () => {
    render(<DifficultyTag difficulty="Beginner" animated={false} />);
    const tag = screen.getByText('Beginner');
    expect(tag).toBeInTheDocument();
    expect(tag.tagName).toBe('SPAN');
  });
});
