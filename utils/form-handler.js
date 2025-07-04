// File: js/form-handler.js
// Description: İletişim formu validasyonları, gönderimleri ve kullanıcı etkileşimlerini yöneten modül

import { debounce } from './debounce.js';

/**
 * Advanced Form Handler
 * Handles contact form submission with validation, animations, and multiple service integrations
 */

export class FormHandler {
  constructor(formId, options = {}) {
    this.form = document.getElementById(formId);
    this.options = {
      service: 'formspree', // 'formspree', 'netlify', 'emailjs'
      endpoint: 'https://formspree.io/f/YOUR_FORM_ID', // Replace with your endpoint
      emailjsConfig: {
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID',
        publicKey: 'YOUR_PUBLIC_KEY'
      },
      showSuccessMessage: true,
      redirectOnSuccess: false,
      redirectUrl: '/thank-you',
      enableSpamProtection: true,
      honeypotField: 'url', // Hidden field name
      rateLimiting: {
        enabled: true,
        maxSubmissions: 3,
        timeWindow: 60000 // 1 minute
      },
      ...options
    };

    this.isSubmitting = false;
    this.submissionCount = 0;
    this.lastSubmissionTime = 0;
    this.validators = new Map();
    
    this.init();
  }

  init() {
    if (!this.form) {
      console.warn('Form not found');
      return;
    }

    this.setupValidation();
    this.setupSubmissionHandler();
    this.setupSpamProtection();
    this.setupAccessibility();
  }

  setupValidation() {
    // Email validation
    this.addValidator('email', (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        isValid: emailRegex.test(value),
        message: 'Please enter a valid email address'
      };
    });

    // Name validation
    this.addValidator('name', (value) => {
      return {
        isValid: value.trim().length >= 2,
        message: 'Name must be at least 2 characters long'
      };
    });

    // Subject validation
    this.addValidator('subject', (value) => {
      return {
        isValid: value.trim().length >= 5,
        message: 'Subject must be at least 5 characters long'
      };
    });

    // Message validation
    this.addValidator('message', (value) => {
      return {
        isValid: value.trim().length >= 10,
        message: 'Message must be at least 10 characters long'
      };
    });

