import React, { useState } from 'react';
import { useGitHub } from '../../contexts/GitHubContext';
import Button from '../common/Button';

const ProjectsSection = () => {
  const { featuredRepositories, isLoading } = useGitHub();
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'react', label: 'React' },
    { id: 'node', label: 'Node.js' },
    { id: 'python', label: 'Python' }
  ];

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-400',
      TypeScript: 'bg-blue-400',
      Python: 'bg-green-400',
      HTML: 'bg-orange-400',
      CSS: 'bg-blue-500',
      Vue: 'bg-green-500',
      React: 'bg-cyan-400'
    };
    return colors[language] || 'bg-gray-400';
  };

  const filteredProjects = featuredRepositories?.filter(repo => {
    if (filter === 'all') return true;
    if (filter === 'react') return repo.language === 'JavaScript' || repo.language === 'TypeScript';
    if (filter === 'node') return repo.name.includes('node') || repo.name.includes('api');
    if (filter === 'python') return repo.language === 'Python';
    return true;
  });

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Featured <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              A showcase of my recent work, featuring innovative solutions and clean code architecture.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === filterOption.id
                    ? 'bg-primary text-background'
                    : 'bg-surface/30 text-text-secondary hover:text-primary hover:bg-surface/50'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-surface/30 border border-border rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-surface/50 rounded mb-4"></div>
                  <div className="h-3 bg-surface/30 rounded mb-2"></div>
                  <div className="h-3 bg-surface/30 rounded mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 w-16 bg-surface/50 rounded"></div>
                    <div className="h-6 w-12 bg-surface/50 rounded"></div>
                  </div>
                  <div className="h-8 bg-surface/50 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects?.map((project) => (
                <div
                  key={project.id}
                  className="group bg-surface/30 border border-border rounded-2xl p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {project.description || 'No description available'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      {project.language && (
                        <div className="flex items-center">
                          <span className={`w-3 h-3 ${getLanguageColor(project.language)} rounded-full mr-2`}></span>
                          {project.language}
                        </div>
                      )}
                      <div className="flex items-center">
                        <i className="ri-star-line mr-1"></i>
                        {project.stars}
                      </div>
                      <div className="flex items-center">
                        <i className="ri-git-branch-line mr-1"></i>
                        {project.forks}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      href={project.url}
                      target="_blank"
                      variant="secondary"
                      size="sm"
                      icon="ri-github-line"
                      className="flex-1"
                    >
                      Code
                    </Button>
                    {project.homepage && (
                      <Button
                        href={project.homepage}
                        target="_blank"
                        size="sm"
                        icon="ri-external-link-line"
                        className="flex-1"
                      >
                        Live Demo
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && (!filteredProjects || filteredProjects.length === 0) && (
            <div className="text-center py-12">
              <i className="ri-folder-open-line text-4xl text-text-secondary mb-4"></i>
              <p className="text-text-secondary">No projects found for the selected filter.</p>
            </div>
          )}

          {/* View More Button */}
          <div className="text-center mt-12">
            <Button
              href="https://github.com/ucanalgan"
              target="_blank"
              variant="secondary"
              icon="ri-github-line"
              iconPosition="right"
            >
              View All Projects on GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection; 