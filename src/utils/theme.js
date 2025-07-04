// File: js/theme.js
// Description: Theme management system for dark/light mode switching

import { saveToStorage, getFromStorage, getPreferredColorScheme } from './utils.js';

/**
 * Advanced Theme Management System
 * Handles dark/light mode toggle with smooth transitions and localStorage persistence
 */

export class ThemeManager {
  constructor() {
    this.currentTheme = 'dark'; // default
    this.storageKey = 'portfolio-theme';
    this.themes = {
      dark: {
        '--bg-primary': '#0a192f',
        '--bg-secondary': '#112240',
        '--bg-tertiary': '#1d2951',
        '--text-primary': '#ccd6f6',
        '--text-secondary': '#8892b0',
        '--text-accent': '#64ffda',
        '--primary': '#64ffda',
        '--border-color': 'rgba(100, 255, 218, 0.1)',
        '--shadow-primary': 'rgba(100, 255, 218, 0.2)'
      },
      light: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8fafc',
        '--bg-tertiary': '#e2e8f0',
        '--text-primary': '#1e293b',
        '--text-secondary': '#64748b',
        '--text-accent': '#0f172a',
        '--primary': '#0369a1',
        '--border-color': 'rgba(3, 105, 161, 0.1)',
        '--shadow-primary': 'rgba(3, 105, 161, 0.2)'
      }
    };
    
    this.init();
  }

  init() {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem(this.storageKey);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    this.currentTheme = savedTheme || systemTheme;
    this.applyTheme(this.currentTheme, false);
    this.createToggleButton();
    this.setupSystemThemeListener();
  }

  createToggleButton() {
    // Create theme toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'theme-toggle';
    toggleButton.className = 'theme-toggle fixed top-4 right-4 z-50';
    toggleButton.setAttribute('aria-label', 'Toggle theme');
    toggleButton.innerHTML = this.getToggleIcon();
    
    // Add to page
    document.body.appendChild(toggleButton);
    
    // Add event listener
    toggleButton.addEventListener('click', () => this.toggleTheme());
    
    // Add keyboard support
    toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  getToggleIcon() {
    return this.currentTheme === 'dark' 
      ? '<i class="ri-sun-line text-xl"></i>'
      : '<i class="ri-moon-line text-xl"></i>';
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme, true);
  }

  applyTheme(theme, withTransition = true) {
    if (withTransition) {
      // Add transition class
      document.documentElement.classList.add('theme-transitioning');
      
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 300);
    }

    // Update CSS variables
    const root = document.documentElement;
    const themeColors = this.themes[theme];
    
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update data-theme attribute
    root.setAttribute('data-theme', theme);
    
    // Update current theme
    this.currentTheme = theme;
    
    // Save to localStorage
    localStorage.setItem(this.storageKey, theme);
    
    // Update toggle button icon
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.innerHTML = this.getToggleIcon();
    }
    
    // Emit theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));
  }

  setupSystemThemeListener() {
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        // Only auto-switch if user hasn't manually set a preference
        this.applyTheme(e.matches ? 'dark' : 'light', true);
      }
    });
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Initialize theme manager
export const themeManager = new ThemeManager();

// Create global theme manager instance
let themeManagerInstance;

/**
 * Initialize theme system
 */
export function initializeTheme() {
  themeManagerInstance = new ThemeManager();
  return themeManagerInstance;
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
  if (!themeManagerInstance) {
    themeManagerInstance = new ThemeManager();
  }
  return themeManagerInstance;
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

// ThemeManager class already exported above

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!themeManagerInstance) {
      initializeTheme();
    }
  });
} else {
  // DOM is already ready
  if (!themeManagerInstance) {
    initializeTheme();
  }
} 