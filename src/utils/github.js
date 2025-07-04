// File: js/github.js
// Description: GitHub API operations - fetching repository data, user information and projects

/**
 * GitHub API Integration
 * Fetches real GitHub data and displays it in the portfolio
 */

const GITHUB_USERNAME = 'ucanalgan';
const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const cache = new Map();

/**
 * Send GitHub API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} API response
 */
async function githubFetch(endpoint, options = {}) {
  const url = `${GITHUB_API_BASE}${endpoint}`;
  const cacheKey = url;
  
  // Cache'den kontrol et
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Website',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache'le
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    // Cache'den eski veri varsa onu kullan
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey).data;
    }
    throw error;
  }
}

/**
 * Kullanıcı profilini getir
 */
export async function fetchUserProfile() {
  try {
    const profile = await githubFetch(`/users/${GITHUB_USERNAME}`);
    return {
      name: profile.name || GITHUB_USERNAME,
      bio: profile.bio || 'Full-Stack Developer',
      avatar: profile.avatar_url,
      location: profile.location || 'Turkey',
      company: profile.company || null,
      blog: profile.blog || null,
      twitter: profile.twitter_username || null,
      followers: profile.followers || 0,
      following: profile.following || 0,
      public_repos: profile.public_repos || 0,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      html_url: profile.html_url
    };
  } catch (error) {
    return getFallbackProfile();
  }
}

/**
 * Repository'leri getir ve filtrele
 */
