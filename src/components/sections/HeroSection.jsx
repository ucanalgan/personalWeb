import { useEffect, useState, useRef } from 'react';
import { useGitHub } from '../../contexts/GitHubContext';
import Button from '../common/Button';

const HeroSection = () => {
  const { userData, stats, isLoading, error, refreshData, lastUpdate } = useGitHub();
  const [profileImage, setProfileImage] = useState('/src/assets/images/profile-placeholder.webp');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const profileRef = useRef(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    if (userData?.avatar_url) {
      setProfileImage(userData.avatar_url);
    }
  }, [userData]);

  const formatLastUpdate = (date) => {
    if (!date) return 'Loading...';
    return new Intl.RelativeTimeFormat('tr', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60)),
      'minute'
    );
  };

  // Icon components for better performance
  const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );

  const MailIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );

  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17l9.2-9.2M17 17V7H7"/>
    </svg>
  );

  const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
    </svg>
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary pt-20 md:pt-0"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs with mouse parallax */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary-400), var(--accent-purple-400))',
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, var(--accent-pink-400), var(--accent-orange-400))',
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
            right: '10%',
            bottom: '20%',
            animationDelay: '1s'
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Main Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Name & Title */}
            <div className="space-y-6">
              <h1 className="display-lg lg:display-xl animate-slide-up">
                Hi, I'm{' '}
                <span className="relative">
                  <span className="gradient-text">
                    {userData?.name || 'Umutcan Algan'}
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary-400 to-accent-purple-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-200" />
                </span>
              </h1>

              <div className="text-lead">
                <span className="text-text-secondary">Full-Stack Developer &</span>{' '}
                <span className="text-gradient-primary font-semibold">Infrastructure-Minded Developer</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-body-lg max-w-2xl mx-auto lg:mx-0">
              <p className="leading-relaxed">
                {userData?.bio ||
'I turn bold ideas into fast, scalable digital products. My focus is on building intuitive web apps that not only perform flawlessly but also create value for users and businesses alike.'                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Button
                href="#projects"
                size="lg"
                variant="primary"
                leftIcon={<GitHubIcon />}
                className="group relative overflow-hidden"
              >
                <span className="relative z-10">Explore My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-400 to-accent-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>

              <Button
                href="#contact"
                variant="glass"
                size="lg"
                leftIcon={<MailIcon />}
                rightIcon={<ArrowIcon />}
                className="group"
              >
                Get In Touch
              </Button>
            </div>
          </div>

          {/* Profile Image - Moved to right side */}
          <div className="flex justify-center lg:justify-end">
            <div
              ref={profileRef}
              className="relative group cursor-pointer"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-400 to-accent-purple-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-110" />

              {/* Profile container */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                {/* Static elegant border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-primary-400 via-accent-purple-400 to-accent-pink-400 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-bg-primary p-1">
                    <img
                      src={profileImage}
                      alt="Umutcan Algan - Full Stack Developer"
                      className="w-full h-full object-cover rounded-full transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 shadow-xl"
                      loading="eager"
                      onError={() => setProfileImage('/src/assets/images/profile-placeholder.webp')}
                    />
                  </div>
                </div>

                {/* Online status */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-success-500 rounded-full border-4 border-bg-primary flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-success-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {[
              { label: 'Repositories', value: stats?.repositories || 0, icon: '📚', color: 'brand-primary' },
              { label: 'GitHub Stars', value: stats?.stars || 0, icon: '⭐', color: 'warning' },
              { label: 'Followers', value: stats?.followers || 0, icon: '👥', color: 'success' },
              { label: 'Total Forks', value: stats?.forks || 0, icon: '🚀', color: 'accent-purple' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="glass relative group p-4 rounded-2xl hover:shadow-xl hover:shadow-brand-primary-500/10 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className={`text-2xl font-bold text-${stat.color}-500`}>
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-caption text-text-tertiary">{stat.label}</div>
                </div>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl bg-${stat.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            ))}
          </div>

          {/* Additional Actions */}
          <div className="flex items-center gap-4 justify-center text-sm mt-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="glass inline-flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-brand-primary-500 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none group"
            >
              <RefreshIcon className={`transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              <span>Refresh Data</span>
            </button>

            <div className="text-text-tertiary">
              Last updated: {formatLastUpdate(lastUpdate)}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="glass border border-error-500/20 bg-error-500/5 text-error-400 p-4 rounded-xl animate-fade-in mt-6 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-error-500 rounded-full animate-pulse" />
                <span className="font-medium">Connection Error</span>
              </div>
              <p className="text-sm mt-1 text-error-300">{error}</p>
            </div>
          )}
        </div>
      </div>


    </section>
  );
};

export default HeroSection;
