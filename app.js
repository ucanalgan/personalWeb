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
  // Initialize modern navigation
  initializeModernNavigation();

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

  // Footer navigation links smooth scrolling
  document.querySelectorAll('.footer-link').forEach(link => {
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

  // Fetch GitHub data
  const githubUsername = 'ucanalgan';
  initializeGitHubSection(githubUsername);

  // Smooth scroll for "My Projects" and "Contact Me" buttons
  document.querySelector('.btn-primary')?.addEventListener('click', () => {
    const el = document.getElementById('github');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('.btn-secondary')?.addEventListener('click', () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  // Initialize rotating text in hero section
  initializeRotatingText();
}

// Modern GitHub Section Initialization
async function initializeGitHubSection(username) {
  try {
    // Fetch GitHub user data for stats
    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`),
      fetch(`https://api.github.com/users/${username}/events?per_page=8`)
    ]);

    const userData = await userResponse.json();
    const reposData = await reposResponse.json();
    const eventsData = await eventsResponse.json();

    // Update GitHub stats
    updateGitHubStats(userData, reposData);
    
    // Create modern project cards
    createModernProjectCards(reposData);
    
    // Create activity timeline
    createActivityTimeline(eventsData);

  } catch (error) {
    console.error('GitHub API error:', error);
    handleGitHubError();
  }
}

// Update GitHub Statistics
function updateGitHubStats(userData, reposData) {
  const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  
  // Animate numbers
  animateNumber('github-repos', userData.public_repos);
  animateNumber('github-followers', userData.followers);
  animateNumber('github-following', userData.following);
  animateNumber('github-stars', totalStars);
  
  // Update footer stats
  animateNumber('footer-projects', userData.public_repos);
  
  // Update hero section stats
  animateNumber('hero-followers', userData.followers);
  animateNumber('hero-repos', userData.public_repos);
  animateNumber('github-repos-mini', userData.public_repos);
}

// Animate number counting effect
function animateNumber(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let currentValue = 0;
  const increment = Math.ceil(targetValue / 50);
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    element.textContent = currentValue;
  }, 30);
}

// Create Modern Project Cards
function createModernProjectCards(repos) {
  const container = document.getElementById('github-projects');
  if (!container) return;
  
  container.innerHTML = '';
  
  repos.forEach((repo, index) => {
    setTimeout(() => {
      const card = document.createElement('div');
      card.className = 'github-project-card opacity-0 translate-y-4';
      
      // Get primary language color
      const languageColors = {
        JavaScript: '#f7df1e',
        Python: '#3776ab',
        Java: '#ed8b00',
        HTML: '#e34c26',
        CSS: '#1572b6',
        TypeScript: '#3178c6',
        React: '#61dafb',
        Vue: '#4fc08d',
        C: '#555555',
        'C++': '#00599c',
        'C#': '#239120'
      };
      
      const languageColor = languageColors[repo.language] || '#64ffda';
      
      card.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-200 flex items-center gap-2 mb-3">
          <i class="ri-git-repository-line text-green-400"></i>
          ${repo.name}
        </h3>
        <p class="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          ${repo.description || 'No description available for this repository.'}
        </p>
        <p class="text-xs text-gray-500 mb-4">Updated ${new Date(repo.updated_at).toLocaleDateString()}</p>
        
        <div class="flex items-center justify-between mb-4">
          ${repo.language ? `
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${languageColor}"></div>
              <span class="text-sm text-gray-400">${repo.language}</span>
            </div>
          ` : '<div></div>'}
          
          <div class="flex items-center gap-3 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <i class="ri-star-line"></i>
              ${repo.stargazers_count}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri-git-branch-line"></i>
              ${repo.forks_count}
            </span>
          </div>
        </div>
        
        <a href="${repo.html_url}" target="_blank" class="inline-flex items-center gap-2 bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 hover:border-green-500/40 text-green-400 text-sm py-2 px-4 rounded-lg transition-all duration-300 font-medium">
          <i class="ri-github-line"></i>
          View Code
        </a>
      `;
      
      container.appendChild(card);
      
      // Animate card appearance
      setTimeout(() => {
        card.classList.remove('opacity-0', 'translate-y-4');
        card.classList.add('opacity-100', 'translate-y-0');
      }, 50);
      
    }, index * 150);
  });
}

// Create Activity Timeline
function createActivityTimeline(events) {
  const container = document.getElementById('github-activity');
  if (!container) return;
  
  // Clear loading state
  const loadingElement = container.querySelector('.activity-loading');
  if (loadingElement) {
    loadingElement.remove();
  }
  
  events.forEach((event, index) => {
    setTimeout(() => {
      const activityItem = document.createElement('div');
      activityItem.className = 'relative pl-20 pb-8 opacity-0 translate-x-4';
      
      // Get activity icon and color based on event type
      const activityConfig = getActivityConfig(event.type);
      
      activityItem.innerHTML = `
        <!-- Timeline Dot -->
        <div class="absolute left-6 w-4 h-4 ${activityConfig.color} rounded-full border-4 border-dark shadow-lg"></div>
        
        <!-- Activity Card -->
        <div class="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/5">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 ${activityConfig.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <i class="${activityConfig.icon} ${activityConfig.iconColor} text-sm"></i>
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-gray-300 text-sm leading-relaxed">
                <span class="font-medium">${activityConfig.action}</span>
                <a href="https://github.com/${event.repo.name}" target="_blank" class="text-green-400 hover:text-green-300 transition-colors font-medium ml-1">
                  ${event.repo.name}
                </a>
              </p>
              
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <i class="ri-time-line"></i>
                  ${formatTimeAgo(event.created_at)}
                </span>
                <span class="flex items-center gap-1">
                  <i class="ri-git-branch-line"></i>
                  ${event.repo.name.split('/')[1]}
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(activityItem);
      
      // Animate timeline item
      setTimeout(() => {
        activityItem.classList.remove('opacity-0', 'translate-x-4');
        activityItem.classList.add('opacity-100', 'translate-x-0');
      }, 50);
      
    }, index * 200);
  });
}

// Get activity configuration
function getActivityConfig(eventType) {
  const configs = {
    PushEvent: {
      action: 'Pushed commits to',
      icon: 'ri-git-commit-line',
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/20',
      color: 'bg-green-500'
    },
    CreateEvent: {
      action: 'Created repository',
      icon: 'ri-add-circle-line',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      color: 'bg-blue-500'
    },
    IssuesEvent: {
      action: 'Worked on issues in',
      icon: 'ri-error-warning-line',
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      color: 'bg-yellow-500'
    },
    PullRequestEvent: {
      action: 'Created pull request in',
      icon: 'ri-git-pull-request-line',
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20',
      color: 'bg-purple-500'
    },
    WatchEvent: {
      action: 'Starred',
      icon: 'ri-star-line',
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      color: 'bg-yellow-500'
    },
    ForkEvent: {
      action: 'Forked',
      icon: 'ri-git-branch-line',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      color: 'bg-blue-500'
    }
  };
  
  return configs[eventType] || {
    action: eventType.replace(/([A-Z])/g, ' $1').trim(),
    icon: 'ri-code-line',
    iconColor: 'text-gray-400',
    iconBg: 'bg-gray-500/20',
    color: 'bg-gray-500'
  };
}

// Format time ago
function formatTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

// Handle GitHub API errors
function handleGitHubError() {
  const projectsContainer = document.getElementById('github-projects');
  const activityContainer = document.getElementById('github-activity');
  
  if (projectsContainer) {
    projectsContainer.innerHTML = `
      <div class="col-span-full text-center py-16">
        <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ri-error-warning-line text-red-400 text-2xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Unable to load GitHub data</h3>
        <p class="text-gray-500">Please check your internet connection and try again later.</p>
      </div>
    `;
  }
  
  if (activityContainer) {
    activityContainer.innerHTML = `
      <div class="text-center py-16">
        <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ri-error-warning-line text-red-400 text-xl"></i>
        </div>
        <p class="text-gray-500">Activities could not be loaded.</p>
      </div>
    `;
  }
}

// Initialize rotating text functionality
function initializeRotatingText() {
  const roles = [
    'Junior Software Developer',
    'Entrepreneurial Developer',
    'Tech Enthusiast',
    'Aspiring Software Engineer',
    'Multidisciplinary Developer',
    'Independent Builder',
  ];
  
  const rotatingTextElement = document.getElementById('rotating-text');
  if (!rotatingTextElement) return;
  
  let currentIndex = 0;
  
  function rotateText() {
    // Fade out
    rotatingTextElement.style.opacity = '0';
    rotatingTextElement.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % roles.length;
      rotatingTextElement.textContent = roles[currentIndex];
      
      // Fade in
      rotatingTextElement.style.opacity = '1';
      rotatingTextElement.style.transform = 'translateY(0)';
    }, 300);
  }
  
  // Start rotation after initial delay
  setTimeout(() => {
    setInterval(rotateText, 3000);
  }, 2000);
}

