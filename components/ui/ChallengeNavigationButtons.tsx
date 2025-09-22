'use client';

import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';
import { Shuffle, Zap } from 'lucide-react';
import Link from 'next/link';
import { useNavigateToRandomFreeChallenge } from '@/lib/navigation';
import { ReactNode } from 'react';

export interface ExploreChallengesButtonProps
  extends Omit<ButtonProps, 'asChild'> {
  children?: ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
}

export interface RandomFreeChallengeButtonProps
  extends Omit<ButtonProps, 'onClick'> {
  children?: ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  loadingText?: string;
}

export function ExploreChallengesButton({
  children = 'Explore Challenges',
  showIcon = true,
  iconPosition = 'right',
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ExploreChallengesButtonProps) {
  const icon = showIcon ? <Zap className="h-4 w-4" /> : null;

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      <Link href="/challenges" className="inline-flex items-center space-x-2">
        {iconPosition === 'left' && icon}
        <span>{children}</span>
        {iconPosition === 'right' && icon}
      </Link>
    </Button>
  );
}

export function RandomFreeChallengeButton({
  children = 'Try Random Challenge',
  showIcon = true,
  iconPosition = 'left',
  loadingText = 'Finding Challenge...',
  className,
  variant = 'outline',
  size = 'default',
  ...props
}: RandomFreeChallengeButtonProps) {
  const { navigateToRandomFreeChallenge, isLoading } =
    useNavigateToRandomFreeChallenge();
  const icon = showIcon ? <Shuffle className="h-4 w-4" /> : null;

  return (
    <Button
      onClick={navigateToRandomFreeChallenge}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      <div className="inline-flex items-center space-x-2">
        {iconPosition === 'left' && (
          <div
            className={`${
              isLoading ? 'animate-spin' : 'group-hover:rotate-180'
            } transition-transform duration-300`}
          >
            {icon}
          </div>
        )}
        <span>{isLoading ? loadingText : children}</span>
        {iconPosition === 'right' && (
          <div
            className={`${
              isLoading ? 'animate-spin' : 'group-hover:rotate-180'
            } transition-transform duration-300`}
          >
            {icon}
          </div>
        )}
      </div>
    </Button>
  );
}

export function RandomFreeChallengeLink({
  children = 'Random Challenge',
  showIcon = true,
  iconPosition = 'left',
  className,
  ...props
}: {
  children?: ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  className?: string;
} & React.ComponentProps<'button'>) {
  const { navigateToRandomFreeChallenge, isLoading } =
    useNavigateToRandomFreeChallenge();
  const icon = showIcon ? <Shuffle className="w-4 h-4" /> : null;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await navigateToRandomFreeChallenge();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } flex items-center gap-2 text-left`}
      {...props}
    >
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          {iconPosition === 'left' && icon}
          {children}
          {iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}
