'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

interface CustomSignUpButtonProps {
  className?: string;
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'destructive'
    | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  redirectUrl?: string;
  mode?: 'modal' | 'redirect';
  showIcon?: boolean;
  iconOnly?: boolean;
  onModalOpen?: () => void;
}

export default function CustomSignUpButton({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  redirectUrl,
  mode = 'modal',
  showIcon = true,
  iconOnly = false,
  onModalOpen,
}: CustomSignUpButtonProps) {
  const { openSignUp } = useClerk();

  const handleSignUp = () => {
    if (mode === 'modal') {
      // Close any open mobile sheets before opening the modal
      onModalOpen?.();
      openSignUp({
        fallbackRedirectUrl: redirectUrl || window.location.href,
      });
    } else {
      // For redirect mode, you would typically use router.push to a sign-up page
      // or use Clerk's buildSignUpUrl() for a custom redirect
      window.location.href = '/sign-up';
    }
  };

  if (iconOnly) {
    return (
      <Button
        variant={variant}
        size="icon"
        onClick={handleSignUp}
        className={`transition-all hover:scale-105 ${className}`}
        aria-label="Sign up for an account"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <UserPlus className="h-4 w-4" />
        </motion.div>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignUp}
      className={`transition-all hover:scale-105 ${className}`}
    >
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {showIcon && <UserPlus className="h-4 w-4" />}
        {children || <span>Sign Up</span>}
      </motion.div>
    </Button>
  );
}
