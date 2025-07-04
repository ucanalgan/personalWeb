import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="theme-toggle">
        <i className="ri-loader-4-line animate-spin"></i>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
    </button>
  );
};

export default ThemeToggle; 