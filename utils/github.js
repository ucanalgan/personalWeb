// File: js/github.js
// Description: GitHub API işlemleri - repository verileri, kullanıcı bilgileri ve projeleri getirme

/**
 * Advanced GitHub API Integration
 * Fetches real repository data, stars, commits, and project information
 */

export class GitHubAPI {
  constructor(username = 'ucanalgan') {
    this.username = username;
    this.baseURL = 'https://api.github.com';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Fetch user profile information
  async fetchUserProfile() {
    const cacheKey = 'user-profile';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseURL}/users/${this.username}`);
      if (!response.ok) throw new Error('Failed to fetch user profile');
      
      const data = await response.json();
      const profile = {
        name: data.name,
        bio: data.bio,
        avatar: data.avatar_url,
        followers: data.followers,
        following: data.following,
        publicRepos: data.public_repos,
        company: data.company,
        location: data.location,
        blog: data.blog,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      this.setCache(cacheKey, profile);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return this.getFallbackProfile();
    }
  }

  // Fetch repositories with enhanced data
  async fetchRepositories(options = {}) {
    const {
      sort = 'updated',
      direction = 'desc',
      per_page = 100,
      type = 'owner'
    } = options;

    const cacheKey = `repos-${sort}-${direction}-${per_page}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseURL}/users/${this.username}/repos?sort=${sort}&direction=${direction}&per_page=${per_page}&type=${type}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch repositories');
      
      const repos = await response.json();
      const enhancedRepos = await this.enhanceRepositories(repos);
      
