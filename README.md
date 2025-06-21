# 🚀 Umutcan Algan - Professional Portfolio

A modern, responsive portfolio website showcasing full-stack development skills, built with cutting-edge web technologies and optimized for performance, accessibility, and SEO.

![Portfolio Screenshot](./assets/images/portfolio-screenshot.png)

## ✨ Features

### 🎨 **Modern Design**
- **Dark/Light Theme** with system preference detection
- **Glassmorphism UI** with backdrop blur effects
- **Responsive Design** optimized for all devices
- **Smooth Animations** with reduced motion support
- **Custom Color System** with CSS variables

### ⚡ **Performance Optimized**
- **Lighthouse Score**: 98+ Performance, 100% Accessibility, 100% SEO
- **Core Web Vitals** optimized
- **Lazy Loading** for images and components
- **Critical CSS** inlined for faster rendering
- **Optimized Assets** with modern compression

### 🔧 **Technical Features**
- **Modular Component Architecture**
- **ES6 Modules** with fallback support
- **TypeScript Ready** structure
- **PWA Support** with service worker
- **SEO Optimized** with structured data
- **Accessibility First** (WCAG 2.1 AA compliant)

### 🎯 **Interactive Sections**
- **Hero Section** with typing animation
- **About Section** with GitHub integration
- **Skills Section** with animated progress bars
- **Projects Section** with live GitHub data
- **Contact Form** with validation and email integration

## 🛠️ Tech Stack

### **Frontend**
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### **Build Tools**
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)

### **Deployment**
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ucanalgan/Kisisel_web.git

# Navigate to project directory
cd Kisisel_web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
Kişisel_web/
├── 📄 index.html              # Main HTML entry point
├── 📄 app.js                  # Main application entry
├── 📄 main.js                 # Component orchestrator
├── 🗂️ components/             # Reusable HTML components
│   ├── common/                # Common UI components
│   ├── layout/                # Layout components
│   └── sections/              # Page sections
├── 🗂️ js/                     # JavaScript modules
│   └── components/            # JavaScript component classes
├── 🗂️ utils/                  # Utility functions
│   ├── animations.js          # Animation utilities
│   ├── theme.js               # Theme management
│   ├── github.js              # GitHub API integration
│   └── form-handler.js        # Form validation & submission
├── 🗂️ styles/                 # CSS stylesheets
│   ├── critical.css           # Critical above-fold CSS
│   ├── themes.css             # Theme variables & utilities
│   └── components.css         # Component-specific styles
├── 🗂️ config/                 # Configuration files
│   ├── vite.config.js         # Vite build configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── postcss.config.js      # PostCSS configuration
├── 🗂️ public/                 # Static assets
│   ├── favicon.svg            # Site favicon
│   ├── manifest.json          # PWA manifest
│   └── robots.txt             # SEO robots file
└── 🗂️ assets/                 # Media assets
    ├── images/                # Images and graphics
    └── icons/                 # Icon assets
```

## 🎨 Component Architecture

### **Modular Design Philosophy**
Each component follows a consistent pattern:

```javascript
// Component Class Structure
class ComponentName {
  constructor() {
    this.container = document.getElementById('container-id');
    this.initialized = false;
  }

  async render() {
    // Load HTML content
    // Initialize interactions
    // Handle errors with fallbacks
  }

  renderFallback() {
    // Immediate static content
  }

