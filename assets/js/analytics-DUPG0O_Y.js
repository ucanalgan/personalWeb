/**
 * Advanced Analytics and Performance Monitoring System
 * Privacy-focused analytics with detailed performance metrics
 */

export class AdvancedAnalytics {
  constructor(options = {}) {
    this.options = {
      enableGoogleAnalytics: false,
      enableHotjar: false,
      enableCustomTracking: true,
      enablePerformanceMonitoring: true,
      enableErrorTracking: true,
      enableUserJourney: true,
      debug: false,
      ...options
    };

    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      pageViews: [],
      interactions: [],
      errors: [],
      performance: {},
      userAgent: navigator.userAgent,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.init();
  }

  init() {
    this.initPerformanceMonitoring();
    this.initErrorTracking();
    this.initUserInteractionTracking();
    this.initScrollTracking();
    this.initFormTracking();
    this.initVisibilityTracking();
    this.initCustomEvents();

    if (this.options.enableGoogleAnalytics) {
      this.initGoogleAnalytics();
    }

    // Send initial page view
    this.trackPageView();

    // Setup session end tracking
    this.setupSessionEndTracking();
  }

  /**
   * Performance Monitoring
   */
  initPerformanceMonitoring() {
    // Core Web Vitals tracking
    this.trackWebVitals();

    // Resource timing
    this.trackResourceTiming();

    // Navigation timing
    this.trackNavigationTiming();

    // Custom performance marks
    this.trackCustomMarks();
  }

  trackWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.trackEvent('web_vitals', 'lcp', {
        value: lastEntry.startTime,
        rating: this.getWebVitalRating('lcp', lastEntry.startTime)
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0];

      this.trackEvent('web_vitals', 'fid', {
        value: firstInput.processingStart - firstInput.startTime,
        rating: this.getWebVitalRating('fid', firstInput.processingStart - firstInput.startTime)
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      }

      this.trackEvent('web_vitals', 'cls', {
        value: clsScore,
        rating: this.getWebVitalRating('cls', clsScore)
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  trackResourceTiming() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      const resourceData = {
        totalResources: resources.length,
        slowResources: resources.filter(r => r.duration > 1000).length,
        largestResource: Math.max(...resources.map(r => r.transferSize || 0)),
        totalTransferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
      };

      this.trackEvent('performance', 'resource_timing', resourceData);
    });
  }

  trackNavigationTiming() {
    window.addEventListener('load', () => {
      const nav = performance.getEntriesByType('navigation')[0];

      const timingData = {
        dns: nav.domainLookupEnd - nav.domainLookupStart,
        tcp: nav.connectEnd - nav.connectStart,
        request: nav.responseStart - nav.requestStart,
        response: nav.responseEnd - nav.responseStart,
        dom: nav.domContentLoadedEventEnd - nav.navigationStart,
        load: nav.loadEventEnd - nav.navigationStart
      };

      this.trackEvent('performance', 'navigation_timing', timingData);
    });
  }

  trackCustomMarks() {
    // Track custom performance marks
    window.addEventListener('load', () => {
      const marks = performance.getEntriesByType('mark');
      const measures = performance.getEntriesByType('measure');

      if (marks.length > 0 || measures.length > 0) {
        this.trackEvent('performance', 'custom_marks', {
          marks: marks.map(mark => ({
            name: mark.name,
            startTime: mark.startTime
          })),
          measures: measures.map(measure => ({
            name: measure.name,
            duration: measure.duration,
            startTime: measure.startTime
          }))
        });
      }
    });
  }

  /**
   * User Interaction Tracking
   */
  initUserInteractionTracking() {
    // Click tracking
    document.addEventListener('click', (e) => {
      const element = e.target.closest('[data-track]') || e.target;
      const trackingData = {
        element: element.tagName,
        class: element.className,
        id: element.id,
        text: element.textContent?.substring(0, 100),
        position: { x: e.clientX, y: e.clientY },
        timestamp: Date.now()
      };

      this.trackInteraction('click', trackingData);
    });

    // Form interactions
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.trackInteraction('form_input', {
          field: e.target.name || e.target.id,
          type: e.target.type,
          timestamp: Date.now()
        });
      }
    });

    // Download tracking
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.isDownloadLink(link.href)) {
        this.trackEvent('engagement', 'download', {
          url: link.href,
          text: link.textContent
        });
      }
    });
  }

  initScrollTracking() {
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 90, 100];
    const trackedMilestones = new Set();

    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      maxScroll = Math.max(maxScroll, scrollPercent);

      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          this.trackEvent('engagement', 'scroll_depth', { depth: milestone });
        }
      });
    };

    window.addEventListener('scroll', this.debounce(trackScrollDepth, 250));

    // Track time spent on page
    window.addEventListener('beforeunload', () => {
      this.trackEvent('engagement', 'time_on_page', {
        duration: Date.now() - this.sessionData.startTime,
        maxScroll
      });
    });
  }

  initFormTracking() {
    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      this.trackEvent('form', 'submit', {
        formId: form.id,
        formClass: form.className,
        action: form.action,
        method: form.method
      });
    });

    // Track form field interactions
    document.addEventListener('focus', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.trackEvent('form', 'field_focus', {
          fieldName: e.target.name || e.target.id,
          fieldType: e.target.type
        });
      }
    });
  }

  initVisibilityTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility', 'change', {
        hidden: document.hidden,
        timestamp: Date.now()
      });
    });
  }

  initCustomEvents() {
    // Set up custom event tracking
    window.addEventListener('custom-analytics', (e) => {
      this.trackEvent('custom', e.detail.eventName, e.detail.data);
    });
  }

  /**
   * Error Tracking
   */
  initErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (e) => {
      this.trackError('javascript', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.trackError('promise_rejection', {
        reason: e.reason?.toString()
      });
    });

    // Resource loading errors
    document.addEventListener('error', (e) => {
      if (e.target !== window) {
        this.trackError('resource', {
          element: e.target.tagName,
          source: e.target.src || e.target.href,
          message: 'Failed to load resource'
        });
      }
    }, true);
  }

  /**
   * Custom tracking methods
   */
  trackPageView(page = window.location.pathname) {
    const pageData = {
      page,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      viewport: { width: window.innerWidth, height: window.innerHeight }
    };

    this.sessionData.pageViews.push(pageData);
    this.trackEvent('navigation', 'page_view', pageData);
  }

  trackEvent(category, action, data = {}) {
    const event = {
      category,
      action,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionData.sessionId,
      page: window.location.pathname
    };

    if (this.options.debug) {
      // Analytics event tracked
    }

    // Send to your analytics endpoint
    this.sendEvent(category, event);
  }

  trackInteraction(type, data) {
    this.sessionData.interactions.push({ type, data, timestamp: Date.now() });
    this.trackEvent('interaction', type, data);
  }

  trackError(type, data) {
    this.sessionData.errors.push({ type, data, timestamp: Date.now() });
    this.trackEvent('error', type, data);
  }

  /**
   * Utility methods
   */
  getWebVitalRating(metric, value) {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  isDownloadLink(url) {
    const downloadExtensions = ['.pdf', '.doc', '.docx', '.zip', '.exe', '.dmg'];
    return downloadExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

  async sendEvent(eventName, eventData) {
    if (!this.options.enableCustomTracking) return;

    try {
      // Store locally for all environments
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(eventData);
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100)));

      // Only send to remote endpoint in production
      if (window.location.hostname !== 'localhost') {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        });
      }
    } catch (error) {
      // Silent fail in production, warn in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('Failed to send analytics event:', error);
      }
    }
  }

  // Google Analytics integration
  initGoogleAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        custom_map: { 'custom_parameter': 'dimension1' }
      });
    }
  }

  setupSessionEndTracking() {
    window.addEventListener('beforeunload', () => {
      // Send session summary
      const sessionSummary = {
        sessionId: this.sessionData.sessionId,
        duration: Date.now() - this.sessionData.startTime,
        pageViews: this.sessionData.pageViews.length,
        interactions: this.sessionData.interactions.length,
        errors: this.sessionData.errors.length
      };

      // Use sendBeacon for reliable delivery (only in production)
      if (navigator.sendBeacon && window.location.hostname !== 'localhost') {
        navigator.sendBeacon('/api/analytics/session-end', JSON.stringify(sessionSummary));
      } else {
        // Store session summary locally for development
        localStorage.setItem('last_session_summary', JSON.stringify(sessionSummary));
      }
    });
  }
}

