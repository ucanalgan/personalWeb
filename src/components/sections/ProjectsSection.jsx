import { useState, useEffect, useRef } from 'react';
import { useGitHub } from '../../contexts/GitHubContext';
import Button from '../common/Button';

const ProjectsSection = () => {
  const { featuredRepositories, isLoading } = useGitHub();
  const [filter, setFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const sectionRef = useRef(null);

  // Helper functions defined first
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'from-yellow-400 to-orange-500',
      TypeScript: 'from-blue-400 to-blue-600',
      Python: 'from-green-400 to-green-600',
      HTML: 'from-orange-400 to-red-500',
      CSS: 'from-blue-500 to-purple-500',
      Vue: 'from-green-500 to-teal-500',
      React: 'from-cyan-400 to-blue-500',
      'C++': 'from-blue-600 to-indigo-600',
      Java: 'from-red-500 to-orange-600'
    };
    return colors[language] || 'from-gray-400 to-gray-600';
  };

  const getLanguageIcon = (language) => {
    const icons = {
      JavaScript: 'ri-javascript-line',
      TypeScript: 'ri-code-s-slash-line',
      Python: 'ri-file-code-line',
      HTML: 'ri-html5-line',
      CSS: 'ri-css3-line',
      Vue: 'ri-vuejs-line',
      React: 'ri-reactjs-line'
    };
    return icons[language] || 'ri-code-line';
  };

  // Dynamic filters based on actual repository languages
  const getLanguageFilters = () => {
    if (!featuredRepositories) return [{ id: 'all', label: 'All Projects', icon: 'ri-apps-line', count: 0 }];
    
    const languageCounts = {};
    featuredRepositories.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const baseFilters = [
      { id: 'all', label: 'All Projects', icon: 'ri-apps-line', count: featuredRepositories.length }
    ];

    const languageFilters = Object.entries(languageCounts).map(([language, count]) => ({
      id: language.toLowerCase(),
      label: language,
      icon: getLanguageIcon(language),
      count
    }));

    return [...baseFilters, ...languageFilters];
  };

  const filters = getLanguageFilters();

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const filteredProjects = featuredRepositories?.filter(repo => {
    if (filter === 'all') return true;
    return repo.language?.toLowerCase() === filter;
  }) || [];

  const projects = filteredProjects;

  const ProjectCard = ({ project, index }) => (
    <div
      className={`group relative transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      <div className="relative bg-surface/40 border border-border rounded-3xl overflow-hidden backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-3 group">
        {/* Project Updated Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {new Date(project.updated_at).toLocaleDateString('tr')}
          </span>
        </div>

        {/* Project Image/Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-20 h-20 bg-gradient-to-br ${getLanguageColor(project.language)} rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition-transform duration-300`}>
              <i className={`${getLanguageIcon(project.language)} text-3xl`} />
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex space-x-2">
                {project.topics?.slice(0, 3).map((topic, i) => (
                  <span key={i} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs text-white">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
              {project.name}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
              {project.description || 'No description available'}
            </p>
          </div>

          {/* Project Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              {project.language && (
                <div className="flex items-center space-x-1">
                  <span className={`w-3 h-3 bg-gradient-to-r ${getLanguageColor(project.language)} rounded-full`} />
                  <span>{project.language}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <i className="ri-star-line text-yellow-400" />
                <span>{project.stargazers_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="ri-git-branch-line text-primary" />
                <span>{project.forks_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              href={project.url || project.html_url || `https://github.com/ucanalgan/${project.name}`}
              target="_blank"
              variant="secondary"
              size="sm"
              icon="ri-github-line"
              className="flex-1 group-hover:scale-105 transition-transform duration-200"
            >
              View Code
            </Button>
            {project.homepage && (
              <Button
                href={project.homepage}
                target="_blank"
                size="sm"
                icon="ri-external-link-line"
                className="flex-1 group-hover:scale-105 transition-transform duration-200"
              >
                Live Demo
              </Button>
            )}
          </div>
        </div>

        {/* Hover glow effect */}
        {hoveredProject === project.id && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl pointer-events-none transition-opacity duration-300" />
        )}
      </div>
    </div>
  );

  return (
    <section id="projects" className="py-32 bg-gradient-to-br from-background via-surface/5 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-l from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Floating elements */}
        <div className="absolute top-32 left-20 w-2 h-2 bg-primary rounded-full animate-ping" />
        <div className="absolute top-64 right-32 w-1 h-1 bg-accent rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-32 w-1.5 h-1.5 bg-primary rounded-full animate-ping delay-500" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-block px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                Featured Work
              </span>
              <h2 className="display-2xl mb-8">
                My <span className="gradient-text">Projects</span>
              </h2>
              <p className="body-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              A portfolio of well-structured projects built with reliable tools, production-ready practices, and a focus on maintainability.
              </p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className={`mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {filters.map((filterOption) => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`group flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 border backdrop-blur-sm ${
                      filter === filterOption.id
                        ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/40 text-primary shadow-lg shadow-primary/20'
                        : 'bg-surface/30 border-border text-text-secondary hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    <i className={`${filterOption.icon} text-lg`} />
                    <span>{filterOption.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      filter === filterOption.id
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface/50 text-text-secondary group-hover:text-primary'
                    }`}>
                      {filterOption.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-surface/30 border border-border rounded-2xl p-1 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  <i className="ri-grid-line" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  <i className="ri-list-check" />
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-surface/30 border border-border rounded-3xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-surface/50" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-surface/50 rounded-xl w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-surface/30 rounded-lg" />
                      <div className="h-4 bg-surface/30 rounded-lg w-5/6" />
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-surface/50 rounded-xl flex-1" />
                      <div className="h-8 bg-surface/50 rounded-xl flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid'
                ? 'md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {projects?.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}

          {!isLoading && (!projects || projects.length === 0) && (
            <div className={`text-center py-20 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-folder-open-line text-4xl text-text-secondary" />
              </div>
              <h3 className="heading-2 mb-4">No Projects Found</h3>
              <p className="body-base text-text-secondary">No projects match the selected filter. Try selecting a different category.</p>
            </div>
          )}

          {/* Call to Action */}
          <div className={`text-center mt-20 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="heading-2 mb-4">
                Like What You See?
              </h3>
              <p className="body-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                These projects represent just a glimpse of what's possible. Let's collaborate
                to bring your vision to life with the same attention to detail and innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="https://github.com/ucanalgan"
                  target="_blank"
                  variant="primary"
                  size="lg"
                  icon="ri-github-line"
                  iconPosition="right"
                  className="group"
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">View All on GitHub</span>
                </Button>
                <Button
                  href="#contact"
                  variant="secondary"
                  size="lg"
                  icon="ri-message-line"
                  className="group"
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">Start a Project</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
