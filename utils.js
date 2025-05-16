export const config = {
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  scroll: {
    threshold: 100,
    smooth: true,
  },
  mobile: {
    breakpoint: 768,
  }
};

// DOM Helpers
export function select(selector) { return document.querySelector(selector); }
export function selectAll(selector) { return document.querySelectorAll(selector); }

// Class Helpers
export function addClass(element, className) { element?.classList.add(className); }
export function removeClass(element, className) { element?.classList.remove(className); }
export function toggleClass(element, className, force) { element?.classList.toggle(className, force); }
export function hasClass(element, className) { return element?.classList.contains(className); }

// Scroll Helpers
export function scrollTo(element, options = {}) {
  const defaults = {
    behavior: config.scroll.smooth ? 'smooth' : 'auto',
    block: 'start',
  };
  element?.scrollIntoView({ ...defaults, ...options });
}

export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  return (
    rect.top <= windowHeight &&
    rect.bottom >= 0 &&
    rect.left <= windowWidth &&
    rect.right >= 0
  );
}

// Throttle
export function throttle(callback, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return callback(...args);
  };
} 
