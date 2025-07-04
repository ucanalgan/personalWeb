# 🚀 Modern Developer Portfolio

A stunning, high-performance portfolio website built with modern web technologies. Features dynamic content loading, smooth animations, dark/light theme switching, and comprehensive GitHub integration.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Build](https://img.shields.io/badge/Build-Passing-success)

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
- **Responsive Design** - Perfect on all devices (desktop, tablet, mobile)
- **Dark/Light Theme** - System preference detection with manual toggle
- **Smooth Animations** - Micro-interactions and scroll-triggered animations
- **Accessibility First** - WCAG AA compliant with proper ARIA labels
- **Modern UI/UX** - Clean, professional design with glassmorphism effects

### ⚡ **Performance Optimized**
- **Lighthouse Score 95+** - Optimized for Core Web Vitals
- **Fast Loading** - Code splitting and lazy loading
- **Progressive Web App** - Offline capability with service worker
- **WebP Images** - Next-gen image formats with lazy loading
- **Critical CSS** - Above-the-fold styles inlined for instant rendering

### 🛠 **Technology Stack**
- **Frontend**: Vanilla JavaScript (ES2022), HTML5, CSS3
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for lightning-fast development
- **Icons**: RemixIcon for consistent iconography
- **Animations**: Custom CSS animations with Intersection Observer
- **Analytics**: Privacy-focused analytics implementation

### 🔧 **Advanced Features**
- **Dynamic GitHub Integration** - Real-time repository data via GitHub API
- **Component-Based Architecture** - Modular, maintainable code structure
- **Smart Contact Form** - Validation with email integration
- **SEO Optimized** - Meta tags, structured data, and performance
- **TypeScript Ready** - Modern JavaScript with type support

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ucanalgan/Kişisel_web.git
   cd Kişisel_web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### 📋 Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server with HMR | Development |
| `npm run build` | Build optimized production bundle | Production |
| `npm run preview` | Preview production build locally | Testing |
| `npm run deploy` | Deploy to GitHub Pages | Deployment |
| `npm run lint` | Check code quality and style | Code Quality |

## 📁 Project Architecture

```
Kişisel_web/
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 common/         # Shared components (ButtonPrimary, Card, etc.)
│   │   ├── 📁 layout/         # Layout components (Header)
│   │   └── 📁 sections/       # Page sections (HeroSection, AboutSection, etc.)
│   ├── 📁 styles/             # Stylesheets
│   │   ├── 📁 components/     # Component-specific styles
│   │   ├── base.css          # Base styles and resets
│   │   ├── themes.css        # Theme definitions
│   │   └── styles.css        # Main stylesheet
│   ├── 📁 utils/              # Utility functions
│   │   ├── analytics.js      # Analytics tracking
│   │   ├── animations.js     # Animation utilities
│   │   ├── github.js         # GitHub API integration
│   │   ├── theme.js          # Theme management
│   │   └── form-handler.js   # Form processing
│   ├── 📁 assets/             # Static assets
│   │   ├── 📁 images/        # Optimized images (WebP format)
│   │   └── 📁 icons/         # Icon assets
│   ├── 📁 config/             # Configuration files
│   └── main.js               # Application entry point
├── 📁 public/                 # Public static files
│   ├── favicon.svg           # Favicon
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── index.html                # Main HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
└── package.json              # Dependencies and scripts
```

## 🎨 Customization Guide

### 🎯 **Personal Information**

1. **Update Profile Data**
   ```javascript
   // src/utils/github.js
   const GITHUB_USERNAME = 'your-username';
   ```

2. **Modify Content**
   - Edit `src/components/sections/AboutSection.html`
   - Update `src/components/sections/HeroSection.html`
   - Customize `src/components/sections/SkillsSection.html`

### 🎨 **Theme Customization**

```css
/* src/styles/themes.css */
:root {
  --primary: #64ffda;
  --primary-dark: #4fd1c7;
  --bg-primary: #0a0e27;
  --bg-secondary: #1a1f3a;
  --text-primary: #ffffff;
  --text-secondary: #a8b2d1;
}
```

### 📊 **Analytics Setup**

```javascript
// src/utils/analytics.js
const ANALYTICS_CONFIG = {
  trackingId: 'your-tracking-id',
  enableTracking: true
};
```

## 🚀 Deployment

### 🌐 **GitHub Pages (Recommended)**

1. **Automatic Deployment**
   ```bash
   npm run deploy
   ```

2. **Manual Setup**
   - Enable GitHub Pages in repository settings
   - Set source to "GitHub Actions"
   - The workflow will auto-deploy on push to main

### 🔧 **Other Platforms**

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder
- **Custom Server**: Upload contents of `dist/` folder

### 🌍 **Environment Variables**

Create a `.env` file in the root directory:

```env
VITE_GITHUB_TOKEN=your_github_token_here
VITE_ANALYTICS_ID=your_analytics_id_here
VITE_CONTACT_FORM_ENDPOINT=your_form_endpoint_here
```

## 🔧 Development

### 🛠 **Development Environment**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and format code
npm run lint
npm run format
```

### 🎯 **Adding New Components**

1. Create component file in `src/components/`
2. Add styles to `src/styles/components/`
3. Import in `src/main.js`
4. Register in ComponentLoader

### 📱 **Testing Responsiveness**

The portfolio is tested on:
- **Desktop**: 1920x1080, 1366x768
- **Tablet**: iPad, iPad Pro
- **Mobile**: iPhone 12/13/14, Galaxy S21, Pixel 5

### ⚡ **Performance Optimization**

- Images are automatically optimized to WebP format
- CSS is purged of unused classes in production
- JavaScript is minified and tree-shaken
- Service worker caches resources for offline use

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### 📝 **Contribution Guidelines**

- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Umut Can Algan**
- GitHub: [@ucanalgan](https://github.com/ucanalgan)
- LinkedIn: [umutcanalgan](https://linkedin.com/in/umutcanalgan)
- Email: umutcanalgan@gmail.com

## 🙏 Acknowledgments

- **Design Inspiration**: Modern portfolio trends and UI/UX best practices
- **Icons**: [RemixIcon](https://remixicon.com) for beautiful icons
- **Animations**: CSS animations and Intersection Observer API
- **GitHub API**: For real-time repository data
- **Community**: Open source developers who inspire continuous learning

## 📈 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/ucanalgan/Kişisel_web?style=social)
![GitHub forks](https://img.shields.io/github/forks/ucanalgan/Kişisel_web?style=social)
![GitHub issues](https://img.shields.io/github/issues/ucanalgan/Kişisel_web)
![GitHub pull requests](https://img.shields.io/github/issues-pr/ucanalgan/Kişisel_web)

## 🎯 Future Enhancements

- [ ] Multi-language support (i18n)
- [ ] Blog section integration
- [ ] Advanced animations with GSAP
- [ ] CMS integration for content management
- [ ] Enhanced SEO features
- [ ] Performance monitoring dashboard
- [ ] A/B testing capabilities
- [ ] Advanced analytics integration

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Umut Can Algan](https://github.com/ucanalgan)

</div>