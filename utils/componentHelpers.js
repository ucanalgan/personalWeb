// File: js/utils/componentHelpers.js
// Description: Component helper functions for portfolio application

import { debounce } from './debounce.js';

/**
 * Component Helpers and Utilities
 * Comprehensive utilities for portfolio components
 */

// Development logging utility  
const isDevelopment = (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
const logger = {
  log: (...args) => isDevelopment && console.log(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  error: (...args) => console.error(...args), // Always show errors
  info: (...args) => isDevelopment && console.info(...args)
};

/**
 * Initialize rotating text animation in hero section
 */
export function initializeRotatingText() {
  const rotatingTextElement = document.querySelector('.rotating-text');
  if (!rotatingTextElement) return;

  const texts = [
    'Full Stack Developer',
    'Frontend Developer', 
    'Backend Developer',
    'UI/UX Enthusiast',
    'Problem Solver'
  ];
  
  let currentIndex = 0;
  
  function rotateText() {
    rotatingTextElement.style.opacity = '0';
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      rotatingTextElement.textContent = texts[currentIndex];
      rotatingTextElement.style.opacity = '1';
    }, 300);
  }
  
  // Start rotation
  setInterval(rotateText, 3000);
}

/**
 * Initialize modern navigation with scroll effects
 */
export function initializeModernNavigation() {
  const navbar = document.getElementById('navbar');
  const navProgress = document.getElementById('nav-progress');
  
  if (!navbar) return;

  // Scroll effect for navbar
  function handleScroll() {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
    
    // Update progress bar
    if (navProgress) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      navProgress.style.width = scrolled + '%';
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  
  function toggleMobileMenu(show) {
    if (mobileMenu) {
      mobileMenu.classList.toggle('open', show);
      document.body.style.overflow = show ? 'hidden' : '';
    }
  }
  
  mobileMenuBtn?.addEventListener('click', () => toggleMobileMenu(true));
  mobileMenuClose?.addEventListener('click', () => toggleMobileMenu(false));
  
  // Close menu when clicking on links
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });
}

/**
 * Setup GitHub stats integration
 */
export function setupGitHubStatsIntegration() {
  const username = 'ucanalgan';
  
  // This function is already implemented in the main app.js
  // We're keeping it here for consistency
  console.log('GitHub stats integration setup for:', username);
}

/**
 * Initialize project search functionality
 */