// Initialize analytics
const analytics = new AdvancedAnalytics({
  enableCustomTracking: true,
  enablePerformanceMonitoring: true,
  enableErrorTracking: true,
  debug: import.meta.env.DEV
});

// Export for manual tracking
export { analytics };

// Global tracking functions
window.trackEvent = (category, action, data) => analytics.trackEvent(category, action, data);
window.trackPageView = (page) => analytics.trackPageView(page);

// Project performance tracking
export function trackProjectMetrics() {
  const projectCards = document.querySelectorAll('.project-card');
  const projectViews = new Map();

  // Track project card visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const projectId = entry.target.dataset.id;
        if (projectId && !projectViews.has(projectId)) {
          projectViews.set(projectId, Date.now());
          trackEvent('project_view', {
            project_id: projectId,
            view_time: Date.now()
          });
        }
      }
    });
  }, { threshold: 0.5 });

  projectCards.forEach(card => observer.observe(card));

  // Track project interactions
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const projectId = card.dataset.id;
      const action = e.target.closest('a') ? 'external_link' : 'details_view';

      trackEvent('project_interaction', {
        project_id: projectId,
        action: action,
        timestamp: Date.now()
      });
    });
  });

  return {
    getProjectViews: () => Array.from(projectViews.entries()),
    getTopViewedProjects: () => {
      return Array.from(projectViews.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    }
  };
}

// A/B test project layouts
export function testProjectLayouts() {
  const layouts = ['grid', 'masonry', 'carousel'];
  const currentLayout = localStorage.getItem('project_layout') ||
    layouts[Math.floor(Math.random() * layouts.length)];

  localStorage.setItem('project_layout', currentLayout);

  trackEvent('layout_test', {
    layout: currentLayout,
    timestamp: Date.now()
  });

  return currentLayout;
}

// Enhanced project search analytics
export function trackProjectSearch(query, results) {
  trackEvent('project_search', {
    query: query.toLowerCase(),
    results_count: results.length,
    has_results: results.length > 0,
    timestamp: Date.now()
  });

  // Track popular search terms
  const searches = JSON.parse(localStorage.getItem('project_searches') || '[]');
  searches.push({
    query: query.toLowerCase(),
    timestamp: Date.now(),
    results: results.length
  });

  // Keep only last 100 searches
  if (searches.length > 100) {
    searches.splice(0, searches.length - 100);
  }

  localStorage.setItem('project_searches', JSON.stringify(searches));
}

/**
 * Analytics & Performance Monitoring System
 * Tracks user interactions, performance metrics, and provides insights
 */

class AnalyticsManager {
  constructor() {
    this.isEnabled = this.checkAnalyticsConsent();
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.performanceMetrics = {};
    this.userAgent = navigator.userAgent;
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    if (this.isEnabled) {
      this.init();
    }
  }

  checkAnalyticsConsent() {
    // Check for user consent (GDPR compliance)
    const consent = localStorage.getItem('analytics-consent');
    return consent === 'accepted';
  }

