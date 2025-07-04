/**
 * Advanced Projects Section Component
 * Professional project showcase with filtering, detailed descriptions, and interactive cards
 */

export default function projectsSection() {
  return `
    <section id="projects" class="py-20 bg-bg-secondary">
      <div class="container mx-auto px-6">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              <span class="text-primary">#</span>Featured Projects
            </h2>
            <p class="text-text-secondary max-w-2xl mx-auto text-lg">
              A showcase of my technical skills, problem-solving abilities, and passion for creating 
              meaningful digital experiences.
            </p>
          </div>

          <!-- Project Filters -->
          <div class="project-filters flex flex-wrap justify-center gap-4 mb-12">
            <button class="filter-btn active" data-filter="all">
              <i class="ri-apps-line mr-2"></i>All Projects
            </button>
            <button class="filter-btn" data-filter="fullstack">
              <i class="ri-stack-line mr-2"></i>Full Stack
            </button>
            <button class="filter-btn" data-filter="frontend">
              <i class="ri-layout-line mr-2"></i>Frontend
            </button>
            <button class="filter-btn" data-filter="backend">
              <i class="ri-server-line mr-2"></i>Backend
            </button>
            <button class="filter-btn" data-filter="mobile">
              <i class="ri-smartphone-line mr-2"></i>Mobile
            </button>
            <button class="filter-btn" data-filter="ai">
              <i class="ri-robot-line mr-2"></i>AI/ML
            </button>
          </div>

          <!-- Projects Grid -->
          <div class="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="projects-container">
            <!-- Projects will be dynamically loaded here -->
          </div>

          <!-- Load More Button -->
          <div class="text-center mt-12">
            <button class="btn-base btn-ghost" id="load-more-btn">
              <i class="ri-download-line mr-2"></i>
              Load More Projects
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Project data structure
const projectsData = [
  {
    id: 'modern-portfolio',
    title: 'Modern Portfolio Website',
    category: 'frontend',
    featured: true,
    image: '/assets/images/projects/portfolio-preview.webp',
    description: 'A modern, responsive portfolio website built with cutting-edge web technologies.',
    longDescription: {
      why: 'To showcase my skills and create a professional online presence that stands out in the competitive tech industry.',
      technologies: ['JavaScript ES6+', 'Vite', 'Tailwind CSS', 'CSS Grid/Flexbox', 'Intersection Observer API'],
      challenges: 'Implementing smooth animations without affecting performance, creating a dark/light theme system, and ensuring accessibility.',
      results: '98% Lighthouse performance score, 100% accessibility rating, and significant improvement in professional inquiries.'
    },
    metrics: {
      performance: '98%',
      lighthouse: '96/100',
      loadTime: '0.8s'
    },
    tags: ['Responsive Design', 'Performance', 'Accessibility', 'PWA'],
    links: {
      github: 'https://github.com/ucanalgan/Kişisel_web',
      demo: 'https://ucanalgan.github.io/Kişisel_web',
      case_study: '#'
    },
    status: 'completed',
    date: '2024-01'
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    category: 'fullstack',
    featured: true,
    image: '/assets/images/projects/ecommerce-preview.webp',
    description: 'Full-stack e-commerce solution with admin dashboard, payment integration, and inventory management.',
    longDescription: {
      why: 'To create a comprehensive e-commerce solution that can compete with established platforms while maintaining simplicity.',
      technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Stripe API', 'JWT Authentication'],
      challenges: 'Implementing secure payment processing, managing complex state across multiple components, and optimizing database queries.',
      results: 'Successfully handles 1000+ concurrent users, 99.9% uptime, and processing $10K+ monthly transactions.'
    },
    metrics: {
      users: '5000+',
      uptime: '99.9%',
      transactions: '$50K+'
    },
    tags: ['MERN Stack', 'Payment Gateway', 'Real-time', 'Scalable'],
    links: {
      github: 'https://github.com/ucanalgan/ecommerce-platform',
      demo: 'https://ecommerce-demo.ucanalgan.dev',
      case_study: '#'
    },
    status: 'completed',
    date: '2023-12'
  },
  {
    id: 'task-management',
    title: 'Collaborative Task Manager',
    category: 'fullstack',
    featured: true,
    image: '/assets/images/projects/taskmanager-preview.webp',
    description: 'Team collaboration platform with real-time updates, kanban boards, and advanced analytics.',
    longDescription: {
      why: 'To solve team productivity challenges by creating an intuitive project management tool with real-time collaboration.',
      technologies: ['Vue.js', 'Firebase', 'WebSocket', 'Chart.js', 'PWA', 'Service Workers'],
      challenges: 'Implementing real-time synchronization across multiple users, handling offline functionality, and creating an intuitive drag-and-drop interface.',
      results: 'Increased team productivity by 40%, adopted by 3 companies, and featured in Vue.js community showcase.'
    },
    metrics: {
      productivity: '+40%',
      teams: '15+',
      tasks: '2500+'
    },
    tags: ['Real-time', 'PWA', 'Team Collaboration', 'Analytics'],
    links: {
      github: 'https://github.com/ucanalgan/task-manager',
      demo: 'https://tasks.ucanalgan.dev',
      case_study: '#'
    },
    status: 'completed',
    date: '2023-10'
  },
  {
    id: 'weather-ai',
    title: 'AI Weather Predictor',
    category: 'ai',
    featured: false,
    image: '/assets/images/projects/weather-ai-preview.webp',
    description: 'Machine learning model that predicts weather patterns with 94% accuracy using historical data.',
    longDescription: {
      why: 'To explore machine learning applications in weather forecasting and create more accurate predictions than traditional models.',
      technologies: ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'FastAPI'],
      challenges: 'Processing large datasets efficiently, handling missing data, and optimizing model accuracy.',
      results: '94% prediction accuracy, 30% faster than existing models, and integration with 5 weather apps.'
    },
    metrics: {
      accuracy: '94%',
      speed: '+30%',
      dataPoints: '1M+'
    },
    tags: ['Machine Learning', 'Python', 'Data Science', 'API'],
    links: {
      github: 'https://github.com/ucanalgan/weather-ai',
      demo: 'https://weather-ai.ucanalgan.dev',
      case_study: '#'
    },
    status: 'completed',
    date: '2023-08'
  },
  {
    id: 'mobile-fitness',
    title: 'Fitness Tracker Mobile App',
    category: 'mobile',
    featured: false,
    image: '/assets/images/projects/fitness-app-preview.webp',
    description: 'Cross-platform mobile app for tracking workouts, nutrition, and health metrics.',
    longDescription: {
      why: 'To create a comprehensive fitness solution that motivates users through gamification and social features.',
      technologies: ['React Native', 'TypeScript', 'Redux Toolkit', 'SQLite', 'Expo', 'Push Notifications'],
      challenges: 'Optimizing performance on various devices, implementing offline data sync, and creating engaging user experience.',
      results: '10K+ downloads, 4.8/5 app store rating, and 85% user retention after 30 days.'
    },
    metrics: {
      downloads: '10K+',
      rating: '4.8/5',
      retention: '85%'
    },
    tags: ['React Native', 'Cross-platform', 'Health Tech', 'Offline-first'],
    links: {
      github: 'https://github.com/ucanalgan/fitness-tracker',
      demo: 'https://fitness-demo.ucanalgan.dev',
      case_study: '#'
    },
    status: 'completed',
    date: '2023-06'
  },
  {
    id: 'api-gateway',
    title: 'Microservices API Gateway',
    category: 'backend',
    featured: false,
    image: '/assets/images/projects/api-gateway-preview.webp',
    description: 'High-performance API gateway with rate limiting, authentication, and monitoring.',
    longDescription: {
      why: 'To create a robust API management solution that can handle enterprise-level traffic and security requirements.',
      technologies: ['Node.js', 'Redis', 'Docker', 'Kubernetes', 'JWT', 'GraphQL'],
      challenges: 'Implementing efficient rate limiting, handling high concurrent requests, and maintaining service discovery.',
      results: 'Handles 100K+ requests/minute, 99.99% uptime, and reduced API response time by 60%.'
    },
    metrics: {
      requests: '100K+/min',
      uptime: '99.99%',
      performance: '+60%'
    },
    tags: ['Microservices', 'API Management', 'DevOps', 'Scalability'],
    links: {
      github: 'https://github.com/ucanalgan/api-gateway',
      demo: 'https://api-docs.ucanalgan.dev',
      case_study: '#'
    },
    status: 'in-progress',
    date: '2024-02'
  }
];

// Project card component
function createProjectCard(project) {
  const statusBadge = project.status === 'completed' 
    ? '<span class="status-badge completed">Completed</span>'
    : '<span class="status-badge in-progress">In Progress</span>';

  const featuredBadge = project.featured 
    ? '<span class="featured-badge">Featured</span>' 
    : '';

  return `
    <article class="project-card scale-in" data-category="${project.category}" data-id="${project.id}">
      <div class="project-image-container">
        <img 
          src="${project.image}" 
          alt="${project.title} preview"
          class="project-image"
          loading="lazy"
        >
        <div class="project-overlay">
          <div class="project-badges">
            ${featuredBadge}
            ${statusBadge}
          </div>
          <div class="project-actions">
            <a href="${project.links.demo}" target="_blank" rel="noopener" class="action-btn demo-btn">
              <i class="ri-external-link-line"></i>
              <span>Live Demo</span>
            </a>
            <a href="${project.links.github}" target="_blank" rel="noopener" class="action-btn github-btn">
              <i class="ri-github-line"></i>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
      
      <div class="project-content">
        <div class="project-header">
          <h3 class="project-title">${project.title}</h3>
          <div class="project-meta">
            <span class="project-date">${project.date}</span>
            <span class="project-category">${project.category}</span>
          </div>
        </div>
        
        <p class="project-description">${project.description}</p>
        
        <div class="project-tech-stack">
          ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
        </div>
        
        <div class="project-metrics">
          ${Object.entries(project.metrics).map(([key, value]) => 
            `<div class="metric">
              <span class="metric-value">${value}</span>
              <span class="metric-label">${key}</span>
            </div>`
          ).join('')}
        </div>
        
        <div class="project-footer">
          <button class="btn-base btn-ghost project-details-btn" data-project="${project.id}">
            <i class="ri-information-line mr-2"></i>
            View Details
          </button>
        </div>
      </div>
    </article>
  `;
}

// Initialize projects section
export function initProjectsSection() {
  const container = document.getElementById('projects-container');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  let currentFilter = 'all';
  let displayedProjects = 6;
  
  // Render initial projects
  renderProjects();
  
  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentFilter = btn.dataset.filter;
      displayedProjects = 6;
      renderProjects();
    });
  });
  
  // Load more functionality
  loadMoreBtn.addEventListener('click', () => {
    displayedProjects += 6;
    renderProjects();
  });
  
  function renderProjects() {
    const filteredProjects = currentFilter === 'all' 
      ? projectsData 
      : projectsData.filter(project => project.category === currentFilter);
    
    const projectsToShow = filteredProjects.slice(0, displayedProjects);
    
    container.innerHTML = projectsToShow.map(createProjectCard).join('');
    
    // Show/hide load more button
    loadMoreBtn.style.display = displayedProjects >= filteredProjects.length ? 'none' : 'block';
    
    // Add event listeners to detail buttons
    addDetailListeners();
  }
  
  function addDetailListeners() {
    document.querySelectorAll('.project-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = e.target.closest('.project-details-btn').dataset.project;
        openProjectModal(projectId);
      });
    });
  }
}

// Project detail modal
function openProjectModal(projectId) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;
  
  const modal = document.createElement('div');
  modal.className = 'project-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="modal-content bg-bg-primary border border-border-color rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="modal-header p-6 border-b border-border-color">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-text-primary">${project.title}</h2>
          <button class="modal-close text-text-secondary hover:text-text-primary">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>
      
      <div class="modal-body p-6">
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <img src="${project.image}" alt="${project.title}" class="rounded-xl w-full mb-6">
            
            <div class="project-detail-section">
              <h3 class="text-lg font-semibold text-primary mb-3">
                <i class="ri-question-line mr-2"></i>Why This Project?
              </h3>
              <p class="text-text-secondary">${project.longDescription.why}</p>
            </div>
            
            <div class="project-detail-section">
              <h3 class="text-lg font-semibold text-primary mb-3">
                <i class="ri-tools-line mr-2"></i>Technologies Used
              </h3>
              <div class="flex flex-wrap gap-2">
                ${project.longDescription.technologies.map(tech => 
                  `<span class="tech-tag">${tech}</span>`
                ).join('')}
              </div>
            </div>
          </div>
          
          <div>
            <div class="project-detail-section">
              <h3 class="text-lg font-semibold text-primary mb-3">
                <i class="ri-settings-line mr-2"></i>Challenges & Solutions
              </h3>
              <p class="text-text-secondary">${project.longDescription.challenges}</p>
            </div>
            
            <div class="project-detail-section">
              <h3 class="text-lg font-semibold text-primary mb-3">
                <i class="ri-bar-chart-line mr-2"></i>Results & Impact
              </h3>
              <p class="text-text-secondary mb-4">${project.longDescription.results}</p>
              
              <div class="metrics-grid grid grid-cols-3 gap-4">
                ${Object.entries(project.metrics).map(([key, value]) => 
                  `<div class="metric-card text-center p-3 bg-bg-secondary rounded-lg">
                    <div class="text-xl font-bold text-primary">${value}</div>
                    <div class="text-sm text-text-secondary">${key}</div>
                  </div>`
                ).join('')}
              </div>
            </div>
            
            <div class="project-detail-section">
              <h3 class="text-lg font-semibold text-primary mb-3">
                <i class="ri-links-line mr-2"></i>Project Links
              </h3>
              <div class="flex gap-3">
                <a href="${project.links.demo}" target="_blank" class="btn-base btn-primary flex-1">
                  <i class="ri-external-link-line mr-2"></i>Live Demo
                </a>
                <a href="${project.links.github}" target="_blank" class="btn-base btn-ghost flex-1">
                  <i class="ri-github-line mr-2"></i>Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Close modal functionality
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', handleEscape);
  
  function closeModal() {
    modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscape);
  }
  
  function handleEscape(e) {
    if (e.key === 'Escape') closeModal();
  }
} 