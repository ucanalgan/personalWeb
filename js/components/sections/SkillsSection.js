/**
 * Skills Section Component
 * Modular component for the skills section
 */

class SkillsSection {
  constructor() {
    this.container = document.getElementById('skills-container');
    this.initialized = false;
  }

  async render() {
    if (!this.container) {
      console.error('Skills container not found');
      return;
    }

    try {
      // Load HTML content
      const response = await fetch('./components/sections/SkillsSection.html');
      if (!response.ok) throw new Error('Failed to fetch skills content');
      
      const htmlContent = await response.text();
      this.container.innerHTML = htmlContent;
      
      this.initializeInteractions();
      this.initialized = true;
      
      console.log('✓ Skills section loaded successfully');
    } catch (error) {
      console.error('Failed to load skills section:', error);
      this.renderFallback();
    }
  }

  renderFallback() {
    // Immediate fallback content
    this.container.innerHTML = `
      <section id="skills" class="py-20 bg-bg-secondary">
        <div class="container mx-auto px-6">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
              <span class="text-primary font-mono text-lg mb-2 block">What I work with</span>
              <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">Skills & Technologies</h2>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <!-- Frontend -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-2xl mb-4">🎨</div>
                <h3 class="text-xl font-semibold text-text-primary mb-4">Frontend</h3>
                <ul class="space-y-2 text-text-secondary">
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> React & Next.js</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> JavaScript (ES6+)</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> HTML5 & CSS3</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Tailwind CSS</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Vue.js</li>
                </ul>
              </div>
              
              <!-- Backend -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-2xl mb-4">⚙️</div>
                <h3 class="text-xl font-semibold text-text-primary mb-4">Backend</h3>
                <ul class="space-y-2 text-text-secondary">
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Node.js & Express</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Python & Django</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> RESTful APIs</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Microservices</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> GraphQL</li>
                </ul>
              </div>
              
              <!-- Database -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-2xl mb-4">🗄️</div>
                <h3 class="text-xl font-semibold text-text-primary mb-4">Database</h3>
                <ul class="space-y-2 text-text-secondary">
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> MongoDB</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> PostgreSQL</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Redis</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Firebase</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> MySQL</li>
                </ul>
              </div>

              <!-- Tools & DevOps -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-2xl mb-4">🛠️</div>
                <h3 class="text-xl font-semibold text-text-primary mb-4">Tools & DevOps</h3>
                <ul class="space-y-2 text-text-secondary">
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Git & GitHub</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Docker</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> AWS / Heroku</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> CI/CD</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Linux</li>
                </ul>
              </div>

              <!-- Design & UI/UX -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-2xl mb-4">🎨</div>
                <h3 class="text-xl font-semibold text-text-primary mb-4">Design & UI/UX</h3>
                <ul class="space-y-2 text-text-secondary">
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Figma</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Adobe XD</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Responsive Design</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> User Experience</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Accessibility</li>
                </ul>
              </div>

              <!-- Learning & Others -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-2xl mb-4">📚</div>
                <h3 class="text-xl font-semibold text-text-primary mb-4">Currently Learning</h3>
                <ul class="space-y-2 text-text-secondary">
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> TypeScript</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Rust</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Machine Learning</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Web3</li>
                  <li class="flex items-center"><span class="text-primary mr-2">•</span> Kubernetes</li>
                </ul>
              </div>
            </div>

            <!-- Skills Progress Bars -->
            <div class="mt-16">
              <h3 class="text-2xl font-bold text-text-primary mb-8 text-center">Proficiency Levels</h3>
              <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                ${this.generateSkillBar('JavaScript', 90)}
                ${this.generateSkillBar('React', 85)}
                ${this.generateSkillBar('Node.js', 80)}
                ${this.generateSkillBar('Python', 75)}
                ${this.generateSkillBar('MongoDB', 85)}
                ${this.generateSkillBar('CSS/Tailwind', 90)}
                ${this.generateSkillBar('Git', 85)}
                ${this.generateSkillBar('UI/UX Design', 70)}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    
    this.initializeInteractions();
  }

  generateSkillBar(skill, percentage) {
    return `
      <div class="skill-item">
        <div class="flex justify-between mb-2">
          <span class="text-text-primary font-medium">${skill}</span>
          <span class="text-text-secondary text-sm">${percentage}%</span>
        </div>
        <div class="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out" 
               style="width: 0%" 
               data-width="${percentage}%"></div>
        </div>
      </div>
    `;
  }

  initializeInteractions() {
    // Animate skill bars when they come into view
    this.animateSkillBars();

    // Add hover effects to skill cards
    const skillCards = this.container.querySelectorAll('.bg-bg-primary\\/50');
    skillCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Add scroll animations if AOS is available
    if (window.AOS) {
      window.AOS.refresh();
    }
  }

  animateSkillBars() {
    const skillBars = this.container.querySelectorAll('[data-width]');
    
    // Use Intersection Observer to animate when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
          
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
      observer.observe(bar);
    });
  }
}

export default SkillsSection; 