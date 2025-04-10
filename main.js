import { initBackground3D } from './background3d.js';
import { initAllAnimations } from './animations.js';
import { initTheme } from './theme.js';

/**
 * Modern Personal Website
 * @author Umutcan Algan
 * @version 4.0.0
 */

// Configuration
const config = {
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  scroll: {
    threshold: 100,
    smooth: true,
  },
  mobile: {
    breakpoint: 768,
  }
};

// DOM Elements
const elements = {
  header: document.querySelector('header'),
  mobileMenu: document.querySelector('.mobile-menu'),
  mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
  mobileMenuCloseBtn: document.querySelector('.mobile-menu-close'),
  scrollTopBtn: document.querySelector('#scroll-top'),
  navLinks: document.querySelectorAll('.nav-link'),
  sections: document.querySelectorAll('section[id]'),
  skillCards: document.querySelectorAll('.skill-card'),
  projectCards: document.querySelectorAll('.project-card')
};

// Helper Functions
const utils = {
  // DOM Helpers
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => document.querySelectorAll(selector),
  
  // Class Helpers
  addClass: (element, className) => element?.classList.add(className),
  removeClass: (element, className) => element?.classList.remove(className),
  toggleClass: (element, className, force) => element?.classList.toggle(className, force),
  hasClass: (element, className) => element?.classList.contains(className),
  
  // Scroll Helpers
  scrollTo: (element, options = {}) => {
    const defaults = {
      behavior: config.scroll.smooth ? 'smooth' : 'auto',
      block: 'start',
    };
    element?.scrollIntoView({ ...defaults, ...options });
  },
  
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top <= windowHeight &&
      rect.bottom >= 0 &&
      rect.left <= windowWidth &&
      rect.right >= 0
    );
  }
};

// Event Handlers
const handlers = {
  scroll: () => {
    const scrolled = window.scrollY > config.scroll.threshold;
    
    // Scroll Top Button
    if (elements.scrollTopBtn) {
      elements.scrollTopBtn.classList.toggle('opacity-100', scrolled);
      elements.scrollTopBtn.classList.toggle('pointer-events-auto', scrolled);
    }
    
    // Header Shadow
    if (elements.header) {
      elements.header.classList.toggle('shadow-lg', scrolled);
    }
    
    // Active Section Detection
    elements.sections.forEach(section => {
      if (utils.isInViewport(section)) {
        const id = section.getAttribute('id');
        elements.navLinks.forEach(link => {
          link.classList.toggle('text-primary', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  
  toggleMobileMenu: (force) => {
    const isOpen = force ?? !elements.mobileMenu.classList.contains('hidden');
    elements.mobileMenu.classList.toggle('hidden', !isOpen);
    document.body.classList.toggle('overflow-hidden', isOpen);
  },
  
  scrollTop: () => {
    window.scrollTo({
      top: 0,
      behavior: config.scroll.smooth ? 'smooth' : 'auto'
    });
  }
};

// Project Filter
let currentFilter = null;

// Filter projects
function filterProjects(tech) {
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!tech) {
    // Show all projects
    projectCards.forEach(card => {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }, 50);
    });
    currentFilter = null;
    return;
  }
  
  // Filter by specific technology
  projectCards.forEach(card => {
    const technologies = card.dataset.technologies ? card.dataset.technologies.split(',') : [];
    const hasMatch = technologies.includes(tech);
    
    if (hasMatch) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
  
  currentFilter = tech;
}

// Intersection Observer for visibility animations
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  // Observer for scroll-animate elements
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('not-visible');
      }
    });
  }, observerOptions);
  
  // Observe all .scroll-animate elements
  document.querySelectorAll('.scroll-animate').forEach(element => {
    element.classList.add('not-visible'); // Initially hidden
    animationObserver.observe(element);
  });
  
  // Observer for active section
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-primary');
          } else {
            link.classList.remove('text-primary');
          }
        });
      }
    });
  }, {
    threshold: 0.3
  });
  
  // Observe all sections
  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });
}

// Page Initialization
function initApp() {
  // Initialize theme
  initTheme();
  
  // Initialize 3D background
  if (window.innerWidth > 768) {
    initBackground3D();
  }
  
  // Initialize GSAP animations
  initAllAnimations();
  
  // Initialize Intersection Observer
  initIntersectionObserver();
  
  // Scroll event listener
  window.addEventListener('scroll', handlers.scroll);
  
  // Mobile menu buttons
  if (elements.mobileMenuBtn) {
    elements.mobileMenuBtn.addEventListener('click', () => handlers.toggleMobileMenu(true));
  }
  
  if (elements.mobileMenuCloseBtn) {
    elements.mobileMenuCloseBtn.addEventListener('click', () => handlers.toggleMobileMenu(false));
  }
  
  // Mobile menu links
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => handlers.toggleMobileMenu(false));
  });
  
  // Scroll to top button
  if (elements.scrollTopBtn) {
    elements.scrollTopBtn.addEventListener('click', handlers.scrollTop);
  }
  
  // Filter buttons
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const tech = button.dataset.filter;
      filterProjects(tech === currentFilter ? null : tech);
      
      // Update active filter button
      document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === tech && tech === currentFilter);
      });
    });
  });
  
  // All ready, remove loading animation
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }, 800);
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp); 