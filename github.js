// GitHub API Integration
const GITHUB_USERNAME = 'ucanalgan'; // GitHub username
const CACHE_DURATION = 60 * 60 * 1000; // Cache duration: 1 hour in milliseconds
const API_TIMEOUT = 10000; // API timeout: 10 seconds
const USE_SAMPLE_DATA = true; // Use sample data if API fails

// Sample data for fallback
const SAMPLE_PROJECTS = [
  {
    name: "PortScanner",
    description: "A port scanner tool developed with C++. Uses multi-threading for efficient scanning.",
    html_url: "https://github.com/ucanalgan/PortScanner",
    topics: ["C++", "Network", "Security"],
    stargazers_count: 2,
    forks_count: 0
  },
  {
    name: "Keylogger",
    description: "Educational keylogger application for cybersecurity training.",
    html_url: "https://github.com/ucanalgan/Keylogger",
    topics: ["Python", "Security", "Education"],
    stargazers_count: 1,
    forks_count: 0
  },
  {
    name: "personalWeb",
    description: "Personal portfolio website showcasing my projects and skills",
    html_url: "https://github.com/ucanalgan/personalWeb",
    topics: ["HTML", "CSS", "JavaScript", "Portfolio"],
    stargazers_count: 0,
    forks_count: 0
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

// Initialize GitHub component
export function initGitHub() {
  const projectsContainer = document.getElementById('github-projects');
  const activityContainer = document.getElementById('github-activity');
  
  if (projectsContainer) {
    if (USE_SAMPLE_DATA) {
      loadSampleProjects(projectsContainer);
    } else {
      loadGitHubProjects(projectsContainer);
    }
  }
  
  if (activityContainer) {
    if (USE_SAMPLE_DATA) {
      loadSampleActivities(activityContainer);
    } else {
      loadGitHubActivity(activityContainer);
    }
  }
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
    
    container.innerHTML = '';
    
    projects.forEach(project => {
      if (!project) return;
      const projectCard = document.createElement('div');
      projectCard.className = 'group bg-white/5 dark:bg-slate-800 border border-slate-600 rounded-xl shadow-md p-5 transition-all duration-300 hover:scale-105 flex flex-col h-full';
      projectCard.innerHTML = `
        <h3 class="text-lg font-semibold mb-2 flex items-center">
          <i class="ri-github-fill mr-2 text-lg text-slate-100 transition-colors group-hover:text-indigo-400"></i>
          ${project.name || 'Unnamed Project'}
        </h3>
        <p class="${project.description ? 'text-sm text-gray-400' : 'text-sm text-gray-400 italic'} mb-4">
          ${project.description || 'Proje açıklaması eklenmemiş.'}
        </p>
        <div class="mt-auto flex space-x-2">
          <span class="bg-gray-700 dark:bg-slate-600 px-2 py-1 rounded-full text-xs text-white inline-block">
            ⭐ ${project.stargazers_count || 0}
          </span>
          <span class="bg-gray-700 dark:bg-slate-600 px-2 py-1 rounded-full text-xs text-white inline-block">
            🍴 ${project.forks_count || 0}
          </span>
        </div>
      `;
      // Add tech tags
      if (project.topics && project.topics.length) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'mt-2 flex flex-wrap gap-2';
        project.topics.forEach(topic => {
          const tag = document.createElement('span');
          tag.className = 'tech-tag cursor-pointer bg-gray-700 dark:bg-slate-600 px-2 py-1 rounded-full text-xs text-white';
          tag.textContent = topic;
          tag.dataset.filter = topic;
          tag.addEventListener('click', () => {
            filterProjects(topic === currentFilter ? null : topic);
          });
          tagsContainer.appendChild(tag);
        });
        projectCard.appendChild(tagsContainer);
      }
      container.appendChild(projectCard);
    });
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
        ${eventDescription} <a href="https://github.com/${activity.repo?.name || ''}" target="_blank" class="text-primary hover:underline">${repoName}</a> - <span class="text-xs text-gray-400">${createdAt}</span>
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
    container.innerHTML = '';
    
    SAMPLE_PROJECTS.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'group bg-white/5 dark:bg-slate-800 border border-slate-600 rounded-xl shadow-md p-5 transition-all duration-300 hover:scale-105 flex flex-col h-full';
      projectCard.innerHTML = `
        <h3 class="text-lg font-semibold mb-2 flex items-center">
          <i class="ri-github-fill mr-2 text-lg text-slate-100 transition-colors group-hover:text-indigo-400"></i>
          ${project.name || 'Unnamed Project'}
        </h3>
        <p class="${project.description ? 'text-sm text-gray-400' : 'text-sm text-gray-400 italic'} mb-4">
          ${project.description || 'Proje açıklaması eklenmemiş.'}
        </p>
        <div class="mt-auto flex space-x-2">
          <span class="bg-gray-700 dark:bg-slate-600 px-2 py-1 rounded-full text-xs text-white inline-block">
            ⭐ ${project.stargazers_count || 0}
          </span>
          <span class="bg-gray-700 dark:bg-slate-600 px-2 py-1 rounded-full text-xs text-white inline-block">
            🍴 ${project.forks_count || 0}
          </span>
        </div>
      `;
      // Add tech tags for sample data
      if (project.topics && project.topics.length) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'mt-2 flex flex-wrap gap-2';
        project.topics.forEach(topic => {
          const tag = document.createElement('span');
          tag.className = 'tech-tag cursor-pointer bg-gray-700 dark:bg-slate-600 px-2 py-1 rounded-full text-xs text-white';
          tag.textContent = topic;
          tag.dataset.filter = topic;
          tag.addEventListener('click', () => {
            filterProjects(topic === currentFilter ? null : topic);
          });
          tagsContainer.appendChild(tag);
        });
        projectCard.appendChild(tagsContainer);
      }
      container.appendChild(projectCard);
    });
    
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