  init() {
    this.trackPageLoad();
    this.initInteractionTracking();
    this.initScrollTracking();
    this.initFormTracking();
    this.initErrorTracking();
    this.initViewportTracking();
    this.startSessionMonitoring();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  trackPageLoad() {
    if (!this.isEnabled) return;

    this.trackEvent('page_load', {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now()
    });

    // Track performance metrics
    window.addEventListener('load', () => {
      if (performance.timing) {
        const timing = performance.timing;
        this.performanceMetrics = {
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          loadComplete: timing.loadEventEnd - timing.navigationStart,
          firstPaint: this.getFirstPaint(),
          firstContentfulPaint: this.getFirstContentfulPaint()
        };

        this.trackEvent('performance_metrics', this.performanceMetrics);
      }
    });
  }

  getFirstPaint() {
    const paintTiming = performance.getEntriesByType('paint');
    const firstPaint = paintTiming.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  getFirstContentfulPaint() {
    const paintTiming = performance.getEntriesByType('paint');
    const fcp = paintTiming.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  initInteractionTracking() {
    if (!this.isEnabled) return;

    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .btn, [role="button"]')) {
        this.trackEvent('button_click', {
          element: e.target.tagName.toLowerCase(),
          id: e.target.id || null,
          className: e.target.className || null,
          text: e.target.textContent?.trim().substring(0, 50) || null
        });
      }
    });

    // Track link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href]')) {
        this.trackEvent('link_click', {
          href: e.target.href,
          text: e.target.textContent?.trim().substring(0, 50) || null,
          external: !e.target.href.startsWith(window.location.origin)
        });
      }
    });
  }

  initScrollTracking() {
    if (!this.isEnabled) return;

    let maxScroll = 0;
    const trackScrollDepth = this.debounce(() => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        // Track milestone scroll depths
        const milestones = [25, 50, 75, 90];
        if (milestones.includes(scrollPercent)) {
          this.trackEvent('scroll_depth', {
            percent: scrollPercent,
            page: window.location.pathname
          });
        }
      }
    }, 500);

    window.addEventListener('scroll', trackScrollDepth, { passive: true });
  }

  initFormTracking() {
    if (!this.isEnabled) return;

    document.addEventListener('submit', (e) => {
      if (e.target.matches('form')) {
        this.trackEvent('form_submit', {
          formId: e.target.id || null,
          formClass: e.target.className || null,
          fields: e.target.elements.length
        });
      }
    });

    // Track form field interactions
    document.addEventListener('focus', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.trackEvent('form_field_focus', {
          fieldType: e.target.type || e.target.tagName.toLowerCase(),
          fieldName: e.target.name || null
        });
      }
    });
  }

  initErrorTracking() {
    if (!this.isEnabled) return;

    // Track JavaScript errors
    window.addEventListener('error', (e) => {
      this.trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno,
        stack: e.error?.stack?.substring(0, 500) || null
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.trackEvent('unhandled_promise_rejection', {
        reason: e.reason?.toString().substring(0, 500) || 'Unknown error'
      });
    });
  }

  initViewportTracking() {
    if (!this.isEnabled) return;

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        this.trackEvent('viewport_change', this.viewport);
      }, 500);
    });
  }

  startSessionMonitoring() {
    if (!this.isEnabled) return;

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
    if (!this.isEnabled) return;

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

    // Send events in batches
    if (this.events.length >= 10) {
      this.sendEvents();
    }
  }

  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

  async sendEvents(_force = false) {
    if (this.events.length === 0 || !this.isEnabled) return;

    try {
      // In production, this would send to your analytics endpoint
      // For now, we'll just clear the events
      this.events = [];
    } catch (error) {
      // Silent fail - don't break user experience
    }
  }

  // Public API
  enable() {
    this.isEnabled = true;
    localStorage.setItem('analytics-consent', 'accepted');
    this.init();
  }

  disable() {
    this.isEnabled = false;
    localStorage.setItem('analytics-consent', 'rejected');
    this.events = [];
  }

  trackCustomEvent(eventName, customData = {}) {
    this.trackEvent(`custom_${eventName}`, customData);
  }

  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      eventsCount: this.events.length,
      performanceMetrics: this.performanceMetrics,
      viewport: this.viewport
    };
  }
}

// Global analytics instance
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
