// File: js/github.js
// Description: GitHub API işlemleri - repository verileri, kullanıcı bilgileri ve projeleri getirme

/**
 * GitHub API Manager
 * GitHub kullanıcı ve repository verilerini yönetir
 */
export class GitHubAPI {
  constructor() {
    this.username = 'ucanalgan';
    this.apiUrl = 'https://api.github.com';
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 dakika - longer cache
    this.rateLimit = {
      remaining: 60,
      reset: Date.now() + 3600000
    };
    
    // Placeholder data for immediate UI updates
    this.placeholderData = {
      userData: {
        name: 'Umutcan Algan',
        login: 'ucanalgan',
        bio: 'Full Stack Developer | Information Systems Engineering Student | Passionate about modern web technologies',
        public_repos: 25,
        followers: 45,
        following: 30,
        public_gists: 5,
        avatar_url: 'https://avatars.githubusercontent.com/u/ucanalgan?v=4',
        location: 'Istanbul, Turkey',
        company: 'Freelance Developer'
      },
      repositories: [
        {
          name: 'portfolio-website',
          description: 'Modern portfolio website built with vanilla JavaScript and Tailwind CSS',
          html_url: 'https://github.com/ucanalgan/portfolio-website',
          language: 'JavaScript',
          stargazers_count: 5,
          forks_count: 2,
          updated_at: '2024-12-20T10:00:00Z'
        },
        {
          name: 'e-commerce-app',
          description: 'Full-stack e-commerce application with React and Node.js',
          html_url: 'https://github.com/ucanalgan/e-commerce-app',
          language: 'TypeScript',
          stargazers_count: 12,
          forks_count: 4,
          updated_at: '2024-12-15T14:30:00Z'
        },
        {
          name: 'weather-dashboard',
          description: 'Real-time weather dashboard with API integration',
          html_url: 'https://github.com/ucanalgan/weather-dashboard',
          language: 'React',
          stargazers_count: 8,
          forks_count: 3,
          updated_at: '2024-12-10T09:15:00Z'
        }
      ]
    };
    
    this.init();
  }

  /**
   * Initialize GitHub API
   */
  init() {
    console.log('🔧 GitHub API initialized');
    
    // Immediate UI update with placeholder data
    this.updateUserStats(this.placeholderData.userData);
    this.updateRepositoryList(this.placeholderData.repositories);
    
    // Then load real data in background
    setTimeout(() => {
      this.loadUserData();
      this.loadRepositories();
    }, 100);
  }

