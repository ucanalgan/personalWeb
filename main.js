/**
 * Modern Portfolio Application
 * Clean, fast, and feature-rich portfolio with advanced UX
 */

// Import modern utilities
import { themeManager } from './utils/theme.js';
import { TypingAnimation, scrollReveal } from './utils/animations.js';
import { scrollSpy } from './utils/scrollSpy.js';
import { ComponentLoader } from './js/components/ComponentLoader.js';
import { initAnalytics } from './utils/analytics.js';

class ModernPortfolio {
  constructor() {
    this.componentLoader = null;
    this.typingAnimation = null;
    this.isInitialized = false;
    this.animationObserver = null;
    this.analytics = null;
    
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Initializing Modern Portfolio...');
      
      // Initialize core systems
      await this.initComponents();
      this.initAnalytics();
      this.initAnimations();
      this.initNavigation();
      this.initScrollEffects();
      this.initPerformanceOptimizations();
      
      // Mark as ready
      this.isInitialized = true;
      this.hideLoader();
      
      console.log('✅ Portfolio initialized successfully!');
      
    } catch (error) {
      console.error('❌ Portfolio initialization failed:', error);
      this.showError();
    }
  }

  async initComponents() {
    this.componentLoader = new ComponentLoader();
    await this.componentLoader.init();
    
    // Initialize projects section after components load
    setTimeout(() => {
      this.initProjectsInteractivity();
    }, 1500);
  }

  initAnalytics() {
    try {
      this.analytics = initAnalytics();
      console.log('📊 Analytics initialized successfully');
    } catch (error) {
      console.warn('⚠️ Analytics initialization failed:', error);
    }
  }

  initProjectsInteractivity() {
    // Import and initialize projects section
    import('./js/components/sections/ProjectsSection.js').then(({ initProjectsSection }) => {
      if (initProjectsSection) {
        initProjectsSection();
      }
    }).catch(error => {
      console.warn('Projects section functionality not available:', error);
    });

    // Import and initialize contact section
    import('./js/components/sections/ContactSection.js').then(({ initContactSection }) => {
      if (initContactSection) {
        initContactSection();
      }
    }).catch(error => {
      console.warn('Contact section functionality not available:', error);
    });
  }

  initAnimations() {
    // Initialize typing animation in hero section
    setTimeout(() => {
      const typingElement = document.getElementById('typing-text');
      if (typingElement) {
        this.typingAnimation = new TypingAnimation(typingElement, [
          'Full Stack Applications',
          'Modern Web Experiences', 
          'Scalable Solutions',
          'Beautiful UI/UX',
          'Clean Architecture'
        ], {
          typeSpeed: 80,
          deleteSpeed: 50,
          pauseTime: 2500,
          loop: true,
          natural: true
        });
      }
    }, 500);

    // Initialize scroll reveal animations
    this.initScrollReveal();
  }

  initScrollReveal() {
    setTimeout(() => {
      // Add animation classes to elements
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        if (index % 2 === 0) {
          section.classList.add('fade-in-up');
        } else {
          section.classList.add('fade-in-left');
        }
      });

      // Cards and project items
      document.querySelectorAll('.card, .project-card').forEach(card => {
        card.classList.add('scale-in');
      });

      // Skills items
      document.querySelectorAll('.skill-item').forEach(skill => {
        skill.classList.add('fade-in-right');
      });

      // Start observing
      scrollReveal.observeAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    }, 1000);
  }

  initNavigation() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileMenu(mobileMenuBtn, mobileMenu);
      });

      // Close menu when clicking nav links
      mobileMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu(mobileMenuBtn, mobileMenu);
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          this.closeMobileMenu(mobileMenuBtn, mobileMenu);
        }
      });

      // Close menu on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileMenu(mobileMenuBtn, mobileMenu);
        }
      });
    }
  }

  toggleMobileMenu(btn, menu) {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isOpen);
    menu.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  closeMobileMenu(btn, menu) {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  initScrollEffects() {
    // Smooth header background on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const header = document.querySelector('.header');
      
      if (header) {
        if (currentScrollY > 100) {
          header.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
          header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
          header.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
          header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }

    // Performance monitoring
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`📊 Page loaded in ${loadTime}ms`);
    });
  }

  hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.remove();
        document.body.classList.remove('loading');
      }, 500);
    }
  }

  showError() {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-overlay fixed inset-0 bg-bg-primary/95 backdrop-blur-sm z-50 flex items-center justify-center';
    errorEl.innerHTML = `
      <div class="text-center p-8 max-w-md mx-auto">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-text-primary mb-4">Oops! Something went wrong</h2>
        <p class="text-text-secondary mb-6">
          The portfolio couldn't load properly. Please check your connection and try again.
        </p>
        <button onclick="window.location.reload()" class="btn-base btn-primary">
          <i class="ri-refresh-line mr-2"></i>
          Try Again
        </button>
      </div>
    `;
    document.body.appendChild(errorEl);
  }

  // Public API methods
  getCurrentTheme() {
    return themeManager.getCurrentTheme();
  }

  getComponent(name) {
    return this.componentLoader?.getComponent(name);
  }

  isReady() {
    return this.isInitialized;
  }

  destroy() {
    if (this.typingAnimation) {
      this.typingAnimation.destroy();
    }
    
    if (scrollReveal) {
      scrollReveal.destroy();
    }
    
    if (scrollSpy) {
      scrollSpy.destroy();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new ModernPortfolio();
  });
} else {
  window.portfolio = new ModernPortfolio();
}

// Register service worker for PWA capabilities
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch(() => console.log('❌ Service Worker registration failed'));
  });
}

export default ModernPortfolio; 