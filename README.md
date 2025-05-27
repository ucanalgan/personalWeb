# 🚀 Personal Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ucanalgan/personalWeb?style=social)](https://github.com/ucanalgan/personalWeb/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ucanalgan/personalWeb?style=social)](https://github.com/ucanalgan/personalWeb/network/members)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12+-88CE02?logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🌟 About Project

This project is a modern, fully responsive, and performance-focused personal portfolio website developed using cutting-edge web technologies. It provides a professional platform showcasing Umutcan Algan's software development journey, projects, and skills. Features modular JavaScript architecture, advanced animations, and real-time GitHub integration that makes it stand out.

## ✨ Key Features

### 🎨 **Modern & Responsive Design**
- **Dark Theme Focused**: Developer-friendly dark theme (#0a192f background, #64ffda accent color)
- **Mobile First**: Perfect appearance on all devices (phone, tablet, desktop)
- **Gradient Effects**: Visual richness with modern CSS gradients
- **Custom Font Integration**: Plus Jakarta Sans & Space Grotesk font families
- **Responsive Navigation**: Hamburger menu for mobile devices with smooth transitions

### ⚡ **Performance & Optimization**
- **Vite Build Tool**: Fast development and optimized production build
- **Terser Minification**: Console log removal and code optimization
- **Critical CSS**: Critical CSS extraction for faster initial loading
- **Lazy Loading**: Deferred loading of heavy components
- **ES2015 Target**: Modern browser compatibility
- **Bundle Splitting**: Modular code structure and optimized chunking

### 🎭 **Advanced Animations**
- **GSAP Integration**: Professional-grade animations with ScrollTrigger
- **Accessibility Respect**: Prefers-reduced-motion support
- **Staggered Animations**: Sequential component animations
- **Hero Animations**: Scale, opacity and transform effects
- **Scroll-triggered Animations**: Animations triggered by page scrolling
- **Custom Keyframes**: Float and pulse-slow animations

### 🔧 **GitHub Integration**
- **Live Project List**: Automatic repository fetching via GitHub API
- **Activity Timeline**: Display of recent GitHub activities
- **Repository Statistics**: Dynamic display of star and fork counts
- **Real-time Updates**: Fetching current GitHub data
- **Error Handling**: Fallback systems for API limits and error states

### 📧 **Advanced Form Management**
- **Real-time Validation**: Instant form validation system
- **Visual Feedback**: Visual feedback for error and success states
- **Anti-spam Protection**: Prevention of rapid form submissions
- **Email Pattern Validation**: Advanced email format validation
- **Character Length Validation**: Message length validation
- **Dynamic Error Messages**: User-friendly error messages

### 🌙 **Theme Management**
- **Dark Mode Default**: Default dark theme
- **LocalStorage Persistence**: Saving theme preferences
- **CSS Custom Properties**: Dynamic color variables
- **Smooth Transitions**: Smooth transitions during theme changes
- **Multi-platform Support**: Desktop and mobile theme toggles

### 📱 **User Experience**
- **Smooth Scrolling**: Fluid page transitions
- **Progress Indicators**: Page scroll progress indicators
- **Accessibility**: ARIA labels and semantic HTML structure
- **Mobile Menu**: Advanced hamburger menu system
- **Interactive Elements**: Hover effects and micro-interactions

## 🛠️ Technology Stack

### **Frontend Core Technologies**
- **HTML5**: Semantic structure and SEO optimization
- **CSS3**: Modern CSS features, Flexbox/Grid, Custom Properties
- **JavaScript ES6+**: Modern JS features, ES Modules, Async/Await
- **Tailwind CSS**: Utility-first CSS framework with custom configuration

### **Build Tools & Development**
```javascript
// Vite Configuration Highlights
{
  base: '/personalWeb/',
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: { compress: { drop_console: true } },
    rollupOptions: { input: { main: 'index.html' } }
  }
}
```

- **Vite**: Next-generation frontend build tool
- **PostCSS**: CSS transformation and optimization
- **Autoprefixer**: Cross-browser CSS compatibility
- **Terser**: JavaScript minification and optimization

### **Animation & Interaction Libraries**
- **GSAP (GreenSock)**: Professional-grade animations
  - ScrollTrigger plugin for scroll-based animations
  - Power easing functions
  - Stagger animations
- **Custom CSS Animations**: Float and pulse effects
- **CSS Transitions**: Smooth hover and state transitions

### **External Services & APIs**
- **GitHub API**: Repository and activity data fetching
- **Remix Icons**: Modern icon library (3.5.0)
- **Google Fonts**: Plus Jakarta Sans & Space Grotesk
- **GitHub Pages**: Static site hosting

## 📂 Detailed Project Structure

```
personalWeb/
├── 📄 index.html              # Main HTML file (1534 lines)
│                              # - Semantic HTML5 structure
│                              # - Meta tags and SEO optimization
│                              # - Responsive design elements
│
├── 🎨 CSS Files
│   ├── style.css              # Tailwind CSS styles (743 lines)
│   ├── input.css              # Tailwind input file (9 lines)
│   └── tailwind.config.js     # Tailwind configuration (34 lines)
│
├── ⚡ JavaScript Modules
│   ├── main.js                # Main JavaScript entry point (304 lines)
│   ├── app.js                 # Application logic and init (630 lines)
│   ├── animations.js          # GSAP animation system (168 lines)
│   ├── github.js              # GitHub API integration (516 lines)
│   ├── form-handler.js        # Form validation system (283 lines)
│   ├── theme.js               # Theme management (115 lines)
│   ├── dom.js                 # DOM manipulation utilities (233 lines)
│   └── utils.js               # Utility functions (56 lines)
│
├── 🔧 Configuration Files
│   ├── vite.config.js         # Vite build configuration (24 lines)
│   ├── postcss.config.js      # PostCSS configuration (7 lines)
│   ├── package.json           # Project dependencies (33 lines)
│   └── package-lock.json      # Dependency lock file (6709 lines)
│
├── 📊 Template & Build Files
│   ├── github-section.html    # GitHub section template (37 lines)
│   ├── dist/                  # Production build directory
│   └── assets/                # Built assets
│
├── 📋 Project Documentation
│   ├── README.md              # This documentation file
│   ├── LICENSE                # MIT license file (21 lines)
│   └── .gitignore            # Git ignore rules (26 lines)
│
└── 🔒 Version Control
    └── .git/                  # Git repository metadata
```

## 🎨 Detailed Color System

### **Primary Color Palette**

| Color Name | Hex Code | RGB Value | Usage Area | CSS Class |
|------------|----------|-----------|------------|-----------|
| **Primary Cyan** | `#64ffda` | `rgb(100, 255, 218)` | Accent color, links, buttons | `text-primary`, `bg-primary` |
| **Dark Background** | `#0a192f` | `rgb(10, 25, 47)` | Main background color | `bg-dark`, `bg-secondary` |
| **Card Background** | `#112240` | `rgb(17, 34, 64)` | Card and section backgrounds | `bg-gray-900` |
| **Secondary Dark** | `#233554` | `rgb(35, 53, 84)` | Secondary background colors | - |
| **Text Light** | `#ccd6f6` | `rgb(204, 214, 246)` | Main text color | `text-gray-300` |
| **Text Muted** | `#8892b0` | `rgb(136, 146, 176)` | Secondary text color | `text-gray-500` |

### **Tailwind Configuration**

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#64ffda',
        secondary: '#0a192f',
        dark: '#0a192f',
        light: '#f8f9fa'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  }
}
```

## 🚀 Installation & Setup

### **System Requirements**
- **Node.js**: v14.0+ (recommended: v16+)
- **npm**: v6.0+ or **yarn**: v1.22+
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Git**: For version control

### **Detailed Installation Steps**

```bash
# 1. Clone the repository
git clone https://github.com/ucanalgan/personalWeb.git

