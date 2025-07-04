import React, { useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { GitHubProvider } from './contexts/GitHubContext'
import Header from './components/layout/Header'
import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
import SkillsSection from './components/sections/SkillsSection'
import ProjectsSection from './components/sections/ProjectsSection'
import GitHubSection from './components/sections/GitHubSection'
import ContactSection from './components/sections/ContactSection'
import FooterSection from './components/sections/FooterSection'
import ScrollToTop from './components/common/ScrollToTop'
import ThemeToggle from './components/common/ThemeToggle'
import { initAnalytics } from './utils/analytics'
import { initAnimations } from './utils/animations'

function App() {
  useEffect(() => {
    // Initialize analytics
    initAnalytics()
    
    // Initialize animations
    initAnimations()
    
    // Scroll progress bar functionality
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/public/sw.js').catch(() => {
        // Service worker registration failed, continue without it
      })
    }

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <ThemeProvider>
      <GitHubProvider>
        <div className="App">
          {/* Scroll Progress Bar */}
          <div className="scroll-progress"></div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Header */}
          <Header />
          
          {/* Main Content */}
          <main>
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <GitHubSection />
            <ContactSection />
          </main>
          
          {/* Footer */}
          <FooterSection />
          
          {/* Scroll to Top Button */}
          <ScrollToTop />
        </div>
      </GitHubProvider>
    </ThemeProvider>
  )
}

export default App 