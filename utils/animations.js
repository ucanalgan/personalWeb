// File: js/animations.js
// Description: Animation utilities and scroll animations for the portfolio

import { debounce } from './debounce.js';
import { isInViewport } from './utils.js';

/**
 * Setup scroll animations with intersection observer
 */
export function setupScrollAnimations() {
  // Create intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Unobserve after animation to improve performance
        scrollAnimationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with scroll animation classes
  const animatedElements = document.querySelectorAll(
    '[data-aos], .fade-in, .slide-in, .scale-in, .animate-on-scroll'
  );

  animatedElements.forEach(element => {
    scrollAnimationObserver.observe(element);
  });

  console.log(`Scroll animations setup for ${animatedElements.length} elements`);
}

/**
 * Initialize GSAP animations (if GSAP is loaded)
 */
export function initGSAPAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping GSAP animations');
    return;
  }

  // Hero section animations
  initHeroAnimations();
  
  // Section reveal animations
  initSectionRevealAnimations();
  
  // Button hover animations
  initButtonAnimations();
  
  // Project card animations
  initProjectCardAnimations();
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const heroTimeline = gsap.timeline();
  
  heroTimeline
    .from('.hero-title', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    })
    .from('.hero-subtitle', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-description', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.hero-buttons .btn', {
      duration: 0.6,
      y: 20,
      opacity: 0,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.hero-stats', {
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.2');
}

/**
 * Section reveal animations
 */
function initSectionRevealAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Animate sections on scroll
  gsap.utils.toArray('section').forEach((section, index) => {
    gsap.fromTo(section, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Animate skill bars
  gsap.utils.toArray('.skill-progress').forEach(bar => {
    const percentage = bar.dataset.percentage || 0;
    
    gsap.fromTo(bar,
      { width: '0%' },
      {
        width: `${percentage}%`,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/**
 * Button hover animations
 */
function initButtonAnimations() {
  if (typeof gsap === 'undefined') return;

  // Primary buttons
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  // Secondary buttons
  document.querySelectorAll('.btn-secondary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Project card animations
 */
function initProjectCardAnimations() {
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('.project-card, .github-project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(card.querySelector('.project-image'), {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(card.querySelector('.project-image'), {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Parallax scrolling effect
 */
export function initParallaxScrolling() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Parallax elements
  gsap.utils.toArray('.parallax').forEach(element => {
    gsap.to(element, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/**
 * Text reveal animation
 */
export function initTextRevealAnimation() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Split text into lines and animate
  gsap.utils.toArray('.text-reveal').forEach(element => {
    const lines = element.textContent.split('\n');
    element.innerHTML = lines.map(line => 
      `<span class="line">${line}</span>`
    ).join('');

    gsap.fromTo(element.querySelectorAll('.line'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/**
 * Floating animation for elements
 */
export function initFloatingAnimation() {
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('.floating').forEach(element => {
    gsap.to(element, {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });
  });
}

/**
 * Loading animation
 */
export function initLoadingAnimation() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  if (typeof gsap !== 'undefined') {
    // GSAP loading animation
    const tl = gsap.timeline();
    
    tl.to('.loader-spinner', {
      rotation: 360,
      duration: 1,
      ease: 'linear',
      repeat: -1
    })
    .to('.loader-text', {
      opacity: 0.5,
      duration: 1,
      yoyo: true,
      repeat: -1
    }, 0);
  } else {
    // CSS fallback animation
    const spinner = loader.querySelector('.loader-spinner');
    if (spinner) {
      spinner.style.animation = 'spin 1s linear infinite';
    }
  }
}

/**
 * Page transition animations
 */
export function initPageTransitions() {
  if (typeof gsap === 'undefined') return;

  // Fade in page content
  gsap.from('main', {
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
}

/**
 * Initialize all animations
 */
export function initAllAnimations() {
  // Setup scroll animations
  setupScrollAnimations();
  
  // Initialize GSAP animations if available
  if (typeof gsap !== 'undefined') {
    initGSAPAnimations();
    initParallaxScrolling();
    initTextRevealAnimation();
    initFloatingAnimation();
    initPageTransitions();
  }
  
  // Initialize loading animation
  initLoadingAnimation();
  
  console.log('All animations initialized');
}

/**
 * Performance-optimized scroll handler
 */
export const handleScrollAnimations = debounce(() => {
  // Handle scroll-based animations without GSAP
  const elements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
  
  elements.forEach(element => {
    if (isInViewport(element, 0.1)) {
      element.classList.add('animated', 'fadeInUp');
    }
  });
}, 100);

/**
 * Initialize skill progress animations with new CSS classes
 */
export function initSkillProgressAnimations() {
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  
  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const percentage = bar.getAttribute('data-percentage');
          
          // Use CSS custom property to animate to target width
          setTimeout(() => {
            bar.classList.add('animate');
          }, 200); // Small delay for better UX
          
          skillObserver.unobserve(bar);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    });
    
    skillBars.forEach(bar => skillObserver.observe(bar));
  } else {
    // Fallback for older browsers
    skillBars.forEach(bar => {
      bar.classList.add('animate');
    });
  }
}

/**
 * Utility functions for visibility management
 */
export const VisibilityUtils = {
  /**
   * Show element with optional display type
   */
  show(element, displayType = 'block') {
    if (!element) return;
    
    element.classList.remove('js-hidden');
    if (displayType === 'flex') {
      element.classList.add('js-flex');
    } else {
      element.classList.add('js-visible');
    }
  },
  
  /**
   * Hide element
   */
  hide(element) {
    if (!element) return;
    
    element.classList.remove('js-visible', 'js-flex');
    element.classList.add('js-hidden');
  },
  
  /**
   * Toggle element visibility
   */
  toggle(element, displayType = 'block') {
    if (!element) return;
    
    if (element.classList.contains('js-hidden')) {
      this.show(element, displayType);
    } else {
      this.hide(element);
    }
  },
  
  /**
   * Show multiple elements
   */
  showMultiple(selector, displayType = 'block') {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => this.show(el, displayType));
  },
  
  /**
   * Hide multiple elements
   */
  hideMultiple(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => this.hide(el));
  }
};

/**
 * Update navigation progress bar
 */
export function updateNavProgress(percentage) {
  const progressBar = document.getElementById('nav-progress');
  if (progressBar) {
    // Remove initial class and set width
    progressBar.classList.remove('nav-progress-initial');
    progressBar.style.width = `${percentage}%`;
  }
}

// Export for main.js compatibility
export { initAllAnimations as default }; 