import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Hero section animations
export function initHeroAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Hero title animation
  gsap.from('.hero-title', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    duration: 1,
    ease: 'power3.out'
  });
  
  // Hero subtitle animation
  gsap.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  });
  
  // Hero content animation
  gsap.from('.hero-content', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.4,
    duration: 1,
    delay: 0.6,
    ease: 'power3.out'
  });
  
  // Hero image animation
  gsap.from('.hero-image', {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: 'back.out(1.5)'
    duration: 1.2,
    delay: 0.4,
    ease: 'back.out(1.7)'
  });
}

// Skills section animations
export function initSkillsAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  gsap.from('.skill-card', {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  gsap.from('.skill-level', {
    scrollTrigger: {
      trigger: '.skill-item',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    width: 0,
    duration: 1.5,
    stagger: 0.1,
    ease: 'power2.out'
  });
}

// GitHub section animations
export function initGitHubAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Simple fade in with minimal movement
  gsap.from('#github .scroll-animate', {
    scrollTrigger: {
      trigger: '#github',
      start: 'top 85%',
      once: true
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });
}

// Projects section animations
export function initProjectsAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  });
}

// Contact section animations
export function initContactAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  gsap.from('#contact .section-title', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
      once: true
    },
    y: 20,
    opacity: 0,
    duration: 0.6
    },
    y: 30,
    opacity: 0,
    duration: 0.8
  });
  
  gsap.from('#contact form', {
    scrollTrigger: {
      trigger: '#contact form',
      start: 'top 85%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.3
  });
}

// Initialize all animations on page load
export function initAllAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Set a small delay before initializing animations to prevent initial page lag
  setTimeout(() => {
    initHeroAnimations();
    initSkillsAnimations();
    initGitHubAnimations();
    initContactAnimations();
    
    // General animations with scroll trigger - simplified for better performance
    gsap.utils.toArray('.scroll-animate').forEach((element) => {
      if (!element.closest('#skills') && !element.closest('#github') && !element.closest('#contact')) {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true // Only trigger once to prevent repeated animations
          },
          y: 20, // Less movement
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
  }, 100);
  initHeroAnimations();
  initSkillsAnimations();
  initProjectsAnimations();
  initContactAnimations();
  
  // General animations with scroll trigger
  gsap.utils.toArray('.scroll-animate').forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
} 
