import './style.css';
import * as utils from './utils.js';
import { initFormValidation } from './form-handler.js';
import { searchProjects } from './github.js';
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
  // Initialize loading screen
  initializeLoadingScreen();
  
  // Initialize performance monitoring
  initializePerformanceMonitoring();
  
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

  // Initialize project search functionality
  initializeProjectSearch();

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
    
    // Create activity timeline (only if container exists)
    if (document.getElementById('github-activity')) {
      createActivityTimeline(eventsData);
    }

  } catch (error) {
    console.error('GitHub API error:', error);
    handleGitHubError();
  }
}

// Update GitHub Statistics
function updateGitHubStats(userData, reposData) {
  const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
  
  // Animate numbers for GitHub stats dashboard
  animateNumber('total-repos', userData.public_repos);
  animateNumber('total-stars', totalStars);
  animateNumber('total-forks', totalForks);
  animateNumber('github-followers', userData.followers);
  
  // Update hero section stats
  animateNumber('hero-followers', userData.followers);
  animateNumber('hero-repos', userData.public_repos);
  animateNumber('github-repos-mini', userData.public_repos);
  
  // Update recent commits (simulated data)
  animateNumber('recent-commits', Math.floor(Math.random() * 50) + 20);
  
  // Update contribution streak
  const streakElement = document.getElementById('contribution-streak');
  if (streakElement) {
    streakElement.textContent = 'Active';
  }
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
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  // Clear loading state
  const loadingElement = container.querySelector('.project-loading');
  if (loadingElement) {
    loadingElement.remove();
  }
  
  container.innerHTML = '';
  
  repos.forEach((repo, index) => {
    setTimeout(() => {
      const card = document.createElement('div');
      card.className = 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 opacity-0 translate-y-4';
      
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
        'C#': '#239120',
        Go: '#00add8',
        Rust: '#dea584'
      };
      
      const languageColor = languageColors[repo.language] || '#64ffda';
      
      card.innerHTML = `
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
              <i class="ri-folder-3-line text-primary text-2xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-200">${repo.name}</h3>
              <p class="text-sm text-gray-500">Repository</p>
            </div>
          </div>
          <a href="${repo.html_url}" target="_blank" class="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
            <i class="ri-external-link-line text-gray-400 hover:text-white transition-colors"></i>
          </a>
        </div>
        
        <p class="text-gray-400 mb-6 leading-relaxed min-h-[3rem]">
          ${repo.description || 'No description available for this repository.'}
        </p>
        
        <div class="flex items-center justify-between mb-6">
          ${repo.language ? `
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${languageColor}"></div>
              <span class="text-sm text-gray-400 font-medium">${repo.language}</span>
            </div>
          ` : '<div></div>'}
          
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <i class="ri-star-line text-yellow-500"></i>
              ${repo.stargazers_count}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri-git-fork-line text-blue-400"></i>
              ${repo.forks_count}
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <a href="${repo.html_url}" target="_blank" class="flex-1 bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 text-primary text-center py-3 px-4 rounded-xl transition-all duration-300 font-medium">
            <i class="ri-github-line mr-2"></i>
            View Code
          </a>
          ${repo.homepage ? `
            <a href="${repo.homepage}" target="_blank" class="w-12 h-12 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 text-green-400 rounded-xl flex items-center justify-center transition-all duration-300">
              <i class="ri-links-line"></i>
            </a>
          ` : ''}
        </div>
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

// Loading Screen Management
function initializeLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 300);
      }
    }, 1000);
  });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
  // Monitor key performance metrics
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const paintTimings = performance.getEntriesByType('paint');
      const fcpEntry = paintTimings.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        console.log(`First Contentful Paint: ${fcpEntry.startTime.toFixed(2)}ms`);
      }
    });
  }
}

// Initialize project search functionality
function initializeProjectSearch() {
  const searchInput = document.getElementById('project-search');
  if (!searchInput) return;

  // Add debounced search functionality
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    // Add visual feedback for search
    searchInput.classList.add('searching');
    
    // Debounce search to avoid too many calls
    searchTimeout = setTimeout(() => {
      // Remove visual feedback
      searchInput.classList.remove('searching');
      
      // Perform search
      if (typeof searchProjects === 'function') {
        searchProjects(searchTerm);
      }
      
      // Update URL with search query (optional)
      if (searchTerm) {
        const url = new URL(window.location);
        url.searchParams.set('search', searchTerm);
        window.history.replaceState({}, '', url);
      } else {
        const url = new URL(window.location);
        url.searchParams.delete('search');
        window.history.replaceState({}, '', url);
      }
    }, 300); // 300ms debounce
  });

  // Clear search on Escape key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.blur();
    }
  });

  // Initialize search from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get('search');
  if (initialSearch) {
    searchInput.value = initialSearch;
    searchInput.dispatchEvent(new Event('input'));
  }

  // Add search highlight functionality
  addSearchHighlighting();
}

// Add search highlighting functionality
function addSearchHighlighting() {
  const style = document.createElement('style');
  style.textContent = `
    .search-highlight {
      background-color: #64ffda;
      color: #0a192f;
      padding: 1px 2px;
      border-radius: 2px;
      font-weight: 600;
    }
    
    #project-search.searching {
      border-color: #64ffda !important;
      box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.2) !important;
    }
    
    .project-card {
      background: linear-gradient(145deg, #112240 0%, #0a192f 100%);
      border: 1px solid rgba(100, 255, 218, 0.1);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .project-card:hover {
      transform: translateY(-5px);
      border-color: rgba(100, 255, 218, 0.3);
      box-shadow: 0 10px 40px rgba(100, 255, 218, 0.1);
    }
    
    .project-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #64ffda, #4fc3f7);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .project-card:hover::before {
      opacity: 1;
    }
    
    .tech-tag {
      background: rgba(100, 255, 218, 0.1);
      color: #64ffda;
      border: 1px solid rgba(100, 255, 218, 0.2);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .tech-tag:hover {
      background: rgba(100, 255, 218, 0.2);
      border-color: rgba(100, 255, 218, 0.4);
    }
  `;
  document.head.appendChild(style);
} 
