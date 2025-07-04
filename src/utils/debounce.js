/**
 * Debounce Utility
 * 
 * A debounce function delays invoking a function until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 * 
 * This is useful for scenarios like:
 * - Search input fields (wait for user to stop typing)
 * - Window resize events
 * - API calls that shouldn't be made too frequently
 * - Form validation
 * 
 * @author Portfolio Project
 * @version 1.0.0
 */

/**
 * Creates a debounced function that delays invoking func until after wait 
 * milliseconds have elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the 
 *                                     leading edge, instead of the trailing
 * 
 * @returns {Function} Returns the new debounced function
 * 
 * @example
 * // Debounce a search function to wait 300ms after user stops typing
 * const debouncedSearch = debounce(searchFunction, 300);
 * searchInput.addEventListener('input', debouncedSearch);
 * 
 * @example
 * // Immediate debounce - executes immediately, then waits
 * const immediateDebounce = debounce(clickHandler, 1000, true);
 * button.addEventListener('click', immediateDebounce);
 */
export function debounce(func, wait, immediate = false) {
  // Validate inputs
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  if (typeof wait !== 'number' || wait < 0) {
    throw new TypeError('Expected wait to be a positive number');
  }
  
  let timeout;
  
  return function executedFunction(...args) {
    // Store the context for proper `this` binding
    const context = this;
    
    // Function to execute after the delay
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    
    // Determine if we should call the function immediately
    const callNow = immediate && !timeout;
    
    // Clear the previous timeout
    clearTimeout(timeout);
    
    // Set the new timeout
    timeout = setTimeout(later, wait);
    
    // If immediate is true and this is the first call, execute immediately
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * Creates a simplified debounced function without immediate option.
 * Useful for most common use cases where you just want to delay execution.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} Returns the new debounced function
 * 
 * @example
 * // Simple debounce for form validation
 * const debouncedValidation = simpleDebounce(validateField, 250);
 * input.addEventListener('input', debouncedValidation);
 */
export function simpleDebounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Cancel a debounced function's pending execution
 * 
 * @param {Function} debouncedFunc - The debounced function to cancel
 * 
 * @example
 * const debouncedFn = debounce(myFunction, 1000);
 * debouncedFn(); // Will execute after 1000ms
 * cancelDebounce(debouncedFn); // Cancels the pending execution
 */
export function cancelDebounce(debouncedFunc) {
  if (debouncedFunc && typeof debouncedFunc.cancel === 'function') {
    debouncedFunc.cancel();
  }
}

/**
 * Enhanced debounce with additional features:
 * - Cancel method
 * - Flush method (execute immediately)
 * - Pending check
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.immediate=false] - Execute on leading edge
 * @param {number} [options.maxWait] - Maximum time func can be delayed
 * @returns {Function} Enhanced debounced function with additional methods
 * 
 * @example
 * const enhanced = enhancedDebounce(saveData, 1000, { maxWait: 5000 });
 * enhanced(); // Normal debounced execution
 * enhanced.flush(); // Execute immediately
 * enhanced.cancel(); // Cancel pending execution
 * console.log(enhanced.pending()); // Check if execution is pending
 */
export function enhancedDebounce(func, wait, options = {}) {
  let timeout;
  let maxTimeoutId;
  let lastCallTime;
  let lastInvokeTime = 0;
  
  const { immediate = false, maxWait } = options;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    return func.apply(thisArg, args);
  }
  
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }
  
  function trailingEdge(time) {
    timeout = undefined;
    
    if (lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  
  function cancel() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
    }
    
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeout = maxTimeoutId = undefined;
  }
  
  function flush() {
    return timeout === undefined ? result : trailingEdge(Date.now());
  }
  
  function pending() {
    return timeout !== undefined;
  }
  
  let lastArgs, lastThis, result;
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait) {
        timeout = setTimeout(trailingEdge, wait, lastCallTime);
        return invokeFunc(lastCallTime);
      }
    }
    
    if (timeout === undefined) {
      timeout = setTimeout(trailingEdge, wait, lastCallTime);
    }
    
    return result;
  }
  
  function leadingEdge(time) {
    lastInvokeTime = time;
    timeout = setTimeout(trailingEdge, wait, time);
    
    if (maxWait) {
      maxTimeoutId = setTimeout(trailingEdge, maxWait, time);
    }
    
    return immediate ? invokeFunc(time) : result;
  }
  
  // Attach utility methods
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  
  return debounced;
}

// Default export for convenience
export default debounce; 