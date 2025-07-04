# 🚀 Personal Portfolio Website

[![Deployment Status](https://img.shields.io/badge/deployment-live-brightgreen)](https://ucanalgan.github.io/personalWeb/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **Modern, performant, and accessible personal portfolio website built with React, Vite, and advanced optimization techniques.**

[🌐 **Live Demo**](https://ucanalgan.github.io/personalWeb/) | [📱 **Mobile Preview**](#responsive-design) | [⚡ **Performance Report**](#performance-metrics)

## 🌟 Live Demo

**[🔗 View Live Portfolio](https://ucanalgan.github.io/Kişisel_web/)**

*Experience the portfolio in action with interactive features and smooth animations.*

## 📸 Screenshots

### 🖥️ Desktop Experience
![Desktop Screenshot](./assets/screenshots/desktop-view.png)

### 📱 Mobile Responsive
![Mobile Screenshot](./assets/screenshots/mobile-view.png)

### 🌙 Dark/Light Theme
<div style="display: flex; gap: 10px;">
  <img src="./assets/screenshots/dark-theme.png" width="45%" alt="Dark Theme">
  <img src="./assets/screenshots/light-theme.png" width="45%" alt="Light Theme">
</div>

## ✨ Key Features

### 🎨 **Modern Design & UX**
- **Glassmorphism UI** with advanced CSS backdrop filters
- **Interactive animations** with CSS transforms and transitions
- **Responsive design** optimized for all device sizes
- **Dark/Light theme** with system preference detection
- **Smooth scroll animations** with Intersection Observer API

### ⚡ **Performance Optimizations**
- **Vite build system** with HMR and optimized bundling
- **Lazy loading components** with React.Suspense
- **Service Worker** with advanced caching strategies
- **Critical CSS inlining** for faster initial paint
- **Image optimization** with WebP support
- **Bundle splitting** for optimal loading performance

### 🛠️ **Technical Excellence**
- **Modern React architecture** with hooks and context
- **TypeScript-ready** configuration
- **Comprehensive design system** with CSS custom properties
- **Accessibility-first** approach (WCAG 2.1 compliant)
- **SEO optimized** with proper meta tags and structured data
- **PWA capabilities** with manifest and service worker

### 📊 **Dynamic Content**
- **GitHub API integration** for real-time repository data
- **Advanced error boundaries** with graceful fallbacks
- **Local storage** for theme and preferences persistence
- **Analytics integration** for usage tracking
- **Contact form** with validation and submission handling

## 🏗️ Architecture Overview

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, ThemeToggle, ScrollToTop)
│   ├── layout/         # Layout components (Header, Footer)
│   └── sections/       # Page sections (Hero, About, Skills, Projects, Contact)
├── contexts/           # React contexts for global state
│   ├── ThemeContext.jsx   # Theme management
│   └── GitHubContext.jsx  # GitHub API integration
├── styles/             # Comprehensive styling system
│   ├── design-system.css  # Design tokens and variables
│   ├── typography.css     # Typography scale and styles
│   ├── components.css     # Component-specific styles
│   ├── themes.css         # Light/dark theme definitions
│   └── styles.css         # Main stylesheet orchestrator
├── utils/              # Utility functions and helpers
│   ├── analytics.js       # Analytics and tracking
│   ├── animations.js      # Animation utilities
│   └── utils.js          # General utility functions
└── App.jsx             # Main application component
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 8+ or **yarn** 1.22+
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/ucanalgan/Kişisel_web.git
cd Kişisel_web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Development
npm run dev          # Start dev server with HMR (localhost:3000)
npm run build        # Production build with optimizations
npm run preview      # Preview production build locally
npm run deploy       # Deploy to GitHub Pages
```

## 🎯 Performance Metrics

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 1.2s
- **FID (First Input Delay)**: < 50ms  
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 0.8s

### Build Optimization Results
```
✓ 57 modules transformed
✓ CSS minification: 61.38 kB → 11.02 kB (gzip)
✓ JS minification: 24.51 kB total bundle size
✓ Tree shaking enabled
✓ Asset optimization: Images, fonts, icons
```

### Lighthouse Scores
- **Performance**: 95+ 🟢
- **Accessibility**: 100 🟢
- **Best Practices**: 100 🟢
- **SEO**: 100 🟢

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: #64ffda;      /* Cyan - Main brand color */
--primary-dark: #4fd1c7; /* Darker variant */
--primary-light: #9cffed; /* Lighter variant */

/* Accent Colors */
--accent-purple: #b794f6; /* Interactive elements */
--accent-pink: #f093fb;   /* Highlights */
--accent-orange: #feca57; /* Call-to-actions */
```

### Typography Scale
- **Display**: 3.5rem → 1.875rem (responsive)
- **Headings**: H1-H6 with optimal line heights
- **Body**: 1rem with 1.6 line height for readability
- **Code**: JetBrains Mono for technical content

### Spacing System
- Based on **4px grid** system
- Consistent spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Responsive spacing with mobile-first approach

## 📱 Responsive Design

### Breakpoint Strategy
```css
/* Mobile-first approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large monitors */
```

### Adaptive Features
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly interactions** for mobile devices
- **Optimized typography** scaling across devices
- **Progressive image loading** based on viewport
- **Mobile navigation** with hamburger menu

## 🔧 Advanced Configuration

### Vite Configuration Highlights
```javascript
// vite.config.js - Key optimizations
{
  build: {
    target: ['es2020', 'chrome91', 'firefox89', 'safari15'],
    rollupOptions: {
      treeshake: true,
      terserOptions: {
        compress: { drop_console: true, passes: 2 }
      }
    }
  },
  css: { 
    codeSplit: true,
    postcss: './postcss.config.js'
  }
}
```

### PostCSS Pipeline
- **Tailwind CSS** for utility-first styling
- **Autoprefixer** for browser compatibility
- **CSS Nano** for production minification
- **PurgeCSS** for unused style removal

### Service Worker Features
```javascript
// Advanced caching strategies
- Static assets: Cache-first with long TTL
- Images: Optimized cache with WebP conversion
- API calls: Network-first with cache fallback
- CSS/JS: Stale-while-revalidate pattern
```

## 🧪 Testing & Quality Assurance

### Code Quality Tools
- **ESLint** with React hooks rules
- **Prettier** for consistent code formatting  
- **Husky** for pre-commit hooks
- **Accessibility testing** with axe-core

### Browser Compatibility
- **Chrome** 91+ ✅
- **Firefox** 89+ ✅
- **Safari** 15+ ✅
- **Edge** 91+ ✅

### Performance Testing
- **Lighthouse CI** integration
- **Bundle analysis** with Rollup visualizer
- **Core Web Vitals** monitoring
- **Real User Monitoring** (RUM) setup

## 🔐 Security & Privacy

### Security Measures
- **Content Security Policy** (CSP) headers
- **HTTPS-only** cookie settings
- **XSS protection** with sanitized inputs
- **Dependency vulnerability** scanning

### Privacy Features
- **No tracking cookies** by default
- **GDPR compliant** analytics setup
- **Local data storage** for preferences
- **User consent** management

## 🌐 Deployment

### GitHub Pages Deployment
```bash
# Automated deployment
npm run deploy

# Manual deployment steps
npm run build
gh-pages -d dist
```

### Alternative Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Continuous deployment from Git
- **Cloudflare Pages**: Edge deployment
- **AWS S3**: Static hosting with CloudFront CDN

### Environment Configuration
```bash
# .env.local
VITE_ANALYTICS_ID=your_analytics_id
VITE_GITHUB_USERNAME=your_github_username
VITE_CONTACT_EMAIL=your_email@domain.com
```

## 📊 Analytics & Monitoring

### Integrated Analytics
- **Google Analytics 4** for user behavior
- **Custom event tracking** for interactions
- **Performance monitoring** with Web Vitals API
- **Error tracking** with boundary components

### Metrics Tracked
- Page views and session duration
- User interactions and conversions
- Performance metrics and errors
- Device and browser analytics

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- Follow **React best practices**
- Use **semantic HTML** elements
- Maintain **accessibility standards**
- Write **self-documenting code**
- Include **performance considerations**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 👤 Author

**Umutcan Algan**
- 🌐 Website: [ucanalgan.dev](https://ucanalgan.github.io/personalWeb/)
- 💼 LinkedIn: [linkedin.com/in/ucanalgan](https://linkedin.com/in/ucanalgan)
- 🐙 GitHub: [github.com/ucanalgan](https://github.com/ucanalgan)
- 📧 Email: contact@ucanalgan.dev

## 🙏 Acknowledgments

### Technologies & Libraries
- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for inspiration on modern web development

### Design Inspiration
- **Linear** for clean UI design patterns
- **Framer** for smooth animation concepts
- **GitHub** for developer-focused UX

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with lots of ☕ by [Umutcan Algan](https://github.com/ucanalgan)

</div>