# 2. Navigate to project directory
cd personalWeb

# 3. Check Node.js version
node --version  # Should be v14.0+

# 4. Install dependencies
npm install
# or
yarn install

# 5. Start development server
npm run dev
# or
yarn dev

# 6. Open in browser
# http://localhost:3000 (opens automatically)
```

### **Available Scripts**

```bash
# Development server (with hot reload)
npm run dev

# Production build (optimized)
npm run build

# Build preview (test production build)
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

### **Build Process Details**

During production build, the following occurs:
- ✅ JavaScript transpiled to ES2015 format
- ✅ Terser minification and console.log removal
- ✅ CSS purging and optimization
- ✅ Asset optimization and chunking
- ✅ HTML minification
- ✅ Source map generation

## 🔧 Detailed Configuration

### **GitHub Integration Setup**

```javascript
// Change GitHub username in app.js
const githubUsername = 'your-github-username';

// API settings in github.js
const GITHUB_API_BASE = 'https://api.github.com';
const REPOS_PER_PAGE = 6;
const ACTIVITIES_LIMIT = 5;
```

### **Animation Settings**

```javascript
// Animation configuration in animations.js
const animationConfig = {
  heroAnimations: {
    duration: 1,
    ease: 'power3.out',
    stagger: 0.3
  },
  scrollAnimations: {
    trigger: 'top 85%',
    duration: 0.6,
    ease: 'power2.out'
  }
};
```

