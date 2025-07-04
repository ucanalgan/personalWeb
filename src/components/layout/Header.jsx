import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);

      // Calculate scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (winScroll / height) * 100;
      setScrollProgress(progress);

      // Update active section based on scroll position with offset
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Use a larger offset for better UX
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    // Throttled scroll listener for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // Set initial active section
    handleScroll();

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [activeSection]);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      setIsMobileMenuOpen(false);
      setActiveSection(sectionId);
    }
  };

  const navItems = [
    { id: 'hero', label: 'Home', icon: 'ri-home-line', shortLabel: 'Home' },
    { id: 'about', label: 'About', icon: 'ri-user-line', shortLabel: 'About' },
    { id: 'skills', label: 'Skills', icon: 'ri-code-line', shortLabel: 'Skills' },
    { id: 'projects', label: 'Projects', icon: 'ri-folder-line', shortLabel: 'Work' },
    { id: 'contact', label: 'Contact', icon: 'ri-mail-line', shortLabel: 'Contact' }
  ];

  return (
    <>
      {/* Enhanced Scroll Progress Bar */}
      <div className="scroll-progress fixed top-0 left-0 right-0 h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ease-out shadow-lg shadow-primary/20"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-border/50 shadow-xl shadow-black/5'
          : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="group relative text-2xl font-bold transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                UA
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 blur-lg" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
                    activeSection === item.id
                      ? 'text-primary bg-primary/10 border border-primary/20'
                      : 'text-text-secondary hover:text-primary hover:bg-surface/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className={`${item.icon} text-base`} />
                    <span>{item.label}</span>
                  </div>

                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button md:hidden relative p-3 text-text-primary hover:text-primary transition-all duration-300 hover:bg-surface/30 rounded-xl group"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 top-3' : 'top-1'
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'top-3'
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 top-3' : 'top-5'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Enhanced Mobile Navigation */}
          <div className={`mobile-menu md:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMobileMenuOpen
              ? 'max-h-80 opacity-100 mt-4'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-xl">
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`group w-full flex items-center px-4 py-3 text-left transition-all duration-300 rounded-xl transform ${
                      activeSection === item.id
                        ? 'text-primary bg-primary/10 border border-primary/20 scale-105'
                        : 'text-text-secondary hover:text-primary hover:bg-surface/30 hover:scale-105'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileMenuOpen ? 'slideInFromRight 0.3s ease-out' : 'none'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-primary/20 text-primary'
                          : 'bg-surface/50 group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        <i className={`${item.icon} text-lg`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-text-secondary/70">
                          {item.id === 'hero' && 'Welcome'}
                          {item.id === 'about' && 'My story'}
                          {item.id === 'skills' && 'What I do'}
                          {item.id === 'projects' && 'My work'}
                          {item.id === 'contact' && 'Get in touch'}
                        </div>
                      </div>
                      {activeSection === item.id && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center justify-center space-x-4">
                  <a
                    href="https://github.com/ucanalgan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-text-secondary hover:text-primary transition-colors duration-300 hover:bg-surface/30 rounded-lg"
                  >
                    <i className="ri-github-line text-lg" />
                  </a>
                  <a
                    href="https://linkedin.com/in/ucanalgan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-text-secondary hover:text-primary transition-colors duration-300 hover:bg-surface/30 rounded-lg"
                  >
                    <i className="ri-linkedin-line text-lg" />
                  </a>
                  <a
                    href="mailto:contact@ucanalgan.dev"
                    className="p-2 text-text-secondary hover:text-primary transition-colors duration-300 hover:bg-surface/30 rounded-lg"
                  >
                    <i className="ri-mail-line text-lg" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Add keyframes for mobile menu animation */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Header;
