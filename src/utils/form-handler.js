// File: js/form-handler.js
// Description: Contact form validations, submissions and user interactions management module

import { debounce } from './debounce.js';

/**
 * Production-ready form handling utilities
 * Handles form validation, submission, and user feedback
 */

export class FormHandler {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    this.options = {
      showSuccessMessage: true,
      showErrorMessage: true,
      resetAfterSubmit: true,
      validateOnInput: true,
      ...options
    };
    
    this.isSubmitting = false;
    this.validators = new Map();
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.setupEventListeners();
    this.setupValidation();
  }

  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Real-time validation
    if (this.options.validateOnInput) {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    }
  }

  setupValidation() {
    // Email validation
    this.addValidator('email', (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || 'Please enter a valid email address';
    });

    // Required field validation
    this.addValidator('required', (value) => {
      return value.trim().length > 0 || 'This field is required';
    });

    // Minimum length validation
    this.addValidator('minLength', (value, min) => {
      return value.length >= min || `Minimum ${min} characters required`;
    });

    // Maximum length validation
    this.addValidator('maxLength', (value, max) => {
      return value.length <= max || `Maximum ${max} characters allowed`;
    });
  }

  addValidator(name, validatorFunction) {
    this.validators.set(name, validatorFunction);
  }

  validateField(input) {
    const rules = input.dataset.validate?.split(',') || [];
    const value = input.value.trim();
    
    for (const rule of rules) {
      const [validatorName, param] = rule.trim().split(':');
      const validator = this.validators.get(validatorName);
      
      if (validator) {
        const result = validator(value, param);
        if (result !== true) {
          this.showFieldError(input, result);
          return false;
        }
      }
    }
    
    this.clearFieldError(input);
    return true;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[data-validate], textarea[data-validate], select[data-validate]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  showFieldError(input, message) {
    this.clearFieldError(input);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-red-400 text-sm mt-1';
    errorElement.textContent = message;
    errorElement.setAttribute('data-error-for', input.name);
    
    input.parentNode.appendChild(errorElement);
    input.classList.add('border-red-400', 'focus:border-red-400');
  }

  clearFieldError(input) {
    const existingError = input.parentNode.querySelector(`[data-error-for="${input.name}"]`);
    if (existingError) {
      existingError.remove();
    }
    
    input.classList.remove('border-red-400', 'focus:border-red-400');
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    // Validate form
    if (!this.validateForm()) {
      this.showMessage('Please fix the errors above', 'error');
      return;
    }
    
    this.isSubmitting = true;
    this.showSubmittingState();
    
    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Submit form data
      const result = await this.submitForm(data);
      
      if (result.success) {
        this.showMessage('Message sent successfully!', 'success');
        if (this.options.resetAfterSubmit) {
          this.form.reset();
        }
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      this.showMessage(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
      this.hideSubmittingState();
    }
  }

  async submitForm(data) {
    // This would typically send to your backend API
    // For demo purposes, using a mock submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success response
    return { success: true, message: 'Form submitted successfully' };
  }

  showSubmittingState() {
    const submitButton = this.form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.classList.add('opacity-75');
    }
  }

  hideSubmittingState() {
    const submitButton = this.form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
      submitButton.classList.remove('opacity-75');
    }
  }

  showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = this.form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message p-4 rounded-lg text-center ${
      type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
      type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
      'bg-blue-500/10 border border-blue-500/20 text-blue-400'
    }`;
    messageElement.textContent = message;
    
    this.form.appendChild(messageElement);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 5000);
    }
  }
}

/**
 * Initialize contact form
 */
export function initContactForm() {
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    return new FormHandler('#contact-form', {
      showSuccessMessage: true,
      showErrorMessage: true,
      resetAfterSubmit: true,
      validateOnInput: true
    });
  }
  return null;
}

/**
 * Newsletter signup form
 */
export function initNewsletterForm() {
  const newsletterForm = document.querySelector('#newsletter-form');
  if (newsletterForm) {
    return new FormHandler('#newsletter-form', {
      resetAfterSubmit: true,
      validateOnInput: false
    });
  }
  return null;
}

export default FormHandler; 