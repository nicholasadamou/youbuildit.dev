'use client';

import { Crown, Users, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  tier: 'free' | 'pro' | 'team';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PremiumBadge({
  tier,
  className,
  size = 'md',
}: PremiumBadgeProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (tier === 'free') {
    return null; // Don't show badge for free challenges
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const getConfig = (tier: string, isDark: boolean) => {
    const lightStyles = {
      pro: {
        backgroundColor: '#fef3c7', // amber-100
        color: '#78350f', // amber-900
        borderColor: '#fcd34d', // amber-300
      },
      team: {
        backgroundColor: '#ede9fe', // purple-100
        color: '#581c87', // purple-900
        borderColor: '#c4b5fd', // purple-300
      },
      premium: {
        backgroundColor: '#f3f4f6', // gray-100
        color: '#111827', // gray-900
        borderColor: '#d1d5db', // gray-300
      },
    };

    const darkStyles = {
      pro: {
        backgroundColor: 'rgba(120, 53, 15, 0.2)', // amber-900/20
        color: '#fcd34d', // amber-300
        borderColor: '#92400e', // amber-800
      },
      team: {
        backgroundColor: 'rgba(88, 28, 135, 0.2)', // purple-900/20
        color: '#c4b5fd', // purple-300
        borderColor: '#6b21a8', // purple-800
      },
      premium: {
        backgroundColor: '#1e293b', // slate-800
        color: '#cbd5e1', // slate-300
        borderColor: '#334155', // slate-700
      },
    };

    const styles = isDark ? darkStyles : lightStyles;
    const tierKey =
      tier === 'pro' ? 'pro' : tier === 'team' ? 'team' : 'premium';
    const style = styles[tierKey];

    switch (tier) {
      case 'pro':
        return {
          icon: Crown,
          label: 'Pro',
          style,
        };
      case 'team':
        return {
          icon: Users,
          label: 'Team',
          style,
        };
      default:
        return {
          icon: Lock,
          label: 'Premium',
          style,
        };
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 border rounded-full bg-gray-200 text-gray-400',
          sizeClasses[size],
          className
        )}
      >
        <Lock size={iconSizes[size]} />
        Loading...
      </span>
    );
  }

  const isDark = resolvedTheme === 'dark';
  const config = getConfig(tier, isDark);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border rounded-full font-semibold shadow-sm pointer-events-none',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: config.style.backgroundColor,
        color: config.style.color,
        borderColor: config.style.borderColor,
      }}
    >
      <Icon size={iconSizes[size]} />
      {config.label}
    </span>
  );
}
