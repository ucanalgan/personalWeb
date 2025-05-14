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
  // Initialize AOS animations
  if (window.AOS) AOS.init({ duration: 800, once: true });

  // Initialize theme based on user preference and setup toggle button
  initTheme();

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
    console.error('`#github-projects` elementi bulunamadı!');
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
              <h3 class="text-lg font-semibold text-primary group-hover:text-secondary">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
              </h3>
              <p class="text-sm text-gray-400 mt-2">${repo.description || 'Açıklama bulunamadı.'}</p>
              <div class="flex items-center text-xs text-gray-400 mt-4">
                <i class="ri-star-line mr-1"></i>${repo.stargazers_count}
                <i class="ri-git-branch-line ml-4 mr-1"></i>${repo.forks_count}
              </div>
            `;
            container.appendChild(card);
          }, index * 300);
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
          div.className = 'project-card group';
          div.innerHTML = `
            <p class="text-sm text-gray-400">${evt.type.replace(/([A-Z])/g, ' $1').trim()} on <a href="https://github.com/${evt.repo.name}" target="_blank" class="text-primary hover:text-secondary">${evt.repo.name}</a></p>
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