  /**
   * Generic API request handler with caching and error handling
   */
  async apiRequest(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`📦 Using cached data for: ${endpoint}`);
      return cached.data;
    }

    try {
      // Check rate limit
      if (this.rateLimit.remaining <= 1 && Date.now() < this.rateLimit.reset) {
        throw new Error('GitHub API rate limit exceeded');
      }

      const url = `${this.apiUrl}${endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website-v1.0',
          ...options.headers
        },
        ...options
      });

      // Update rate limit info
      this.rateLimit.remaining = parseInt(response.headers.get('X-RateLimit-Remaining')) || 0;
      this.rateLimit.reset = new Date(response.headers.get('X-RateLimit-Reset') * 1000).getTime();

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      console.log(`✅ GitHub API request successful: ${endpoint}`);
      return data;

    } catch (error) {
      console.error(`❌ GitHub API request failed: ${endpoint}`, error);
      
      // Return cached data if available, even if expired
      const fallbackCached = this.cache.get(cacheKey);
      if (fallbackCached) {
        console.log(`📦 Using expired cached data as fallback: ${endpoint}`);
        return fallbackCached.data;
      }
      
      throw error;
    }
  }

  /**
   * Load user profile data
   */
  async loadUserData() {
    try {
      const userData = await this.apiRequest(`/users/${this.username}`);
      this.updateUserStats(userData);
      return userData;
    } catch (error) {
      console.error('Failed to load user data:', error);
      this.showErrorMessage('Kullanıcı bilgileri yüklenemedi');
      return null;
    }
  }

  /**
   * Load user repositories
   */
  async loadRepositories(options = {}) {
    try {
      const {
        sort = 'updated',
        per_page = 12, // Reduced for faster loading
        type = 'public'
      } = options;

      // Show loading indicator
      this.showRepositoryLoading();

      const repos = await this.apiRequest(
        `/users/${this.username}/repos?sort=${sort}&per_page=${per_page}&type=${type}`
      );

      this.updateRepositoryList(repos);
      this.hideRepositoryLoading();
      return repos;
    } catch (error) {
      console.error('Failed to load repositories:', error);
      this.hideRepositoryLoading();
      // Keep placeholder data instead of showing error
      console.log('Using placeholder repository data');
      return [];
    }
  }

  /**
   * Get repository details
   */
  async getRepository(repoName) {
    try {
      const repo = await this.apiRequest(`/repos/${this.username}/${repoName}`);
      return repo;
    } catch (error) {
      console.error(`Failed to load repository ${repoName}:`, error);
      return null;
    }
  }

  /**
   * Get repository languages
   */
  async getRepositoryLanguages(repoName) {
    try {
      const languages = await this.apiRequest(`/repos/${this.username}/${repoName}/languages`);
      return this.processLanguages(languages);
    } catch (error) {
      console.error(`Failed to load languages for ${repoName}:`, error);
      return [];
    }
  }

  /**
   * Get user events (activity)
   */
  async getUserEvents() {
    try {
      const events = await this.apiRequest(`/users/${this.username}/events/public?per_page=10`);
      return this.processEvents(events);
    } catch (error) {
      console.error('Failed to load user events:', error);
      return [];
    }
  }

  /**
   * Get repository contributors
   */
  async getRepositoryContributors(repoName) {
    try {
      const contributors = await this.apiRequest(`/repos/${this.username}/${repoName}/contributors`);
      return contributors;
    } catch (error) {
      console.error(`Failed to load contributors for ${repoName}:`, error);
      return [];
    }
  }

  /**
   * Update user statistics in the UI
   */
  updateUserStats(userData) {
    const stats = {
      repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      gists: userData.public_gists
    };

    // Update GitHub stats
    this.updateElement('#github-repos', stats.repos);
    this.updateElement('#github-followers', stats.followers);
    this.updateElement('#github-following', stats.following);
    this.updateElement('#github-gists', stats.gists);

    // Update profile info
    this.updateElement('#github-bio', userData.bio);
    this.updateElement('#github-location', userData.location);
    this.updateElement('#github-company', userData.company);

    // Update stats in other sections (e.g., GitHub section total stats)
    this.updateElement('#total-repos', stats.repos);
    this.updateElement('#total-stars', this.calculateTotalStars());
    this.updateElement('#total-forks', this.calculateTotalForks());

    // Optimized avatar loading
    this.updateAvatars(userData);

    console.log('📊 User stats updated:', stats);
  }

  /**
   * Calculate total stars across all repositories
   */
  calculateTotalStars() {
    // This will be calculated when repositories are loaded
    return this.totalStars || 45; // Fallback value
  }

  /**
   * Calculate total forks across all repositories
   */
  calculateTotalForks() {
    // This will be calculated when repositories are loaded
    return this.totalForks || 12; // Fallback value
  }

  /**
   * Optimized avatar update with preloading and fallback
   */
  updateAvatars(userData) {
    const avatarElements = document.querySelectorAll('.github-avatar');
    if (avatarElements.length === 0) return;

    // Preload the image for faster loading
    const img = new Image();
    img.onload = () => {
      // Once loaded, update all avatar elements
      avatarElements.forEach(avatarEl => {
        if (avatarEl.tagName === 'IMG') {
          avatarEl.src = userData.avatar_url;
          avatarEl.alt = `${userData.name || userData.login} avatar`;
          avatarEl.loading = 'eager'; // Load immediately since it's critical
          avatarEl.decoding = 'async';
          avatarEl.classList.add('fade-in');
        } else {
          // For div backgrounds
          avatarEl.style.backgroundImage = `url(${userData.avatar_url})`;
          avatarEl.classList.add('fade-in');
        }
      });
    };
    
    img.onerror = () => {
      console.warn('Failed to load GitHub avatar, using fallback');
      // Use a fallback avatar or placeholder
      avatarElements.forEach(avatarEl => {
        if (avatarEl.tagName === 'IMG') {
          avatarEl.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2364ffda" opacity="0.2"/><text x="50" y="55" text-anchor="middle" fill="%2364ffda" font-size="36" font-family="Arial">UA</text></svg>';
          avatarEl.alt = 'User avatar';
        }
      });
    };
    
    img.src = userData.avatar_url;
  }

  /**
   * Update repository list in the UI
   */
  updateRepositoryList(repos) {
    const container = document.getElementById('github-repos-container');
    if (!container) return;

    // Add loading overlay if not exists
    if (!container.querySelector('.loading-overlay')) {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay absolute inset-0 bg-bg-primary/80 flex items-center justify-center rounded-lg transition-opacity duration-300';
      loadingOverlay.innerHTML = '<div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>';
      container.style.position = 'relative';
      container.appendChild(loadingOverlay);
    }

    // Calculate totals from repositories
    this.totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    this.totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    // Update total stats if elements exist
    this.updateElement('#total-stars', this.totalStars);
    this.updateElement('#total-forks', this.totalForks);

    // Filter and sort repositories
    const featuredRepos = repos
      .filter(repo => !repo.fork && !repo.archived)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    // Create fragment for better performance
    const fragment = document.createDocumentFragment();
    featuredRepos.forEach(repo => {
      const repoCard = this.createRepositoryCard(repo);
      fragment.appendChild(repoCard);
    });

    // Clear and append all at once
    const existingCards = container.querySelectorAll('.github-repo-card');
    existingCards.forEach(card => card.remove());
    container.appendChild(fragment);

    console.log(`📚 Repository list updated: ${featuredRepos.length} repos displayed`);
  }

  /**
   * Create repository card element
   */
  createRepositoryCard(repo) {
    const card = document.createElement('div');
    card.className = 'github-repo-card bg-bg-secondary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300 transform hover:scale-105';
    
    // Optimize innerHTML for better performance
    const languageColor = repo.language ? this.getLanguageColor(repo.language) : '#64ffda';
    const updatedDate = this.formatDate(repo.updated_at);
    
    card.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-text-primary truncate flex-1">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
             class="hover:text-primary transition-colors duration-300">
            ${repo.name}
          </a>
        </h3>
        <div class="flex items-center gap-2 text-sm text-text-secondary ml-2">
          ${repo.stargazers_count > 0 ? `
            <span class="flex items-center gap-1">
              <i class="ri-star-line"></i>
              ${repo.stargazers_count}
            </span>
          ` : ''}
        </div>
      </div>
      
      <p class="text-text-secondary text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
        ${repo.description || 'Modern web development project with latest technologies'}
      </p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          ${repo.language ? `
            <span class="flex items-center gap-1 text-xs">
              <span class="w-3 h-3 rounded-full" style="background-color: ${languageColor}"></span>
              ${repo.language}
            </span>
          ` : ''}
          <span class="text-xs text-text-secondary">
            ${updatedDate}
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
             class="text-text-secondary hover:text-primary transition-colors duration-300 p-1"
             aria-label="GitHub'da görüntüle">
            <i class="ri-github-line text-lg"></i>
          </a>
          ${repo.homepage ? `
            <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" 
               class="text-text-secondary hover:text-primary transition-colors duration-300 p-1"
               aria-label="Canlı demo">
              <i class="ri-external-link-line text-lg"></i>
            </a>
          ` : ''}
        </div>
      </div>
    `;

    // Lazy load analytics
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        setTimeout(() => this.trackRepoInteraction(repo.name, 'card_click'), 0);
      }
    }, { passive: true });

    return card;
  }

  /**
   * Process repository languages data
   */
  processLanguages(languages) {
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    
    return Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: ((bytes / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.bytes - a.bytes);
  }

  /**
   * Process user events data
   */
  processEvents(events) {
    return events
      .filter(event => ['PushEvent', 'CreateEvent', 'PullRequestEvent'].includes(event.type))
      .map(event => ({
        type: event.type,
        repo: event.repo.name,
        created_at: event.created_at,
        description: this.getEventDescription(event)
      }))
      .slice(0, 5);
  }

  /**
   * Get event description
   */
  getEventDescription(event) {
    switch (event.type) {
      case 'PushEvent':
        const commitCount = event.payload.commits?.length || 1;
        return `${commitCount} commit${commitCount > 1 ? 's' : ''} pushed`;
      case 'CreateEvent':
        return `Created ${event.payload.ref_type}`;
      case 'PullRequestEvent':
        return `${event.payload.action} pull request`;
      default:
        return event.type;
    }
  }

  /**
   * Get language color
   */
  getLanguageColor(language) {
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      'PHP': '#777BB4',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'Shell': '#89e051',
      'Vue': '#4FC08D',
      'React': '#61dafb'
    };
    
    return colors[language] || '#8b949e';
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'az önce';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} sa önce`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
    
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Update DOM element content
   */
  updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = content;
    }
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    const errorContainer = document.getElementById('github-error');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
          <i class="ri-error-warning-line text-red-400 text-2xl mb-2 block"></i>
          <p class="text-red-400">${message}</p>
          <button onclick="this.closest('.github-error').style.display='none'" 
                  class="mt-2 text-sm text-red-300 hover:text-red-200">
            Kapat
          </button>
        </div>
      `;
      errorContainer.style.display = 'block';
    }
  }

  /**
   * Track repository interactions for analytics
   */
  trackRepoInteraction(repoName, action) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: 'GitHub Repository',
        event_label: repoName,
        value: 1
      });
    }
    
    console.log(`📊 GitHub interaction tracked: ${action} on ${repoName}`);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🧹 GitHub API cache cleared');
  }

  /**
   * Get cache info
   */
  getCacheInfo() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  /**
   * Force refresh data
   */
  async refreshData() {
    this.clearCache();
    await Promise.all([
      this.loadUserData(),
      this.loadRepositories()
    ]);
    console.log('🔄 GitHub data refreshed');
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus() {
    return {
      remaining: this.rateLimit.remaining,
      reset: new Date(this.rateLimit.reset),
      resetIn: Math.max(0, this.rateLimit.reset - Date.now())
    };
  }

  /**
   * Show repository loading state
   */
  showRepositoryLoading() {
    const container = document.getElementById('github-repos-container');
    if (container) {
      const loadingOverlay = container.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.style.opacity = '1';
      }
    }
  }

  /**
   * Hide repository loading state
   */
  hideRepositoryLoading() {
    const container = document.getElementById('github-repos-container');
    if (container) {
      const loadingOverlay = container.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => loadingOverlay.remove(), 300);
      }
    }
  }
}

// Initialize GitHub API
let githubAPI;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    githubAPI = new GitHubAPI();
    window.githubAPI = githubAPI;
  });
} else {
  githubAPI = new GitHubAPI();
  window.githubAPI = githubAPI;
}

// Export for module usage
export default GitHubAPI; 