### **Theme Configuration**

```javascript
// Theme settings in theme.js
const themeConfig = {
  storageKey: 'theme-preference',
  defaultTheme: 'dark',
  transitions: {
    duration: '500ms',
    easing: 'ease-in-out'
  }
};
```

### **Form Validation Rules**

```javascript
// Validation rules in form-handler.js
const validationRules = {
  name: { required: true, minLength: 2 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  subject: { required: true, minLength: 5 },
  message: { required: true, minLength: 10 }
};
```

## 📊 Performance Optimizations

### **Code Splitting & Bundling**
- **ES Modules**: Modular JavaScript structure
- **Dynamic Imports**: Module loading on demand
- **Rollup Optimization**: Tree shaking and dead code elimination
- **Asset Chunking**: Optimized splitting of CSS and JS files

### **Loading Optimizations**
- **Critical CSS**: Inline critical styles for initial page load
- **Font Preloading**: Optimized Google Fonts loading
- **Image Optimization**: Responsive images and lazy loading
- **Resource Hints**: Preload, preconnect directives

### **Runtime Performance**
- **GSAP Optimization**: Loading only necessary plugins
- **Event Debouncing**: Optimized scroll and resize events
- **Memory Management**: Proper cleanup of event listeners
- **Reduced Motion Support**: Animation control for accessibility

## 🌐 Deployment & Hosting

### **GitHub Pages Deployment**

```bash
# Automatic deployment
npm run build
npm run deploy

# Manual deployment
npm run build
npx gh-pages -d dist
```

### **Build Verification**

Post-production build checklist:
- ✅ All assets are in correct paths
- ✅ CSS and JS minification successful
- ✅ GitHub API functionality working
- ✅ Form validation active
- ✅ Responsive design preserved

## 🧪 Testing & Debug

### **Browser Compatibility Testing**
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅
- **Mobile Safari**: iOS 14+ ✅
- **Chrome Mobile**: Android 10+ ✅

### **Performance Metrics**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🤝 Contributing

### **Development Workflow**

1. **Fork & Clone**
   ```bash
   git fork https://github.com/ucanalgan/personalWeb.git
   git clone https://github.com/your-username/personalWeb.git
   ```

2. **Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Development**
   ```bash
   npm run dev  # Development server
   # Make your code changes
   ```

4. **Testing**
   ```bash
   npm run build  # Production build test
   npm run preview  # Build preview
   ```

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Pull Request**
   - Create PR with detailed description
   - Add screenshots
   - Wait for review

### **Code Style Guidelines**
- **JavaScript**: ES6+ standards
- **CSS**: Tailwind utility classes
- **HTML**: Semantic HTML5
- **Comments**: English descriptions

## 🐛 Known Issues & Solutions

### **Common Issues**

1. **GitHub API Rate Limit**
   - **Issue**: Hitting API limits
   - **Solution**: Use personal access token

2. **Animation Performance**
   - **Issue**: Slowdown on low-performance devices
   - **Solution**: Prefers-reduced-motion support active

3. **Font Loading**
   - **Issue**: Font loading delay
   - **Solution**: Font preloading and fallback fonts

## 📄 License

This project is licensed under the **MIT License**. This means you can:
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Use privately
- ✅ Sub-license

See the [LICENSE](LICENSE) file for more details.

## 📧 Contact & Support

### **Developer Contact**
**Umutcan Algan** - Full Stack Developer
- 🐙 **GitHub**: [@ucanalgan](https://github.com/ucanalgan)
- 💼 **LinkedIn**: [Umutcan Algan](https://linkedin.com/in/umutcan-algan/)
- 🌐 **Portfolio**: [ucanalgan.github.io/personalWeb](https://ucanalgan.github.io/personalWeb/)
- 📧 **Email**: umutcanalgan91@gmail.com

### **Project Links**
- 🔗 **Repository**: [github.com/ucanalgan/personalWeb](https://github.com/ucanalgan/personalWeb)
- 🌐 **Live Demo**: [ucanalgan.github.io/personalWeb](https://ucanalgan.github.io/personalWeb/)
- 📋 **Issues**: [github.com/ucanalgan/personalWeb/issues](https://github.com/ucanalgan/personalWeb/issues)

### **Support**
- 🐛 **Bug Reports**: Use GitHub Issues
- 💡 **Feature Requests**: GitHub Discussions
- ❓ **Questions**: GitHub Discussions or email

---

<div align="center">

⭐ **If you like this project, please give it a star!** ⭐

Made with ❤️ by [Umutcan Algan](https://github.com/ucanalgan)

</div>