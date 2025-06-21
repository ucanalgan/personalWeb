/**
 * About Section Component
 * Modular component for the about section with GitHub integration
 */

class AboutSection {
  constructor() {
    this.container = document.getElementById('about-container');
    this.initialized = false;
  }

  async render() {
    if (!this.container) {
      console.error('About container not found');
      return;
    }

    try {
      // Load HTML content
      const response = await fetch('./components/sections/AboutSection.html');
      if (!response.ok) throw new Error('Failed to fetch about content');
      
      const htmlContent = await response.text();
      this.container.innerHTML = htmlContent;
      
      this.initializeInteractions();
      this.initialized = true;
      
      console.log('✓ About section loaded successfully');
      
      // Load GitHub data if available
      this.loadGitHubData();
    } catch (error) {
      console.error('Failed to load about section:', error);
      this.renderFallback();
    }
  }

  renderFallback() {
    // Immediate fallback content
    this.container.innerHTML = `
      <section id="about" class="py-20 bg-bg-primary">
        <div class="container mx-auto px-6">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
              <span class="text-primary font-mono text-lg mb-2 block">Get to know me</span>
              <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">About Me</h2>
            </div>
            
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              <!-- About Content -->
              <div>
                <div class="prose prose-lg max-w-none">
                  <p class="text-text-secondary text-lg leading-relaxed mb-6">
                    Hello! I'm Umutcan, a passionate full-stack developer based in Istanbul, Turkey. 
                    I enjoy creating things that live on the internet, whether that be websites, 
                    applications, or anything in between.
                  </p>
                  
                  <p class="text-text-secondary text-lg leading-relaxed mb-6">
                    My interest in web development started back in 2020 when I decided to try 
                    editing custom Tumblr themes — turns out hacking together a custom reblog 
                    button taught me a lot about HTML & CSS!
                  </p>
                  
                  <p class="text-text-secondary text-lg leading-relaxed mb-8">
                    Fast-forward to today, and I've had the privilege of working on various 
                    projects ranging from e-commerce platforms to data visualization tools. 
                    My main focus these days is building accessible, inclusive products and 
                    digital experiences for a variety of clients.
                  </p>
                </div>

                <!-- GitHub Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                    <div class="text-2xl font-bold text-primary" id="github-repos">12</div>
                    <div class="text-sm text-text-secondary">Repositories</div>
                  </div>
                  <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                    <div class="text-2xl font-bold text-primary" id="github-followers">50+</div>
                    <div class="text-sm text-text-secondary">Followers</div>
                  </div>
                  <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                    <div class="text-2xl font-bold text-primary" id="github-stars">200+</div>
                    <div class="text-sm text-text-secondary">Stars</div>
                  </div>
                  <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                    <div class="text-2xl font-bold text-primary" id="github-forks">50+</div>
                    <div class="text-sm text-text-secondary">Forks</div>
                  </div>
                </div>

                <!-- Skills quick list -->
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">JavaScript</span>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">React</span>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Node.js</span>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Python</span>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">MongoDB</span>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Git</span>
                </div>
              </div>

              <!-- Profile Image and Info -->
              <div class="text-center lg:text-left">
                <div class="relative inline-block mb-6">
                  <div class="w-64 h-64 mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-bg-secondary border border-border-color">
                    <img id="profile-image" 
                         src="https://avatars.githubusercontent.com/ucanalgan" 
                         alt="Umutcan Algan"
                         class="w-full h-full object-cover"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMUExQTFBIi8+CjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEwNCIgcj0iNDAiIGZpbGw9IiM2MzYzNjMiLz4KPHBhdGggZD0iTTY0IDE5MkM2NCAxNjAgOTYgMTM2IDEyOCAxMzZDMTYwIDEzNiAxOTIgMTYwIDE5MiAxOTJWMjU2SDY0VjE5MloiIGZpbGw9IiM2MzYzNjMiLz4KPC9zdmc+'"
                         loading="lazy">
                  </div>
                  <div class="absolute -bottom-4 -right-4 bg-green-500 w-8 h-8 rounded-full border-4 border-bg-primary flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div class="bg-bg-secondary/50 border border-border-color rounded-xl p-6">
                  <h3 class="text-xl font-semibold text-text-primary mb-2">Quick Facts</h3>
                  <ul class="space-y-2 text-text-secondary">
                    <li>📍 Based in Istanbul, Turkey</li>
                    <li>🎓 Computer Science Background</li>
                    <li>💼 Open to Remote Work</li>
                    <li>🌱 Always Learning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    
    this.initializeInteractions();
  }

  async loadGitHubData() {
    try {
      // Use existing GitHub class if available
      if (window.GitHub) {
        const github = window.GitHub;
        const stats = await github.getGitHubStats();
        
        // Update stats in the UI
        this.updateGitHubStats(stats);
      }
    } catch (error) {
      console.warn('GitHub data loading failed:', error);
    }
  }

  updateGitHubStats(stats) {
    const elements = {
      repos: this.container.querySelector('#github-repos'),
      followers: this.container.querySelector('#github-followers'),
      stars: this.container.querySelector('#github-stars'),
      forks: this.container.querySelector('#github-forks')
    };

    if (elements.repos && stats.repos) {
      elements.repos.textContent = stats.repos;
    }
    if (elements.followers && stats.followers) {
      elements.followers.textContent = stats.followers;
    }
    if (elements.stars && stats.stars) {
      elements.stars.textContent = stats.stars;
    }
    if (elements.forks && stats.forks) {
      elements.forks.textContent = stats.forks;
    }
  }

  initializeInteractions() {
    // Add scroll animations if AOS is available
    if (window.AOS) {
      window.AOS.refresh();
    }

    // Preload GitHub avatar
    const profileImage = this.container.querySelector('#profile-image');
    if (profileImage) {
      profileImage.addEventListener('load', () => {
        profileImage.classList.add('fade-in');
      });
    }
  }
}

export default AboutSection; 