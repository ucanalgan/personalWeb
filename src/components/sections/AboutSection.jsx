import React from 'react';
import Button from '../common/Button';

const AboutSection = () => {
  const skills = [
    { name: 'React', level: 90, icon: 'ri-reactjs-line' },
    { name: 'Node.js', level: 85, icon: 'ri-nodejs-line' },
    { name: 'Python', level: 80, icon: 'ri-file-code-line' },
    { name: 'TypeScript', level: 85, icon: 'ri-code-s-slash-line' },
    { name: 'PostgreSQL', level: 75, icon: 'ri-database-2-line' },
    { name: 'AWS', level: 70, icon: 'ri-cloud-line' }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Me</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Passionate full-stack developer with a love for creating meaningful digital experiences 
              and solving complex problems through elegant code.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="space-y-6 text-text-secondary leading-relaxed">
                <p>
                  With over 3 years of experience in web development, I specialize in building 
                  modern, scalable applications using cutting-edge technologies. My journey began 
                  with a curiosity about how websites work, and it has evolved into a passion for 
                  crafting exceptional user experiences.
                </p>
                
                <p>
                  I believe in writing clean, maintainable code and following best practices. 
                  Whether it's a complex React application, a robust Node.js backend, or a 
                  data-driven Python script, I approach every project with attention to detail 
                  and a focus on performance.
                </p>

                <p>
                  When I'm not coding, you can find me exploring new technologies, contributing 
                  to open-source projects, or sharing knowledge with the developer community.
                </p>
              </div>

              <div className="mt-8">
                <Button
                  href="#contact"
                  icon="ri-download-line"
                  variant="secondary"
                >
                  Download Resume
                </Button>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-8">Technical Skills</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <i className={`${skill.icon} text-primary mr-3 text-xl`}></i>
                        <span className="font-medium text-text-primary">{skill.name}</span>
                      </div>
                      <span className="text-text-secondary">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-surface/30 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg group-hover:shadow-primary/25"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats or Additional Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-surface/20 border border-border rounded-xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary mb-2">3+</div>
              <div className="text-text-secondary">Years Experience</div>
            </div>
            <div className="text-center p-6 bg-surface/20 border border-border rounded-xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-accent mb-2">50+</div>
              <div className="text-text-secondary">Projects Completed</div>
            </div>
            <div className="text-center p-6 bg-surface/20 border border-border rounded-xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-text-secondary">Learning Mode</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 