import { config, select, selectAll, scrollTo, isInViewport } from './utils.js';

// Persistent filter state
export let currentFilter = null;

// Tech data for skill bars
export const techData = {
  'Python': { percentage: 90, color: 'rgb(88, 123, 206)', projects: ['ai-chat-bot', 'finance-analysis'] },
  'C': { percentage: 85, color: 'rgb(255, 99, 132)', projects: [] },
  'C++': { percentage: 80, color: 'rgb(54, 162, 235)', projects: [] },
  'HTML': { percentage: 95, color: 'rgb(255, 159, 64)', projects: ['portfolio'] },
  'CSS': { percentage: 90, color: 'rgb(75, 192, 192)', projects: ['portfolio'] },
  'JavaScript': { percentage: 85, color: 'rgb(153, 102, 255)', projects: ['task-manager', 'league-tracker', 'portfolio'] },
  'Java': { percentage: 75, color: 'rgb(255, 205, 86)', projects: ['inventory-system'] }
};

// DOM Elements
export const elements = {
  header: select('header'),
  mobileMenu: select('.mobile-menu'),
  mobileMenuBtn: select('.mobile-menu-btn'),
  mobileMenuCloseBtn: select('.mobile-menu-close'),
  scrollTopBtn: select('#scroll-top'),
  navLinks: selectAll('.nav-link'),
  sections: selectAll('section[id]'),
  skillCards: selectAll('.skill-card'),
  projectCards: selectAll('.project-card')
};

// Event Handlers
export const handlers = {
  scroll: () => {
    const scrolled = window.scrollY > config.scroll.threshold;
    const { scrollTopBtn, header, navLinks, sections } = elements;
    // Scroll Top Button Visibility
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('opacity-100', scrolled);
      scrollTopBtn.classList.toggle('pointer-events-auto', scrolled);
    }
    // Header Shadow
    if (header) {
      header.classList.toggle('shadow-lg', scrolled);
    }
    // Active Section Detection
    sections.forEach(section => {
      if (isInViewport(section)) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
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

// Animate sections when visible
export function initializeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });
  selectAll('.section-animate').forEach(el => observer.observe(el));
}

// Mobile menu open/close
export function initializeMobileMenu() {
  const menuBtn = elements.mobileMenuBtn;
  const closeBtn = elements.mobileMenuCloseBtn;
  const mobileMenu = elements.mobileMenu;
  const mobileLinks = selectAll('.mobile-menu a');
  if (!menuBtn || !closeBtn || !mobileMenu) return;
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    requestAnimationFrame(() => mobileMenu.classList.add('opacity-100'));
  });
  const closeMobile = () => {
    mobileMenu.classList.remove('opacity-100');
    setTimeout(() => mobileMenu.classList.add('hidden'), 300);
  };
  closeBtn.addEventListener('click', closeMobile);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobile));
}

// Header hide/show and scroll-to-top functionality
export function initializeScrollEvents() {
  const header = elements.header;
  const scrollBtn = elements.scrollTopBtn;
  let lastScroll = 0, scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(() => {
      const current = window.pageYOffset;
      if (header) {
        if (current > 50) {
          header.classList.add('backdrop-blur-lg', 'shadow-lg');
        } else {
          header.classList.remove('backdrop-blur-lg', 'shadow-lg');
        }
        if (current > lastScroll && current > 100) header.style.transform = 'translateY(-100%)';
        else header.style.transform = 'translateY(0)';
      }
      if (scrollBtn) {
        if (current > 500) scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
        else scrollBtn.classList.add('opacity-0', 'pointer-events-none');
      }
      lastScroll = current;
    });
  });
  scrollBtn?.addEventListener('click', handlers.scrollTop);
}

// Skill bars animation
export function initializeSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-progress-bar');
        const skill = entry.target.getAttribute('data-skill');
        if (bar && techData[skill]) bar.style.width = `${techData[skill].percentage}%`;
      }
    });
  }, { threshold: 0.1 });
  const container = select('.skills-container');
  if (container) {
    Object.entries(techData).forEach(([skill, data]) => {
      const el = document.createElement('div');
      el.className = 'mb-4';
      el.setAttribute('data-skill', skill);
      el.innerHTML = `
        <div class="flex justify-between mb-1">
          <span class="text-sm font-medium text-gray-300">${skill}</span>
          <span class="text-sm font-medium text-primary">${data.percentage}%</span>
        </div>
        <div class="skill-progress">
          <div class="skill-progress-bar w-0"></div>
        </div>
      `;
      container.appendChild(el);
      observer.observe(el);
    });
  }
}

// Scroll reveal animations
export function initializeScrollAnimations() {
  const elems = selectAll('.scroll-animate');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('not-visible');
      } else {
        entry.target.classList.remove('visible');
        entry.target.classList.add('not-visible');
      }
    });
  }, { threshold: 0.2, rootMargin: '-50px' });
  elems.forEach(el => { el.classList.add('not-visible'); observer.observe(el); });
}

// Project filtering
export function filterProjects(technology) {
  const cards = selectAll('.project-card');
  if (!technology) {
    cards.forEach(c => { c.style.display = 'flex'; setTimeout(() => { c.style.opacity = 1; c.style.transform = 'translateY(0)'; }, 50); });
    currentFilter = null;
    return;
  }
  cards.forEach(c => {
    const techs = c.dataset.technologies?.split(',') || [];
    const show = techs.includes(technology);
    if (show) {
      c.style.display = 'flex';
      setTimeout(() => { c.style.opacity = 1; c.style.transform = 'translateY(0)'; }, 50);
    } else {
      c.style.opacity = 0;
      c.style.transform = 'translateY(20px)';
      setTimeout(() => { c.style.display = 'none'; }, 300);
    }
  });
  currentFilter = technology;
} 