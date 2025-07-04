import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Apply theme to document
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);

      // Save to localStorage
      localStorage.setItem('portfolio-theme', theme);

      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.content = theme === 'dark' ? '#0a0e27' : '#ffffff';
      }

      // Dispatch theme change event
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
    }
  }, [theme, isLoading]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isLoading,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
