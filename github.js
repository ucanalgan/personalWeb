import { filterProjects, currentFilter } from './dom.js';

// GitHub API Integration
const GITHUB_USERNAME = 'ucanalgan'; // GitHub username
const CACHE_DURATION = 60 * 60 * 1000; // Cache duration: 1 hour in milliseconds
const API_TIMEOUT = 10000; // API timeout: 10 seconds
const USE_SAMPLE_DATA = false; // Use real GitHub API data

// Global variables for search functionality
let allProjects = []; // Store all projects for searching
let currentSearchTerm = ''; // Current search term

// Sample data for fallback (updated with real projects)
const SAMPLE_PROJECTS = [
  {
    name: "personalWeb",
    description: "Modern responsive portfolio website built with HTML, CSS, JavaScript, and Tailwind CSS featuring GSAP animations and GitHub API integration",
    html_url: "https://github.com/ucanalgan/personalWeb",
    topics: ["html", "css", "javascript", "portfolio", "tailwind-css", "gsap", "responsive-design"],
    stargazers_count: 0,
    forks_count: 0,
    language: "HTML",
    updated_at: new Date().toISOString()
  },
  {
    name: "Multi-Language-Port-Scanner",
    description: "Advanced network scanning tool implemented in C++, Python, JavaScript, Rust, and Go with comprehensive port detection capabilities",
    html_url: "https://github.com/ucanalgan/Multi-Language-Port-Scanner",
    topics: ["cpp", "python", "javascript", "rust", "go", "network", "security", "port-scanner"],
    stargazers_count: 2,
    forks_count: 1,
    language: "C++",
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    name: "Credit-Card-Debt-Tracker",
    description: "Full-stack TypeScript application using React frontend and Express backend with PostgreSQL for comprehensive debt management",
    html_url: "https://github.com/ucanalgan/Credit-Card-Debt-Tracker",
    topics: ["typescript", "react", "express", "postgresql", "full-stack", "debt-management"],
    stargazers_count: 1,
    forks_count: 0,
    language: "TypeScript",
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    name: "Python-Keylogger",
    description: "Educational cybersecurity tool developed in Python for understanding keystroke monitoring and security research",
    html_url: "https://github.com/ucanalgan/Python-Keylogger",
    topics: ["python", "cybersecurity", "education", "keylogger", "security-research"],
    stargazers_count: 1,
    forks_count: 0,
    language: "Python",
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    name: "Password-Security-Checker",
    description: "Python-based tool to analyze and validate password strength with comprehensive security checks",
    html_url: "https://github.com/ucanalgan/Password-Security-Checker",
    topics: ["python", "security", "password", "validation", "cybersecurity"],
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    name: "Email-Automation-System",
    description: "Python automation script for streamlined email management and communication workflows",
    html_url: "https://github.com/ucanalgan/Email-Automation-System",
    topics: ["python", "automation", "email", "workflow", "productivity"],
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const SAMPLE_ACTIVITIES = [
  {
    type: "PushEvent",
    repo: { name: "ucanalgan/PortScanner" },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    type: "CreateEvent",
    repo: { name: "ucanalgan/personalWeb" },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    type: "PullRequestEvent",
    repo: { name: "ucanalgan/Keylogger" },
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  }
];

// Cache objects
const cache = {
  projects: {
    data: null,
    timestamp: 0
  },
  activities: {
    data: null,
    timestamp: 0
  }
};

// Helper for fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Fetch GitHub projects
export async function fetchGitHubProjects() {
  // Check cache first
  const now = Date.now();
  if (cache.projects.data && (now - cache.projects.timestamp < CACHE_DURATION)) {
    console.log('Using cached GitHub projects data');
    return cache.projects.data;
  }
  
  try {
    // Show retry message if this is a retry attempt
    const projectsContainer = document.getElementById('github-projects');
    if (projectsContainer && cache.projects.timestamp > 0) {
      projectsContainer.innerHTML = '<div class="text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div><p class="text-gray-400">Retrying...</p></div>';
    }
    
    // Try to use actual API if USE_SAMPLE_DATA is false
    if (!USE_SAMPLE_DATA) {
      const response = await fetchWithTimeout(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Save to cache
      cache.projects.data = data;
      cache.projects.timestamp = now;
      
      // Store projects for search functionality
      allProjects = data;
      
      return data;
    } else {
      console.log('Using sample project data instead of API');
      // Use sample data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save sample data to cache
      cache.projects.data = SAMPLE_PROJECTS;
      cache.projects.timestamp = now;
      
      return SAMPLE_PROJECTS;
    }
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    
    // Show error in UI if container exists
    const projectsContainer = document.getElementById('github-projects');
    if (projectsContainer) {
      // Use sample data on error if enabled
      if (USE_SAMPLE_DATA) {
        console.log('Using sample project data after API error');
        cache.projects.data = SAMPLE_PROJECTS;
        cache.projects.timestamp = now;
        return SAMPLE_PROJECTS;
      }
      
      projectsContainer.innerHTML = `
        <div class="text-center py-4">
          <div class="text-red-400 mb-2"><i class="ri-error-warning-line text-2xl"></i></div>
          <p class="text-gray-400 mb-3">There was an error loading GitHub projects</p>
          <button id="retry-projects" class="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-sm transition-colors">
            Try Again
          </button>
          <button id="use-sample-projects" class="ml-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-sm transition-colors">
            Use Sample Data
          </button>
        </div>
      `;
      
      // Add retry button functionality
      document.getElementById('retry-projects')?.addEventListener('click', () => {
        projectsContainer.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';
        setTimeout(() => loadGitHubProjects(projectsContainer), 500);
      });
      
      // Add use sample data button functionality
      document.getElementById('use-sample-projects')?.addEventListener('click', () => {
        projectsContainer.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';
        setTimeout(() => {
          loadSampleProjects(projectsContainer);
        }, 500);
      });
    }
    
    // Return empty array or cached data if available
    return cache.projects.data || [];
  }
}

// Fetch GitHub activities
export async function fetchGitHubActivity() {
  // Check cache first
  const now = Date.now();
  if (cache.activities.data && (now - cache.activities.timestamp < CACHE_DURATION)) {
    console.log('Using cached GitHub activities data');
    return cache.activities.data;
  }
  
  try {
    // Show retry message if this is a retry attempt
    const activityContainer = document.getElementById('github-activity');
    if (activityContainer && cache.activities.timestamp > 0) {
      activityContainer.innerHTML = '<div class="text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div><p class="text-gray-400">Retrying...</p></div>';
    }
    
    // Try to use actual API if USE_SAMPLE_DATA is false
    if (!USE_SAMPLE_DATA) {
      const response = await fetchWithTimeout(
        `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Save to cache
      cache.activities.data = data;
      cache.activities.timestamp = now;
      
      return data;
    } else {
      console.log('Using sample activity data instead of API');
      // Use sample data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save sample data to cache
      cache.activities.data = SAMPLE_ACTIVITIES;
      cache.activities.timestamp = now;
      
      return SAMPLE_ACTIVITIES;
    }
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    
    // Show error in UI if container exists
    const activityContainer = document.getElementById('github-activity');
    if (activityContainer) {
      // Use sample data on error if enabled
      if (USE_SAMPLE_DATA) {
        console.log('Using sample activity data after API error');
        cache.activities.data = SAMPLE_ACTIVITIES;
        cache.activities.timestamp = now;
        return SAMPLE_ACTIVITIES;
      }
      
      activityContainer.innerHTML = `
        <div class="text-center py-4">
          <div class="text-red-400 mb-2"><i class="ri-error-warning-line text-2xl"></i></div>
          <p class="text-gray-400 mb-3">There was an error loading GitHub activities</p>
          <button id="retry-activity" class="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-sm transition-colors">
            Try Again
          </button>
          <button id="use-sample-activity" class="ml-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-sm transition-colors">
            Use Sample Data
          </button>
        </div>
      `;
      
      // Add retry button functionality
      document.getElementById('retry-activity')?.addEventListener('click', () => {
        activityContainer.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';
        setTimeout(() => loadGitHubActivity(activityContainer), 500);
      });
      
      // Add use sample data button functionality
      document.getElementById('use-sample-activity')?.addEventListener('click', () => {
        activityContainer.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';
        setTimeout(() => {
          loadSampleActivities(activityContainer);
        }, 500);
      });
    }
    
    // Return empty array or cached data if available
    return cache.activities.data || [];
  }
}

// Format date
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format event type
export function formatEventType(eventType) {
  const eventTypes = {
    'PushEvent': 'Pushed code to',
    'CreateEvent': 'Created',
    'PullRequestEvent': 'Opened pull request in',
    'IssueCommentEvent': 'Commented on issue in',
    'IssuesEvent': 'Opened/closed issue in',
    'WatchEvent': 'Starred',
    'ForkEvent': 'Forked'
  };
  
  return eventTypes[eventType] || eventType;
}

// Fetch GitHub language stats
export async function fetchLanguageStats() {
  try {
    // First get repositories
    const repos = await fetchGitHubProjects();
    
    if (!repos || repos.length === 0) {
      throw new Error('No repositories found');
    }
    
    // Store language stats
    const languageStats = {};
    let totalBytes = 0;
    
    // Process each repository
    const languagePromises = repos.map(async (repo) => {
      // Skip if using sample data
      if (USE_SAMPLE_DATA) {
        // Simulate language data for sample repos
        const fakeLangs = {
          "JavaScript": Math.floor(Math.random() * 100000) + 10000,
          "HTML": Math.floor(Math.random() * 50000) + 5000,
          "CSS": Math.floor(Math.random() * 30000) + 3000,
        };
        
        // Add Python for some repos
        if (repo.topics && repo.topics.includes("Python")) {
          fakeLangs["Python"] = Math.floor(Math.random() * 80000) + 20000;
        }
        
        // Add C++ for some repos
        if (repo.topics && repo.topics.includes("C++")) {
          fakeLangs["C++"] = Math.floor(Math.random() * 70000) + 30000;
        }
        
        // Process fake language data
        Object.entries(fakeLangs).forEach(([lang, bytes]) => {
          if (!languageStats[lang]) {
            languageStats[lang] = 0;
          }
          languageStats[lang] += bytes;
          totalBytes += bytes;
        });
        
        return;
      }
      
      try {
        // Fetch languages for this repo
        const response = await fetchWithTimeout(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );
        
        if (!response.ok) {
          console.warn(`Could not fetch languages for ${repo.name}`);
          return;
        }
        
        const languages = await response.json();
        
        // Add language bytes to the stats
        Object.entries(languages).forEach(([lang, bytes]) => {
          if (!languageStats[lang]) {
            languageStats[lang] = 0;
          }
          languageStats[lang] += bytes;
          totalBytes += bytes;
        });
      } catch (error) {
        console.warn(`Error fetching languages for ${repo.name}:`, error);
      }
    });
    
    // Wait for all language fetches to complete
    await Promise.all(languagePromises);
    
    // Convert to percentages and sort
    const sortedLanguages = Object.entries(languageStats)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 1000) / 10 // Round to 1 decimal place
      }))
      .sort((a, b) => b.bytes - a.bytes);
    
    return sortedLanguages;
  } catch (error) {
    console.error('Error fetching language statistics:', error);
    return [];
  }
}

// Helper function to get language colors
function getLanguageColor(language) {
  // Common language colors
  const colors = {
    "JavaScript": ["from-yellow-500", "to-amber-500"],
    "TypeScript": ["from-blue-500", "to-blue-400"],
    "HTML": ["from-orange-600", "to-orange-400"],
    "CSS": ["from-blue-600", "to-blue-400"],
    "Python": ["from-blue-700", "to-green-400"],
    "Java": ["from-red-600", "to-orange-500"],
    "C++": ["from-blue-600", "to-purple-500"],
    "C#": ["from-purple-600", "to-purple-400"],
    "PHP": ["from-indigo-600", "to-indigo-400"],
    "Ruby": ["from-red-700", "to-red-500"],
    "Go": ["from-teal-500", "to-teal-300"],
    "Rust": ["from-orange-700", "to-orange-500"],
    "Swift": ["from-orange-600", "to-orange-400"],
    "Kotlin": ["from-purple-600", "to-purple-400"],
    "C": ["from-blue-700", "to-blue-500"],
    "Assembly": ["from-gray-700", "to-gray-500"],
    "Shell": ["from-green-700", "to-green-500"],
    "PowerShell": ["from-blue-800", "to-blue-600"],
    "Bash": ["from-green-800", "to-green-600"],
    "Docker": ["from-blue-600", "to-blue-400"],
    "YAML": ["from-purple-700", "to-purple-500"],
    "JSON": ["from-amber-600", "to-amber-400"],
    "XML": ["from-gray-600", "to-gray-400"],
    "Markdown": ["from-blue-900", "to-blue-700"]
  };
  
  return colors[language] || ["from-gray-600", "to-gray-400"]; // Default color
}

// Distribute language stats to Frontend, Backend, and Tools categories
export function distributeLanguageStats(languages) {
  if (!languages || languages.length === 0) {
    console.warn('No language data available to distribute');
    return;
  }
  
  console.log('Distributing language data to skill categories:', languages);
  
  // Define which languages belong to which category
  const categoryMapping = {
    frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue', 'React', 'Angular', 'Svelte', 'SCSS', 'SASS', 'Less', 'EJS'],
    backend: ['Python', 'Java', 'PHP', 'Ruby', 'Go', 'C#', 'Node', 'TypeScript', 'Swift', 'Kotlin', 'Rust', 'Dart', 'Elixir', 'Django', 'Flask', 'Rails', 'Spring', 'Laravel', 'Express'],
    tools: ['C', 'C++', 'Assembly', 'Shell', 'PowerShell', 'Bash', 'Batchfile', 'Makefile', 'Docker', 'Dockerfile', 'YAML', 'JSON', 'XML', 'Markdown', 'Text', 'R', 'MATLAB', 'Perl', 'Lua']
  };
  
  // Use the global getLanguageColor function
  
  // Get icon for language
  const getLanguageIcon = (language) => {
    // Common language icons
    const icons = {
      "JavaScript": "ri-javascript-line",
      "TypeScript": "ri-code-s-slash-line",
      "HTML": "ri-html5-line",
      "CSS": "ri-css3-line",
      "Python": "ri-file-code-line",
      "Java": "ri-cup-line",
      "C++": "ri-terminal-box-line",
      "C#": "ri-microsoft-line",
      "PHP": "ri-code-box-line",
      "Ruby": "ri-ruby-line",
      "Go": "ri-code-s-slash-line",
      "Rust": "ri-code-box-line",
      "Swift": "ri-apple-line",
      "Kotlin": "ri-android-line",
      "C": "ri-terminal-line",
      "Assembly": "ri-cpu-line",
      "Shell": "ri-terminal-window-line",
      "PowerShell": "ri-terminal-window-line",
      "Bash": "ri-terminal-window-line",
      "Docker": "ri-ship-line",
      "YAML": "ri-file-list-line",
      "JSON": "ri-braces-line",
      "XML": "ri-file-code-line",
      "Markdown": "ri-markdown-line"
    };
    
    return icons[language] || "ri-code-s-slash-line"; // Default icon
  };
  
  // Create a skill item element for a language
  const createSkillItem = (language, percentage) => {
    const [fromColor, toColor] = getLanguageColor(language);
    const icon = getLanguageIcon(language);
    const colorBase = fromColor.split('-')[1];
    
    return `
      <div class="skill-item-modern group">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-${colorBase}-500/20 rounded-lg flex items-center justify-center">
              <i class="${icon} text-${colorBase}-400"></i>
            </div>
            <span class="font-semibold text-gray-200">${language}</span>
          </div>
          <span class="text-sm text-green-400 font-medium">${percentage}%</span>
        </div>
        <div class="skill-progress-modern">
          <div class="skill-bar-modern bg-gradient-to-r ${fromColor} ${toColor}" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  };
  
  // Find container for skills based on category - now using IDs
  const getSkillContainer = (category) => {
    const containerId = `github-${category}-skills`;
    return document.getElementById(containerId);
  };
  
  // Add dynamic language skills to each category
  const categorizedLanguages = {
    frontend: [],
    backend: [],
    tools: []
  };
  
  // Assign languages to categories
  languages.forEach(lang => {
    const langName = lang.name;
    
    if (categoryMapping.frontend.some(l => langName.includes(l))) {
      categorizedLanguages.frontend.push(lang);
    } else if (categoryMapping.backend.some(l => langName.includes(l))) {
      categorizedLanguages.backend.push(lang);
    } else {
      // Default to tools/others if not matched
      categorizedLanguages.tools.push(lang);
    }
  });
  
  // Distribute languages to each container
  Object.entries(categorizedLanguages).forEach(([category, langs]) => {
    const container = getSkillContainer(category);
    if (!container) {
      console.warn(`Container for ${category} skills not found with ID: github-${category}-skills`);
      return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add a header for GitHub skills if we have languages
    if (langs.length > 0) {
      // Add header
      const header = document.createElement('div');
      header.className = 'flex items-center gap-2 mb-4';
      header.innerHTML = `
        <div class="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
          <i class="ri-github-fill text-green-400"></i>
        </div>
        <h4 class="text-md font-semibold text-gray-200">From GitHub</h4>
      `;
      container.appendChild(header);
      
      // Add skills (up to 3 per category)
      langs.slice(0, 3).forEach(lang => {
        const skillItem = document.createElement('div');
        skillItem.innerHTML = createSkillItem(lang.name, lang.percentage);
        container.appendChild(skillItem.firstElementChild);
      });
    }
  });
}

// Initialize GitHub component
export function initGitHub() {
  // Load GitHub profile info
  const reposElement = document.getElementById('github-repos');
  const followersElement = document.getElementById('github-followers');
  const followingElement = document.getElementById('github-following');
  const starsElement = document.getElementById('github-stars');
  const footerProjectsElement = document.getElementById('footer-projects');
  
  // Load profile info
  fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
    .then(response => response.json())
    .then(data => {
      if (reposElement) reposElement.textContent = data.public_repos || '10+';
      if (followersElement) followersElement.textContent = data.followers || '3';
      if (followingElement) followingElement.textContent = data.following || '7';
      if (footerProjectsElement) footerProjectsElement.textContent = data.public_repos || '10+';
      
      // Count stars (requires fetching all repos)
      fetchGitHubProjects().then(repos => {
        const stars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
        if (starsElement) starsElement.textContent = stars || '0';
      });
    })
    .catch(error => {
      console.error('Error fetching GitHub profile:', error);
      if (reposElement) reposElement.textContent = '10+';
      if (followersElement) followersElement.textContent = '3';
      if (followingElement) followingElement.textContent = '7';
      if (starsElement) starsElement.textContent = '0';
      if (footerProjectsElement) footerProjectsElement.textContent = '10+';
    });
  
  // Load GitHub projects
  const projectsContainer = document.getElementById('github-projects');
  if (projectsContainer) {
    if (USE_SAMPLE_DATA) {
      loadSampleProjects(projectsContainer);
    } else {
      loadGitHubProjects(projectsContainer);
    }
  }
  
  // Load GitHub activity
  const activityContainer = document.getElementById('github-activity');
  if (activityContainer) {
    if (USE_SAMPLE_DATA) {
      loadSampleActivities(activityContainer);
    } else {
      loadGitHubActivity(activityContainer);
    }
  }
  
  // Load language statistics and distribute to skill categories
  fetchLanguageStats()
    .then(languages => {
      // Instead of rendering to a separate section, distribute to the categories
      distributeLanguageStats(languages);
    })
    .catch(error => {
      console.error('Error loading language statistics:', error);
    });
}

// Load projects
async function loadGitHubProjects(container) {
  try {
    container.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';
    
    const projects = await fetchGitHubProjects();
    
    if (projects.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-500 py-10">No projects found</p>';
      return;
    }
    
    // Store projects for search functionality
    allProjects = projects;
    
    // Display all projects initially
    displayProjects(projects);
    
  } catch (error) {
    console.error('Error loading GitHub projects:', error);
    container.innerHTML = `
      <div class="bg-red-600 text-white p-6 rounded-lg shadow-lg text-center">
        <p class="mb-4 font-semibold">Şu anda veriye ulaşılamıyor, tekrar denemek ister misiniz?</p>
        <button id="retry-projects" class="px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-200 transition">
          Tekrar Dene
        </button>
      </div>
    `;
    document.getElementById('retry-projects')?.addEventListener('click', () => {
      container.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';
      setTimeout(() => loadGitHubProjects(container), 500);
    });
  }
}

// Load activities
async function loadGitHubActivity(container) {
  try {
    container.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';
    
    const activities = await fetchGitHubActivity();
    
    if (activities.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-500 py-10">No activities found</p>';
      return;
    }
    
    container.innerHTML = '';
    
    activities.forEach(activity => {
      if (!activity || !activity.repo) return;
      const activityItem = document.createElement('div');
      activityItem.className = 'text-sm text-gray-300 py-2 border-b border-gray-700';
      const repoName = activity.repo?.name ? activity.repo.name.split('/')[1] : '';
      const eventDescription = formatEventType(activity.type || '');
      const createdAt = formatDate(activity.created_at || new Date());
      activityItem.innerHTML = `
        <i class="ri-github-line mr-2"></i>${eventDescription} <a href="https://github.com/${activity.repo?.name || ''}" target="_blank" class="text-primary hover:underline">${repoName}</a> - <span class="text-xs text-gray-400">${createdAt}</span>
      `;
      container.appendChild(activityItem);
    });
  } catch (error) {
    console.error('Error loading GitHub activities:', error);
    container.innerHTML = '<p class="text-center text-red-400 py-10">Error loading activities. Please try again later.</p>';
  }
}

// Load sample projects (for fallback)
function loadSampleProjects(container) {
  try {
    // Store sample projects for search functionality
    allProjects = SAMPLE_PROJECTS;
    
    // Display all sample projects initially
    displayProjects(SAMPLE_PROJECTS);
    
    // Add note about sample data
    const noteElement = document.createElement('div');
    noteElement.className = 'text-center text-xs text-gray-500 mt-6';
    noteElement.innerHTML = 'Showing sample data';
    container.appendChild(noteElement);
    
  } catch (error) {
    console.error('Error loading sample projects:', error);
    container.innerHTML = `
      <div class="bg-red-600 text-white p-6 rounded-lg shadow-lg text-center">
        <p class="mb-4 font-semibold">Şu anda veriye ulaşılamıyor, tekrar denemek ister misiniz?</p>
        <button id="retry-sample-projects" class="px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-200 transition">
          Tekrar Dene
        </button>
      </div>
    `;
    document.getElementById('retry-sample-projects')?.addEventListener('click', () => {
      container.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';
      setTimeout(() => loadSampleProjects(container), 500);
    });
  }
}

// Load sample activities (for fallback)
function loadSampleActivities(container) {
  try {
    container.innerHTML = '';
    
    SAMPLE_ACTIVITIES.forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.className = 'bg-gray-900/30 border border-gray-800 rounded-xl p-4 mb-3 hover:border-primary/20 transition-all duration-300';
      
      let repoName = activity.repo?.name ? activity.repo.name.split('/')[1] : '';
      let eventDescription = formatEventType(activity.type || '');
      let createdAt = formatDate(activity.created_at || new Date());
      
      activityItem.innerHTML = `
        <div class="flex items-center">
          <i class="ri-github-line text-xl text-primary mr-3"></i>
          <div>
            <p class="font-medium">${eventDescription} <a href="https://github.com/${activity.repo?.name || ''}" target="_blank" class="text-primary hover:underline">${repoName}</a></p>
            <p class="text-sm text-gray-400">${createdAt}</p>
          </div>
        </div>
      `;
      
      container.appendChild(activityItem);
    });
    
    // Add note about sample data
    const noteElement = document.createElement('div');
    noteElement.className = 'text-center text-xs text-gray-500 mt-6';
    noteElement.innerHTML = 'Showing sample data';
    container.appendChild(noteElement);
    
  } catch (error) {
    console.error('Error loading sample activities:', error);
    container.innerHTML = '<p class="text-center text-red-400 py-10">Error loading activities. Please try again later.</p>';
  }
}

// Search functionality
export function searchProjects(term) {
  currentSearchTerm = term;
  filterProjects(term);
}

// Filter projects
export function filterProjects(term) {
  if (!term) {
    // If no term is provided, show all projects
    displayProjects(allProjects);
    return;
  }

  const searchTerm = term.toLowerCase();
  
  // Filter projects based on the search term
  const filteredProjects = allProjects.filter(project => {
    const nameMatch = project.name && project.name.toLowerCase().includes(searchTerm);
    const descMatch = project.description && project.description.toLowerCase().includes(searchTerm);
    const topicsMatch = project.topics && project.topics.some(topic => 
      topic.toLowerCase().includes(searchTerm)
    );
    const languageMatch = project.language && project.language.toLowerCase().includes(searchTerm);
    
    return nameMatch || descMatch || topicsMatch || languageMatch;
  });

  displayProjects(filteredProjects);
  
  // Update search result info
  updateSearchInfo(filteredProjects.length, allProjects.length, term);
}

// Update search information
function updateSearchInfo(filteredCount, totalCount, searchTerm) {
  // Remove existing search info
  const existingInfo = document.querySelector('.search-info');
  if (existingInfo) {
    existingInfo.remove();
  }
  
  if (searchTerm && searchTerm.trim()) {
    const container = document.getElementById('projects-container');
    if (container) {
      const searchInfo = document.createElement('div');
      searchInfo.className = 'search-info col-span-full mb-6 p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl';
      searchInfo.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="ri-search-line text-primary text-lg"></i>
            <span class="text-gray-300">
              Found <span class="text-primary font-semibold">${filteredCount}</span> 
              of <span class="text-gray-400">${totalCount}</span> projects 
              matching "<span class="text-primary font-medium">${searchTerm}</span>"
            </span>
          </div>
          <button onclick="document.getElementById('project-search').value = ''; document.getElementById('project-search').dispatchEvent(new Event('input'));" 
                  class="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-1">
            <i class="ri-close-line"></i>
            Clear
          </button>
        </div>
      `;
      container.insertBefore(searchInfo, container.firstChild);
    }
  }
}

// Display projects
export function displayProjects(projects) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = '';

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="ri-search-line text-gray-500 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-300 mb-2">No projects found</h3>
        <p class="text-gray-500">Try adjusting your search terms or filters</p>
      </div>
    `;
    return;
  }

  projects.forEach(project => {
    if (!project) return;
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card group cursor-pointer';
    projectCard.dataset.technologies = project.topics ? project.topics.join(',') : '';
    
    projectCard.innerHTML = `
      <div class="flex items-start justify-between mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-blue-500/30 transition-all duration-300">
          <i class="ri-folder-3-line text-primary text-xl"></i>
        </div>
        <div class="flex items-center gap-2">
          <span class="tech-tag">⭐ ${project.stargazers_count || 0}</span>
          <span class="tech-tag">🍴 ${project.forks_count || 0}</span>
        </div>
      </div>
      
      <h3 class="text-xl font-bold text-gray-200 mb-3 group-hover:text-primary transition-colors duration-300">
        ${project.name || 'Unnamed Project'}
      </h3>
      
      <p class="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
        ${project.description || 'No description available.'}
      </p>
      
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center gap-2">
          ${project.language ? `
            <span class="tech-tag">
              <i class="ri-code-line text-xs"></i>
              ${project.language}
            </span>
          ` : ''}
        </div>
        
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" 
             class="w-8 h-8 bg-gray-800/50 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
             onclick="event.stopPropagation()">
            <i class="ri-external-link-line text-gray-400 hover:text-primary text-sm"></i>
          </a>
          ${project.clone_url ? `
            <button onclick="event.stopPropagation(); navigator.clipboard.writeText('${project.clone_url}')" 
                    class="w-8 h-8 bg-gray-800/50 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    title="Copy clone URL">
              <i class="ri-file-copy-line text-gray-400 hover:text-primary text-sm"></i>
            </button>
          ` : ''}
        </div>
      </div>
    `;
    
    // Add tech tags
    if (project.topics && project.topics.length) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'mt-4 flex flex-wrap gap-2';
      project.topics.slice(0, 5).forEach(topic => { // Limit to 5 topics
        const tag = document.createElement('span');
        tag.className = 'tech-tag cursor-pointer hover:bg-primary/20 hover:text-primary transition-all duration-200';
        tag.textContent = topic;
        tag.dataset.filter = topic;
        tag.addEventListener('click', (e) => {
          e.stopPropagation();
          // Trigger search with the topic
          const searchInput = document.getElementById('project-search');
          if (searchInput) {
            searchInput.value = topic;
            searchInput.dispatchEvent(new Event('input'));
          }
        });
        tagsContainer.appendChild(tag);
      });
      projectCard.appendChild(tagsContainer);
    }
    
    // Add click handler to open project
    projectCard.addEventListener('click', () => {
      window.open(project.html_url, '_blank', 'noopener,noreferrer');
    });
    
    container.appendChild(projectCard);
  });
} 
