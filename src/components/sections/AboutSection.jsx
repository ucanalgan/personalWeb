import { useState, useEffect, useRef, useMemo } from 'react';
import Button from '../common/Button';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});
  const sectionRef = useRef(null);

  const skills = [
    { name: 'React', level: 90, icon: 'ri-reactjs-line', color: 'from-cyan-400 to-blue-500' },
    { name: 'Node.js', level: 85, icon: 'ri-nodejs-line', color: 'from-green-400 to-green-600' },
    { name: 'Python', level: 80, icon: 'ri-file-code-line', color: 'from-yellow-400 to-orange-500' },
    { name: 'TypeScript', level: 85, icon: 'ri-code-s-slash-line', color: 'from-blue-400 to-blue-600' },
    { name: 'PostgreSQL', level: 75, icon: 'ri-database-2-line', color: 'from-indigo-400 to-purple-500' },
    { name: 'AWS', level: 70, icon: 'ri-cloud-line', color: 'from-orange-400 to-red-500' }
  ];

  // Most recent first; the ordering is the information here.
  const experience = [
    {
      title: 'Backend Team Leader',
      org: 'Toplum Gönüllüleri Vakfı (TOG)',
      period: '02/2026 - present',
      icon: 'ri-team-line',
      summary: 'Leading a six-person backend team building a scalable three-repo system on Node.js, Express, PostgreSQL and Redis for volunteer management. Introduced Git branching strategies and JWT-based authentication while moving the architecture toward microservices.'
    },
    {
      title: 'Frontend Developer',
      org: 'Vera Yazılım & TasarımLife',
      period: '01/2026 - 04/2026',
      icon: 'ri-layout-line',
      summary: 'Delivered 8+ dynamic modules on weekly sprint cycles, building responsive interfaces with pure CSS over PHP and CodeIgniter, and worked through UI/UX and performance bottlenecks to keep delivery on schedule.'
    },
    {
      title: 'IT Intern',
      org: 'Bellcom Bilgisayar',
      period: '07/2025 - 08/2025',
      icon: 'ri-server-line',
      summary: 'Resolved 50+ hardware, software and network issues across a 20-day corporate internship, handling hardware installation and network configuration with zero downtime.'
    },
    {
      title: 'IT Assistant',
      org: 'Piri Reis University',
      period: '09/2023 - 06/2024',
      icon: 'ri-tools-line',
      summary: 'Supported daily IT operations for university staff and students over ten months, and delivered infrastructure upgrades including IP security camera integration and smart presentation systems.'
    }
  ];

  const stats = useMemo(() => [
    { label: 'Team Members Led', value: 6, suffix: '', icon: 'ri-team-line', color: 'text-primary' },
    { label: 'WER Reduction (ASR)', value: 46, suffix: '%', icon: 'ri-line-chart-line', color: 'text-primary' },
    // A year is not a quantity, so counting up to it reads as a bug.
    { label: 'Graduating', value: 2027, suffix: '', icon: 'ri-graduation-cap-line', color: 'text-primary', animate: false }
  ], []);

  // Intersection Observer for animations
  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          stats.forEach(stat => {
            animateCounter(stat.label, stat.value, stat.animate !== false);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [stats]);

  // Keyed by label so adding or renaming a stat cannot silently break the
  // counter, which is what happened with the previous hard-coded mapping.
  const animateCounter = (label, targetValue, animated) => {
    if (!animated) {
      setAnimatedStats(prev => ({ ...prev, [label]: targetValue }));
      return;
    }
    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }
      setAnimatedStats(prev => ({ ...prev, [label]: Math.floor(currentValue) }));
    }, 30);
  };

  const getStatValue = (label, originalValue) =>
    animatedStats[label] ?? originalValue;

  return (
    <section id="about" className="bg-gradient-to-br from-background via-surface/10 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-block px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                About Me
              </span>
              <h2 className="display-2xl mb-8">
                Backend Systems &<br />
                <span className="gradient-text">Full-Stack Delivery</span>
              </h2>
              <p className="body-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
                Information Systems Engineering student at Piri Reis University, graduating June 2027.
                I lead a backend team at TOG and build production systems with Node.js, PostgreSQL and React.
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-16 items-start mb-20">
            {/* Story Content */}
            <div className="lg:col-span-2">
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <ol className="space-y-8">
                  {experience.map((role) => (
                    <li key={role.org} className="group">
                      <div className="flex items-start gap-4 p-6 bg-surface/30 border border-border rounded-2xl backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white shadow-lg">
                          <i className={`${role.icon} text-xl`} aria-hidden="true" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                            <h3 className="heading-3 group-hover:text-primary transition-colors duration-300">
                              {role.title}
                            </h3>
                            <span className="text-caption">{role.period}</span>
                          </div>
                          <p className="text-sm font-medium text-primary mb-2">{role.org}</p>
                          <p className="body-base text-text-secondary leading-relaxed">
                            {role.summary}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button
                    href="#projects"
                    variant="primary"
                    size="lg"
                    icon="ri-eye-line"
                    className="group"
                  >
                    <span className="group-hover:scale-105 transition-transform duration-200">View My Work</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Interactive Skills */}
            <div className="lg:col-span-1">
              <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="sticky top-32">
                  <h3 className="heading-2 mb-8 text-center">
                    Technical <span className="gradient-text">Expertise</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="group">
                        <div className="flex items-center space-x-3 p-4 bg-surface/20 border border-border rounded-xl backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                          <div className={`w-10 h-10 bg-gradient-to-br ${skill.color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <i className={`${skill.icon} text-lg`} />
                          </div>
                          <span className="font-semibold text-text-primary group-hover:text-primary transition-colors duration-300">{skill.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-12">
              <h3 className="heading-2 mb-4">
                Achievement <span className="gradient-text">Highlights</span>
              </h3>
              <p className="body-lg text-text-secondary">Numbers that tell my story</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="relative p-8 bg-gradient-to-br from-surface/40 to-surface/20 border border-border rounded-2xl backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 text-center">
                      <div className={`w-16 h-16 ${stat.color} bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <i className={`${stat.icon} text-2xl`} />
                      </div>
                      <div className="mb-4">
                        <span className="display-lg font-mono gradient-text">
                          {getStatValue(stat.label, stat.value)}{stat.suffix}
                        </span>
                      </div>
                      <div className="body-base text-text-secondary font-medium">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
