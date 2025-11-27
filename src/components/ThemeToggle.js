'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ mobile = false, onClick }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!mounted) {
    // Return null or a placeholder during SSR
    return mobile ? null : (
      <div className="w-8 h-8" /> // Placeholder to prevent layout shift
    );
  }

  const handleClick = () => {
    toggleTheme();
    if (onClick) onClick();
  };

  const buttonProps = mobile
    ? {
        variant: "ghost",
        className: "w-full justify-start h-12",
        onClick: handleClick,
        'aria-label': `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
      }
    : {
        variant: "ghost",
        size: "icon",
        onClick: handleClick,
        'aria-label': `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
      };

  return (
    <Button {...buttonProps}>
      {mobile && (
        <>
          {theme === 'light' ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </>
      )}
      {!mobile && (
        theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />
      )}
    </Button>
  );
}
