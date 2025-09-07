'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  triggerClassName?: string;
}

export const FilterDropdown = React.forwardRef<
  HTMLButtonElement,
  FilterDropdownProps
>(
  (
    {
      value,
      onValueChange,
      options,
      placeholder = 'Select...',
      className,
      icon,
      triggerClassName,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          ref={ref}
          className={cn(
            'flex h-9 min-w-[140px] items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[--brand] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            'hover:bg-accent hover:text-accent-foreground transition-colors',
            'data-[state=open]:ring-2 data-[state=open]:ring-[--brand] data-[state=open]:ring-offset-2',
            triggerClassName,
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {icon}
            <span className="text-foreground truncate">
              {value === 'All' || !value ? placeholder : value}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-3 flex-shrink-0"
          >
            <ChevronDown className="h-4 w-4 opacity-50" />
          </motion.div>
        </DropdownMenuTrigger>

        <AnimatePresence>
          {isOpen && (
            <DropdownMenuContent
              className="min-w-[140px] w-[var(--radix-dropdown-menu-trigger-width)] max-w-[240px] p-1"
              align="start"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{
                  duration: 0.2,
                  ease: 'easeOut',
                }}
              >
                {options.map(option => (
                  <DropdownMenuItem
                    key={option}
                    className={cn(
                      'flex items-center justify-between cursor-pointer',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus:bg-accent focus:text-accent-foreground',
                      value === option && 'bg-accent text-accent-foreground'
                    )}
                    onSelect={() => {
                      onValueChange(option);
                      setIsOpen(false);
                    }}
                  >
                    <span>{option}</span>
                    {value === option && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check className="h-4 w-4 text-[--brand]" />
                      </motion.div>
                    )}
                  </DropdownMenuItem>
                ))}
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>
    );
  }
);

FilterDropdown.displayName = 'FilterDropdown';