export function initializeProjectSearch() {
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card, .github-project-card');
  
  if (!searchInput) return;
  
  function filterProjects(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    projectCards.forEach(card => {
      const title = card.querySelector('h3, .project-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('p, .project-description')?.textContent.toLowerCase() || '';
      const tags = card.querySelector('.project-tags')?.textContent.toLowerCase() || '';
      
      const matches = title.includes(term) || description.includes(term) || tags.includes(term);
      
      card.style.display = matches ? 'block' : 'none';
      
      // Add animation
      if (matches) {
        card.style.animation = 'fadeInUp 0.5s ease-out';
      }
    });
  }
  
  // Debounce search input using imported debounce function
  const debouncedFilter = debounce((value) => filterProjects(value), 300);
  searchInput.addEventListener('input', (e) => {
    debouncedFilter(e.target.value);
  });
}

/**
 * Initialize loading screen
 */
export function initializeLoadingScreen() {
  const loader = document.getElementById('loader');
  
  if (!loader) return;
  
  // Hide loader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 1000);
  });
}

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
  if (!('performance' in window)) return;
  
  // Monitor navigation timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      
      console.log('Page Load Performance:', {
        loadTime: `${loadTime}ms`,
        domContentLoaded: `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 'N/A'
      });
    }, 0);
  });
}

/**
 * Initialize component with lazy loading
 */
export function initializeComponent(element, componentName) {
  if (!element) return;
  
  // Add loading state
  element.dataset.loading = 'true';
  element.classList.add('component-loading');
  
  // Simulate component initialization
  setTimeout(() => {
    element.dataset.loading = 'false';
    element.classList.remove('component-loading');
    element.classList.add('component-loaded');
    
    console.log(`Component ${componentName} initialized`);
  }, 100);
}

/**
 * Setup form validation
 */
export function setupFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Real-time validation on blur
      input.addEventListener('blur', () => validateField(input));
      
      // Clear errors on input
      input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission validation
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Handle form submission
        console.log('Form is valid, submitting...');
        // Add your form submission logic here
      }
    });
  });
}

/**
 * Validate individual form field
 */
function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  const required = field.hasAttribute('required');
  
  // Clear previous errors
  clearFieldError(field);
  
  // Check if required field is empty
  if (required && !value) {
    showFieldError(field, 'This field is required');
    return false;
  }
  
  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field, 'Please enter a valid email address');
      return false;
    }
  }
  
  // Minimum length validation
  const minLength = field.getAttribute('minlength');
  if (minLength && value.length < parseInt(minLength)) {
    showFieldError(field, `Minimum ${minLength} characters required`);
    return false;
  }
  
  return true;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
  const formGroup = field.closest('.form-group') || field.parentElement;
  
  // Add error class
  formGroup.classList.add('error');
  field.classList.add('error');
  
  // Create error message
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message text-red-400 text-sm mt-1';
  errorElement.textContent = message;
  
  // Remove existing error message
  const existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add new error message
  formGroup.appendChild(errorElement);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
  const formGroup = field.closest('.form-group') || field.parentElement;
  
  // Remove error classes
  formGroup.classList.remove('error');
  field.classList.remove('error');
  
  // Remove error message
  const errorMessage = formGroup.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

/**
 * Component Helper Utilities
 * Utility functions for component management and optimization
 */

/**
 * Initialize lazy image loading with Intersection Observer
 */
export function initLazyImages() {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without IntersectionObserver
    loadAllImages();
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Replace data-src with src
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Replace data-srcset with srcset
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        // Add loaded class for CSS transitions
        img.classList.add('loaded');
        
        // Stop observing this image
        observer.unobserve(img);
        
        console.log('🖼️ Lazy loaded image:', img.src);
      }
    });
  }, {
    // Load images when they're 50px away from the viewport
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  // Observe all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    // Add loading placeholder
    img.classList.add('lazy-loading');
    imageObserver.observe(img);
  });

  console.log(`🚀 Initialized lazy loading for ${lazyImages.length} images`);
}

/**
 * Fallback function to load all images immediately
 */
function loadAllImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute('data-srcset');
    }
    img.classList.add('loaded');
  });
  
  console.log(`📷 Fallback: Loaded all ${lazyImages.length} images immediately`);
}

// Debounce function imported from dedicated utils/debounce.js file

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
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
 * Wait for element to exist in DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Element>} Promise that resolves with the element
 */
export function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Timeout fallback
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Animate element into view with Intersection Observer
 * @param {string|NodeList} elements - Elements to animate
 * @param {Object} options - Animation options
 */
export function animateOnScroll(elements, options = {}) {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px 0px',
    animationClass: 'animate-in',
    once: true
  };

  const config = { ...defaultOptions, ...options };

  if (!('IntersectionObserver' in window)) {
    // Fallback: Just add the animation class
    const elementList = typeof elements === 'string' ? 
      document.querySelectorAll(elements) : elements;
    
    elementList.forEach(el => el.classList.add(config.animationClass));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(config.animationClass);
        
        if (config.once) {
          observer.unobserve(entry.target);
        }
      } else if (!config.once) {
        entry.target.classList.remove(config.animationClass);
      }
    });
  }, {
    threshold: config.threshold,
    rootMargin: config.rootMargin
  });

  const elementList = typeof elements === 'string' ? 
    document.querySelectorAll(elements) : elements;

  elementList.forEach(el => observer.observe(el));
}

/**
 * Create and manage a loading state
 * @param {HTMLElement} container - Container element
 * @param {string} message - Loading message
 * @returns {Object} Loading state management object
 */
export function createLoadingState(container, message = 'Loading...') {
  const loader = document.createElement('div');
  loader.className = 'loading-state flex items-center justify-center p-8';
  loader.innerHTML = `
    <div class="text-center">
      <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-text-secondary">${message}</p>
    </div>
  `;

  return {
    show() {
      container.appendChild(loader);
    },
    hide() {
      if (loader.parentElement) {
        loader.remove();
      }
    },
    update(newMessage) {
      const messageEl = loader.querySelector('p');
      if (messageEl) {
        messageEl.textContent = newMessage;
      }
    }
  };
}

/**
 * Smooth scroll to element with offset
 * @param {string|HTMLElement} target - Target element or selector
 * @param {number} offset - Offset from top in pixels
 * @param {number} duration - Animation duration in milliseconds
 */
export function smoothScrollTo(target, offset = 0, duration = 800) {
  const element = typeof target === 'string' ? 
    document.querySelector(target) : target;
    
  if (!element) {
    console.warn('Scroll target not found:', target);
    return;
  }

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function (ease-in-out)
    const ease = progress < 0.5 ? 
      2 * progress * progress : 
      1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

/**
 * Generate unique ID for elements
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean} True if element is in viewport
 */
export function isInViewport(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const verticalVisible = (rect.top + rect.height * threshold < windowHeight) && 
                         (rect.bottom - rect.height * threshold > 0);
  const horizontalVisible = (rect.left + rect.width * threshold < windowWidth) && 
                           (rect.right - rect.width * threshold > 0);
  
  return verticalVisible && horizontalVisible;
}

/**
 * Format numbers with appropriate suffixes (K, M, B)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Create error boundary for component
 * @param {HTMLElement} container - Container element
 * @param {string} componentName - Component name for error message
 * @returns {Function} Error handler function
 */
export function createErrorBoundary(container, componentName) {
  return function handleError(error) {
    console.error(`Error in ${componentName} component:`, error);
    
    container.innerHTML = `
      <div class="error-boundary bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
        <i class="ri-error-warning-line text-red-500 text-2xl mb-2"></i>
        <h3 class="text-red-400 font-semibold mb-2">Component Error</h3>
        <p class="text-red-300 text-sm mb-4">
          The ${componentName} component failed to load properly.
        </p>
        <button onclick="window.location.reload()" 
                class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded border border-red-500/30 text-sm transition-colors">
          Reload Page
        </button>
      </div>
    `;
  };
}

// Export all utilities as default object
export default {
  initLazyImages,
  debounce,
  throttle,
  waitForElement,
  animateOnScroll,
  createLoadingState,
  smoothScrollTo,
  generateId,
  isInViewport,
  formatNumber,
  createErrorBoundary
}; 