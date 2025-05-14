import { select } from './utils.js';

/**
 * Show error state for input
 */
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.classList.remove('success');
  formControl.classList.add('error');
  let msgElem = formControl.querySelector('small');
  if (!msgElem) {
    msgElem = document.createElement('small');
    formControl.appendChild(msgElem);
  }
  msgElem.innerText = message;
}

/**
 * Show success state for input
 */
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.classList.remove('error');
  formControl.classList.add('success');
  const msgElem = formControl.querySelector('small');
  if (msgElem) msgElem.innerText = '';
}

/**
 * Validate a single input: required and pattern
 */
function validateInput(input) {
  const value = input.value.trim();
  // Required check
  if (!value) {
    showError(input, `${formatName(input)} boş bırakılamaz`);
    return false;
  }
  // Pattern check if pattern attribute is set
  const pattern = input.getAttribute('pattern');
  if (pattern) {
    const regex = new RegExp(pattern);
    if (!regex.test(value)) {
      showError(input, `${formatName(input)} geçerli formatta olmalıdır`);
      return false;
    }
  }
  showSuccess(input);
  return true;
}

/**
 * Format field name for messages
 */
function formatName(input) {
  return input.getAttribute('data-name') ||
    input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

/**
 * Initialize form validation on the given selector
 */
export function initFormValidation(formSelector) {
  const form = select(formSelector);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateInput(input)) isFormValid = false;
    });
    if (isFormValid) {
      // Optionally submit or show overall success feedback
      console.log('Form başarıyla doğrulandı.');
      form.reset();
    }
  });
} 