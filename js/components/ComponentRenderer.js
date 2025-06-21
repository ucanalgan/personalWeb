// Component: ComponentRenderer
// Açıklama: HTML template'leri kullanarak component'leri render eder ve DOM'a ekler
// Kullanım: Tüm component rendering işlemleri için merkezi sistem

export class ComponentRenderer {
  constructor() {
    this.templates = new Map();
    this.cache = new Map();
    this.loadTemplates();
  }

  /**
   * Tüm template'leri yükle ve cache'le
   */
  async loadTemplates() {
    try {
      // Common component template'lerini yükle
      await this.loadCommonTemplates();
      console.log('✅ Component templates loaded successfully');
    } catch (error) {
      console.error('❌ Error loading component templates:', error);
    }
  }

  /**
   * Ortak component template'lerini yükle
   */
  async loadCommonTemplates() {
    const commonTemplates = [
      'components/common/Button.html',
      'components/common/Card.html',
      'components/common/ScrollToTop.html',
      'components/common/ThemeToggle.html'
    ];

    for (const templatePath of commonTemplates) {
      try {
        const response = await fetch(templatePath);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const templates = doc.querySelectorAll('template');
        
        templates.forEach(template => {
          this.templates.set(template.id, template.content.cloneNode(true));
        });
      } catch (error) {
        console.warn(`⚠️ Could not load template: ${templatePath}`, error);
      }
    }
  }

