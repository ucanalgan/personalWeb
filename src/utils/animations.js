// File: js/animations.js
// Description: Animation utilities and scroll animations for the portfolio

import { debounce , isInViewport } from './utils.js';

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

  // Scroll animations initialized
}

/**
 * Initialize GSAP animations if available
 */
function initGSAP() {
  if (typeof gsap !== 'undefined') {
    // GSAP is available, enhance animations
    gsap.registerPlugin(ScrollTrigger);

    // Enhanced scroll animations
    gsap.utils.toArray('.animate-on-scroll').forEach(element => {
      gsap.fromTo(element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  } else {
    // GSAP not available, silent fallback in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn('GSAP not loaded, skipping GSAP animations');
    }
  }
}

/**
 * Hero section animations
 */
function _initHeroAnimations() {
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
function _initSectionRevealAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Animate sections on scroll
  gsap.utils.toArray('section').forEach((section, _index) => {
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
    const _percentage = bar.dataset.percentage || 0;

    gsap.fromTo(bar,
      { width: '0%' },
      {
        width: `${_percentage}%`,
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
function _initButtonAnimations() {
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
function _initProjectCardAnimations() {
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
  initGSAP();
  initParallaxScrolling();
  initTextRevealAnimation();
  initFloatingAnimation();
  initPageTransitions();


  // All animations initialized
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
          const _percentage = bar.getAttribute('data-percentage');

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

/**
 * Advanced Animation Utilities
 * High-performance animations for portfolio
 */

/**
 * Scroll reveal animations with Intersection Observer
 */
export class ScrollReveal {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      reset: false,
      ...options
    };

    this.observer = this.createObserver();
    this.elements = new Set();
  }

  createObserver() {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.revealElement(entry.target);
          if (!this.options.reset) {
            this.observer.unobserve(entry.target);
          }
        } else if (this.options.reset) {
          this.hideElement(entry.target);
        }
      });
    }, this.options);
  }

  observe(selector) {
    const elements = typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : [selector];

    elements.forEach(element => {
      if (element) {
        this.elements.add(element);
        this.observer.observe(element);
        element.classList.add('reveal-pending');
      }
    });
  }

  observeAll(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => this.observe(element));
  }

  revealElement(element) {
    element.classList.remove('reveal-pending');
    element.classList.add('revealed');
  }

  hideElement(element) {
    element.classList.remove('revealed');
    element.classList.add('reveal-pending');
  }

  destroy() {
    this.observer.disconnect();
    this.elements.clear();
  }
}

/**
 * Typing animation effect
 */
export class TypingAnimation {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {
      words: ['Developer', 'Designer', 'Creator'],
      typeSpeed: 100,
      deleteSpeed: 50,
      delayBetweenWords: 2000,
      loop: true,
      cursor: true,
      ...options
    };

    this.currentWordIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.timeoutId = null;

    if (this.element && this.options.cursor) {
      this.element.style.borderRight = '2px solid var(--primary)';
    }
  }

  start() {
    if (!this.element) return;
    this.type();
  }

  type() {
    const currentWord = this.options.words[this.currentWordIndex];
    const shouldDelete = this.isDeleting;

    if (shouldDelete) {
      // Deleting characters
      this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      // Adding characters
      this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    let nextDelay = shouldDelete ? this.options.deleteSpeed : this.options.typeSpeed;

    if (!shouldDelete && this.currentCharIndex === currentWord.length) {
      // Word complete, start deleting after delay
      nextDelay = this.options.delayBetweenWords;
      this.isDeleting = true;
    } else if (shouldDelete && this.currentCharIndex === 0) {
      // Deletion complete, move to next word
      this.isDeleting = false;
      this.currentWordIndex = (this.currentWordIndex + 1) % this.options.words.length;

      if (this.currentWordIndex === 0 && !this.options.loop) {
        return; // Stop animation if not looping
      }
    }

    this.timeoutId = setTimeout(() => this.type(), nextDelay);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  destroy() {
    this.stop();
    if (this.element) {
      this.element.style.borderRight = '';
    }
  }
}

/**
 * Page transition animations
 */
export class PageTransitions {
  constructor() {
    this.isTransitioning = false;
  }

  fadeIn(element, duration = 300) {
    return new Promise(resolve => {
      element.style.opacity = '0';
      element.style.transition = `opacity ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  }

  fadeOut(element, duration = 300) {
    return new Promise(resolve => {
      element.style.opacity = '1';
      element.style.transition = `opacity ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.opacity = '0';
        setTimeout(resolve, duration);
      });
    });
  }

  slideUp(element, duration = 400) {
    return new Promise(resolve => {
      element.style.transform = 'translateY(20px)';
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  }

  scaleIn(element, duration = 300) {
    return new Promise(resolve => {
      element.style.transform = 'scale(0.95)';
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  }
}

/**
 * Parallax scroll effect
 */
export class ParallaxScroll {
  constructor(elements, options = {}) {
    this.elements = typeof elements === 'string'
      ? document.querySelectorAll(elements)
      : elements;
    this.options = {
      speed: 0.5,
      ...options
    };

    this.ticking = false;
    this.handleScroll = this.handleScroll.bind(this);
  }

  init() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateElements();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateElements() {
    const scrolled = window.pageYOffset;

    this.elements.forEach(element => {
      const rate = scrolled * this.options.speed;
      element.style.transform = `translateY(${rate}px)`;
    });
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

/**
 * Initialize all animations
 */
export function initAnimations() {
  // Initialize scroll reveal
  const scrollReveal = new ScrollReveal({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe common animated elements
  scrollReveal.observeAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');

  // Initialize typing animation if element exists
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const typingAnimation = new TypingAnimation(typingElement, {
      words: ['Full-Stack Developer', 'Problem Solver', 'Tech Enthusiast'],
      typeSpeed: 80,
      deleteSpeed: 60,
      delayBetweenWords: 2000
    });
    typingAnimation.start();
  }

  // Initialize parallax if elements exist
  const parallaxElements = document.querySelectorAll('.parallax');
  if (parallaxElements.length > 0) {
    const parallax = new ParallaxScroll(parallaxElements, { speed: 0.3 });
    parallax.init();
  }

  return {
    scrollReveal,
    typingAnimation: window.typingAnimation,
    parallax: window.parallax
  };
}

// Create global scroll reveal instance
export const scrollReveal = new ScrollReveal();

export default {
  ScrollReveal,
  TypingAnimation,
  PageTransitions,
  ParallaxScroll,
  initAnimations,
  scrollReveal
};
