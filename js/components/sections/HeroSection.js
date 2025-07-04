/**
 * Hero Section Component
 * ES6 functional component for the hero section
 */

export default function heroSection() {
  return `
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
              I build <span id="typing-text" class="text-primary"></span>
            </h2>
            
            <p class="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              I'm a full-stack developer specializing in building exceptional digital experiences. 
              Currently focused on building accessible, human-centered products with modern technologies.
            </p>
            
            <div class="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a href="#projects" class="btn-base btn-primary">
                <i class="ri-folder-line mr-2"></i>
                View My Work
              </a>
              <a href="#contact" class="btn-base btn-ghost">
                <i class="ri-mail-line mr-2"></i>
                Get In Touch
              </a>
            </div>
            
            <div class="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                <div class="text-2xl font-bold text-primary" id="projects-count">15+</div>
                <div class="text-sm text-text-secondary">Projects</div>
              </div>
              <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                <div class="text-2xl font-bold text-primary" id="followers-count">50+</div>
                <div class="text-sm text-text-secondary">Followers</div>
              </div>
              <div class="text-center p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                <div class="text-2xl font-bold text-primary" id="commits-count">200+</div>
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
}

// Initialize hero interactions
export function initHeroSection() {
  const heroButtons = document.querySelectorAll('#hero a[href^="#"]');
  heroButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Update hero stats dynamically
export function updateHeroStats(stats) {
  if (stats.projects) {
    const projectsEl = document.getElementById('projects-count');
    if (projectsEl) projectsEl.textContent = `${stats.projects}+`;
  }
  
  if (stats.followers) {
    const followersEl = document.getElementById('followers-count');
    if (followersEl) followersEl.textContent = `${stats.followers}+`;
  }
  
  if (stats.commits) {
    const commitsEl = document.getElementById('commits-count');
    if (commitsEl) commitsEl.textContent = `${stats.commits}+`;
  }
} 