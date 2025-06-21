/**
 * App.js - Main Entry Point for Portfolio Application
 * Updated to work with the new modular component system
 */

// Import the modular portfolio system
import portfolio from './main.js';

// Enhanced app initialization with backward compatibility
class PortfolioApp {
  constructor() {
    this.portfolio = portfolio;
    this.legacyModeActive = false;
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🎯 Starting Portfolio Application...');
      
      // Check if modular system is available
      if (this.portfolio && typeof this.portfolio.init === 'function') {
        console.log('📦 Using modular component system');
        
        // Wait for modular system to initialize
        await this.waitForPortfolioLoad();
        
        // Initialize additional app-level features
        this.initializeAppFeatures();
        
      } else {
        console.warn('⚠️ Modular system not available, falling back to legacy mode');
        this.legacyModeActive = true;
        await this.initializeLegacyMode();
      }
      
      this.initialized = true;
      console.log('🚀 Portfolio Application ready!');
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      await this.handleAppError(error);
    }
  }

  async waitForPortfolioLoad() {
    return new Promise((resolve) => {
      if (this.portfolio.initialized) {
        resolve();
      } else {
        window.addEventListener('portfolioLoaded', () => {
          console.log('✅ Portfolio modular system loaded');
          resolve();
        }, { once: true });
      }
    });
  }

  initializeAppFeatures() {
    // Enhanced navigation
    this.initializeNavigation();
    
    // Scroll features
    this.initializeScrollFeatures();
    
    // Page visibility handling
    this.initializeVisibilityHandling();
    
    // Error boundaries
    this.initializeErrorBoundaries();
    
    // Analytics integration
    this.initializeAnalytics();
    
    console.log('🔧 App-level features initialized');
  }

  initializeNavigation() {
    // Enhanced navigation with active states
    const updateActiveNav = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const scrollY = window.scrollY;
      let activeSection = 'hero';

      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            activeSection = sectionId;
          }
        }
      });

      // Update navigation states
      document.querySelectorAll('.nav-link, [href^="#"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeSection}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    // Throttled scroll handler for navigation
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial navigation state
    updateActiveNav();
  }

  initializeScrollFeatures() {
    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top-global';
    backToTopButton.className = 'fixed bottom-6 right-6 w-12 h-12 bg-primary/90 hover:bg-primary text-white rounded-full shadow-lg opacity-0 transition-all duration-300 z-50 flex items-center justify-center';
    backToTopButton.innerHTML = '<i class="ri-arrow-up-line"></i>';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    
    document.body.appendChild(backToTopButton);

    // Show/hide back to top button
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.pointerEvents = 'auto';
      } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.pointerEvents = 'none';
      }
    }, { passive: true });

    // Back to top functionality
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Reading progress indicator
    this.initializeReadingProgress();
  }

  initializeReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.className = 'fixed top-0 left-0 h-1 bg-primary transition-all duration-150 z-50';
    progressBar.style.width = '0%';
    
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }, { passive: true });
  }

  initializeVisibilityHandling() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('📱 Page hidden - pausing non-essential features');
        // Pause animations, videos, etc.
        this.pauseNonEssentialFeatures();
      } else {
        console.log('📱 Page visible - resuming features');
        // Resume animations, videos, etc.
        this.resumeNonEssentialFeatures();
      }
    });
  }

  pauseNonEssentialFeatures() {
    // Pause any running animations
    document.querySelectorAll('video, [data-animate]').forEach(element => {
      if (element.tagName === 'VIDEO') {
        element.pause();
      }
      element.classList.add('paused');
    });
  }

  resumeNonEssentialFeatures() {
    // Resume animations and videos
    document.querySelectorAll('[data-animate].paused').forEach(element => {
      element.classList.remove('paused');
    });
  }

  initializeErrorBoundaries() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('🚨 Global error caught:', event.error);
      this.handleGlobalError(event.error);
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 Unhandled promise rejection:', event.reason);
      this.handleGlobalError(event.reason);
    });
  }

  handleGlobalError(error) {
    // Track error
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || error.toString(),
        fatal: false
      });
    }

    // Show user-friendly error message
    this.showErrorNotification('Something went wrong. Please refresh the page if issues persist.');
  }

  showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="ri-error-warning-line mr-2"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white/80 hover:text-white">
          <i class="ri-close-line"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  initializeAnalytics() {
    // Basic analytics initialization
    if (typeof gtag !== 'undefined') {
      console.log('📊 Analytics initialized');
      
      // Track page view
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href
      });

      // Track component loading events
      window.addEventListener('portfolioLoaded', (event) => {
        gtag('event', 'portfolio_loaded', {
          event_category: 'engagement',
          event_label: 'components_loaded',
          custom_parameter: event.detail?.components?.length || 0
        });
      });
    }
  }

  async initializeLegacyMode() {
    console.log('🔄 Initializing legacy compatibility mode...');
    
    try {
      // Load legacy modules if available
      if (typeof initApp === 'function') {
        await initApp();
      }
      
      // Basic functionality for legacy mode
      this.initializeFallbackFeatures();
      
      console.log('✅ Legacy mode initialized');
    } catch (error) {
      console.error('❌ Legacy mode initialization failed:', error);
    }
  }

  initializeFallbackFeatures() {
    // Basic smooth scrolling
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Basic theme toggle
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }

    console.log('🔧 Fallback features initialized');
  }

  async handleAppError(error) {
    console.error('App error handler:', error);
    
    // Hide loader if still visible
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
    
    // Show error boundary
    const errorBoundary = document.getElementById('error-boundary');
    if (errorBoundary) {
      errorBoundary.classList.remove('hidden');
    }
    
    // Ensure page is visible
    document.body.style.visibility = 'visible';
  }

  // Public API
  getSystemInfo() {
    return {
      mode: this.legacyModeActive ? 'legacy' : 'modular',
      initialized: this.initialized,
      portfolioSystem: this.portfolio?.getSystemStatus?.() || null
    };
  }

  reloadApp() {
    window.location.reload();
  }
}

// Initialize the application
const app = new PortfolioApp();

// Start app initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Global app access
window.App = app;

// Export for module usage
export default app; 