  /**
   * Button component oluştur
   */
  createButton({ 
    type = 'primary', 
    text = 'Button', 
    icon = null, 
    onClick = null,
    href = null,
    loading = false,
    disabled = false,
    className = '',
    attributes = {}
  }) {
    let templateId = 'btn-primary-template';
    
    if (loading) {
      templateId = 'btn-loading-template';
    } else if (href) {
      templateId = 'btn-link-template';
    } else if (type === 'secondary') {
      templateId = 'btn-secondary-template';
    } else if (type === 'icon') {
      templateId = 'btn-icon-template';
    } else if (type === 'fab') {
      templateId = 'btn-fab-template';
    }

    const template = this.templates.get(templateId);
    if (!template) {
      console.error(`Template not found: ${templateId}`);
      return null;
    }

    const element = template.cloneNode(true);
    const button = element.querySelector('button, a');
    
    if (!button) return null;

    // Text ve icon ayarla
    const textElement = button.querySelector('[data-text]');
    const iconElement = button.querySelector('[data-icon]');
    
    if (textElement) textElement.textContent = text;
    if (iconElement && icon) {
      iconElement.className = `${icon} ${iconElement.className}`;
    } else if (iconElement && !icon) {
      iconElement.remove();
    }

    // Href ayarla (link button için)
    if (href && button.tagName === 'A') {
      button.href = href;
    }

    // Disabled state
    if (disabled) {
      button.disabled = true;
      button.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Additional class names
    if (className) {
      button.classList.add(...className.split(' '));
    }

    // Additional attributes
    Object.entries(attributes).forEach(([key, value]) => {
      button.setAttribute(key, value);
    });

    // Click handler
    if (onClick && typeof onClick === 'function') {
      button.addEventListener('click', onClick);
    }

    return button;
  }

  /**
   * Project card oluştur
   */
  createProjectCard({
    name,
    description,
    language,
    topics = [],
    stars = 0,
    forks = 0,
    updated,
    url,
    languageIcon = 'ri-code-line'
  }) {
    const template = this.templates.get('project-card-template');
    if (!template) return null;

    const element = template.cloneNode(true);
    const card = element.querySelector('.project-card');

    // Project bilgilerini doldur
    const nameElement = card.querySelector('[data-project-name]');
    const descElement = card.querySelector('[data-project-description]');
    const langElement = card.querySelector('[data-project-language]');
    const topicsElement = card.querySelector('[data-project-topics]');
    const starsElement = card.querySelector('[data-project-stars]');
    const forksElement = card.querySelector('[data-project-forks]');
    const updatedElement = card.querySelector('[data-project-updated]');
    const linkElement = card.querySelector('[data-project-link]');
    const iconElement = card.querySelector('[data-language-icon]');

    if (nameElement) nameElement.textContent = name;
    if (descElement) descElement.textContent = description;
    if (langElement) langElement.textContent = language;
    if (starsElement) starsElement.textContent = stars;
    if (forksElement) forksElement.textContent = forks;
    if (updatedElement) updatedElement.textContent = updated;
    if (linkElement) linkElement.href = url;
    if (iconElement) iconElement.className = `${languageIcon} text-primary text-xl`;

    // Topics ekle
    if (topicsElement && topics.length > 0) {
      topicsElement.innerHTML = '';
      topics.forEach(topic => {
        const topicSpan = document.createElement('span');
        topicSpan.className = 'px-2 py-1 bg-primary/10 border border-primary/20 text-primary text-xs rounded-md';
        topicSpan.textContent = topic;
        topicsElement.appendChild(topicSpan);
      });
    }

    return card;
  }

  /**
   * Activity card oluştur
   */
  createActivityCard({
    type,
    repo,
    time,
    description = '',
    icon = 'ri-git-commit-line'
  }) {
    const template = this.templates.get('activity-card-template');
    if (!template) return null;

    const element = template.cloneNode(true);
    const card = element.querySelector('.activity-card');

    const typeElement = card.querySelector('[data-activity-type]');
    const repoElement = card.querySelector('[data-activity-repo]');
    const timeElement = card.querySelector('[data-activity-time]');
    const descElement = card.querySelector('[data-activity-description]');
    const iconElement = card.querySelector('[data-activity-icon]');

    if (typeElement) typeElement.textContent = type;
    if (repoElement) repoElement.textContent = repo;
    if (timeElement) timeElement.textContent = time;
    if (descElement) descElement.textContent = description;
    if (iconElement) iconElement.className = `${icon} text-primary text-sm`;

    return card;
  }

  /**
   * Stats card oluştur
   */
  createStatsCard({
    value,
    label,
    icon = 'ri-bar-chart-line'
  }) {
    const template = this.templates.get('stats-card-template');
    if (!template) return null;

    const element = template.cloneNode(true);
    const card = element.querySelector('.stats-card');

    const valueElement = card.querySelector('[data-stats-value]');
    const labelElement = card.querySelector('[data-stats-label]');
    const iconElement = card.querySelector('[data-stats-icon]');

    if (valueElement) valueElement.textContent = value;
    if (labelElement) labelElement.textContent = label;
    if (iconElement) iconElement.className = `${icon} text-primary text-2xl`;

    return card;
  }

  /**
   * Skill card oluştur
   */
  createSkillCard({
    name,
    category,
    percentage,
    icon = 'ri-code-line'
  }) {
    const template = this.templates.get('skill-card-template');
    if (!template) return null;

    const element = template.cloneNode(true);
    const card = element.querySelector('.skill-card');

    const nameElement = card.querySelector('[data-skill-name]');
    const categoryElement = card.querySelector('[data-skill-category]');
    const percentageElement = card.querySelector('[data-skill-percentage]');
    const iconElement = card.querySelector('[data-skill-icon]');
    const progressElement = card.querySelector('[data-skill-progress]');

    if (nameElement) nameElement.textContent = name;
    if (categoryElement) categoryElement.textContent = category;
    if (percentageElement) percentageElement.textContent = `${percentage}%`;
    if (iconElement) iconElement.className = `${icon} text-primary`;
    
    if (progressElement) {
      // Progress bar animasyonu için data attribute
      progressElement.style.setProperty('--skill-width', `${percentage}%`);
      
      // Intersection Observer ile görünür olduğunda animate et
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              progressElement.style.width = `${percentage}%`;
            }, 100);
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(card);
    }