      this.setCache(cacheKey, enhancedRepos);
      return enhancedRepos;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return this.getFallbackRepositories();
    }
  }

  // Enhance repositories with additional data
  async enhanceRepositories(repos) {
    const enhancements = await Promise.allSettled(
      repos.map(async (repo) => {
        try {
          // Fetch additional repo stats
          const [languages, commits] = await Promise.all([
            this.fetchRepoLanguages(repo.name),
            this.fetchRepoCommits(repo.name, 1) // Just get the latest commit
          ]);

          return {
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            htmlUrl: repo.html_url,
            homepage: repo.homepage,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            size: repo.size,
            language: repo.language,
            languages,
            topics: repo.topics || [],
            createdAt: new Date(repo.created_at),
            updatedAt: new Date(repo.updated_at),
            pushedAt: new Date(repo.pushed_at),
            isPrivate: repo.private,
            isFork: repo.fork,
            hasPages: repo.has_pages,
            defaultBranch: repo.default_branch,
            openIssues: repo.open_issues_count,
            license: repo.license?.name,
            lastCommit: commits[0] || null,
            // Calculate activity score
            activityScore: this.calculateActivityScore(repo),
            // Determine project category
            category: this.categorizeProject(repo.topics, repo.language, repo.description)
          };
        } catch (error) {
          console.warn(`Failed to enhance repo ${repo.name}:`, error);
          return this.createBasicRepoData(repo);
        }
      })
    );

    return enhancements
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
      .sort((a, b) => b.activityScore - a.activityScore);
  }

  // Fetch repository languages
  async fetchRepoLanguages(repoName) {
    try {
      const response = await fetch(`${this.baseURL}/repos/${this.username}/${repoName}/languages`);
      if (!response.ok) return {};
      return await response.json();
    } catch (error) {
      console.warn(`Failed to fetch languages for ${repoName}:`, error);
      return {};
    }
  }

  // Fetch recent commits
  async fetchRepoCommits(repoName, per_page = 10) {
    try {
      const response = await fetch(
        `${this.baseURL}/repos/${this.username}/${repoName}/commits?per_page=${per_page}`
      );
      if (!response.ok) return [];
      
      const commits = await response.json();
      return commits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: new Date(commit.commit.author.date),
        url: commit.html_url
      }));
    } catch (error) {
      console.warn(`Failed to fetch commits for ${repoName}:`, error);
      return [];
    }
  }

  // Calculate activity score for sorting
  calculateActivityScore(repo) {
    const now = Date.now();
    const daysSinceUpdate = (now - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24);
    const daysSinceCreation = (now - new Date(repo.created_at)) / (1000 * 60 * 60 * 24);
    
    // Weighted scoring
    const starsWeight = repo.stargazers_count * 10;
    const forksWeight = repo.forks_count * 5;
    const recentActivityWeight = Math.max(0, 100 - daysSinceUpdate);
    const projectMaturityWeight = Math.min(365, daysSinceCreation) / 365 * 20;
    
    return starsWeight + forksWeight + recentActivityWeight + projectMaturityWeight;
  }

  // Categorize projects based on various factors
  categorizeProject(topics, language, description) {
    const topicsStr = topics.join(' ').toLowerCase();
    const descStr = (description || '').toLowerCase();
    const langStr = (language || '').toLowerCase();
    
    // AI/ML projects
    if (topicsStr.includes('ai') || topicsStr.includes('ml') || topicsStr.includes('machine-learning') ||
        descStr.includes('ai') || descStr.includes('machine learning') || descStr.includes('neural')) {
      return 'ai';
    }
    
    // Mobile projects
    if (topicsStr.includes('mobile') || topicsStr.includes('android') || topicsStr.includes('ios') ||
        langStr.includes('swift') || langStr.includes('kotlin') || topicsStr.includes('react-native')) {
      return 'mobile';
    }
    
    // Backend projects
    if (topicsStr.includes('api') || topicsStr.includes('backend') || topicsStr.includes('server') ||
        langStr.includes('python') || langStr.includes('node') || langStr.includes('go')) {
      return 'backend';
    }
    
    // Full-stack projects
    if (topicsStr.includes('fullstack') || topicsStr.includes('full-stack') ||
        (topicsStr.includes('react') && topicsStr.includes('node')) ||
        (topicsStr.includes('vue') && topicsStr.includes('express'))) {
      return 'fullstack';
    }
    
    // Default to frontend
    return 'frontend';
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clearCache() {
    this.cache.clear();
  }

  // Fallback data for when API is unavailable
  getFallbackProfile() {
    return {
      name: 'Umutcan Algan',
      bio: 'Full Stack Developer',
      followers: 50,
      following: 30,
      publicRepos: 15,
      location: 'Turkey'
    };
  }

  getFallbackRepositories() {
    return [
      {
        id: 1,
        name: 'portfolio-website',
        description: 'Modern portfolio website built with vanilla JavaScript and Vite',
        stars: 25,
        forks: 5,
        language: 'JavaScript',
        category: 'frontend',
        activityScore: 95
      },
      {
        id: 2,
        name: 'task-manager-app',
        description: 'Full-stack task management application with real-time updates',
        stars: 18,
        forks: 8,
        language: 'TypeScript',
        category: 'fullstack',
        activityScore: 88
      }
    ];
  }

  createBasicRepoData(repo) {
    return {
      id: repo.id,
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      category: 'frontend',
      activityScore: 50
    };
  }

  // Public API methods
  async getPortfolioStats() {
    try {
      const [profile, repos] = await Promise.all([
        this.fetchUserProfile(),
        this.fetchRepositories()
      ]);

      const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);
      const languages = this.getTopLanguages(repos);
      const topProjects = repos.slice(0, 6);

      return {
        profile,
        stats: {
          totalRepos: profile.publicRepos,
          totalStars,
          totalForks,
          followers: profile.followers
        },
        languages,
        topProjects,
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Error fetching portfolio stats:', error);
      return this.getFallbackStats();
    }
  }

  getTopLanguages(repos) {
    const languageStats = {};
    
    repos.forEach(repo => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    });

    return Object.entries(languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({
        name: language,
        count,
        percentage: Math.round((count / repos.length) * 100)
      }));
  }

  getFallbackStats() {
    return {
      profile: this.getFallbackProfile(),
      stats: {
        totalRepos: 15,
        totalStars: 50,
        totalForks: 20,
        followers: 50
      },
      languages: [
        { name: 'JavaScript', count: 8, percentage: 40 },
        { name: 'TypeScript', count: 4, percentage: 20 },
        { name: 'Python', count: 3, percentage: 15 }
      ],
      topProjects: this.getFallbackRepositories(),
      lastUpdate: new Date()
    };
  }
}

// Initialize GitHub API
export const githubAPI = new GitHubAPI();

// Utility functions for components
export async function updateHeroStats() {
  try {
    const stats = await githubAPI.getPortfolioStats();
    
    // Update hero section stats
    const elements = {
      projects: document.getElementById('projects-count'),
      followers: document.getElementById('followers-count'),
      commits: document.getElementById('commits-count')
    };

    if (elements.projects) {
      elements.projects.textContent = `${stats.stats.totalRepos}+`;
    }
    
    if (elements.followers) {
      elements.followers.textContent = `${stats.stats.followers}+`;
    }
    
    if (elements.commits) {
      // Estimate commits based on repos and activity
      const estimatedCommits = stats.stats.totalRepos * 15;
      elements.commits.textContent = `${estimatedCommits}+`;
    }

    return stats;
  } catch (error) {
    console.warn('Failed to update hero stats:', error);
    return null;
  }
}

export async function getProjectsData() {
  try {
    const stats = await githubAPI.getPortfolioStats();
    return stats.topProjects;
  } catch (error) {
    console.warn('Failed to fetch projects data:', error);
    return [];
  }
} 