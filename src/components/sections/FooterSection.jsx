// React 17+ JSX Transform - no React import needed

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    {
      icon: 'ri-github-line',
      label: 'GitHub',
      url: 'https://github.com/ucanalgan',
      color: 'hover:text-gray-400'
    },
    {
      icon: 'ri-linkedin-line',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/umutcanalgan',
      color: 'hover:text-blue-400'
    },
    {
      icon: 'ri-twitter-line',
      label: 'Twitter',
      url: 'https://twitter.com/ucanalgan',
      color: 'hover:text-blue-500'
    },
    {
      icon: 'ri-mail-line',
      label: 'Email',
      url: 'mailto:umutcanalgan@gmail.com',
      color: 'hover:text-green-400'
    }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-surface/10 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Umut Can Algan
              </h3>
              <p className="text-text-secondary mt-2">
                Full-Stack Developer
              </p>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Passionate about creating innovative digital experiences with modern web technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-text-primary mb-4">Quick Links</h4>
            <nav className="space-y-2">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-text-secondary hover:text-primary transition-colors duration-300 text-sm"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-text-primary mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:umutcanalgan@gmail.com"
                className="block text-text-secondary hover:text-primary transition-colors duration-300"
              >
                umutcanalgan@gmail.com
              </a>
              <p className="text-text-secondary">Turkey</p>
              <p className="text-text-secondary">Available for opportunities</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-text-primary mb-4">Follow Me</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-surface/30 border border-border rounded-lg flex items-center justify-center text-text-secondary transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 ${social.color}`}
                  aria-label={social.label}
                >
                  <i className={`${social.icon} text-lg`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-secondary text-sm mb-4 md:mb-0">
              © {currentYear} Umutcan Algan. All rights reserved.
            </p>
          </div>
          </div>
      </div>
    </footer>
  );
};

export default FooterSection;
