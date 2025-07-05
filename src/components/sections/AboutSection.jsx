import { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ experience: 0, projects: 0, learning: 0 });
  const sectionRef = useRef(null);

  const skills = [
    { name: 'React', level: 90, icon: 'ri-reactjs-line', color: 'from-cyan-400 to-blue-500' },
    { name: 'Node.js', level: 85, icon: 'ri-nodejs-line', color: 'from-green-400 to-green-600' },
    { name: 'Python', level: 80, icon: 'ri-file-code-line', color: 'from-yellow-400 to-orange-500' },
    { name: 'TypeScript', level: 85, icon: 'ri-code-s-slash-line', color: 'from-blue-400 to-blue-600' },
    { name: 'PostgreSQL', level: 75, icon: 'ri-database-2-line', color: 'from-indigo-400 to-purple-500' },
    { name: 'AWS', level: 70, icon: 'ri-cloud-line', color: 'from-orange-400 to-red-500' }
  ];

  const stats = [
    { label: 'Years Experience', value: 2, suffix: '+', icon: 'ri-time-line', color: 'text-cyan-400' },
    { label: 'Projects Completed', value: 15, suffix: '+', icon: 'ri-trophy-line', color: 'text-purple-400' },
    { label: 'Technologies Mastered', value: 10, suffix: '+', icon: 'ri-code-s-slash-line', color: 'text-green-400' }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate stats
          stats.forEach((stat, index) => {
            setTimeout(() => {
              animateCounter(stat.label, stat.value);
            }, index * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const animateCounter = (label, targetValue) => {
    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }

      if (label === 'Years Experience') {
        setAnimatedStats(prev => ({ ...prev, experience: Math.floor(currentValue) }));
      } else if (label === 'Projects Completed') {
        setAnimatedStats(prev => ({ ...prev, projects: Math.floor(currentValue) }));
      } else if (label === 'Technologies Mastered') {
        setAnimatedStats(prev => ({ ...prev, learning: Math.floor(currentValue) }));
      }
    }, 30);
  };

  const getStatValue = (label, originalValue) => {
                if (label === 'Years Experience') return animatedStats.experience;
            if (label === 'Projects Completed') return animatedStats.projects;
            if (label === 'Technologies Mastered') return animatedStats.learning;
    return originalValue;
  };

  return (
    <section id="about" className="py-32 bg-gradient-to-br from-background via-surface/10 to-background relative overflow-hidden">
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
                Web & <span className="gradient-text">Network</span>
                <br />Engineer<span className="gradient-text"> Student </span>
              </h2>
              <p className="body-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              Bridging web technologies and networking principles to build reliable, scalable systems while continuously learning and solving real-world problems.
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-16 items-start mb-20">
            {/* Story Content */}
            <div className="lg:col-span-2">
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="space-y-8">
                  <div className="group">
                    <div className="flex items-start space-x-4 p-6 bg-surface/30 border border-border rounded-2xl backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      🎓
                      </div>
                      <div>
                        <h3 className="heading-3 mb-3 group-hover:text-primary transition-colors duration-300">Academic Development</h3>
                        <p className="body-base text-text-secondary leading-relaxed">
                        Studying Information Systems Engineering, I’m building a strong foundation in both software development and network systems. Through hands-on labs and academic projects, I’ve developed skills in data structures, computer networks, and system design—bridging theory with real-world application.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start space-x-4 p-6 bg-surface/30 border border-border rounded-2xl backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        💻
                      </div>
                      <div>
                        <h3 className="heading-3 mb-3 group-hover:text-primary transition-colors duration-300"> Freelance & Personal Projects</h3>
                        <p className="body-base text-text-secondary leading-relaxed">
                        Outside of school, I’ve worked on several personal and freelance projects to sharpen my skills. From creating dynamic websites and GitHub-integrated portfolios to building small web tools, I focus on practical solutions that are both scalable and user-friendly. These projects reflect my passion for clean architecture and real problem-solving.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start space-x-4 p-6 bg-surface/30 border border-border rounded-2xl backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        🏢
                      </div>
                      <div>
                        <h3 className="heading-3 mb-3 group-hover:text-primary transition-colors duration-300"> Professional & Work Experience</h3>
                        <p className="body-base text-text-secondary leading-relaxed">
                        During my first university year, I worked as an IT Assistant at my school, helping manage hardware/software systems and supporting technical infrastructure. This real-world exposure taught me troubleshooting, teamwork, and the operational side of tech. I continue to explore opportunities that blend my academic focus with real industry experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button
                    href="#contact"
                    icon="ri-download-line"
                    variant="primary"
                    size="lg"
                    className="group"
                  >
                    <span className="group-hover:scale-105 transition-transform duration-200">Download Resume</span>
                  </Button>
                  <Button
                    href="#projects"
                    variant="secondary"
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
                      <div className={`w-16 h-16 ${stat.color} bg-gradient-to-br from-current/20 to-current/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
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
