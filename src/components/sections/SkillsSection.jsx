import React from 'react';

const SkillsSection = () => {
  const skillCategories = [
    {
      title: 'Frontend',
      icon: 'ri-palette-line',
      skills: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vite']
    },
    {
      title: 'Backend',
      icon: 'ri-server-line',
      skills: ['Node.js', 'Express.js', 'Python', 'Django', 'FastAPI', 'REST APIs']
    },
    {
      title: 'Database',
      icon: 'ri-database-2-line',
      skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Prisma', 'SQLAlchemy']
    },
    {
      title: 'DevOps & Tools',
      icon: 'ri-tools-line',
      skills: ['Docker', 'AWS', 'Git', 'GitHub Actions', 'Linux', 'Nginx']
    }
  ];

  return (
    <section id="skills" className="py-20 bg-surface/5">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              My <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Skills</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              A comprehensive toolkit for building modern, scalable applications across the full stack.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category, index) => (
              <div key={index} className="group">
                <div className="bg-surface/30 border border-border rounded-2xl p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <i className={`${category.icon} text-2xl text-primary`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">{category.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="bg-background/50 px-3 py-2 rounded-lg text-center text-sm text-text-secondary hover:text-primary transition-colors duration-300 cursor-default"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 