import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      /* `back-to-top` had no styles left after the CSS cleanup, so the button
         rendered at 16x27 and stayed clickable while invisible. */
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center justify-center w-12 h-12
        rounded-full bg-surface border border-border text-text-secondary shadow-lg
        transition-all duration-300 hover:text-primary hover:border-border-hover
        focus-visible:ring-2 focus-visible:ring-primary ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
    }`}
      aria-label="Scroll to top"
      title="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
    >
      <i className="ri-arrow-up-line text-xl" aria-hidden="true" />
    </button>
  );
};

export default ScrollToTop;