export async function fetchRepositories() {
  try {
    const repos = await githubFetch(`/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    
    // Filter and sort important projects
    const filteredRepos = repos
      .filter(repo => !repo.fork && !repo.archived) // Fork'ları ve arşivlenmiş repoları hariç tut
      .filter(repo => repo.stargazers_count > 0 || repo.description) // Yıldızı olan veya açıklaması olan
      .sort((a, b) => {
        // Önce yıldız sayısına göre, sonra güncellenme tarihine göre sırala
        if (a.stargazers_count !== b.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, 6) // En iyi 6 projeyi al
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || 'No description available',
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        languages_url: repo.languages_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        size: repo.size,
        open_issues_count: repo.open_issues_count,
        default_branch: repo.default_branch,
        clone_url: repo.clone_url
      }));

    // Her repo için dil istatistiklerini getir
    const reposWithLanguages = await Promise.all(
      filteredRepos.map(async (repo) => {
        try {
          const languages = await githubFetch(`/repos/${GITHUB_USERNAME}/${repo.name}/languages`);
          const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
          const languageStats = Object.entries(languages).map(([lang, bytes]) => ({
            name: lang,
            percentage: ((bytes / totalBytes) * 100).toFixed(1)
          }));
          
          return {
            ...repo,
            languages: languageStats
          };
        } catch (error) {
          return repo;
        }
      })
    );

    return reposWithLanguages;
  } catch (error) {
    return getFallbackRepositories();
  }
}

/**
 * GitHub istatistiklerini hesapla
 */
export async function fetchGitHubStats() {
  try {
    const [profile, repos] = await Promise.all([
      fetchUserProfile(),
      githubFetch(`/users/${GITHUB_USERNAME}/repos?per_page=100`)
    ]);

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languages = {};
    
    // Dil istatistikleri
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang, count]) => ({ language: lang, count }));

    return {
      totalRepos: profile.public_repos,
      totalStars,
      totalForks,
      followers: profile.followers,
      following: profile.following,
      topLanguages,
      joinDate: profile.created_at,
      lastUpdate: profile.updated_at
    };
  } catch (error) {
    return getFallbackStats();
  }
}

/**
 * Commit aktivitelerini getir (son 1 yıl)
 */
export async function fetchCommitActivity() {
  try {
    const events = await githubFetch(`/users/${GITHUB_USERNAME}/events/public?per_page=100`);
    
    const pushEvents = events.filter(event => event.type === 'PushEvent');
    const commitsByMonth = {};
    
    pushEvents.forEach(event => {
      const date = new Date(event.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      commitsByMonth[monthKey] = (commitsByMonth[monthKey] || 0) + (event.payload.commits?.length || 1);
    });

    // Son 12 ayı al
    const last12Months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      last12Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        commits: commitsByMonth[monthKey] || 0
      });
    }

    return last12Months;
  } catch (error) {
    return getFallbackCommitActivity();
  }
}

/**
 * README dosyalarından proje fotoğrafları çek
 */
export async function fetchProjectImages() {
  try {
    const repos = await githubFetch(`/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
    const projectImages = [];

    for (const repo of repos) {
      try {
        // README.md dosyasını getir
        const readme = await githubFetch(`/repos/${GITHUB_USERNAME}/${repo.name}/readme`);
        const content = atob(readme.content); // Base64 decode
        
        // Markdown'dan image URL'lerini çıkar
        const imageRegex = /!\[.*?\]\((.*?)\)/g;
        const images = [];
        let match;
        
        while ((match = imageRegex.exec(content)) !== null) {
          let imageUrl = match[1];
          
          // Relative URL'leri GitHub raw URL'ine çevir
          if (!imageUrl.startsWith('http')) {
            imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${repo.default_branch}/${imageUrl}`;
          }
          
          images.push(imageUrl);
        }

        if (images.length > 0) {
          projectImages.push({
            repoName: repo.name,
            repoUrl: repo.html_url,
            images: images,
            description: repo.description
          });
        }
      } catch (error) {
        // README yoksa veya erişim sorunu varsa devam et
        continue;
      }
    }

    return projectImages;
  } catch (error) {
    return [];
  }
}

/**
 * Ana GitHub entegrasyon fonksiyonu
 */
export async function initGitHubIntegration() {
  try {
    const [profile, repositories, stats, commitActivity, projectImages] = await Promise.all([
      fetchUserProfile(),
      fetchRepositories(),
      fetchGitHubStats(),
      fetchCommitActivity(),
      fetchProjectImages()
    ]);

    const data = {
      profile,
      repositories,
      stats,
      commitActivity,
      projectImages,
      isLoaded: true,
      loadedAt: new Date().toISOString()
    };

    // DOM'a verileri ekle
    updateProfileSection(data.profile);
    updateStatsSection(data.stats);
    updateProjectsSection(data.repositories);
    updateAboutSection(data.profile);
    
    if (data.projectImages.length > 0) {
      updateProjectImagesSection(data.projectImages);
    }

    return data;
  } catch (error) {
    // Fallback verilerle devam et
    const fallbackData = {
      profile: getFallbackProfile(),
      repositories: getFallbackRepositories(),
      stats: getFallbackStats(),
      commitActivity: getFallbackCommitActivity(),
      projectImages: [],
      isLoaded: false,
      error: error.message
    };

    updateProfileSection(fallbackData.profile);
    updateStatsSection(fallbackData.stats);
    updateProjectsSection(fallbackData.repositories);

    return fallbackData;
  }
}

/**
 * Profil bölümünü güncelle
 */
function updateProfileSection(profile) {
  // Avatar güncelle
  const avatarElements = document.querySelectorAll('[data-github-avatar]');
  avatarElements.forEach(el => {
    if (el.tagName === 'IMG') {
      el.src = profile.avatar;
      el.alt = `${profile.name} Avatar`;
    } else {
      el.style.backgroundImage = `url(${profile.avatar})`;
    }
  });

  // İsim güncelle
  const nameElements = document.querySelectorAll('[data-github-name]');
  nameElements.forEach(el => {
    el.textContent = profile.name;
  });

  // Bio güncelle
  const bioElements = document.querySelectorAll('[data-github-bio]');
  bioElements.forEach(el => {
    el.textContent = profile.bio;
  });

  // Lokasyon güncelle
  const locationElements = document.querySelectorAll('[data-github-location]');
  locationElements.forEach(el => {
    el.textContent = profile.location;
  });

  // GitHub profil linki güncelle
  const profileLinks = document.querySelectorAll('[data-github-profile-link]');
  profileLinks.forEach(el => {
    el.href = profile.html_url;
  });
}

/**
 * İstatistik bölümünü güncelle
 */
function updateStatsSection(stats) {
  const statElements = {
    repositories: document.querySelectorAll('[data-stat="repositories"]'),
    stars: document.querySelectorAll('[data-stat="stars"]'),
    forks: document.querySelectorAll('[data-stat="forks"]'),
    followers: document.querySelectorAll('[data-stat="followers"]')
  };

  // Repository sayısını güncelle
  statElements.repositories.forEach(el => {
    animateCounter(el, stats.totalRepos || 0);
  });

  // Toplam yıldız sayısını güncelle
  statElements.stars.forEach(el => {
    animateCounter(el, stats.totalStars || 0);
  });

  // Toplam fork sayısını güncelle
  statElements.forks.forEach(el => {
    animateCounter(el, stats.totalForks || 0);
  });

  // Takipçi sayısını güncelle
  statElements.followers.forEach(el => {
    animateCounter(el, stats.followers || 0);
  });
}

/**
 * Projeler bölümünü güncelle
 */
function updateProjectsSection(repositories) {
  const projectsContainer = document.querySelector('#projects-container, [data-projects-container]');
  if (!projectsContainer || !repositories.length) return;

  const projectsHTML = repositories.map(repo => `
    <article class="project-card bg-surface border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 group">
      <div class="p-6">
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
            ${repo.name.replace(/[-_]/g, ' ')}
          </h3>
          <div class="flex items-center gap-2 text-sm text-text-secondary">
            <span class="flex items-center gap-1">
              <i class="ri-star-line text-yellow-400"></i>
              ${repo.stargazers_count}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri-git-branch-line"></i>
              ${repo.forks_count}
            </span>
          </div>
        </div>
        
        <p class="text-text-secondary mb-4 line-clamp-3">
          ${repo.description}
        </p>
        
        ${repo.topics && repo.topics.length > 0 ? `
          <div class="flex flex-wrap gap-2 mb-4">
            ${repo.topics.slice(0, 3).map(topic => 
              `<span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">${topic}</span>`
            ).join('')}
          </div>
        ` : ''}
        
        ${repo.languages && repo.languages.length > 0 ? `
          <div class="flex items-center gap-2 mb-4">
            <span class="flex items-center gap-1 text-sm text-text-secondary">
              <span class="w-3 h-3 rounded-full" style="background-color: ${getLanguageColor(repo.languages[0].name)}"></span>
              ${repo.languages[0].name}
            </span>
            ${repo.languages.length > 1 ? `
              <span class="text-xs text-text-secondary">+${repo.languages.length - 1} more</span>
            ` : ''}
          </div>
        ` : ''}
        
        <div class="flex gap-3">
          <a href="${repo.html_url}" 
             target="_blank" 
             rel="noopener noreferrer"
             class="flex-1 btn-secondary text-center text-sm">
            <i class="ri-github-line mr-2"></i>
            View Code
          </a>
          ${repo.homepage ? `
            <a href="${repo.homepage}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="flex-1 btn-primary text-center text-sm">
              <i class="ri-external-link-line mr-2"></i>
              Live Demo
            </a>
          ` : ''}
        </div>
      </div>
    </article>
  `).join('');

  projectsContainer.innerHTML = projectsHTML;
}

/**
 * Hakkında bölümünü güncelle
 */
function updateAboutSection(profile) {
  const aboutText = document.querySelector('[data-about-github]');
  if (aboutText && profile.bio) {
    aboutText.textContent = profile.bio;
  }

  const joinDate = document.querySelector('[data-github-join-date]');
  if (joinDate && profile.created_at) {
    const date = new Date(profile.created_at);
    joinDate.textContent = `GitHub since ${date.getFullYear()}`;
  }
}

/**
 * Proje fotoğrafları bölümünü güncelle
 */
function updateProjectImagesSection(projectImages) {
  const imagesContainer = document.querySelector('#project-images-container, [data-project-images]');
  if (!imagesContainer || !projectImages.length) return;

  const imagesHTML = projectImages.map(project => `
    <div class="project-image-card">
      <h4 class="text-lg font-semibold mb-3">${project.repoName}</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${project.images.slice(0, 4).map(image => `
          <img src="${image}" 
               alt="${project.repoName} screenshot"
               class="rounded-lg border border-border hover:border-primary/50 transition-colors"
               loading="lazy"
               onerror="this.style.display='none'">
        `).join('')}
      </div>
      <a href="${project.repoUrl}" 
         target="_blank" 
         rel="noopener noreferrer"
         class="inline-flex items-center mt-3 text-primary hover:text-primary-light transition-colors">
        <i class="ri-external-link-line mr-1"></i>
        View Project
      </a>
    </div>
  `).join('');

  imagesContainer.innerHTML = imagesHTML;
}

/**
 * Sayı animasyonu
 */
function animateCounter(element, targetValue) {
  const startValue = 0;
  const duration = 2000;
  const startTime = performance.now();
  
  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);
    
    element.textContent = formatNumber(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };
  
  requestAnimationFrame(updateCounter);
}

/**
 * Sayı formatlama
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Programlama dili renkleri
 */
function getLanguageColor(language) {
  const colors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#239120',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'HTML': '#e34c26',
    'CSS': '#1572B6',
    'Vue': '#4FC08D',
    'React': '#61DAFB'
  };
  return colors[language] || '#64ffda';
}

/**
 * Fallback verileri
 */
function getFallbackProfile() {
  return {
    name: 'Umut Can Algan',
    bio: 'Full-Stack Developer specialized in modern web technologies',
    avatar: '/assets/images/profile.webp',
    location: 'Turkey',
    followers: 0,
    following: 0,
    public_repos: 0,
    html_url: `https://github.com/${GITHUB_USERNAME}`
  };
}

function getFallbackRepositories() {
  return [
    {
      name: 'portfolio-website',
      description: 'Personal portfolio website built with modern web technologies',
      html_url: `https://github.com/${GITHUB_USERNAME}/portfolio-website`,
      language: 'JavaScript',
      stargazers_count: 0,
      forks_count: 0,
      topics: ['portfolio', 'javascript', 'css']
    }
  ];
}

function getFallbackStats() {
  return {
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    followers: 0,
    topLanguages: []
  };
}

function getFallbackCommitActivity() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      commits: 0
    });
  }
  return months;
}

export default {
  initGitHubIntegration,
  fetchUserProfile,
  fetchRepositories,
  fetchGitHubStats,
  fetchCommitActivity,
  fetchProjectImages
}; 