    // Add real-time validation
    this.form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) {
          this.validateField(field);
        }
      });
    });
  }

  addValidator(fieldName, validatorFn) {
    this.validators.set(fieldName, validatorFn);
  }

  validateField(field) {
    const validator = this.validators.get(field.name);
    if (!validator) return true;

    const result = validator(field.value);
    this.updateFieldUI(field, result);
    return result.isValid;
  }

  validateForm() {
    let isValid = true;
    const fields = this.form.querySelectorAll('input[required], textarea[required]');
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  updateFieldUI(field, result) {
    const fieldGroup = field.closest('.field-group') || field.parentElement;
    const errorElement = fieldGroup.querySelector('.field-error') || 
                         this.createErrorElement(fieldGroup);

    if (result.isValid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    } else {
      field.classList.add('invalid');
      field.classList.remove('valid');
      errorElement.textContent = result.message;
      errorElement.style.display = 'block';
    }
  }

  createErrorElement(parent) {
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error text-red-500 text-sm mt-1';
    errorEl.style.display = 'none';
    parent.appendChild(errorEl);
    return errorEl;
  }

  setupSubmissionHandler() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSubmit();
    });
  }

  setupSpamProtection() {
    if (!this.options.enableSpamProtection) return;

    // Add honeypot field
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = this.options.honeypotField;
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    this.form.appendChild(honeypot);

    // Add timestamp for submission rate limiting
    const timestamp = document.createElement('input');
    timestamp.type = 'hidden';
    timestamp.name = 'timestamp';
    timestamp.value = Date.now();
    this.form.appendChild(timestamp);
  }

  setupAccessibility() {
    // Add ARIA labels and descriptions
    this.form.querySelectorAll('input, textarea').forEach(field => {
      const label = this.form.querySelector(`label[for="${field.id}"]`);
      if (label && !field.getAttribute('aria-label')) {
        field.setAttribute('aria-label', label.textContent);
      }
    });

    // Add form status announcements
    const statusEl = document.createElement('div');
    statusEl.id = 'form-status';
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.setAttribute('aria-atomic', 'true');
    statusEl.className = 'sr-only';
    this.form.appendChild(statusEl);
  }

  async handleSubmit() {
    if (this.isSubmitting) return;

    // Rate limiting check
    if (!this.checkRateLimit()) {
      this.showMessage('Too many submissions. Please wait before trying again.', 'error');
      return;
    }

    // Spam protection check
    if (!this.checkSpamProtection()) {
      this.showMessage('Submission blocked. Please try again later.', 'error');
      return;
    }

    // Validation check
    if (!this.validateForm()) {
      this.showMessage('Please fix the errors below and try again.', 'error');
      return;
    }

    this.isSubmitting = true;
    this.updateSubmitButton(true);

    try {
      const formData = new FormData(this.form);
      const result = await this.submitForm(formData);

      if (result.success) {
        this.handleSuccess(result);
      } else {
        this.handleError(result.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.handleError('An error occurred. Please try again later.');
    } finally {
      this.isSubmitting = false;
      this.updateSubmitButton(false);
    }
  }

  async submitForm(formData) {
    // Remove honeypot from form data if empty (legitimate submission)
    const honeypotValue = formData.get(this.options.honeypotField);
    if (!honeypotValue) {
      formData.delete(this.options.honeypotField);
    }

    switch (this.options.service) {
      case 'formspree':
        return await this.submitToFormspree(formData);
      case 'netlify':
        return await this.submitToNetlify(formData);
      case 'emailjs':
        return await this.submitToEmailJS(formData);
      default:
        throw new Error('Invalid form service specified');
    }
  }

  async submitToFormspree(formData) {
    const response = await fetch(this.options.endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    return {
      success: response.ok,
      message: data.message || (response.ok ? 'Message sent successfully!' : 'Failed to send message')
    };
  }

  async submitToNetlify(formData) {
    formData.append('form-name', this.form.getAttribute('name') || 'contact');
    
    const response = await fetch('/', {
      method: 'POST',
      body: formData
    });

    return {
      success: response.ok,
      message: response.ok ? 'Message sent successfully!' : 'Failed to send message'
    };
  }

  async submitToEmailJS(formData) {
    // Note: EmailJS requires their SDK to be loaded
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS SDK not loaded');
    }

    const templateParams = Object.fromEntries(formData);
    
    const response = await emailjs.send(
      this.options.emailjsConfig.serviceId,
      this.options.emailjsConfig.templateId,
      templateParams,
      this.options.emailjsConfig.publicKey
    );

    return {
      success: response.status === 200,
      message: response.status === 200 ? 'Message sent successfully!' : 'Failed to send message'
    };
  }

  checkRateLimit() {
    if (!this.options.rateLimiting.enabled) return true;

    const now = Date.now();
    const timeWindow = this.options.rateLimiting.timeWindow;
    
    if (now - this.lastSubmissionTime < timeWindow) {
      if (this.submissionCount >= this.options.rateLimiting.maxSubmissions) {
        return false;
      }
      this.submissionCount++;
    } else {
      this.submissionCount = 1;
      this.lastSubmissionTime = now;
    }

    return true;
  }

  checkSpamProtection() {
    if (!this.options.enableSpamProtection) return true;

    // Check honeypot
    const honeypotValue = this.form.querySelector(`[name="${this.options.honeypotField}"]`)?.value;
    if (honeypotValue) return false;

    // Check submission timing (too fast = bot)
    const timestamp = this.form.querySelector('[name="timestamp"]')?.value;
    if (timestamp && Date.now() - parseInt(timestamp) < 3000) {
      return false;
    }

    return true;
  }

  handleSuccess(result) {
    this.recordSubmission();
    
    if (this.options.showSuccessMessage) {
      this.showMessage(result.message, 'success');
    }

    if (this.options.redirectOnSuccess) {
      setTimeout(() => {
        window.location.href = this.options.redirectUrl;
      }, 2000);
    } else {
      this.form.reset();
      this.clearValidationStates();
    }

    // Analytics tracking
    this.trackEvent('form_submit', 'contact', 'success');
  }

  handleError(message) {
    this.showMessage(message, 'error');
    this.trackEvent('form_submit', 'contact', 'error');
  }

  showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = this.form.querySelector('.form-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'form-message';
      this.form.appendChild(messageEl);
    }

    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.display = 'block';

    // Update screen reader announcement
    const statusEl = document.getElementById('form-status');
    if (statusEl) {
      statusEl.textContent = message;
    }

    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 5000);
    }
  }

  updateSubmitButton(isSubmitting) {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    if (isSubmitting) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i>Sending...';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="ri-send-plane-line mr-2"></i>Send Message';
    }
  }

  clearValidationStates() {
    this.form.querySelectorAll('.invalid, .valid').forEach(field => {
      field.classList.remove('invalid', 'valid');
    });

    this.form.querySelectorAll('.field-error').forEach(error => {
      error.style.display = 'none';
    });
  }

  recordSubmission() {
    this.submissionCount++;
    this.lastSubmissionTime = Date.now();
    
    // Store in localStorage for persistence
    const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
    submissions.push({
      timestamp: Date.now(),
      form: this.form.id
    });
    
    // Keep only last 10 submissions
    if (submissions.length > 10) {
      submissions.splice(0, submissions.length - 10);
    }
    
    localStorage.setItem('form_submissions', JSON.stringify(submissions));
  }

  trackEvent(action, category, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead');
    }
  }

  // Public methods
  reset() {
    this.form.reset();
    this.clearValidationStates();
    this.hideMessage();
  }

  hideMessage() {
    const messageEl = this.form.querySelector('.form-message');
    if (messageEl) {
      messageEl.style.display = 'none';
    }
  }

  destroy() {
    // Remove event listeners and clean up
    this.form.removeEventListener('submit', this.handleSubmit);
    this.form.querySelectorAll('input, textarea').forEach(field => {
      field.removeEventListener('blur', this.validateField);
      field.removeEventListener('input', this.validateField);
    });
  }
}

// Initialize contact form when DOM is loaded
export function initContactForm() {
  const contactForm = new FormHandler('contact-form', {
    service: 'formspree',
    endpoint: 'https://formspree.io/f/xnnqlzja', // Replace with your Formspree endpoint
    showSuccessMessage: true,
    enableSpamProtection: true
  });

  return contactForm;
}

// Auto-initialize if contact form exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contact-form')) {
      initContactForm();
    }
  });
} else {
  if (document.getElementById('contact-form')) {
    initContactForm();
  }
}

// Initialize Form Handler
let formHandler;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    formHandler = new FormHandler();
    window.formHandler = formHandler;
  });
} else {
  formHandler = new FormHandler();
  window.formHandler = formHandler;
}

// Export for module usage
export default FormHandler; 