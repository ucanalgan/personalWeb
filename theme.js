// Theme Control
const themeConfig = {
  storageKey: 'theme-preference',
  defaultTheme: 'dark' // default theme
};

// Get user theme preference
export function getThemePreference() {
  // Get theme preference from local storage
  const userPreference = localStorage.getItem(themeConfig.storageKey);
  if (userPreference) {
    return userPreference;
  }
  
  // Check system preference
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return systemPreference;
}

// Apply theme
export function applyTheme(theme) {
  // Apply to html element for Tailwind dark mode
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
  
  // Apply to body for custom styling
  document.body.classList.remove('dark', 'light');
  document.body.classList.add(theme);
  
<<<<<<< Updated upstream
  // Add specific CSS variables and background colors
  if (theme === 'dark') {
    document.documentElement.style.setProperty('--bg-color', '#0a192f');
    document.documentElement.style.setProperty('--text-color', '#e6f1ff');
    document.body.style.backgroundColor = '#0a192f';
    document.body.style.color = '#e6f1ff';
  } else {
    document.documentElement.style.setProperty('--bg-color', '#f8f9fa');
    document.documentElement.style.setProperty('--text-color', '#0a192f');
    document.body.style.backgroundColor = '#f8f9fa';
    document.body.style.color = '#0a192f';
=======
  // Update theme colors
  if (theme === 'dark') {
    document.documentElement.style.setProperty('--bg-color', '#0a192f');
    document.documentElement.style.setProperty('--text-color', '#e6f1ff');
  } else {
    document.documentElement.style.setProperty('--bg-color', '#f8f9fa');
    document.documentElement.style.setProperty('--text-color', '#0a192f');
>>>>>>> Stashed changes
  }
  
  // Save theme preference
  localStorage.setItem(themeConfig.storageKey, theme);
  
  // Update theme toggle button
  updateThemeToggle(theme);
}

// Update theme toggle button
function updateThemeToggle(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  
  if (theme === 'dark') {
    // If dark, show sun icon (to switch to light)
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
      themeToggle.setAttribute('title', 'Switch to Light Mode');
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.innerHTML = '<i class="ri-sun-line text-xl"></i>';
      mobileThemeToggle.setAttribute('title', 'Switch to Light Mode');
    }
  } else {
    // If light, show moon icon (to switch to dark)
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
      themeToggle.setAttribute('title', 'Switch to Dark Mode');
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.innerHTML = '<i class="ri-moon-line text-xl"></i>';
      mobileThemeToggle.setAttribute('title', 'Switch to Dark Mode');
    }
  }
}

// Toggle theme
export function toggleTheme() {
  const currentTheme = getThemePreference();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  return newTheme;
}

// Initialize theme toggle
export function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  
<<<<<<< Updated upstream
=======
  // Apply current theme
  const currentTheme = getThemePreference();
  applyTheme(currentTheme);
  
>>>>>>> Stashed changes
  // Add click event for desktop toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      toggleTheme();
    });
  }
  
  // Add click event for mobile toggle
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      toggleTheme();
    });
  }
}

// Initialize theme on page load
export function initTheme() {
<<<<<<< Updated upstream
  // Force dark theme to start for better user experience
  applyTheme('dark');
  
  // Then check user preference
  const currentTheme = getThemePreference();
  if (currentTheme !== 'dark') {
    setTimeout(() => applyTheme(currentTheme), 100);
  }
  
  // Initialize theme toggle
=======
  const currentTheme = getThemePreference();
  applyTheme(currentTheme);
  
  // Initialize theme toggle on DOM ready
>>>>>>> Stashed changes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
} 