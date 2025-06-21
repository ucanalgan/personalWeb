// File: js/form-handler.js
// Description: İletişim formu validasyonları, gönderimleri ve kullanıcı etkileşimlerini yöneten modül

import { debounce } from './debounce.js';

/**
 * Form Handler Manager
 * Tüm form işlemlerini yönetir: validation, submission, feedback
 */
export class FormHandler {
  constructor() {
    this.forms = new Map();
    this.validators = new Map();
    this.config = {
      debounceTime: 300,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
      emailPattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      phonePattern: /^(\+90|0)?[5][0-9]{9}$/
    };
    
    this.init();
  }

  /**
   * Initialize form handler
   */
  init() {
    console.log('📝 Form Handler initialized');
    this.setupEventListeners();
    this.initializeValidators();
    this.findAndRegisterForms();
  }

  /**
   * Set up global form event listeners
   */
  setupEventListeners() {
    // Form submission handler
    document.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Real-time validation (using imported debounce function)
    document.addEventListener('input', debounce(this.handleFieldInput.bind(this), this.config.debounceTime));
    document.addEventListener('blur', this.handleFieldBlur.bind(this));
    document.addEventListener('focus', this.handleFieldFocus.bind(this));
    
    // File upload handler
    document.addEventListener('change', this.handleFileChange.bind(this));
    
    // Paste event for file inputs
    document.addEventListener('paste', this.handlePaste.bind(this));
  }

