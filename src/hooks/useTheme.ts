import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme['name']>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme['name'] | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setThemeState(initialTheme);
    setIsHydrated(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme['name']) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  useEffect(() => {
    if (isHydrated) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, isHydrated]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isHydrated
  };
};