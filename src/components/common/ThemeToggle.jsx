// React 17+ JSX Transform - no React import needed
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="theme-toggle">
        <i className="ri-loader-4-line animate-spin" />
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
      <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'} />
    </button>
  );
};

export default ThemeToggle;
