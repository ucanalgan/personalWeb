/**
 * Main Application Entry Point - Updated for Modular Component System
 * Orchestrates all components and handles loading, fallbacks, and integration
 */

// Import all section components
import HeroSection from './js/components/sections/HeroSection.js';
import AboutSection from './js/components/sections/AboutSection.js';
import SkillsSection from './js/components/sections/SkillsSection.js';
import ProjectsSection from './js/components/sections/ProjectsSection.js';
import ContactSection from './js/components/sections/ContactSection.js';
import FooterSection from './js/components/sections/FooterSection.js';

class ModularPortfolio {
  constructor() {
    this.components = new Map();
    this.loadingStates = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🚀 Initializing Modular Portfolio System...');
      
      // Show loading indicator
      this.showLoader();
      
      // Initialize components in priority order
      await this.initializeComponents();
      
      // Initialize additional features
      await this.initializeFeatures();
      
      // Hide loading screen
      this.hideLoader();
      
      this.initialized = true;
      console.log('✅ Modular Portfolio initialization complete!');
      
      // Trigger custom event for other scripts
      window.dispatchEvent(new CustomEvent('portfolioLoaded', {
        detail: { components: Array.from(this.components.keys()) }
      }));
      
    } catch (error) {
      console.error('❌ Portfolio initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  async initializeComponents() {
    // Component definitions with priority and configuration
    const componentConfigs = [
      { 
        name: 'hero', 
        class: HeroSection, 
        priority: 1, 
        critical: true,
        fallbackDelay: 2000 
      },
      { 
        name: 'about', 
        class: AboutSection, 
        priority: 2, 
        critical: false,
        dependencies: ['github'] 
      },
      { 
        name: 'skills', 
        class: SkillsSection, 
        priority: 3, 
        critical: false 
      },
      { 
        name: 'projects', 
        class: ProjectsSection, 
        priority: 2, 
        critical: false,
        dependencies: ['github'] 
      },
      { 
        name: 'contact', 
        class: ContactSection, 
        priority: 4, 
        critical: false 
      },
      { 
        name: 'footer', 
        class: FooterSection, 
        priority: 5, 
        critical: false 
      }
    ];

    // Sort by priority (lower number = higher priority)
    componentConfigs.sort((a, b) => a.priority - b.priority);

    // Separate critical and non-critical components
    const criticalComponents = componentConfigs.filter(config => config.critical);
    const nonCriticalComponents = componentConfigs.filter(config => !config.critical);

    console.log('📦 Loading critical components first...');
    await this.loadComponentsBatch(criticalComponents, true);

    console.log('📦 Loading non-critical components...');
    await this.loadComponentsBatch(nonCriticalComponents, false);
  }

  async loadComponentsBatch(componentConfigs, isCritical = false) {
    const promises = componentConfigs.map(async (config) => {
      try {
        const startTime = performance.now();
        
        // Create and store component instance
        const component = new config.class();
        this.components.set(config.name, component);
        this.loadingStates.set(config.name, 'loading');

        // Set timeout for fallback if specified
        let fallbackTimeout;
        if (config.fallbackDelay) {
          fallbackTimeout = setTimeout(() => {
            if (this.loadingStates.get(config.name) === 'loading') {
              console.warn(`⚠️ ${config.name} component taking too long, using fallback`);
              component.renderFallback();
              this.loadingStates.set(config.name, 'fallback');
            }
          }, config.fallbackDelay);
        }

        // Render component
        await component.render();
        
        // Clear fallback timeout if component loaded successfully
        if (fallbackTimeout) {
          clearTimeout(fallbackTimeout);
        }

        const loadTime = performance.now() - startTime;
        this.loadingStates.set(config.name, 'loaded');
        
        console.log(`✓ ${config.name} component loaded successfully (${Math.round(loadTime)}ms)`);
        
      } catch (error) {
        console.error(`❌ Failed to load ${config.name} component:`, error);
        await this.handleComponentError(config, error);
      }
    });

    // Handle promise resolution based on criticality
    if (isCritical) {
      // Wait for all critical components before continuing
      await Promise.all(promises);
    } else {
      // Allow non-critical components to load independently
      Promise.allSettled(promises);
    }
  }

  async handleComponentError(config, error) {
    const attempts = this.retryAttempts.get(config.name) || 0;
    
    if (attempts < this.maxRetries) {
      console.log(`🔄 Retrying ${config.name} component (attempt ${attempts + 1}/${this.maxRetries})`);
      this.retryAttempts.set(config.name, attempts + 1);
      
      // Exponential backoff delay
      const delay = Math.pow(2, attempts) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        const component = new config.class();
        this.components.set(config.name, component);
        await component.render();
        this.loadingStates.set(config.name, 'loaded');
        console.log(`✓ ${config.name} component loaded successfully on retry`);
      } catch (retryError) {
        await this.handleComponentError(config, retryError);
      }
    } else {
      console.error(`❌ ${config.name} component failed after ${this.maxRetries} attempts, using fallback`);
      
      // Use fallback rendering
      try {
        const component = new config.class();
        this.components.set(config.name, component);
        component.renderFallback();
        this.loadingStates.set(config.name, 'fallback');
        console.log(`⚠️ ${config.name} component using fallback content`);
      } catch (fallbackError) {
        console.error(`❌ ${config.name} fallback also failed:`, fallbackError);
        this.loadingStates.set(config.name, 'error');
      }
    }
  }

