import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'hero', label: 'Home', icon: 'ri-home-line' },
    { id: 'about', label: 'About', icon: 'ri-user-line' },
    { id: 'skills', label: 'Skills', icon: 'ri-code-line' },
    { id: 'projects', label: 'Projects', icon: 'ri-folder-line' },
    { id: 'contact', label: 'Contact', icon: 'ri-mail-line' }
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress"></div>
      
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              UA
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-primary ${
                    activeSection === item.id 
                      ? 'text-primary' 
                      : 'text-text-secondary'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-primary hover:text-primary transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              <i className={`text-xl ${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left transition-all duration-300 rounded-lg hover:bg-surface ${
                    activeSection === item.id 
                      ? 'text-primary bg-surface border-l-4 border-primary' 
                      : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  <i className={`${item.icon} mr-3`}></i>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header; 