  /**
   * Initialize built-in validators
   */
  initializeValidators() {
    // Required field validator
    this.validators.set('required', {
      validate: (value) => value && value.trim().length > 0,
      message: 'Bu alan zorunludur'
    });

    // Email validator
    this.validators.set('email', {
      validate: (value) => !value || this.config.emailPattern.test(value),
      message: 'Geçerli bir e-posta adresi giriniz'
    });

    // Phone validator
    this.validators.set('phone', {
      validate: (value) => !value || this.config.phonePattern.test(value),
      message: 'Geçerli bir telefon numarası giriniz'
    });

    // Minimum length validator
    this.validators.set('minlength', {
      validate: (value, param) => !value || value.length >= parseInt(param),
      message: (param) => `En az ${param} karakter olmalıdır`
    });

    // Maximum length validator
    this.validators.set('maxlength', {
      validate: (value, param) => !value || value.length <= parseInt(param),
      message: (param) => `En fazla ${param} karakter olabilir`
    });

    // URL validator
    this.validators.set('url', {
      validate: (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Geçerli bir URL giriniz'
    });

    // Number validator
    this.validators.set('number', {
      validate: (value) => !value || !isNaN(value),
      message: 'Geçerli bir sayı giriniz'
    });

    // Checkbox/radio group validator
    this.validators.set('checked', {
      validate: (value, param, field) => {
        if (field.type === 'checkbox' || field.type === 'radio') {
          const form = field.closest('form');
          const group = form.querySelectorAll(`[name="${field.name}"]:checked`);
          return group.length > 0;
        }
        return true;
      },
      message: 'Bu seçenek işaretlenmelidir'
    });
  }

  /**
   * Find and register all forms in the document
   */
  findAndRegisterForms() {
    const forms = document.querySelectorAll('form[data-form-handler]');
    forms.forEach(form => this.registerForm(form));
  }

  /**
   * Register a form for handling
   */
  registerForm(formElement, options = {}) {
    const formId = formElement.id || `form_${Date.now()}`;
    
    if (!formElement.id) {
      formElement.id = formId;
    }

    const formConfig = {
      element: formElement,
      endpoint: formElement.dataset.endpoint || options.endpoint,
      method: formElement.dataset.method || options.method || 'POST',
      validateOnInput: formElement.dataset.validateOnInput !== 'false',
      showProgress: formElement.dataset.showProgress !== 'false',
      resetOnSuccess: formElement.dataset.resetOnSuccess !== 'false',
      customValidators: options.validators || {},
      onSubmit: options.onSubmit,
      onSuccess: options.onSuccess,
      onError: options.onError
    };

    this.forms.set(formId, formConfig);
    this.setupFormUI(formElement);
    
    console.log(`📋 Form registered: ${formId}`);
    return formId;
  }

  /**
   * Set up form UI elements
   */
  setupFormUI(form) {
    // Add form wrapper if not exists
    if (!form.querySelector('.form-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-wrapper';
      
      const originalParent = form.parentNode;
      originalParent.insertBefore(wrapper, form);
      wrapper.appendChild(form);
    }

    // Add progress bar
    if (!form.querySelector('.form-progress')) {
      const progressBar = document.createElement('div');
      progressBar.className = 'form-progress hidden';
      progressBar.innerHTML = `
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-text">Gönderiliyor...</div>
      `;
      form.insertBefore(progressBar, form.firstChild);
    }

    // Add feedback container
    if (!form.querySelector('.form-feedback')) {
      const feedback = document.createElement('div');
      feedback.className = 'form-feedback';
      form.appendChild(feedback);
    }

    // Setup field wrappers and error containers
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => this.setupFieldUI(field));
  }

  /**
   * Set up individual field UI
   */
  setupFieldUI(field) {
    if (field.closest('.field-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'field-wrapper';
    
    const parent = field.parentNode;
    parent.insertBefore(wrapper, field);
    wrapper.appendChild(field);

    // Add error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'field-error hidden';
    wrapper.appendChild(errorContainer);

    // Add character counter for text fields
    if ((field.type === 'text' || field.type === 'textarea') && field.maxLength) {
      const counter = document.createElement('div');
      counter.className = 'field-counter';
      counter.textContent = `0/${field.maxLength}`;
      wrapper.appendChild(counter);
      
      field.addEventListener('input', () => {
        counter.textContent = `${field.value.length}/${field.maxLength}`;
      });
    }
  }

  /**
   * Handle form submission
   */
  async handleFormSubmit(e) {
    if (!e.target.matches('form[data-form-handler]')) return;
    
    e.preventDefault();
    
    const form = e.target;
    const formId = form.id;
    const config = this.forms.get(formId);
    
    if (!config) {
      console.error('Form configuration not found:', formId);
      return;
    }

    try {
      // Show loading state
      this.setFormLoading(form, true);
      
      // Validate form
      const isValid = await this.validateForm(form);
      if (!isValid) {
        this.setFormLoading(form, false);
        this.showFormFeedback(form, 'error', 'Lütfen form hatalarını düzeltin');
        return;
      }

      // Custom submit handler
      if (config.onSubmit) {
        const result = await config.onSubmit(this.getFormData(form), form);
        if (result === false) {
          this.setFormLoading(form, false);
          return;
        }
      }

      // Submit form
      await this.submitForm(form, config);
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.handleFormError(form, config, error);
    }
  }

  /**
   * Submit form to endpoint
   */
  async submitForm(form, config) {
    const formData = this.getFormData(form);
    
    // Simulate progress for better UX
    this.updateProgress(form, 20);
    
    if (!config.endpoint) {
      // Simulate submission if no endpoint
      await this.simulateSubmission(form);
      return;
    }

    try {
      this.updateProgress(form, 50);
      
      const response = await fetch(config.endpoint, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
      });

      this.updateProgress(form, 80);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      this.updateProgress(form, 100);
      this.handleFormSuccess(form, config, result);
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * Simulate form submission for demo purposes
   */
  async simulateSubmission(form) {
    return new Promise((resolve) => {
      let progress = 20;
      const interval = setInterval(() => {
        progress += 20;
        this.updateProgress(form, progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            this.handleFormSuccess(form, this.forms.get(form.id), {
              success: true,
              message: 'Mesajınız başarıyla gönderildi!'
            });
            resolve();
          }, 500);
        }
      }, 200);
    });
  }

  /**
   * Handle successful form submission
   */
  handleFormSuccess(form, config, result) {
    this.setFormLoading(form, false);
    this.showFormFeedback(form, 'success', result.message || 'Form başarıyla gönderildi!');
    
    if (config.resetOnSuccess) {
      form.reset();
      this.clearAllFieldErrors(form);
    }
    
    if (config.onSuccess) {
      config.onSuccess(result, form);
    }

    // Track success
    this.trackFormEvent(form.id, 'submit_success');
  }

  /**
   * Handle form submission error
   */
  handleFormError(form, config, error) {
    this.setFormLoading(form, false);
    this.showFormFeedback(form, 'error', error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    
    if (config.onError) {
      config.onError(error, form);
    }

    // Track error
    this.trackFormEvent(form.id, 'submit_error', error.message);
  }

  /**
   * Validate entire form
   */
  async validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    for (const field of fields) {
      const fieldValid = await this.validateField(field);
      if (!fieldValid) {
        isValid = false;
      }
    }
    
    return isValid;
  }

  /**
   * Validate individual field
   */
  async validateField(field) {
    const errors = [];
    const value = field.value;
    const validationRules = this.getValidationRules(field);
    
    for (const [rule, param] of Object.entries(validationRules)) {
      const validator = this.validators.get(rule);
      if (validator) {
        const isValid = await validator.validate(value, param, field);
        if (!isValid) {
          const message = typeof validator.message === 'function' 
            ? validator.message(param) 
            : validator.message;
          errors.push(message);
        }
      }
    }
    
    // Custom field validators
    const formConfig = this.forms.get(field.closest('form').id);
    if (formConfig && formConfig.customValidators[field.name]) {
      const customValidator = formConfig.customValidators[field.name];
      const result = await customValidator(value, field);
      if (result !== true) {
        errors.push(result);
      }
    }
    
    this.showFieldErrors(field, errors);
    return errors.length === 0;
  }

  /**
   * Get validation rules from field attributes
   */
  getValidationRules(field) {
    const rules = {};
    
    if (field.required) rules.required = true;
    if (field.type === 'email') rules.email = true;
    if (field.type === 'tel') rules.phone = true;
    if (field.type === 'url') rules.url = true;
    if (field.type === 'number') rules.number = true;
    if (field.minLength) rules.minlength = field.minLength;
    if (field.maxLength) rules.maxlength = field.maxLength;
    if (field.type === 'checkbox' || field.type === 'radio') rules.checked = true;
    
    // Custom validation attributes
    if (field.dataset.validate) {
      const customRules = field.dataset.validate.split('|');
      customRules.forEach(rule => {
        const [name, param] = rule.split(':');
        rules[name] = param || true;
      });
    }
    
    return rules;
  }

  /**
   * Handle field input events
   */
  async handleFieldInput(e) {
    const field = e.target;
    if (!field.matches('input, textarea, select')) return;
    
    const form = field.closest('form[data-form-handler]');
    if (!form) return;
    
    const config = this.forms.get(form.id);
    if (config && config.validateOnInput) {
      await this.validateField(field);
    }
  }

  /**
   * Handle field blur events
   */
  async handleFieldBlur(e) {
    const field = e.target;
    if (!field.matches('input, textarea, select')) return;
    
    const form = field.closest('form[data-form-handler]');
    if (form) {
      await this.validateField(field);
    }
  }

  /**
   * Handle field focus events
   */
  handleFieldFocus(e) {
    const field = e.target;
    if (!field.matches('input, textarea, select')) return;
    
    this.clearFieldError(field);
  }

  /**
   * Handle file input changes
   */
  handleFileChange(e) {
    const input = e.target;
    if (input.type !== 'file') return;
    
    this.validateFiles(input);
  }

  /**
   * Handle paste events for file inputs
   */
  handlePaste(e) {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.type === 'file') {
      const items = e.clipboardData.items;
      
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          this.handlePastedFile(activeElement, file);
        }
      }
    }
  }

  /**
   * Validate uploaded files
   */
  validateFiles(input) {
    const files = Array.from(input.files);
    const errors = [];
    
    for (const file of files) {
      // Check file size
      if (file.size > this.config.maxFileSize) {
        errors.push(`${file.name}: Dosya boyutu çok büyük (Max: ${this.formatFileSize(this.config.maxFileSize)})`);
      }
      
      // Check file type
      const extension = file.name.split('.').pop().toLowerCase();
      if (!this.config.allowedFileTypes.includes(extension)) {
        errors.push(`${file.name}: Desteklenmeyen dosya türü`);
      }
    }
    
    this.showFieldErrors(input, errors);
    return errors.length === 0;
  }

  /**
   * Get form data as object
   */
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    return data;
  }

  /**
   * Show field errors
   */
  showFieldErrors(field, errors) {
    const wrapper = field.closest('.field-wrapper');
    const errorContainer = wrapper.querySelector('.field-error');
    
    if (errors.length > 0) {
      field.classList.add('field-invalid');
      field.classList.remove('field-valid');
      errorContainer.innerHTML = errors.map(error => `<div class="error-message">${error}</div>`).join('');
      errorContainer.classList.remove('hidden');
    } else {
      this.clearFieldError(field);
      if (field.value) {
        field.classList.add('field-valid');
      }
    }
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    const wrapper = field.closest('.field-wrapper');
    const errorContainer = wrapper.querySelector('.field-error');
    
    field.classList.remove('field-invalid', 'field-valid');
    errorContainer.classList.add('hidden');
    errorContainer.innerHTML = '';
  }

  /**
   * Clear all field errors in form
   */
  clearAllFieldErrors(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => this.clearFieldError(field));
  }

  /**
   * Show form feedback message
   */
  showFormFeedback(form, type, message) {
    const feedback = form.querySelector('.form-feedback');
    feedback.className = `form-feedback form-feedback-${type}`;
    feedback.innerHTML = `
      <div class="feedback-icon">
        <i class="ri-${type === 'success' ? 'check-line' : 'error-warning-line'}"></i>
      </div>
      <div class="feedback-message">${message}</div>
    `;
    feedback.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      feedback.classList.add('hidden');
    }, 5000);
  }

  /**
   * Set form loading state
   */
  setFormLoading(form, loading) {
    const progress = form.querySelector('.form-progress');
    const submitBtn = form.querySelector('[type="submit"]');
    
    if (loading) {
      form.classList.add('form-loading');
      progress.classList.remove('hidden');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="ri-loader-line animate-spin"></i> Gönderiliyor...';
      }
    } else {
      form.classList.remove('form-loading');
      progress.classList.add('hidden');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || 'Gönder';
      }
    }
  }

  /**
   * Update progress bar
   */
  updateProgress(form, percentage) {
    const progressFill = form.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
  }

  /**
   * Utility functions
   * Note: debounce function moved to utils/debounce.js for better modularity
   */

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Track form events for analytics
   */
  trackFormEvent(formId, action, label = '') {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: 'Form',
        event_label: `${formId}${label ? `: ${label}` : ''}`,
        value: 1
      });
    }
    
    console.log(`📊 Form event tracked: ${action} on ${formId}`);
  }

  /**
   * Add custom validator
   */
  addValidator(name, validator) {
    this.validators.set(name, validator);
  }

  /**
   * Get form configuration
   */
  getFormConfig(formId) {
    return this.forms.get(formId);
  }

  /**
   * Update form configuration
   */
  updateFormConfig(formId, updates) {
    const config = this.forms.get(formId);
    if (config) {
      Object.assign(config, updates);
    }
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