import * as utils from './utils.js';
import { initFormValidation } from './form-handler.js';
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
  // Section animations
  initializeAnimations();

  // Mobile menu setup
  initializeMobileMenu();

  // Scroll behaviors
  initializeScrollEvents();

  // Skill bars animation
  initializeSkillBars();

  // Scroll reveal animations
  initializeScrollAnimations();

  // Global scroll listener
  window.addEventListener('scroll', handlers.scroll);

  // Scroll to top button
  elements.scrollTopBtn?.addEventListener('click', handlers.scrollTop);

  // Mobile menu toggles
  elements.mobileMenuBtn?.addEventListener('click', () => handlers.toggleMobileMenu(true));
  elements.mobileMenuCloseBtn?.addEventListener('click', () => handlers.toggleMobileMenu(false));

  // Navigation link smooth scrolling
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        utils.scrollTo(target);
        handlers.toggleMobileMenu(false);
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
    console.error('`#github-projects` elementi bulunamadı!');
  } else {
    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`)
      .then(res => res.json())
      .then(repos => {
        container.innerHTML = ''; // clear spinner/loading state
        repos.forEach(repo => {
          const card = document.createElement('div');
          card.className = 'project-card';
          card.innerHTML = `
            <h3 class="text-xl font-display font-bold mb-2 text-primary">
              <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </h3>
            <p class="text-gray-400 text-sm mb-4">${repo.description || 'Açıklama bulunamadı.'}</p>
            <div class="flex items-center space-x-4 text-gray-400">
              <span class="flex items-center"><i class="ri-star-fill mr-1"></i>${repo.stargazers_count}</span>
              <span class="flex items-center"><i class="ri-git-branch-line mr-1"></i>${repo.forks_count}</span>
            </div>
          `;
          container.appendChild(card);
        });
      })
      .catch(err => {
        container.innerHTML = "<p class='text-red-500'>GitHub verisi yüklenemedi.</p>";
        console.error('GitHub API hatası:', err);
      });
  }

  // Fetch GitHub recent activities into the `#github-activity` container
  const activityContainer = document.getElementById('github-activity');
  if (!activityContainer) {
    console.error('`#github-activity` elementi bulunamadı!');
  } else {
    fetch(`https://api.github.com/users/${githubUsername}/events?per_page=5`)
      .then(res => res.json())
      .then(events => {
        activityContainer.innerHTML = '';
        events.forEach(evt => {
          const div = document.createElement('div');
          div.className = 'project-card';
          div.innerHTML = `
            <p class="text-gray-400 text-sm mb-2">
              ${evt.type.replace(/([A-Z])/g, ' $1').trim()} on
              <a href="https://github.com/${evt.repo.name}" target="_blank" class="text-primary hover:underline">${evt.repo.name}</a>
            </p>
          `;
          activityContainer.appendChild(div);
        });
      })
      .catch(err => {
        activityContainer.innerHTML = "<p class='text-red-500'>Aktiviteler yüklenemedi.</p>";
        console.error('GitHub API hatası:', err);
      });
  }
}

// Initialize application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp); 