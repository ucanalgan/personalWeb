/**
 * Advanced Scroll Spy System
 * Tracks active sections and updates navigation accordingly
 */

export class ScrollSpy {
  constructor(options = {}) {
    this.options = {
      sections: ['hero', 'about', 'skills', 'projects', 'contact'],
      navSelector: '.nav-link',
      offset: 100,
      smoothScroll: true,
      activeClass: 'active',
      threshold: 0.3,
      ...options
    };
    
    this.sections = [];
    this.navLinks = [];
    this.currentSection = null;
    this.isScrolling = false;
    this.observer = null;
    
    this.init();
  }

  init() {
    this.findSections();
    this.findNavLinks();
    this.setupIntersectionObserver();
    this.bindEvents();
  }

  findSections() {
    this.sections = this.options.sections.map(id => {
      const element = document.getElementById(id);
      return element ? { id, element } : null;
    }).filter(Boolean);
  }

  findNavLinks() {
    this.navLinks = Array.from(document.querySelectorAll(this.options.navSelector))
      .map(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          const targetSection = this.sections.find(s => s.id === targetId);
          if (targetSection) {
            return { element: link, targetId, targetSection };
          }
        }
        return null;
      }).filter(Boolean);
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: `-${this.options.offset}px 0px -60% 0px`,
      threshold: this.options.threshold
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      observerOptions
    );

    this.sections.forEach(section => {
      this.observer.observe(section.element);
    });
  }

  handleIntersection(entries) {
    let activeSection = null;
    let maxRatio = 0;

    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        activeSection = this.sections.find(s => s.element === entry.target);
      }
    });

    if (activeSection && activeSection !== this.currentSection) {
      this.setActiveSection(activeSection.id);
    }
  }

  setActiveSection(sectionId) {
    // Remove active class from all nav links
    this.navLinks.forEach(link => {
      link.element.classList.remove(this.options.activeClass);
    });

    // Add active class to current section's nav link
    const activeLink = this.navLinks.find(link => link.targetId === sectionId);
    if (activeLink) {
      activeLink.element.classList.add(this.options.activeClass);
    }

    // Update current section
    this.currentSection = this.sections.find(s => s.id === sectionId);

    // Dispatch event
    window.dispatchEvent(new CustomEvent('sectionChanged', {
      detail: { sectionId, section: this.currentSection }
    }));
  }

  bindEvents() {
    // Smooth scroll for nav links
    if (this.options.smoothScroll) {
      this.navLinks.forEach(link => {
        link.element.addEventListener('click', this.handleNavClick.bind(this));
      });
    }

    // Handle hash changes
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
    
    // Handle initial hash
    if (window.location.hash) {
      this.handleHashChange();
    }
  }

  handleNavClick(event) {
    event.preventDefault();
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      this.scrollToSection(targetId);
      
      // Update URL without triggering scroll
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    }
  }

  handleHashChange() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const targetSection = this.sections.find(s => s.id === targetId);
      if (targetSection) {
        this.scrollToSection(targetId, false); // Don't update URL again
      }
    }
  }

  scrollToSection(sectionId, updateUrl = true) {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) return;

    const targetY = section.element.offsetTop - this.options.offset;
    
    if (this.options.smoothScroll) {
      this.smoothScrollTo(targetY);
    } else {
      window.scrollTo(0, targetY);
    }

    if (updateUrl && history.pushState) {
      history.pushState(null, null, `#${sectionId}`);
    }
  }

  smoothScrollTo(targetY) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
    let startTime = null;

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const currentY = startY + (distance * ease);
      window.scrollTo(0, currentY);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  getCurrentSection() {
    return this.currentSection;
  }

  addSection(id) {
    const element = document.getElementById(id);
    if (element && !this.sections.find(s => s.id === id)) {
      const section = { id, element };
      this.sections.push(section);
      this.observer.observe(element);
      
      // Find corresponding nav link
      const navLink = Array.from(document.querySelectorAll(this.options.navSelector))
        .find(link => {
          const href = link.getAttribute('href');
          return href === `#${id}`;
        });
      
      if (navLink) {
        this.navLinks.push({ element: navLink, targetId: id, targetSection: section });
        if (this.options.smoothScroll) {
          navLink.addEventListener('click', this.handleNavClick.bind(this));
        }
      }
    }
  }

  removeSection(id) {
    const sectionIndex = this.sections.findIndex(s => s.id === id);
    if (sectionIndex > -1) {
      const section = this.sections[sectionIndex];
      this.observer.unobserve(section.element);
      this.sections.splice(sectionIndex, 1);
      
      const navLinkIndex = this.navLinks.findIndex(l => l.targetId === id);
      if (navLinkIndex > -1) {
        this.navLinks.splice(navLinkIndex, 1);
      }
    }
  }

  refresh() {
    // Re-find sections and nav links
    this.findSections();
    this.findNavLinks();
    
    // Re-setup observer
    if (this.observer) {
      this.observer.disconnect();
    }
    this.setupIntersectionObserver();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Remove event listeners
    this.navLinks.forEach(link => {
      link.element.removeEventListener('click', this.handleNavClick);
    });
    
    window.removeEventListener('hashchange', this.handleHashChange);
  }
}

// Progress indicator
export class ScrollProgress {
  constructor(options = {}) {
    this.options = {
      selector: '.scroll-progress',
      color: 'var(--primary)',
      height: '3px',
      position: 'fixed',
      top: '0',
      zIndex: '9999',
      ...options
    };
    
    this.progressBar = null;
    this.init();
  }

  init() {
    this.createProgressBar();
    this.bindEvents();
  }

  createProgressBar() {
    // Check if progress bar already exists
    this.progressBar = document.querySelector(this.options.selector);
    
    if (!this.progressBar) {
      this.progressBar = document.createElement('div');
      this.progressBar.className = this.options.selector.replace('.', '');
      document.body.appendChild(this.progressBar);
    }

    // Apply styles
    Object.assign(this.progressBar.style, {
      position: this.options.position,
      top: this.options.top,
      left: '0',
      width: '0%',
      height: this.options.height,
      backgroundColor: this.options.color,
      zIndex: this.options.zIndex,
      transition: 'width 0.1s ease',
      transformOrigin: 'left center'
    });
  }

  bindEvents() {
    window.addEventListener('scroll', this.updateProgress.bind(this), { passive: true });
    window.addEventListener('resize', this.updateProgress.bind(this), { passive: true });
  }

  updateProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  }

  destroy() {
    if (this.progressBar) {
      this.progressBar.remove();
    }
    window.removeEventListener('scroll', this.updateProgress);
    window.removeEventListener('resize', this.updateProgress);
  }
}

// Initialize scroll spy and progress
export const scrollSpy = new ScrollSpy();
export const scrollProgress = new ScrollProgress(); 