  initializeInteractions() {
    // Component-specific functionality
  }
}
```

### **Component Loading Strategy**
- **Priority-based loading** (Hero > About/Projects > Skills > Contact > Footer)
- **Error handling** with exponential backoff retry
- **Fallback rendering** for resilience
- **Performance monitoring** with load time tracking

## 🎯 Performance Optimizations

### **Loading Strategy**
- Critical components load first and block further loading
- Non-critical components load asynchronously
- Comprehensive fallback content prevents blank sections
- Retry mechanism with exponential backoff

### **CSS Optimizations**
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded asynchronously
- CSS variables for consistent theming
- Purged unused styles in production

### **JavaScript Optimizations**
- ES6 modules with dynamic imports
- Tree shaking and code splitting
- Minification and compression
- Legacy browser support with polyfills

## 🔧 Configuration

### **Theme Customization**
Edit `styles/themes.css` to customize colors, fonts, and animations:

```css
:root {
  --primary: #64ffda;
  --bg-primary: #0a192f;
  --text-primary: #ccd6f6;
  /* ... more variables */
}
```

### **GitHub Integration**
Update `utils/github.js` with your GitHub username and repository settings:

```javascript
const GITHUB_CONFIG = {
  username: 'your-username',
  repositories: ['repo1', 'repo2'],
  apiToken: 'your-token' // Optional for higher rate limits
};
```

### **Contact Form**
Configure `utils/form-handler.js` for your email service:

```javascript
const FORM_CONFIG = {
  emailService: 'your-service',
  apiEndpoint: 'your-endpoint',
  recipientEmail: 'your@email.com'
};
```

## 📱 Responsive Design

### **Breakpoints**
- **xs**: 475px - Extra small devices
- **sm**: 640px - Small devices  
- **md**: 768px - Medium devices
- **lg**: 1024px - Large devices
- **xl**: 1280px - Extra large devices
- **2xl**: 1536px - 2X large devices
- **3xl**: 1600px - Ultra wide displays

### **Mobile-First Approach**
All components are designed mobile-first with progressive enhancement for larger screens.

## ♿ Accessibility Features

### **WCAG 2.1 AA Compliance**
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader compatibility

### **Reduced Motion Support**
Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  /* Reduced animations */
}
```

## 🌐 SEO Optimizations

### **Technical SEO**
- Semantic HTML5 structure
- Open Graph and Twitter Card meta tags
- Structured data (JSON-LD)
- XML sitemap
- Robots.txt configuration
- Canonical URLs

### **Performance SEO**
- Core Web Vitals optimization
- Fast loading times
- Mobile-friendly design
- Progressive Web App features

## 🚀 Deployment

### **GitHub Pages (Recommended)**

1. **Automatic Deployment**
   ```bash
   npm run deploy
   ```

2. **Manual Deployment**
   ```bash
   npm run build
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

### **Custom Domain Setup**
1. Add `CNAME` file to `public/` directory with your domain
2. Configure DNS with your domain provider
3. Enable HTTPS in GitHub Pages settings

### **Environment Variables**
```bash
# Production
NODE_ENV=production

# GitHub API (optional)
GITHUB_TOKEN=your_token

# Analytics (optional)
GA_TRACKING_ID=your_id
```

## 📊 Performance Metrics

### **Lighthouse Scores**
- **Performance**: 98+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### **Core Web Vitals**
- **LCP** (Largest Contentful Paint): < 1.2s
- **FID** (First Input Delay): < 50ms
- **CLS** (Cumulative Layout Shift): < 0.1

### **Bundle Sizes**
- **Initial JavaScript**: ~58KB (gzipped: ~11KB)
- **Critical CSS**: ~47KB (gzipped: ~9KB)
- **Total Page Size**: ~130KB (gzipped: ~30KB)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design inspiration**: Modern portfolio trends and glassmorphism design
- **Icons**: [Remix Icon](https://remixicon.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Inter, JetBrains Mono)
- **Animations**: CSS animations with reduced motion support
- **Build tool**: [Vite](https://vitejs.dev/) for fast development and building

## 📞 Contact

**Umutcan Algan**
- 🌐 Portfolio: [umutcanalgan.dev](https://umutcanalgan.dev)
- 📧 Email: umutcanalgan@hotmail.com
- 💼 LinkedIn: [linkedin.com/in/umutcanalgan](https://linkedin.com/in/umutcanalgan)
- 🐙 GitHub: [github.com/ucanalgan](https://github.com/ucanalgan)

---

<div align="center">
  <p>Made with ❤️ by Umutcan Algan</p>
  <p>
    <a href="https://github.com/ucanalgan/Kisisel_web/stargazers">⭐ Star this repo</a> |
    <a href="https://github.com/ucanalgan/Kisisel_web/issues">🐛 Report bug</a> |
    <a href="https://github.com/ucanalgan/Kisisel_web/issues">💡 Request feature</a>
  </p>
</div>