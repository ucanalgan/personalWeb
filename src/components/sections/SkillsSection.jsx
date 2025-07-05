import { useState, useEffect, useRef } from 'react';

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const sectionRef = useRef(null);

  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: 'ri-palette-line',
      color: 'from-cyan-400 to-blue-500',
      description: 'Creating engaging user interfaces',
      skills: [
        { name: 'React', icon: 'ri-reactjs-line', description: 'Component-based UI development' },
        { name: 'TypeScript', icon: 'ri-code-s-slash-line', description: 'Type-safe development' },
        { name: 'Tailwind CSS', icon: 'ri-css3-line', description: 'Utility-first styling' },
        { name: 'Next.js', icon: 'ri-layout-line', description: 'Full-stack React framework' },
        { name: 'Vite', icon: 'ri-flashlight-line', description: 'Modern build tooling' }
      ]
    },
    {
      title: 'Backend Development',
      icon: 'ri-server-line',
      color: 'from-green-400 to-emerald-600',
      description: 'Building robust server architectures',
      skills: [
        { name: 'Node.js', icon: 'ri-nodejs-line', description: 'Server-side JavaScript' },
        { name: 'Express.js', icon: 'ri-route-line', description: 'Web application framework' },
        { name: 'Python', icon: 'ri-file-code-line', description: 'Backend scripting & APIs' },
        { name: 'FastAPI', icon: 'ri-rocket-line', description: 'Modern Python web framework' },
        { name: 'REST APIs', icon: 'ri-api-line', description: 'RESTful service design' }
      ]
    },
    {
      title: 'Database & Storage',
      icon: 'ri-database-2-line',
      color: 'from-purple-400 to-indigo-600',
      description: 'Data management and optimization',
      skills: [
        { name: 'MySQL', icon: 'ri-database-2-line', description: 'Relational SQL database' },
        { name: 'MongoDB', icon: 'ri-leaf-line', description: 'NoSQL document storage' },
        { name: 'SQL', icon: 'ri-table-line', description: 'Core SQL knowledge & queries' }
      ]
    },
    {
      title: 'DevOps & Tools',
      icon: 'ri-tools-line',
      color: 'from-orange-400 to-red-500',
      description: 'Deployment and development tools',
      skills: [
        { name: 'Git', icon: 'ri-git-branch-line', description: 'Version control for collaboration' },
        { name: 'GitHub Actions', icon: 'ri-github-line', description: 'Basic CI/CD automation workflows' },
        { name: 'Linux', icon: 'ri-terminal-line', description: 'Command-line and server basics' }
      ]
    }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = sectionRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Auto-rotate categories
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveCategory((prev) => (prev + 1) % skillCategories.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isVisible, skillCategories.length]);

  return (
    <section id="skills" className="py-32 bg-gradient-to-b from-surface/5 via-background to-surface/5 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-ping" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-accent rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-primary rounded-full animate-ping delay-500" />
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-accent rounded-full animate-pulse delay-2000" />
        </div>
        <div className="absolute top-32 right-10 w-64 h-64 bg-gradient-to-l from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-10 w-80 h-80 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-block px-6 py-2 bg-accent/10 text-accent border border-accent/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              Technologies & Tools 
              </span>
              <h2 className="display-2xl mb-8">
                My <span className="gradient-text">Tech Stack</span>
              </h2>
              <p className="body-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              A curated set of technologies and tools utilized across the software development lifecycle — from user interface design to backend architecture and system optimization.
              </p>
            </div>
          </div>

          {/* Category Navigation */}
          <div className={`flex flex-wrap justify-center gap-4 mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {skillCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-500 border backdrop-blur-sm ${
                  activeCategory === index
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/40 text-primary shadow-lg shadow-primary/20'
                    : 'bg-surface/30 border-border text-text-secondary hover:border-primary/30 hover:text-primary'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <i className={`${category.icon} text-lg`} />
                  <span>{category.title}</span>
                </div>
                {activeCategory === index && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Skills Display */}
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Category Info */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  <div className={`bg-gradient-to-br ${skillCategories[activeCategory].color} p-8 rounded-3xl text-white shadow-2xl transform transition-all duration-700`}>
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <i className={`${skillCategories[activeCategory].icon} text-3xl`} />
                      </div>
                      <h3 className="heading-2 mb-3">{skillCategories[activeCategory].title}</h3>
                      <p className="body-base opacity-90">{skillCategories[activeCategory].description}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="ri-code-line" />
                        <span>{skillCategories[activeCategory].skills.length} Technologies</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="ri-time-line" />
                        <span>Production Ready</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="ri-star-line" />
                        <span>Battle Tested</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="lg:col-span-2">
                <div className="grid md:grid-cols-2 gap-6">
                  {skillCategories[activeCategory].skills.map((skill, index) => (
                    <div
                      key={`${activeCategory}-${index}`}
                      className="group relative"
                      onMouseEnter={() => setHoveredSkill(`${activeCategory}-${index}`)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div className="bg-surface/40 border border-border rounded-2xl p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-2">
                        {/* Skill Header */}
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${skillCategories[activeCategory].color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <i className={`${skill.icon} text-2xl`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors duration-300 mb-1">
                              {skill.name}
                            </h4>
                            <p className="text-sm text-text-secondary leading-relaxed">
                              {skill.description}
                            </p>
                          </div>
                        </div>

                        {/* Hover Effect */}
                        {hoveredSkill === `${activeCategory}-${index}` && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl pointer-events-none transition-opacity duration-300" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className={`flex justify-center mt-16 space-x-2 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {skillCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeCategory === index
                    ? 'bg-primary scale-125'
                    : 'bg-surface/50 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className={`text-center mt-20 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="heading-2 mb-4">
                Ready to <span className="gradient-text">Collaborate?</span>
              </h3>
              <p className="body-lg text-text-secondary mb-6 max-w-2xl mx-auto">
                Let's bring your vision to life with modern technologies and best practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary group"
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">View My Projects</span>
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-secondary group"
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">Let's Talk</span>
                  <i className="ri-message-line ml-2 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