    return card;
  }

  /**
   * Social link card oluştur
   */
  createSocialCard({
    platform,
    username,
    url,
    icon
  }) {
    const template = this.templates.get('social-card-template');
    if (!template) return null;

    const element = template.cloneNode(true);
    const card = element.querySelector('.social-card');

    const nameElement = card.querySelector('[data-social-name]');
    const usernameElement = card.querySelector('[data-social-username]');
    const iconElement = card.querySelector('[data-social-icon]');

    if (nameElement) nameElement.textContent = platform;
    if (usernameElement) usernameElement.textContent = username;
    if (iconElement) iconElement.className = `${icon} text-primary`;
    
    card.href = url;
    card.setAttribute('data-social-link', url);

    return card;
  }

  /**
   * Contact info card oluştur
   */
  createContactInfoCard({
    type,
    value,
    icon,
    href = null
  }) {
    const template = this.templates.get('contact-info-card-template');
    if (!template) return null;

    const element = template.cloneNode(true);
    const card = element.querySelector('.contact-info-card');

    const typeElement = card.querySelector('[data-contact-type]');
    const valueElement = card.querySelector('[data-contact-value]');
    const iconElement = card.querySelector('[data-contact-icon]');

    if (typeElement) typeElement.textContent = type;
    if (valueElement) {
      valueElement.textContent = value;
      if (href) valueElement.href = href;
    }
    if (iconElement) iconElement.className = `${icon} text-primary text-xl`;

    return card;
  }

  /**
   * Scroll to top butonu oluştur
   */
  createScrollToTop(type = 'default') {
    let templateId = 'scroll-to-top-template';
    
    if (type === 'minimal') {
      templateId = 'scroll-to-top-minimal-template';
    } else if (type === 'progress') {
      templateId = 'scroll-to-top-progress-template';
    }

    const template = this.templates.get(templateId);
    if (!template) return null;

    const element = template.cloneNode(true);
    const button = element.querySelector('button');

    // Scroll event listener ekle
    if (button) {
      this.initScrollToTop(button, type);
    }

    return button;
  }

  /**
   * Theme toggle butonu oluştur
   */
  createThemeToggle(type = 'default') {
    let templateId = 'theme-toggle-template';
    
    if (type === 'switch') {
      templateId = 'theme-toggle-switch-template';
    } else if (type === 'minimal') {
      templateId = 'theme-toggle-minimal-template';
    } else if (type === 'text') {
      templateId = 'theme-toggle-text-template';
    } else if (type === 'floating') {
      templateId = 'theme-toggle-floating-template';
    }

    const template = this.templates.get(templateId);
    if (!template) return null;

    const element = template.cloneNode(true);
    const button = element.querySelector('button');

    // Theme toggle functionality ekle
    if (button && window.themeManager) {
      button.addEventListener('click', () => {
        window.themeManager.toggle();
      });
    }

    return button;
  }

  /**
   * Scroll to top functionality
   */
  initScrollToTop(button, type) {
    let scrollTimeout;

    const updateScrollToTop = () => {
      const scrolled = window.pageYOffset;
      const threshold = 300;

      if (scrolled > threshold) {
        button.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        button.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        button.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        button.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      }

      // Progress circle update (sadece progress type için)
      if (type === 'progress') {
        const progressCircle = button.querySelector('.progress-circle');
        if (progressCircle) {
          const scrollPercent = scrolled / (document.documentElement.scrollHeight - window.innerHeight);
          const dashArray = 163.36; // 2 * π * r (r=26)
          const dashOffset = dashArray - (dashArray * scrollPercent);
          progressCircle.style.strokeDashoffset = dashOffset;
        }
      }
    };

    // Scroll event listener
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateScrollToTop, 10);
    });

    // Click event listener
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Initial check
    updateScrollToTop();
  }

  /**
   * Component'i container'a render et
   */
  renderToContainer(component, container) {
    if (!component || !container) return false;

    try {
      container.appendChild(component);
      return true;
    } catch (error) {
      console.error('Error rendering component:', error);
      return false;
    }
  }

  /**
   * Multiple component'leri render et
   */
  renderMultiple(components, container, clearFirst = false) {
    if (!container) return false;

    try {
      if (clearFirst) {
        container.innerHTML = '';
      }

      components.forEach(component => {
        if (component) {
          container.appendChild(component);
        }
      });

      return true;
    } catch (error) {
      console.error('Error rendering multiple components:', error);
      return false;
    }
  }

  /**
   * Template cache'ini temizle
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Component sayısını döndür
   */
  getStats() {
    return {
      templatesLoaded: this.templates.size,
      cacheSize: this.cache.size
    };
  }
}

// Global instance oluştur
export const componentRenderer = new ComponentRenderer(); 