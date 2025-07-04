/**
 * Analytics & Performance Monitoring System
 * Tracks user interactions, performance metrics, and provides insights
 */

class AnalyticsManager {
  constructor() {
    this.isEnabled = true;
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.performanceMetrics = {};
    this.userAgent = navigator.userAgent;
    this.viewport = { width: window.innerWidth, height: window.innerHeight };
    
    this.init();
  }

  init() {
    if (!this.isEnabled) return;

    console.log('📊 Analytics Manager initialized');
    
    // Track page load performance
    this.trackPageLoad();
    
    // Track user interactions
    this.initInteractionTracking();
    
    // Track scroll behavior
    this.initScrollTracking();
    
    // Track form interactions
    this.initFormTracking();
    
    // Track errors
    this.initErrorTracking();
    
    // Track viewport changes
    this.initViewportTracking();
    
    // Start session monitoring
    this.startSessionMonitoring();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      
      this.performanceMetrics.pageLoad = {
        loadTime,
        domContentLoaded,
        timestamp: Date.now()
      };

      this.trackEvent('page_load', {
        load_time: loadTime,
        dom_content_loaded: domContentLoaded,
        user_agent: this.userAgent,
        viewport: this.viewport
      });

      // Track Core Web Vitals
      this.trackWebVitals();
    });
  }

  trackWebVitals() {
    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.performanceMetrics.lcp = lastEntry.startTime;
      this.trackEvent('web_vital_lcp', { value: lastEntry.startTime });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0];
      if (firstInput) {
        const fid = firstInput.processingStart - firstInput.startTime;
        this.performanceMetrics.fid = fid;
        this.trackEvent('web_vital_fid', { value: fid });
      }
    }).observe({ entryTypes: ['first-input'] });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.performanceMetrics.cls = clsValue;
      this.trackEvent('web_vital_cls', { value: clsValue });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  initInteractionTracking() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, .btn-base, .nav-link');
      if (target) {
        this.trackEvent('click', {
          element: target.tagName.toLowerCase(),
          classes: target.className,
          text: target.textContent?.trim().substring(0, 50),
          href: target.href || null,
          section: this.getCurrentSection(target)
        });
      }
    });

    // Track theme toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle')) {
        this.trackEvent('theme_toggle', {
          new_theme: document.documentElement.getAttribute('data-theme')
        });
      }
    });

    // Track mobile menu usage
    document.addEventListener('click', (e) => {
      if (e.target.closest('#mobile-menu-btn')) {
        const isExpanded = e.target.closest('#mobile-menu-btn').getAttribute('aria-expanded') === 'true';
        this.trackEvent('mobile_menu_toggle', { action: isExpanded ? 'close' : 'open' });
      }
    });
  }

  initScrollTracking() {
    let maxScroll = 0;
    let scrollDepth = 0;
    const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
    const sectionViews = new Set();

    const handleScroll = this.debounce(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollDepth = Math.round((scrollTop / docHeight) * 100);
      
      if (currentScrollDepth > scrollDepth) {
        scrollDepth = currentScrollDepth;
        
        // Track scroll milestones
        if (scrollDepth >= 25 && scrollDepth < 50 && !this.scrollMilestones?.quarter) {
          this.scrollMilestones = { ...this.scrollMilestones, quarter: true };
          this.trackEvent('scroll_milestone', { depth: 25 });
        }
        if (scrollDepth >= 50 && scrollDepth < 75 && !this.scrollMilestones?.half) {
          this.scrollMilestones = { ...this.scrollMilestones, half: true };
          this.trackEvent('scroll_milestone', { depth: 50 });
        }
        if (scrollDepth >= 75 && scrollDepth < 90 && !this.scrollMilestones?.threeQuarter) {
          this.scrollMilestones = { ...this.scrollMilestones, threeQuarter: true };
          this.trackEvent('scroll_milestone', { depth: 75 });
        }
        if (scrollDepth >= 90 && !this.scrollMilestones?.complete) {
          this.scrollMilestones = { ...this.scrollMilestones, complete: true };
          this.trackEvent('scroll_milestone', { depth: 90 });
        }
      }

      // Track section views
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section && this.isElementInViewport(section) && !sectionViews.has(sectionId)) {
          sectionViews.add(sectionId);
          this.trackEvent('section_view', { section: sectionId });
        }
      });
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  initFormTracking() {
    // Track form interactions
    document.addEventListener('focus', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.trackEvent('form_field_focus', {
          field_name: e.target.name || e.target.id,
          field_type: e.target.type,
          form_id: e.target.closest('form')?.id
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM') {
        this.trackEvent('form_submit', {
          form_id: form.id,
          form_name: form.name,
          fields_count: form.elements.length
        });
      }
    });

    // Track form validation errors
    document.addEventListener('invalid', (e) => {
      this.trackEvent('form_validation_error', {
        field_name: e.target.name || e.target.id,
        field_type: e.target.type,
        validation_message: e.target.validationMessage
      });
    });
  }

  initErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (e) => {
      this.trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno,
        error: e.error?.toString()
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.trackEvent('unhandled_promise_rejection', {
        reason: e.reason?.toString(),
        promise: e.promise?.toString()
      });
    });

    // Track resource loading errors
    document.addEventListener('error', (e) => {
      if (e.target !== window) {
        this.trackEvent('resource_error', {
          element: e.target.tagName.toLowerCase(),
          source: e.target.src || e.target.href,
          message: 'Failed to load resource'
        });
      }
    }, true);
  }

  initViewportTracking() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newViewport = { width: window.innerWidth, height: window.innerHeight };
        this.trackEvent('viewport_change', {
          old_viewport: this.viewport,
          new_viewport: newViewport
        });
        this.viewport = newViewport;
      }, 250);
    });
  }

  startSessionMonitoring() {
    // Track session duration every 30 seconds
    setInterval(() => {
      const sessionDuration = Date.now() - this.startTime;
      this.trackEvent('session_heartbeat', {
        duration: sessionDuration,
        events_count: this.events.length
      });
    }, 30000);

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('page_visibility_change', {
        hidden: document.hidden,
        visibility_state: document.visibilityState
      });
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.startTime;
      this.trackEvent('session_end', {
        duration: sessionDuration,
        events_count: this.events.length,
        performance_metrics: this.performanceMetrics
      });
      
      // Send remaining events
      this.sendEvents(true);
    });
  }

  trackEvent(eventName, eventData = {}) {
    const event = {
      id: this.generateEventId(),
      name: eventName,
      data: eventData,
      timestamp: Date.now(),
      session_id: this.sessionId,
      url: window.location.href,
      referrer: document.referrer,
      user_agent: this.userAgent,
      viewport: this.viewport
    };

    this.events.push(event);
    console.log('📊 Event tracked:', eventName, eventData);

    // Send events in batches
    if (this.events.length >= 10) {
      this.sendEvents();
    }
  }

  trackCustomEvent(eventName, customData = {}) {
    this.trackEvent(`custom_${eventName}`, customData);
  }

  trackPageView(page) {
    this.trackEvent('page_view', {
      page: page || window.location.pathname,
      title: document.title,
      timestamp: Date.now()
    });
  }

  trackPerformanceMetric(metricName, value) {
    this.performanceMetrics[metricName] = value;
    this.trackEvent('performance_metric', {
      metric: metricName,
      value: value
    });
  }

  generateEventId() {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getCurrentSection(element) {
    const section = element.closest('section');
    return section?.id || 'unknown';
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  async sendEvents(force = false) {
    if (this.events.length === 0) return;
    
    try {
      // In a real implementation, you would send to your analytics service
      // For now, we'll just log and clear the events
      console.log('📤 Sending analytics events:', this.events.length);
      
      // Example: Send to Google Analytics, Mixpanel, or custom analytics service
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events: this.events })
      // });
      
      this.events = [];
      
    } catch (error) {
      console.error('❌ Failed to send analytics events:', error);
    }
  }

  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      eventsCount: this.events.length,
      performanceMetrics: this.performanceMetrics,
      viewport: this.viewport,
      userAgent: this.userAgent
    };
  }

  disable() {
    this.isEnabled = false;
    console.log('📊 Analytics disabled');
  }

  enable() {
    this.isEnabled = true;
    console.log('📊 Analytics enabled');
  }
}

// Performance Monitor utility functions
export const PerformanceMonitor = {
  measurePageLoad() {
    return new Promise((resolve) => {
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const metrics = {
          navigationStart: timing.navigationStart,
          domainLookup: timing.domainLookupEnd - timing.domainLookupStart,
          connection: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart,
          domProcessing: timing.domComplete - timing.domLoading,
          loadComplete: timing.loadEventEnd - timing.navigationStart
        };
        resolve(metrics);
      });
    });
  },

  measureFunction(func, name) {
    return function(...args) {
      const start = performance.now();
      const result = func.apply(this, args);
      const end = performance.now();
      console.log(`⏱️ ${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    };
  },

  measureAsyncFunction(func, name) {
    return async function(...args) {
      const start = performance.now();
      const result = await func.apply(this, args);
      const end = performance.now();
      console.log(`⏱️ ${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    };
  }
};

// Create global analytics instance
let analyticsManager = null;

export function initAnalytics() {
  if (!analyticsManager) {
    analyticsManager = new AnalyticsManager();
  }
  return analyticsManager;
}

export function getAnalytics() {
  return analyticsManager;
}

export default AnalyticsManager; 