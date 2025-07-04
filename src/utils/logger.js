/**
 * Centralized Logging Utility
 * Manages console outputs based on environment and build configuration
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

class Logger {
  constructor() {
    this.isDevelopment = isDevelopment;
    this.isProduction = isProduction;
    this.enabledLevels = this.getEnabledLevels();
  }

  getEnabledLevels() {
    if (this.isProduction) {
      return new Set(['error']); // Only errors in production
    }
    return new Set(['log', 'warn', 'error', 'info', 'debug']); // All levels in development
  }

  log(...args) {
    if (this.enabledLevels.has('log')) {
      // Removed console.log for production
    }
  }

  warn(...args) {
    if (this.enabledLevels.has('warn')) {
      console.warn('🟡', ...args);
    }
  }

  error(...args) {
    if (this.enabledLevels.has('error')) {
      console.error('🔴', ...args);
    }
  }

  info(...args) {
    if (this.enabledLevels.has('info')) {
      console.info('🔵', ...args);
    }
  }

  debug(...args) {
    if (this.enabledLevels.has('debug')) {
      console.debug('🐛', ...args);
    }
  }

  // Specialized logging methods
  success(...args) {
    if (this.enabledLevels.has('log')) {
      // Removed console.log for production
    }
  }

  performance(label, startTime) {
    if (this.enabledLevels.has('debug')) {
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      // Removed console.log for production
    }
  }

  group(label, collapsed = false) {
    if (this.enabledLevels.has('log')) {
      if (collapsed) {
        console.groupCollapsed(label);
      } else {
        console.group(label);
      }
    }
  }

  groupEnd() {
    if (this.enabledLevels.has('log')) {
      console.groupEnd();
    }
  }

  table(data) {
    if (this.enabledLevels.has('log')) {
      console.table(data);
    }
  }

  // Component-specific logging
  component(name, message, ...args) {
    if (this.enabledLevels.has('log')) {
      // Removed console.log for production
    }
  }

  api(method, url, status, ...args) {
    if (this.enabledLevels.has('log')) {
      const emoji = status >= 200 && status < 300 ? '✅' : '❌';
      // Removed console.log for production
    }
  }

  // Silent methods that never log (for build optimization)
  silentLog() {}
  silentWarn() {}
  silentInfo() {}
  silentDebug() {}
}

// Create singleton instance
const logger = new Logger();

export default logger;

// Export convenience methods
export const { log, warn, error, info, debug, success, performance, group, groupEnd, table, component, api } = logger; 