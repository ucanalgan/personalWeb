// File: js/components/ComponentLoader.js
// Description: Component'leri dinamik olarak yükler ve DOM'a render eder
// Kullanım: Sayfa yüklendiğinde tüm component'leri otomatik olarak yerleştirir

export class ComponentLoader {
  constructor() {
    this.loadedComponents = new Map();
    this.componentQueue = [];
    this.isLoading = false;
  }

  /**
   * Component'leri sırayla yükle
   */
  async loadComponents() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      console.log('🔄 Loading components...');
      
      // Layout component'lerini önce yükle
      await this.loadLayoutComponents();
      
      // Section component'lerini yükle
      await this.loadSectionComponents();
      
      // Common component'leri yükle
      await this.loadCommonComponents();
      
      // Component'ler yüklendikten sonra event fire et
      document.dispatchEvent(new CustomEvent('componentsLoaded'));
      
      console.log('✅ All components loaded successfully');
    } catch (error) {
      console.error('❌ Error loading components:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Layout component'lerini yükle
   */
  async loadLayoutComponents() {
    const layoutComponents = [
      { file: 'components/layout/Header.html', target: '#header-placeholder' },
      { file: 'components/layout/Footer.html', target: '#footer-placeholder' }
    ];

    for (const component of layoutComponents) {
      await this.loadComponent(component.file, component.target);
    }
  }

  /**
   * Section component'lerini yükle
   */
  async loadSectionComponents() {
    const sectionComponents = [
      { file: 'components/sections/HeroSection.html', target: '#hero-placeholder' },
      { file: 'components/sections/AboutSection.html', target: '#about-placeholder' },
      { file: 'components/sections/SkillsSection.html', target: '#skills-placeholder' },
      { file: 'components/sections/GitHubSection.html', target: '#projects-placeholder' },
      { file: 'components/sections/ContactSection.html', target: '#contact-placeholder' }
    ];

    for (const component of sectionComponents) {
      await this.loadComponent(component.file, component.target);
    }
  }

  /**
   * Common component'leri yükle
   */
  async loadCommonComponents() {
    // Theme toggle butonunu header'a ekle
    await this.loadComponent('components/common/ThemeToggle.html', '#theme-toggle-placeholder');
    
    // Scroll to top butonunu sayfaya ekle
    await this.loadComponent('components/common/ScrollToTop.html', 'body');
    
    // Template'leri DOM'a ekle (render için)
    await this.loadTemplates();
  }

  /**
   * Tek bir component'i yükle
   */
  async loadComponent(filePath, targetSelector) {
    try {
      const target = document.querySelector(targetSelector);
      if (!target) {
        console.warn(`⚠️ Target not found for ${filePath}: ${targetSelector}`);
        return;
      }

      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      
      // HTML'i parse et ve DOM'a ekle
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const content = doc.body.firstElementChild;

      if (content) {
        // Eğer target body ise append et, değilse replace et
        if (targetSelector === 'body') {
          target.appendChild(content);
        } else {
          target.replaceWith(content);
        }
        
        this.loadedComponents.set(filePath, content);
        console.log(`✅ Loaded: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to load ${filePath}:`, error);
      
      // Error fallback - placeholder ekle
      const target = document.querySelector(targetSelector);
      if (target) {
        target.innerHTML = `
          <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            <i class="ri-error-warning-line text-2xl mb-2 block"></i>
            <p class="text-sm">Component yüklenemedi: ${filePath}</p>
          </div>
        `;
      }
    }
  }

  /**
   * Template'leri DOM'a yükle
   */
  async loadTemplates() {
    const templateFiles = [
      'components/common/Button.html',
      'components/common/Card.html'
    ];

    for (const filePath of templateFiles) {
      try {
        const response = await fetch(filePath);
        const html = await response.text();
        
        // Template'leri head'e ekle
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const templates = doc.querySelectorAll('template');
        
        templates.forEach(template => {
          document.head.appendChild(template.cloneNode(true));
        });
        
        console.log(`📋 Templates loaded: ${filePath}`);
      } catch (error) {
        console.warn(`⚠️ Could not load templates: ${filePath}`, error);
      }
    }
  }

  /**
   * Component tekrar yükle
   */
  async reloadComponent(filePath, targetSelector) {
    // Önce mevcut component'i kaldır
    if (this.loadedComponents.has(filePath)) {
      this.loadedComponents.delete(filePath);
    }
    
    // Component'i tekrar yükle
    await this.loadComponent(filePath, targetSelector);
  }

  /**
   * Yüklenen component'leri getir
   */
  getLoadedComponents() {
    return Array.from(this.loadedComponents.keys());
  }

  /**
   * Component yüklendi mi kontrol et
   */
  isComponentLoaded(filePath) {
    return this.loadedComponents.has(filePath);
  }

  /**
   * Tüm component'leri temizle
   */
  clearComponents() {
    this.loadedComponents.clear();
    console.log('🧹 Components cleared');
  }

  /**
   * Component placeholder'larını oluştur
   */
  createPlaceholders() {
    const placeholders = [
      { id: 'header-placeholder', tag: 'header' },
      { id: 'hero-placeholder', tag: 'main' },
      { id: 'about-placeholder', tag: 'section' },
      { id: 'skills-placeholder', tag: 'section' },
      { id: 'projects-placeholder', tag: 'section' },
      { id: 'contact-placeholder', tag: 'section' },
      { id: 'footer-placeholder', tag: 'footer' },
      { id: 'theme-toggle-placeholder', tag: 'div' }
    ];

    placeholders.forEach(({ id, tag }) => {
      if (!document.getElementById(id)) {
        const element = document.createElement(tag);
        element.id = id;
        element.className = 'component-placeholder';
        
        // Loading indicator ekle
        element.innerHTML = `
          <div class="flex items-center justify-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span class="ml-3 text-text-secondary">Loading ${id.replace('-placeholder', '')}...</span>
          </div>
        `;
        
        document.body.appendChild(element);
      }
    });
  }

  /**
   * Loading durumunu göster
   */
  showLoading(target, message = 'Loading...') {
    const element = document.querySelector(target);
    if (element) {
      element.innerHTML = `
        <div class="flex items-center justify-center p-8">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
          <span class="text-text-secondary">${message}</span>
        </div>
      `;
    }
  }

  /**
   * Error durumunu göster
   */
  showError(target, message = 'An error occurred') {
    const element = document.querySelector(target);
    if (element) {
      element.innerHTML = `
        <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          <i class="ri-error-warning-line text-2xl mb-2 block"></i>
          <p class="text-sm">${message}</p>
        </div>
      `;
    }
  }
}

// Global instance oluştur
export const componentLoader = new ComponentLoader(); 