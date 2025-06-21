/**
 * Hero Section Component
 * Modular component for the hero section with immediate rendering
 */

class HeroSection {
  constructor() {
    this.container = document.getElementById('hero-container');
    this.initialized = false;
  }

  async render() {
    if (!this.container) {
      console.error('Hero container not found');
      return;
    }

    try {
      // Load HTML content
      const response = await fetch('./components/sections/HeroSection.html');
      if (!response.ok) throw new Error('Failed to fetch hero content');
      
      const htmlContent = await response.text();
      this.container.innerHTML = htmlContent;
      
      this.initializeInteractions();
      this.initialized = true;
      
      console.log('✓ Hero section loaded successfully');
    } catch (error) {
      console.error('Failed to load hero section:', error);
      this.renderFallback();
    }
  }

  renderFallback() {
    // Immediate fallback content
    this.container.innerHTML = `
      <section id="hero" class="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-primary pt-20">
        <div class="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary opacity-50"></div>
        
        <div class="container mx-auto px-6 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <div class="hero-content">
              <span class="inline-block text-primary font-mono text-lg mb-2">Hi, my name is</span>
              
              <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-4">
                Umutcan Algan
              </h1>
              
              <h2 class="text-2xl md:text-4xl lg:text-5xl font-bold text-text-secondary mb-6">
                I build <span class="text-primary">Backend Developer</span>
              </h2>
              
              <p class="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
                I'm a full-stack developer specializing in building exceptional digital experiences. 
                Currently focused on building accessible, human-centered products with modern technologies.
              </p>
              
              <div class="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a href="#github" class="inline-flex items-center px-8 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary rounded-xl font-medium transition-all duration-300">
                  <i class="ri-github-line mr-2"></i>
                  View My Work
                </a>
                <a href="#contact" class="inline-flex items-center px-8 py-4 bg-transparent hover:bg-bg-secondary border border-border-color hover:border-primary/30 text-text-primary hover:text-primary rounded-xl font-medium transition-all duration-300">
                  <i class="ri-mail-line mr-2"></i>
                  Get In Touch
                </a>
              </div>
              
              <div class="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                  <div class="text-2xl font-bold text-primary">15+</div>
                  <div class="text-sm text-text-secondary">Projects</div>
                </div>
                <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                  <div class="text-2xl font-bold text-primary">50+</div>
                  <div class="text-sm text-text-secondary">Followers</div>
                </div>
                <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                  <div class="text-2xl font-bold text-primary">200+</div>
                  <div class="text-sm text-text-secondary">Commits</div>
                </div>
                <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                  <div class="text-2xl font-bold text-primary">Active</div>
                  <div class="text-sm text-text-secondary">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    
    this.initializeInteractions();
  }

  initializeInteractions() {
    // Smooth scrolling for hero buttons
    const heroButtons = this.container.querySelectorAll('a[href^="#"]');
    heroButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(button.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Add scroll animations if AOS is available
    if (window.AOS) {
      window.AOS.refresh();
    }
  }

  // Public method to update stats dynamically
  updateStats(stats) {
    if (!this.initialized) return;
    
    const statsElements = this.container.querySelectorAll('.hero-stats > div');
    if (stats.projects && statsElements[0]) {
      statsElements[0].querySelector('.text-2xl').textContent = `${stats.projects}+`;
    }
    if (stats.followers && statsElements[1]) {
      statsElements[1].querySelector('.text-2xl').textContent = `${stats.followers}+`;
    }
    if (stats.commits && statsElements[2]) {
      statsElements[2].querySelector('.text-2xl').textContent = `${stats.commits}+`;
    }
  }
}

export default HeroSection; 