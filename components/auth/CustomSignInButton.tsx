'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

interface CustomSignInButtonProps {
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
}

export default function CustomSignInButton({
  className = '',
  variant = 'outline',
  size = 'default',
  children,
  redirectUrl,
  mode = 'modal',
  showIcon = true,
  iconOnly = false,
}: CustomSignInButtonProps) {
  const { openSignIn } = useClerk();

  const handleSignIn = () => {
    if (mode === 'modal') {
      openSignIn({
        fallbackRedirectUrl: redirectUrl || window.location.href,
      });
    } else {
      // For redirect mode, you would typically use router.push to a sign-in page
      // or use Clerk's buildSignInUrl() for a custom redirect
      window.location.href = '/sign-in';
    }
  };

  if (iconOnly) {
    return (
      <Button
        variant={variant}
        size="icon"
        onClick={handleSignIn}
        className={`transition-all hover:scale-105 ${className}`}
        aria-label="Sign in to your account"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <User className="h-4 w-4" />
        </motion.div>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignIn}
      className={`transition-all hover:scale-105 ${className}`}
    >
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {showIcon && <User className="h-4 w-4" />}
        {children || <span>Sign In</span>}
      </motion.div>
    </Button>
  );
}
