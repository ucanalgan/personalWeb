// File: js/utils.js
// Description: Utility functions for the portfolio application

// Debounce function moved to dedicated utils/debounce.js file
// Import from there: import { debounce } from './utils/debounce.js';
export { debounce, simpleDebounce, enhancedDebounce } from './utils/debounce.js';

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Select a single element
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {Element|null} Selected element
 */
export function select(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Select multiple elements
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {NodeList} Selected elements
 */
export function selectAll(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Smooth scroll to element
 * @param {Element|string} target - Target element or selector
 * @param {number} offset - Offset from top (optional)
 */
export function scrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? select(target) : target;
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean} Whether element is in viewport
 */
export function isInViewport(element, threshold = 0.1) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const elementHeight = rect.height;
  const elementWidth = rect.width;
  
  return (
    rect.top >= -elementHeight * threshold &&
    rect.left >= -elementWidth * threshold &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + elementHeight * threshold &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + elementWidth * threshold
  );
}

/**
 * Configuration object for the application
 */
export const config = {
  // Animation settings
  animation: {
    duration: 800,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    stagger: 100
  },
  
  // Scroll settings
  scroll: {
    offset: 100,
    threshold: 0.1
  },
  
  // GitHub settings
  github: {
    username: 'ucanalgan',
    apiUrl: 'https://api.github.com'
  },
  
  // Theme settings
  theme: {
    default: 'dark',
    storageKey: 'portfolio-theme'
  },
  
  // Performance settings
  performance: {
    enableLogging: true,
    imageQuality: 0.8,
    lazyLoadOffset: '50px'
  }
};

/**
 * Get user's preferred color scheme
 * @returns {string} 'dark' or 'light'
 */
export function getPreferredColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('Could not save to localStorage:', error);
    return false;
  }
}

/**
 * Get data from localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Retrieved value or default
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Could not retrieve from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for ID (optional)
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

/**
 * Wait for specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after timeout
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if device is mobile
 * @returns {boolean} Whether device is mobile
 */
export function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Check if device is tablet
 * @returns {boolean} Whether device is tablet
 */
export function isTablet() {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Check if device is desktop
 * @returns {boolean} Whether device is desktop
 */
export function isDesktop() {
  return window.innerWidth > 1024;
}

/**
 * Get random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get element's position relative to viewport
 * @param {Element} element - Element to get position for
 * @returns {Object} Position object with top, left, width, height
 */
export function getElementPosition(element) {
  if (!element) return { top: 0, left: 0, width: 0, height: 0 };
  
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    width: rect.width,
    height: rect.height
  };
}

/**
 * Enhanced image lazy loading utility with performance optimizations
 */
export function initLazyImages() {
  const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]:not([src])');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          
          // Handle data-src (manual lazy loading)
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
          }
          
          // Add loaded class for CSS transitions
          image.addEventListener('load', () => {
            image.classList.add('loaded');
            image.classList.remove('lazy');
          });
          
          // Handle load errors
          image.addEventListener('error', () => {
            image.alt = 'Failed to load image';
            image.classList.add('error');
            console.warn('Failed to load image:', image.src);
          });
          
          // Preload next images for better UX
          preloadNextImages(image);
          
          observer.unobserve(image);
        }
      });
    }, {
      rootMargin: config.performance.lazyLoadOffset || '50px',
      threshold: 0.01
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.add('loaded');
      img.classList.remove('lazy');
    });
  }
}

/**
 * Preload next images for smoother experience
 * @param {Element} currentImage - Currently loading image
 */
function preloadNextImages(currentImage) {
  const nextImages = Array.from(document.querySelectorAll('img[loading="lazy"]'))
    .filter(img => img !== currentImage && img.src && !img.complete)
    .slice(0, 2); // Preload next 2 images
    
  nextImages.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img.src;
    document.head.appendChild(link);
  });
} 