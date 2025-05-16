import './style.css';
import * as utils from './utils.js';
import { initFormValidation } from './form-handler.js';
import { initTheme } from './theme.js';
import {
  elements,
  handlers,
  initializeAnimations,
  initializeMobileMenu,
  initializeScrollEvents,
  initializeSkillBars,
  initializeScrollAnimations,
  filterProjects,
  currentFilter
} from './dom.js';

// Main application initialization
export function initApp() {
  // Detect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Defer AOS animations initialization until idle
  if (!prefersReducedMotion && window.AOS) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => window.AOS.init({ duration: 800, once: true }));
    } else {
      setTimeout(() => window.AOS.init({ duration: 800, once: true }), 200);
    }
  }

  // Initialize theme based on user preference and setup toggle button
  initTheme();

  // Section animations if motion is not reduced
  if (!prefersReducedMotion) initializeAnimations();

  // Mobile menu setup
  initializeMobileMenu();

  // Scroll behaviors
  initializeScrollEvents();

  // Skill bars animation
  initializeSkillBars();

  // Scroll reveal animations if motion is not reduced
  if (!prefersReducedMotion) initializeScrollAnimations();

  // Global scroll listener
  window.addEventListener('scroll', handlers.scroll);

  // Scroll to top button
  elements.scrollTopBtn?.addEventListener('click', handlers.scrollTop);

  // Navigation link smooth scrolling
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        utils.scrollTo(target);
      }
    });
  });

  // Mobile menu smooth scrolling
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        utils.scrollTo(target);
      }
    });
  });

  // Project filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tech = btn.dataset.filter;
      filterProjects(tech === currentFilter ? null : tech);
      document.querySelectorAll('[data-filter]').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === tech && tech === currentFilter);
      });
    });
  });

  // Initialize form validation on the contact form
  initFormValidation('#contact-form');

  // Fetch GitHub projects into the `#github-projects` container
  const githubUsername = 'ucanalgan';
  const container = document.getElementById('github-projects');
  if (!container) {
    console.error('`#github-projects` element not found!');
  } else {
    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`)
      .then(res => res.json())
      .then(repos => {
        container.innerHTML = ''; // clear spinner/loading state
        repos.forEach((repo, index) => {
          setTimeout(() => {
            const card = document.createElement('div');
            card.className = 'project-card group';
            card.innerHTML = `
              <h3 class="text-lg font-semibold text-primary flex items-center gap-2">
                <i class="ri-git-repository-line"></i>
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
              </h3>
              <p class="text-sm text-gray-400 mt-2">${repo.description || 'Description not found.'}</p>
              <div class="flex items-center text-xs text-gray-400 mt-4">
                <span class="flex items-center gap-1 bg-[#172a46]/80 px-2 py-1 rounded-md">
                  <i class="ri-star-line"></i>${repo.stargazers_count}
                </span>
                <span class="flex items-center gap-1 bg-[#172a46]/80 px-2 py-1 rounded-md ml-2">
                  <i class="ri-git-branch-line"></i>${repo.forks_count}
                </span>
              </div>
            `;
            container.appendChild(card);
          }, index * 300);
        });
      })
      .catch(err => {
        container.innerHTML = "<p class='text-red-500'>GitHub data could not be loaded.</p>";
        console.error('GitHub API error:', err);
      });
  }

  // Fetch GitHub recent activities into the `#github-activity` container
  const activityContainer = document.getElementById('github-activity');
  if (!activityContainer) {
    console.error('`#github-activity` element not found!');
  } else {
    fetch(`https://api.github.com/users/${githubUsername}/events?per_page=5`)
      .then(res => res.json())
      .then(events => {
        activityContainer.innerHTML = '';
        events.forEach(evt => {
          const div = document.createElement('div');
          div.className = 'activity-card';
          div.innerHTML = `
            <div class="flex items-center gap-2">
              <i class="ri-github-fill text-primary"></i>
              <p class="text-sm text-gray-300">${evt.type.replace(/([A-Z])/g, ' $1').trim()} on 
                <a href="https://github.com/${evt.repo.name}" target="_blank" 
                   class="text-primary hover:text-primary/80 transition-colors">${evt.repo.name}</a>
              </p>
            </div>
          `;
          activityContainer.appendChild(div);
        });
      })
      .catch(err => {
        activityContainer.innerHTML = "<p class='text-red-500'>Activities could not be loaded.</p>";
        console.error('GitHub API error:', err);
      });
  }

  // Smooth scroll for "My Projects" and "Contact Me" buttons
  document.querySelector('.btn-primary')?.addEventListener('click', () => {
    const el = document.getElementById('github');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('.btn-secondary')?.addEventListener('click', () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
}

// Initialize application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp); 
