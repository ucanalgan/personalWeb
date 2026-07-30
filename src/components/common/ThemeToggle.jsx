// React 17+ JSX Transform - no React import needed
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isLoading } = useTheme();

  // 44px hit area, matching the minimum touch target used elsewhere.
  const base =
    'inline-flex items-center justify-center w-11 h-11 rounded-xl border border-border ' +
    'text-text-secondary transition-colors duration-300';

  if (isLoading) {
    return (
      <div className={base} aria-hidden="true">
        <i className="ri-loader-4-line animate-spin" />
      </div>
    );
  }

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`${base} hover:text-primary hover:border-border-hover hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary`}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'} aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
