// File: js/theme.js
// Description: Theme management system for dark/light mode switching

import { saveToStorage, getFromStorage, getPreferredColorScheme } from './utils.js';

/**
 * Theme manager class
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'dark';
    this.themeStorageKey = 'portfolio-theme';
    this.themeToggleBtn = null;
    this.mediaQuery = null;
    
    this.init();
  }

  /**
   * Initialize theme system
   */
  init() {
    // Get saved theme or use system preference
    const savedTheme = getFromStorage(this.themeStorageKey);
    const systemTheme = getPreferredColorScheme();
    
    this.currentTheme = savedTheme || systemTheme;
    
    // Apply initial theme
    this.applyTheme(this.currentTheme);
    
    // Setup theme toggle button
    this.setupThemeToggle();
    
    // Listen for system theme changes
    this.setupSystemThemeListener();
    
    console.log(`Theme system initialized with: ${this.currentTheme}`);
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark');
    body.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme classes
    root.classList.add(`theme-${theme}`);
    body.classList.add(`${theme}-theme`);
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', theme);
    
    // Update CSS custom properties
    this.updateThemeColors(theme);
    
    // Update meta theme-color
    this.updateMetaThemeColor(theme);
    
    // Update theme toggle button
    this.updateThemeToggleButton(theme);
    
    this.currentTheme = theme;
    
    // Save to localStorage
    saveToStorage(this.themeStorageKey, theme);
    
    // Dispatch theme change event
    this.dispatchThemeChangeEvent(theme);
  }

  /**
   * Update CSS custom properties based on theme
   */
  updateThemeColors(theme) {
    const root = document.documentElement;
    
    const themes = {
      dark: {
        '--bg-primary': '#0a192f',
        '--bg-secondary': '#112240',
        '--bg-tertiary': '#1d2951',
        '--text-primary': '#ccd6f6',
        '--text-secondary': '#8892b0',
        '--text-accent': '#64ffda',
        '--primary': '#64ffda',
        '--primary-dark': '#4db6ac',
        '--border-color': 'rgba(100, 255, 218, 0.1)',
        '--shadow-primary': 'rgba(100, 255, 218, 0.2)',
        '--backdrop-blur': 'rgba(10, 25, 47, 0.85)'
      },
      light: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8fafc',
        '--bg-tertiary': '#e2e8f0',
        '--text-primary': '#2d3748',
        '--text-secondary': '#4a5568',
        '--text-accent': '#2b6cb0',
        '--primary': '#2b6cb0',
        '--primary-dark': '#2c5aa0',
        '--border-color': 'rgba(43, 108, 176, 0.1)',
        '--shadow-primary': 'rgba(43, 108, 176, 0.2)',
        '--backdrop-blur': 'rgba(255, 255, 255, 0.85)'
      }
    };

    const themeColors = themes[theme];
    
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        dark: '#0a192f',
        light: '#ffffff'
      };
      metaThemeColor.setAttribute('content', colors[theme]);
    }
  }

  /**
   * Setup theme toggle button
   */
  setupThemeToggle() {
    this.themeToggleBtn = document.querySelector('.theme-toggle, #theme-toggle');
    
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      // Add keyboard support
      this.themeToggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  }

  /**
   * Update theme toggle button appearance
   */
  updateThemeToggleButton(theme) {
    if (!this.themeToggleBtn) return;
    
    const icon = this.themeToggleBtn.querySelector('i');
    const text = this.themeToggleBtn.querySelector('.theme-text');
    
    if (icon) {
      icon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
    }
    
    if (text) {
      text.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
    
    // Update aria-label for accessibility
    this.themeToggleBtn.setAttribute('aria-label', 
      `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`
    );
  }

  /**
   * Setup system theme change listener
   */
  setupSystemThemeListener() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only auto-switch if user hasn't manually set a theme
      const savedTheme = getFromStorage(this.themeStorageKey);
      if (!savedTheme) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    this.mediaQuery.addEventListener('change', handleSystemThemeChange);
  }

  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    
    // Add animation class for smooth transition
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  }

  /**
   * Set specific theme
   */
  setTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      this.applyTheme(theme);
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Dispatch theme change event
   */
  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themeChange', {
      detail: { theme, previousTheme: this.currentTheme }
    });
    document.dispatchEvent(event);
  }

  /**
   * Reset to system theme
   */
  resetToSystemTheme() {
    const systemTheme = getPreferredColorScheme();
    this.applyTheme(systemTheme);
    
    // Remove saved preference to follow system
    localStorage.removeItem(this.themeStorageKey);
  }
}

// Create global theme manager instance
let themeManager;

/**
 * Initialize theme system
 */
export function initializeTheme() {
  themeManager = new ThemeManager();
  return themeManager;
}

/**
 * Initialize theme (for main.js compatibility)
 */
export function initTheme() {
  return initializeTheme();
}

/**
 * Get theme manager instance
 */
export function getThemeManager() {
  if (!themeManager) {
    themeManager = new ThemeManager();
  }
  return themeManager;
}

/**
 * Toggle theme (utility function)
 */
export function toggleTheme() {
  const manager = getThemeManager();
  manager.toggleTheme();
}

/**
 * Set theme (utility function)
 */
export function setTheme(theme) {
  const manager = getThemeManager();
  manager.setTheme(theme);
}

/**
 * Get current theme (utility function)
 */
export function getCurrentTheme() {
  const manager = getThemeManager();
  return manager.getCurrentTheme();
}

// Add CSS for smooth theme transitions
const themeTransitionCSS = `
  .theme-transition * {
    transition: background-color 0.3s ease, 
                color 0.3s ease, 
                border-color 0.3s ease !important;
  }
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = themeTransitionCSS;
document.head.appendChild(styleSheet);

// Export theme manager class for advanced usage
export { ThemeManager };

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!themeManager) {
      initializeTheme();
    }
  });
} else {
  // DOM is already ready
  if (!themeManager) {
    initializeTheme();
  }
} 