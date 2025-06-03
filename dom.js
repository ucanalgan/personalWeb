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
  scrollTopButtons: selectAll('#scroll-top, .scroll-top-button'),
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
  // Initialize fade state
  mobileMenu.classList.add('opacity-0');
  // Open menu with fade-in and prevent body scroll
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    mobileMenu.classList.remove('opacity-0');
    document.body.classList.add('overflow-hidden');
  });
  // Helper to close menu with fade-out and restore body scroll
  const hideMenu = () => {
    mobileMenu.classList.add('opacity-0');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('translate-x-full');
    }, 200);
  };
  // Close menu on close button click
  closeBtn.addEventListener('click', hideMenu);
  // Close menu when a link is clicked
  mobileLinks.forEach(link => link.addEventListener('click', hideMenu));
}

// Header hide/show and scroll-to-top functionality
export function initializeScrollEvents() {
  const header = elements.header;
  const scrollBtn = elements.scrollTopBtn;
  const scrollButtons = elements.scrollTopButtons; // Tüm scroll buttonları
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
      
      // Tüm scroll buttonları için aynı davranış
      if (scrollButtons) {
        scrollButtons.forEach(btn => {
          if (current > 500) {
            btn.classList.remove('opacity-0', 'pointer-events-none');
            btn.classList.add('opacity-100', 'pointer-events-auto');
          } else {
            btn.classList.add('opacity-0', 'pointer-events-none');
            btn.classList.remove('opacity-100', 'pointer-events-auto');
          }
        });
      }
      
      lastScroll = current;
    });
  });
  
  // Tüm scroll buttonları için click event
  scrollButtons?.forEach(btn => {
    btn.addEventListener('click', handlers.scrollTop);
  });
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
    // Remove filter UI when no filter
    const filterBtns = selectAll('[data-filter]');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    const infoDiv = document.getElementById('filter-info');
    if (infoDiv) infoDiv.remove();
    return;
  }
  cards.forEach(c => {
    // Retrieve technology tags from project card
    const techTags = c.querySelectorAll('.tech-tag');
    const techs = techTags.length ? Array.from(techTags).map(tag => tag.dataset.filter) : [];
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
  // Update filter buttons active state
  const filterBtns = selectAll('[data-filter]');
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === technology);
  });
  // Display active filter info
  const projectContainer = document.getElementById('github-projects');
  let infoDiv = document.getElementById('filter-info');
  if (!infoDiv && projectContainer) {
    infoDiv = document.createElement('div');
    infoDiv.id = 'filter-info';
    infoDiv.className = 'mb-4 text-center font-semibold';
    projectContainer.parentNode.insertBefore(infoDiv, projectContainer);
  }
  if (infoDiv) {
    infoDiv.textContent = `You are viewing: [${technology}]`;
  }
} 
