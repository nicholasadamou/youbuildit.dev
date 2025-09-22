'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, CreditCard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CustomUserButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  afterSignOutUrl?: string;
}

export default function CustomUserButton({
  className = '',
  size = 'md',
  showName = false,
  afterSignOutUrl = '/',
}: CustomUserButtonProps) {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleSignOut = () => {
    signOut({ redirectUrl: afterSignOutUrl });
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    openUserProfile();
    setIsOpen(false);
  };

  if (!isLoaded || !user) {
    return (
      <div
        className={`${sizeClasses[size]} bg-muted animate-pulse rounded-full ${className}`}
      />
    );
  }

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.emailAddresses[0]?.emailAddress[0].toUpperCase() || '?';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`p-0 rounded-full hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all ${className}`}
          size="icon"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Avatar className={sizeClasses[size]}>
              <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {showName && (
              <span
                className={`font-medium text-foreground ${textSizes[size]}`}
              >
                {user.firstName ||
                  user.emailAddresses[0]?.emailAddress.split('@')[0]}
              </span>
            )}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2" sideOffset={8}>
        {/* User Info Header */}
        <div className="flex items-center gap-3 p-3 mb-2 bg-muted/50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {user.fullName || 'User'}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Profile */}
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="flex items-center gap-3 p-2 cursor-pointer hover:bg-accent rounded-md transition-colors"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <User className="h-4 w-4 text-blue-800 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Profile</p>
            <p className="text-xs text-muted-foreground">
              Manage your account settings
            </p>
          </div>
        </DropdownMenuItem>
        {/* Account Settings */}
        <DropdownMenuItem asChild>
          <Link
            href="/account"
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Settings className="h-4 w-4 text-green-800 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Account Settings</p>
              <p className="text-xs text-muted-foreground">
                Preferences and billing
              </p>
            </div>
          </Link>
        </DropdownMenuItem>

        {/* Billing */}
        <DropdownMenuItem asChild>
          <Link
            href="/account?tab=subscription"
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CreditCard className="h-4 w-4 text-purple-800 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Billing</p>
              <p className="text-xs text-muted-foreground">
                Subscription & payment
              </p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-destructive/10 rounded-md transition-colors text-destructive focus:text-destructive"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <LogOut className="h-4 w-4 text-red-800 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Sign Out</p>
            <p className="text-xs text-muted-foreground">
              Log out of your account
            </p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
