import React, { useEffect, useState } from 'react';
import { useGitHub } from '../../contexts/GitHubContext';
import Button from '../common/Button';

const HeroSection = () => {
  const { userData, stats, isLoading, error, refreshData, lastUpdate } = useGitHub();
  const [profileImage, setProfileImage] = useState('/src/assets/images/profile-placeholder.webp');

  useEffect(() => {
    if (userData?.avatar_url) {
      setProfileImage(userData.avatar_url);
    }
  }, [userData]);

  const formatLastUpdate = (date) => {
    if (!date) return 'Loading...';
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60)),
      'minute'
    );
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface via-surface/50 to-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Content */}
          <div className="text-center lg:text-left">
            {/* Profile Image with Dynamic Loading */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="relative group">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-primary/25">
                  <img 
                    src={profileImage} 
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="eager"
                    onError={() => setProfileImage('/src/assets/images/profile-placeholder.webp')}
                  />
                </div>
                {/* Status Badge */}
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
                Hi, I'm <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {userData?.name || 'Umut Can Algan'}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-6">
                Full-Stack Developer & <span className="text-primary font-semibold">Modern Web Enthusiast</span>
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 text-lg text-text-secondary leading-relaxed">
              <p>
                {userData?.bio || 
                  'I create innovative digital experiences with modern web technologies, focusing on performance, user experience, and clean code architecture.'
                }
              </p>
            </div>

            {/* GitHub Stats */}
            <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-surface/30 border border-border rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-primary">
                  {isLoading ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    stats?.repositories || 0
                  )}
                </div>
                <div className="text-sm text-text-secondary">Repositories</div>
              </div>
              <div className="text-center p-4 bg-surface/30 border border-border rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">
                  {isLoading ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    stats?.stars || 0
                  )}
                </div>
                <div className="text-sm text-text-secondary">GitHub Stars</div>
              </div>
              <div className="text-center p-4 bg-surface/30 border border-border rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-400">
                  {isLoading ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    stats?.followers || 0
                  )}
                </div>
                <div className="text-sm text-text-secondary">Followers</div>
              </div>
              <div className="text-center p-4 bg-surface/30 border border-border rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-accent">
                  {isLoading ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    stats?.forks || 0
                  )}
                </div>
                <div className="text-sm text-text-secondary">Total Forks</div>
              </div>
            </div>

            {/* Last Update Info */}
            <div className="mb-8 text-sm text-text-secondary/70 italic">
              <span>Last updated: {formatLastUpdate(lastUpdate)}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                href="#projects"
                size="lg"
                icon="ri-folder-line"
                className="font-semibold"
              >
                Explore My Projects
              </Button>
              
              <Button
                href="#contact"
                variant="secondary"
                size="lg"
                icon="ri-mail-line"
                className="font-semibold"
              >
                Get In Touch
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex justify-center lg:justify-start">
              <button 
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-primary border border-border hover:border-primary/50 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                <i className={`ri-refresh-line ${isLoading ? 'animate-spin' : ''}`}></i>
                Refresh GitHub Data
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </div>
            )}
          </div>

          {/* Visual Content */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl rotate-6 scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-accent/10 to-primary/10 rounded-3xl -rotate-6 scale-95"></div>
              
              {/* Code Preview Card */}
              <div className="relative bg-surface/50 backdrop-blur-lg border border-border rounded-2xl p-8 shadow-2xl max-w-lg">
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-text-secondary">portfolio.js</div>
                </div>
                
                {/* Code Content */}
                <div className="font-mono text-sm space-y-2">
                  <div className="text-purple-400">const <span className="text-blue-400">developer</span> = {'{'}</div>
                  <div className="pl-4 text-text-secondary">
                    <div>name: <span className="text-green-400">'{userData?.name || 'Umut Can Algan'}'</span>,</div>
                    <div>role: <span className="text-green-400">'Full-Stack Developer'</span>,</div>
                    <div>skills: [<span className="text-green-400">'React'</span>, <span className="text-green-400">'Node.js'</span>, <span className="text-green-400">'Python'</span>],</div>
                    <div>passion: <span className="text-green-400">'Building Amazing Things'</span></div>
                  </div>
                  <div className="text-purple-400">{'};'}</div>
                  <div className="mt-4 text-blue-400">
                    developer.<span className="text-yellow-400">createAwesome</span>();
                  </div>
                </div>
                
                {/* Typing Cursor */}
                <div className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="flex flex-col items-center text-text-secondary">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-text-secondary/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 