/**
 * Projects Section Component
 * Modular component for the projects section with GitHub integration
 */

class ProjectsSection {
  constructor() {
    this.container = document.getElementById('projects-container');
    this.initialized = false;
    this.repositories = [];
  }

  async render() {
    if (!this.container) {
      console.error('Projects container not found');
      return;
    }

    try {
      // Load HTML content
      const response = await fetch('./components/sections/ProjectsSection.html');
      if (!response.ok) throw new Error('Failed to fetch projects content');
      
      const htmlContent = await response.text();
      this.container.innerHTML = htmlContent;
      
      this.initializeInteractions();
      this.initialized = true;
      
      console.log('✓ Projects section loaded successfully');
      
      // Load GitHub repositories
      this.loadGitHubRepositories();
    } catch (error) {
      console.error('Failed to load projects section:', error);
      this.renderFallback();
    }
  }

  renderFallback() {
    // Immediate fallback content with placeholder projects
    this.container.innerHTML = `
      <section id="projects" class="py-20 bg-bg-primary">
        <div class="container mx-auto px-6">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
              <span class="text-primary font-mono text-lg mb-2 block">Some things I've built</span>
              <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">Featured Projects</h2>
              <p class="text-text-secondary max-w-2xl mx-auto">
                Here are some of my recent projects. Each project is built with modern technologies 
                and best practices in mind.
              </p>
            </div>
            
            <div id="repositories-container" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <!-- Loading state -->
              <div class="col-span-full text-center py-12">
                <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-text-secondary">Loading projects from GitHub...</p>
              </div>
            </div>

            <!-- Featured Projects Section -->
            <div class="mt-20">
              <h3 class="text-2xl font-bold text-text-primary mb-8 text-center">Highlighted Projects</h3>
              <div class="grid lg:grid-cols-2 gap-8">
                ${this.generateFeaturedProject({
                  title: 'Portfolio Website',
                  description: 'This responsive portfolio website built with modern web technologies including Vite, Tailwind CSS, and modular JavaScript architecture.',
                  tech: ['JavaScript', 'Vite', 'Tailwind CSS', 'HTML5'],
                  image: '💼',
                  links: {
                    github: 'https://github.com/ucanalgan/portfolio',
                    demo: '#'
                  }
                })}
                
                ${this.generateFeaturedProject({
                  title: 'Full-Stack E-Commerce',
                  description: 'Complete e-commerce solution with user authentication, payment processing, and admin dashboard.',
                  tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                  image: '🛒',
                  links: {
                    github: '#',
                    demo: '#'
                  }
                })}
              </div>
            </div>

            <!-- Call to Action -->
            <div class="text-center mt-16">
              <a href="https://github.com/ucanalgan" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="inline-flex items-center px-8 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary rounded-xl font-medium transition-all duration-300 hover:scale-105">
                <i class="ri-github-line mr-2"></i>
                View All Projects on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
    
    this.initializeInteractions();
  }

  generateFeaturedProject(project) {
    return `
      <div class="bg-bg-secondary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="text-3xl">${project.image}</div>
          <div class="flex gap-2">
            <a href="${project.links.github}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="text-text-secondary hover:text-primary transition-colors">
              <i class="ri-github-line text-xl"></i>
            </a>
            <a href="${project.links.demo}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="text-text-secondary hover:text-primary transition-colors">
              <i class="ri-external-link-line text-xl"></i>
            </a>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-text-primary mb-3">${project.title}</h3>
        <p class="text-text-secondary mb-4 leading-relaxed">${project.description}</p>
        
        <div class="flex flex-wrap gap-2">
          ${project.tech.map(tech => 
            `<span class="px-2 py-1 bg-primary/10 text-primary rounded text-sm">${tech}</span>`
          ).join('')}
        </div>
      </div>
    `;
  }

  async loadGitHubRepositories() {
    try {
      // Use existing GitHub class if available
      if (window.GitHub) {
        const github = window.GitHub;
        this.repositories = await github.getRepositories();
        this.renderRepositories();
      } else {
        console.warn('GitHub class not available, showing fallback projects');
        this.renderFallbackRepositories();
      }
    } catch (error) {
      console.error('Failed to load GitHub repositories:', error);
      this.renderFallbackRepositories();
    }
  }

  renderRepositories() {
    const container = this.container.querySelector('#repositories-container');
    if (!container || !this.repositories.length) {
      this.renderFallbackRepositories();
      return;
    }

    // Sort repositories by stars and last updated
    const sortedRepos = this.repositories
      .filter(repo => !repo.fork) // Exclude forked repositories
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6); // Show top 6 repositories

    container.innerHTML = sortedRepos.map(repo => this.generateRepositoryCard(repo)).join('');
  }

  renderFallbackRepositories() {
    const container = this.container.querySelector('#repositories-container');
    if (!container) return;

    // Fallback repository data
    const fallbackRepos = [
      {
        name: 'portfolio-website',
        description: 'Modern responsive portfolio website built with Vite and Tailwind CSS',
        language: 'JavaScript',
        stargazers_count: 5,
        html_url: '#',
        homepage: '#'
      },
      {
        name: 'todo-app',
        description: 'Full-stack todo application with React frontend and Node.js backend',
        language: 'JavaScript',
        stargazers_count: 3,
        html_url: '#',
        homepage: '#'
      },
      {
        name: 'weather-dashboard',
        description: 'Weather dashboard with real-time data and beautiful visualizations',
        language: 'JavaScript',
        stargazers_count: 8,
        html_url: '#',
        homepage: '#'
      }
    ];

    container.innerHTML = fallbackRepos.map(repo => this.generateRepositoryCard(repo)).join('');
  }

  generateRepositoryCard(repo) {
    const languageColors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'Python': '#3572A5',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95'
    };

    return `
      <div class="bg-bg-secondary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center">
            <i class="ri-folder-line text-primary text-xl mr-2"></i>
            <h3 class="text-lg font-semibold text-text-primary">${repo.name}</h3>
          </div>
          <div class="flex gap-2">
            <a href="${repo.html_url}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="text-text-secondary hover:text-primary transition-colors">
              <i class="ri-github-line"></i>
            </a>
            ${repo.homepage ? `
              <a href="${repo.homepage}" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="text-text-secondary hover:text-primary transition-colors">
                <i class="ri-external-link-line"></i>
              </a>
            ` : ''}
          </div>
        </div>
        
        <p class="text-text-secondary mb-4 text-sm leading-relaxed min-h-[2.5rem]">
          ${repo.description || 'No description available'}
        </p>
        
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-4">
            ${repo.language ? `
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" 
                     style="background-color: ${languageColors[repo.language] || '#858585'}"></div>
                <span class="text-text-secondary">${repo.language}</span>
              </div>
            ` : ''}
            
            <div class="flex items-center text-text-secondary">
              <i class="ri-star-line mr-1"></i>
              <span>${repo.stargazers_count || 0}</span>
            </div>
          </div>
          
          <div class="text-text-secondary text-xs">
            Updated ${this.getTimeAgo(repo.updated_at)}
          </div>
        </div>
      </div>
    `;
  }

  getTimeAgo(dateString) {
    if (!dateString) return 'recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }

  initializeInteractions() {
    // Add scroll animations if AOS is available
    if (window.AOS) {
      window.AOS.refresh();
    }

    // Add intersection observer for repository cards animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe repository cards when they're added
    setTimeout(() => {
      const repoCards = this.container.querySelectorAll('#repositories-container > div');
      repoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      });
    }, 100);
  }
}

export default ProjectsSection; 