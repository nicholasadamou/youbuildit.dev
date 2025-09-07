'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const themes = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

export default function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center bg-secondary rounded-lg p-1">
        {themes.map(themeOption => {
          const Icon = themeOption.icon;
          return (
            <button
              key={themeOption.id}
              className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground"
              disabled
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    );
  }

  const currentThemeIndex = themes.findIndex(t => t.id === theme);
  const activeIndex = currentThemeIndex >= 0 ? currentThemeIndex : 2; // Default to system if not found

  return (
    <div className="flex items-center bg-secondary rounded-lg p-1 relative">
      {/* Active indicator background */}
      <motion.div
        className="absolute bg-background rounded-md shadow-sm"
        style={{
          width: '32px',
          height: '32px',
          left: '4px', // Account for padding
        }}
        animate={{
          x: activeIndex * 36, // 32px width + 4px gap
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      />

      {themes.map((themeOption, index) => {
        const Icon = themeOption.icon;
        const isActive = theme === themeOption.id;

        return (
          <motion.button
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors z-10 ${
              index > 0 ? 'ml-1' : ''
            } ${
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${themeOption.label} theme`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
