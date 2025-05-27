import { select } from './utils.js';

/**
 * Show error state for input
 */
function showError(input, message) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  formGroup.classList.remove('success');
  formGroup.classList.add('error');
  
  // Remove existing error message
  let existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error styling to input
  input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
  input.classList.remove('border-gray-600', 'focus:border-primary', 'focus:ring-primary/20');
  
  // Create and add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message text-red-400 text-sm mt-2 flex items-center space-x-1';
  errorDiv.innerHTML = `
    <i class="ri-error-warning-line text-xs"></i>
    <span>${message}</span>
  `;
  input.parentElement.appendChild(errorDiv);
}

/**
 * Show success state for input
 */
function showSuccess(input) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  formGroup.classList.remove('error');
  formGroup.classList.add('success');
  
  // Remove existing error message
  let existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add success styling to input
  input.classList.add('border-green-500', 'focus:border-green-500', 'focus:ring-green-500/20');
  input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20', 'border-gray-600', 'focus:border-primary', 'focus:ring-primary/20');
  
  // Add success icon to the input's icon container
  const iconContainer = input.parentElement.querySelector('.absolute');
  if (iconContainer) {
    const icon = iconContainer.querySelector('i');
    if (icon) {
      icon.className = 'ri-check-line text-green-500';
    }
  }
}

/**
 * Reset input to normal state
 */
function resetInputState(input) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  formGroup.classList.remove('error', 'success');
  
  // Remove error message
  let existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Reset input styling
  input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20', 'border-green-500', 'focus:border-green-500', 'focus:ring-green-500/20');
  input.classList.add('border-gray-600', 'focus:border-primary', 'focus:ring-primary/20');
  
  // Reset icon
  const iconContainer = input.parentElement.querySelector('.absolute');
  if (iconContainer) {
    const icon = iconContainer.querySelector('i');
    if (icon && input.id) {
      // Reset to original icon based on input type
      switch (input.id) {
        case 'name':
          icon.className = 'ri-user-line text-gray-500';
          break;
        case 'email':
          icon.className = 'ri-mail-line text-gray-500';
          break;
        case 'subject':
          icon.className = 'ri-price-tag-3-line text-gray-500';
          break;
        case 'message':
          icon.className = 'ri-message-3-line text-gray-500';
          break;
        default:
          icon.className = 'ri-information-line text-gray-500';
      }
    }
  }
}

/**
 * Validate a single input: required and pattern
 */
function validateInput(input) {
  const value = input.value.trim();
  
  // Required check
  if (input.hasAttribute('required') && !value) {
    showError(input, `${formatName(input)} is required`);
    return false;
  }
  
  // Pattern check if pattern attribute is set
  const pattern = input.getAttribute('pattern');
  if (pattern && value) {
    const regex = new RegExp(pattern);
    if (!regex.test(value)) {
      showError(input, `${formatName(input)} format is invalid`);
      return false;
    }
  }
  
  // Email validation
  if (input.type === 'email' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      showError(input, 'Please enter a valid email address');
      return false;
    }
  }
  
  // Length validation for message
  if (input.id === 'message' && value && value.length < 10) {
    showError(input, 'Message should be at least 10 characters');
    return false;
  }
  
  // If we get here, input is valid
  if (value) {
    showSuccess(input);
  } else {
    resetInputState(input);
  }
  return true;
}

/**
 * Format field name for messages
 */
function formatName(input) {
  return input.getAttribute('data-name') ||
    input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Anti-spam: track last submission time to prevent rapid resubmissions
let lastSubmissionTime = 0;

/**
 * Show form feedback message
 */
function showFormMessage(form, message, type = 'success') {
  // Remove existing messages
  const existingMessages = form.parentElement.querySelectorAll('.form-message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message p-4 rounded-xl mb-6 flex items-center space-x-3 ${
    type === 'success' 
      ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
      : type === 'error' 
      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
      : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
  }`;
  
  const icon = type === 'success' ? 'ri-check-circle-line' : 
               type === 'error' ? 'ri-error-warning-line' : 
               'ri-information-line';
  
  messageDiv.innerHTML = `
    <i class="${icon}"></i>
    <span>${message}</span>
  `;
  
  form.insertAdjacentElement('beforebegin', messageDiv);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
  
  // Scroll to message
  messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Initialize form validation on the given selector
 */
export function initFormValidation(formSelector) {
  const form = select(formSelector);
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');
  
  // Add real-time validation on blur
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        validateInput(input);
      }
    });
    
    input.addEventListener('input', () => {
      // Clear error state when user starts typing
      if (input.closest('.form-group').classList.contains('error')) {
        resetInputState(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Anti-spam: prevent multiple submissions within 10 seconds
    const now = Date.now();
    if (now - lastSubmissionTime < 10000) {
      showFormMessage(form, 'Please wait 10 seconds before sending another message.', 'warning');
      return;
    }
    lastSubmissionTime = now;

    let isFormValid = true;
    
    // Validate all inputs
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      console.log('Form successfully validated.');
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="flex items-center justify-center space-x-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Sending...</span>
        </span>
      `;
      submitBtn.disabled = true;
      
      // Simulate form submission (replace with actual submission logic)
      setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        
        showFormMessage(form, 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
        form.reset();
        
        // Reset all input states
        inputs.forEach(input => {
          resetInputState(input);
        });
      }, 2000);
    } else {
      showFormMessage(form, 'Please fix the errors below and try again.', 'error');
      
      // Focus on first error field
      const firstError = form.querySelector('.error input, .error textarea');
      if (firstError) {
        firstError.focus();
      }
    }
  });
} 