// Modern Navigation System
function initializeModernNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const navProgress = document.getElementById('nav-progress');
  
  // Mobile menu toggle functionality
  function toggleMobileMenu() {
    const isOpen = mobileMenuOverlay.classList.contains('open');
    
    if (isOpen) {
      // Close menu
      mobileMenuOverlay.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      // Open menu
      mobileMenuOverlay.classList.add('open');
      mobileMenuBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Event listeners for mobile menu
  mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
  mobileMenuClose?.addEventListener('click', toggleMobileMenu);
  
  // Close mobile menu when clicking on nav links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(toggleMobileMenu, 300); // Delay to allow smooth scroll
    });
  });
  
  // Close mobile menu when clicking overlay
  mobileMenuOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      toggleMobileMenu();
    }
  });
  
  // Navbar scroll effects and progress
  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollY / documentHeight) * 100;
    
    // Update progress bar
    if (navProgress) {
      navProgress.style.width = `${Math.min(scrollProgress, 100)}%`;
    }
    
    // Add/remove scrolled class for navbar styling
    if (scrollY > 100) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
  
  // Active section highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link-modern, .mobile-nav-link');
    
    let currentSection = '';
    const scrollY = window.scrollY + 150; // Offset for better UX
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Update active states
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Throttled scroll handler for better performance
  let scrollTimeout;
  function throttledScrollHandler() {
    if (scrollTimeout) return;
    
    scrollTimeout = requestAnimationFrame(() => {
      handleNavbarScroll();
      updateActiveNavLink();
      scrollTimeout = null;
    });
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', throttledScrollHandler);
  
  // Enhanced smooth scrolling for all navigation links
  function addSmoothScrolling() {
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    
    allNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Calculate offset for fixed navbar
          const navbarHeight = navbar?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (mobileMenuOverlay?.classList.contains('open')) {
            setTimeout(toggleMobileMenu, 100);
          }
        }
      });
    });
  }
  
  // Initialize smooth scrolling
  addSmoothScrolling();
  
  // Handle escape key for mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay?.classList.contains('open')) {
      toggleMobileMenu();
    }
  });
  
  // Add resize handler to close mobile menu on desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mobileMenuOverlay?.classList.contains('open')) {
      toggleMobileMenu();
    }
  });
  
  // Initial call to set proper states
  handleNavbarScroll();
  updateActiveNavLink();
}

// Initialize application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp); 
