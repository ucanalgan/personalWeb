/**
 * Footer Section Component
 * Modular component for the footer section
 */

class FooterSection {
  constructor() {
    this.container = document.getElementById('footer-container');
    this.initialized = false;
  }

  async render() {
    if (!this.container) {
      console.error('Footer container not found');
      return;
    }

    try {
      // Load HTML content
      const response = await fetch('./components/sections/FooterSection.html');
      if (!response.ok) throw new Error('Failed to fetch footer content');
      
      const htmlContent = await response.text();
      this.container.innerHTML = htmlContent;
      
      this.initializeInteractions();
      this.initialized = true;
      
      console.log('✓ Footer section loaded successfully');
    } catch (error) {
      console.error('Failed to load footer section:', error);
      this.renderFallback();
    }
  }

  renderFallback() {
    // Immediate fallback content
    this.container.innerHTML = `
      <footer class="bg-bg-secondary border-t border-border-color">
        <div class="container mx-auto px-6 py-12">
          <div class="max-w-6xl mx-auto">
            <!-- Main Footer Content -->
            <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-8">
              <!-- Brand & Description -->
              <div class="lg:col-span-2">
                <h3 class="text-2xl font-bold text-text-primary mb-4">Umutcan Algan</h3>
                <p class="text-text-secondary mb-6 max-w-md">
                  Full-stack developer passionate about creating beautiful, functional, and 
                  user-centered digital experiences. Always learning, always building.
                </p>
                
                <!-- Social Links -->
                <div class="flex space-x-4">
                  <a href="https://github.com/ucanalgan" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="w-10 h-10 bg-bg-primary border border-border-color rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-300"
                     aria-label="GitHub Profile">
                    <i class="ri-github-line text-lg"></i>
                  </a>
                  
                  <a href="https://linkedin.com/in/umutcan-algan/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="w-10 h-10 bg-bg-primary border border-border-color rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-300"
                     aria-label="LinkedIn Profile">
                    <i class="ri-linkedin-line text-lg"></i>
                  </a>
                  
                  <a href="mailto:umutcanalgan@hotmail.com"
                     class="w-10 h-10 bg-bg-primary border border-border-color rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-300"
                     aria-label="Send Email">
                    <i class="ri-mail-line text-lg"></i>
                  </a>
                  
                  <a href="https://twitter.com/ucanalgan" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="w-10 h-10 bg-bg-primary border border-border-color rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-300"
                     aria-label="Twitter Profile">
                    <i class="ri-twitter-line text-lg"></i>
                  </a>
                </div>
              </div>
              
              <!-- Quick Links -->
              <div>
                <h4 class="text-lg font-semibold text-text-primary mb-4">Quick Links</h4>
                <ul class="space-y-2">
                  <li>
                    <a href="#about" class="text-text-secondary hover:text-primary transition-colors">
                      About Me
                    </a>
                  </li>
                  <li>
                    <a href="#skills" class="text-text-secondary hover:text-primary transition-colors">
                      Skills
                    </a>
                  </li>
                  <li>
                    <a href="#projects" class="text-text-secondary hover:text-primary transition-colors">
                      Projects
                    </a>
                  </li>
                  <li>
                    <a href="#contact" class="text-text-secondary hover:text-primary transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              
              <!-- Contact Info -->
              <div>
                <h4 class="text-lg font-semibold text-text-primary mb-4">Get In Touch</h4>
                <ul class="space-y-2 text-text-secondary">
                  <li class="flex items-center">
                    <i class="ri-mail-line mr-2 text-primary"></i>
                    <a href="mailto:umutcanalgan@hotmail.com" class="hover:text-primary transition-colors">
                      umutcanalgan@hotmail.com
                    </a>
                  </li>
                  <li class="flex items-center">
                    <i class="ri-map-pin-line mr-2 text-primary"></i>
                    <span>Istanbul, Turkey</span>
                  </li>
                  <li class="flex items-center">
                    <i class="ri-time-line mr-2 text-primary"></i>
                    <span>UTC+3 Timezone</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Bottom Bar -->
            <div class="border-t border-border-color pt-8">
              <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="text-text-secondary text-sm mb-4 md:mb-0">
                  <p>&copy; ${new Date().getFullYear()} Umutcan Algan. All rights reserved.</p>
                </div>
                
                <div class="flex items-center space-x-6 text-sm">
                  <span class="text-text-secondary">
                    Built with <span class="text-red-500">❤</span> using 
                    <span class="text-primary">Vite</span> & 
                    <span class="text-primary">Tailwind CSS</span>
                  </span>
                  
                  <!-- Back to Top Button -->
                  <button id="back-to-top" 
                          class="flex items-center text-text-secondary hover:text-primary transition-colors"
                          aria-label="Back to top">
                    <span class="mr-1">Back to top</span>
                    <i class="ri-arrow-up-line"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Site Stats -->
            <div class="mt-8 pt-8 border-t border-border-color">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div class="bg-bg-primary/50 border border-border-color rounded-lg p-4">
                  <div class="text-lg font-bold text-primary" id="visitor-count">---</div>
                  <div class="text-xs text-text-secondary">Visitors</div>
                </div>
                <div class="bg-bg-primary/50 border border-border-color rounded-lg p-4">
                  <div class="text-lg font-bold text-primary">${new Date().getFullYear()}</div>
                  <div class="text-xs text-text-secondary">Year Built</div>
                </div>
                <div class="bg-bg-primary/50 border border-border-color rounded-lg p-4">
                  <div class="text-lg font-bold text-primary">v2.0</div>
                  <div class="text-xs text-text-secondary">Version</div>
                </div>
                <div class="bg-bg-primary/50 border border-border-color rounded-lg p-4">
                  <div class="text-lg font-bold text-primary" id="uptime">100%</div>
                  <div class="text-xs text-text-secondary">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
    
    this.initializeInteractions();
  }

  initializeInteractions() {
    // Back to top functionality
    const backToTopButton = this.container.querySelector('#back-to-top');
    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = this.container.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Initialize visitor counter (simulate)
    this.initializeVisitorCounter();

    // Add hover effects to social links
    const socialLinks = this.container.querySelectorAll('a[aria-label]');
    socialLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px)';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
      });
    });
  }

  initializeVisitorCounter() {
    // Simulate visitor counter
    const visitorElement = this.container.querySelector('#visitor-count');
    if (visitorElement) {
      // Get from localStorage or simulate
      let count = localStorage.getItem('visitor-count');
      if (!count) {
        count = Math.floor(Math.random() * 1000) + 500; // Random number between 500-1500
        localStorage.setItem('visitor-count', count);
      }
      
      // Animate counter
      this.animateCounter(visitorElement, 0, parseInt(count), 2000);
    }
  }

  animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (range * easeOut));
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Public method to update stats
  updateStats(stats) {
    if (!this.initialized) return;
    
    if (stats.visitors) {
      const visitorElement = this.container.querySelector('#visitor-count');
      if (visitorElement) {
        visitorElement.textContent = stats.visitors.toLocaleString();
      }
    }
    
    if (stats.uptime) {
      const uptimeElement = this.container.querySelector('#uptime');
      if (uptimeElement) {
        uptimeElement.textContent = `${stats.uptime}%`;
      }
    }
  }
}

export default FooterSection; 