  async initializeFeatures() {
    try {
      // Initialize GitHub integration if available
      if (window.GitHub) {
        await this.initializeGitHubIntegration();
      }

      // Initialize theme system
      this.initializeThemeSystem();

      // Initialize smooth scrolling
      this.initializeSmoothScrolling();

      // Initialize performance monitoring
      this.initializePerformanceMonitoring();

      console.log('✓ Additional features initialized');
    } catch (error) {
      console.warn('⚠️ Some features failed to initialize:', error);
    }
  }

  async initializeGitHubIntegration() {
    try {
      console.log('🔗 Initializing GitHub integration...');
      
      // Update components with GitHub data
      const aboutComponent = this.components.get('about');
      const projectsComponent = this.components.get('projects');
      
      if (aboutComponent && typeof aboutComponent.loadGitHubData === 'function') {
        await aboutComponent.loadGitHubData();
      }
      
      if (projectsComponent && typeof projectsComponent.loadGitHubRepositories === 'function') {
        await projectsComponent.loadGitHubRepositories();
      }
      
      console.log('✓ GitHub integration initialized');
    } catch (error) {
      console.warn('⚠️ GitHub integration failed:', error);
    }
  }

  initializeThemeSystem() {
    // Initialize theme toggle functionality
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Notify components of theme change
    this.components.forEach(component => {
      if (typeof component.onThemeChange === 'function') {
        component.onThemeChange(newTheme);
      }
    });

    console.log(`🎨 Theme changed to: ${newTheme}`);
  }

  initializeSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  initializePerformanceMonitoring() {
    // Monitor performance metrics
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('📊 Performance Metrics:', {
            loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms',
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms',
            componentStates: this.getComponentLoadTimes()
          });
        }, 0);
      });
    }
  }

  getComponentLoadTimes() {
    const loadTimes = {};
    this.components.forEach((component, name) => {
      const state = this.loadingStates.get(name);
      loadTimes[name] = {
        state: state,
        retries: this.retryAttempts.get(name) || 0
      };
    });
    return loadTimes;
  }

  showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'flex';
      loader.style.opacity = '1';
    }
  }

  hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        document.body.style.visibility = 'visible';
      }, 500);
    } else {
      document.body.style.visibility = 'visible';
    }
  }

  handleInitializationError(error) {
    console.error('Portfolio initialization failed:', error);
    
    // Show error boundary
    const errorBoundary = document.getElementById('error-boundary');
    if (errorBoundary) {
      errorBoundary.classList.remove('hidden');
    }
    
    // Hide loader
    this.hideLoader();
    
    // Track error if analytics available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });
    }
  }

  // Public API methods for component management
  getComponent(name) {
    return this.components.get(name);
  }

  getComponentState(name) {
    return this.loadingStates.get(name);
  }

  async reloadComponent(name) {
    const component = this.components.get(name);
    if (component) {
      console.log(`🔄 Reloading ${name} component...`);
      this.loadingStates.set(name, 'loading');
      
      try {
        await component.render();
        this.loadingStates.set(name, 'loaded');
        console.log(`✓ ${name} component reloaded successfully`);
      } catch (error) {
        console.error(`❌ Failed to reload ${name}:`, error);
        component.renderFallback();
        this.loadingStates.set(name, 'fallback');
      }
    }
  }

  getSystemStatus() {
    return {
      initialized: this.initialized,
      componentCount: this.components.size,
      loadedComponents: Array.from(this.loadingStates.entries())
        .filter(([name, state]) => state === 'loaded')
        .map(([name]) => name),
      failedComponents: Array.from(this.loadingStates.entries())
        .filter(([name, state]) => state === 'error')
        .map(([name]) => name)
    };
  }
}

// Initialize the modular portfolio system
const portfolio = new ModularPortfolio();

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => portfolio.init());
} else {
  portfolio.init();
}

// Make portfolio instance globally accessible for debugging and external access
window.Portfolio = portfolio;

// Export for ES6 module usage
export default portfolio; 