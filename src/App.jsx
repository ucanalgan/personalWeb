import React, { useEffect, Suspense, lazy } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GitHubProvider } from './contexts/GitHubContext';

// Static imports for critical components
import Header from './components/layout/Header';
import ScrollToTop from './components/common/ScrollToTop';
import { initAnalytics } from './utils/analytics';
import { initAnimations } from './utils/animations';

// Lazy imports for non-critical components
const HeroSection = lazy(() => import('./components/sections/HeroSection'));
const AboutSection = lazy(() => import('./components/sections/AboutSection'));
const SkillsSection = lazy(() => import('./components/sections/SkillsSection'));
const ProjectsSection = lazy(() => import('./components/sections/ProjectsSection'));
const GitHubSection = lazy(() => import('./components/sections/GitHubSection'));
const ContactSection = lazy(() => import('./components/sections/ContactSection'));
const FooterSection = lazy(() => import('./components/sections/FooterSection'));

// Loading component for better UX
const SectionLoader = ({ className = '' }) => (
  <div className={`section-loader animate-pulse ${className}`}>
    <div className="container mx-auto px-4 py-20">
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-1/3 mx-auto" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-2/3 mx-auto" />
        <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-md w-full" />
      </div>
    </div>
  </div>
);

// Error boundary for lazy loading
class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback text-center py-20">
          <p className="text-red-500">Bu bölüm yüklenirken bir hata oluştu.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn-primary mt-4"
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    // Initialize analytics with error handling
    try {
      initAnalytics();
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }

    // Initialize animations with error handling
    try {
      initAnimations();
    } catch (error) {
      console.warn('Animations initialization failed:', error);
    }

    // Optimized scroll progress bar
    const updateScrollProgress = () => {
      const scrollProgress = document.querySelector('.scroll-progress');
      if (scrollProgress) {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = `${Math.max(0, Math.min(100, scrolled))}%`;
      }
    };

    // Throttled scroll listener for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Service Worker registration with better error handling
    if ('serviceWorker' in navigator && 'production' === process.env.NODE_ENV) {
      navigator.serviceWorker.register('/public/sw.js')
        .then(registration => {
          console.log('SW registered successfully');
        })
        .catch(error => {
          console.warn('SW registration failed:', error);
        });
    }

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload font
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      link.as = 'style';
      document.head.appendChild(link);

      // Preload critical images (if any)
      // Add your critical images here
    };

    preloadCriticalResources();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ThemeProvider>
      <GitHubProvider>
        <div className="App min-h-screen">
          {/* Scroll Progress Bar */}
          <div className="scroll-progress fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-primary-dark z-50 transition-all duration-200" />

          {/* Header - Critical component, loaded immediately */}
          <Header />

          {/* Main Content with Lazy Loading */}
          <main>
            <LazyErrorBoundary>
              <Suspense fallback={<SectionLoader className="hero-section" />}>
                <HeroSection />
              </Suspense>
            </LazyErrorBoundary>

            <LazyErrorBoundary>
              <Suspense fallback={<SectionLoader className="about-section" />}>
                <AboutSection />
              </Suspense>
            </LazyErrorBoundary>

            <LazyErrorBoundary>
              <Suspense fallback={<SectionLoader className="skills-section" />}>
                <SkillsSection />
              </Suspense>
            </LazyErrorBoundary>

            <LazyErrorBoundary>
              <Suspense fallback={<SectionLoader className="projects-section" />}>
                <ProjectsSection />
              </Suspense>
            </LazyErrorBoundary>

            <LazyErrorBoundary>
              <Suspense fallback={<SectionLoader className="github-section" />}>
                <GitHubSection />
              </Suspense>
            </LazyErrorBoundary>

            <LazyErrorBoundary>
              <Suspense fallback={<SectionLoader className="contact-section" />}>
                <ContactSection />
              </Suspense>
            </LazyErrorBoundary>
          </main>

          {/* Footer */}
          <LazyErrorBoundary>
            <Suspense fallback={<SectionLoader className="footer-section" />}>
              <FooterSection />
            </Suspense>
          </LazyErrorBoundary>

          {/* Scroll to Top Button */}
          <ScrollToTop />
        </div>
      </GitHubProvider>
    </ThemeProvider>
  );
}

export default App;
