/**
 * Modern Kişisel Web Sitesi
 * @author Umutcan Algan
 * @version 3.0.0
 */

// Yapılandırma
const config = {
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  scroll: {
    threshold: 100,
    smooth: true,
  },
  mobile: {
    breakpoint: 768,
  }
};

// DOM Elementleri
const elements = {
  header: document.querySelector('header'),
  mobileMenu: document.querySelector('.mobile-menu'),
  mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
  mobileMenuCloseBtn: document.querySelector('.mobile-menu-close'),
  scrollTopBtn: document.querySelector('#scroll-top'),
  navLinks: document.querySelectorAll('.nav-link'),
  sections: document.querySelectorAll('section[id]'),
  skillCards: document.querySelectorAll('.skill-card'),
  projectCards: document.querySelectorAll('.project-card')
};

// Yardımcı Fonksiyonlar
const utils = {
  // DOM Yardımcıları
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => document.querySelectorAll(selector),
  
  // Sınıf Yardımcıları
  addClass: (element, className) => element?.classList.add(className),
  removeClass: (element, className) => element?.classList.remove(className),
  toggleClass: (element, className, force) => element?.classList.toggle(className, force),
  hasClass: (element, className) => element?.classList.contains(className),
  
  // Scroll Yardımcıları
  scrollTo: (element, options = {}) => {
    const defaults = {
      behavior: config.scroll.smooth ? 'smooth' : 'auto',
      block: 'start',
    };
    element?.scrollIntoView({ ...defaults, ...options });
  },
  
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top <= windowHeight &&
      rect.bottom >= 0 &&
      rect.left <= windowWidth &&
      rect.right >= 0
    );
  }
};

// Olay İşleyicileri
const handlers = {
  scroll: () => {
    const scrolled = window.scrollY > config.scroll.threshold;
    
    // Scroll Top Button
    if (elements.scrollTopBtn) {
      elements.scrollTopBtn.classList.toggle('opacity-100', scrolled);
      elements.scrollTopBtn.classList.toggle('pointer-events-auto', scrolled);
    }
    
    // Header Shadow
    if (elements.header) {
      elements.header.classList.toggle('shadow-lg', scrolled);
    }
    
    // Aktif Bölüm Tespiti
    elements.sections.forEach(section => {
      if (utils.isInViewport(section)) {
        const id = section.getAttribute('id');
        elements.navLinks.forEach(link => {
          link.classList.toggle('text-primary', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  
  toggleMobileMenu: (force) => {
    const isOpen = force ?? !elements.mobileMenu.classList.contains('hidden');
    elements.mobileMenu.classList.toggle('hidden', !isOpen);
    document.body.classList.toggle('overflow-hidden', isOpen);
  },
  
  scrollTop: () => {
    window.scrollTo({
      top: 0,
      behavior: config.scroll.smooth ? 'smooth' : 'auto'
    });
  }
};

// Teknoloji ve projeler verisi
const techData = {
  'Python': {
    percentage: 90,
    color: 'rgb(88, 123, 206)',
    projects: ['ai-chat-bot', 'finance-analysis']
  },
  'C': {
    percentage: 85,
    color: 'rgb(255, 99, 132)',
    projects: []
  },
  'C++': {
    percentage: 80,
    color: 'rgb(54, 162, 235)',
    projects: []
  },
  'HTML': {
    percentage: 95,
    color: 'rgb(255, 159, 64)',
    projects: ['portfolio']
  },
  'CSS': {
    percentage: 90,
    color: 'rgb(75, 192, 192)',
    projects: ['portfolio']
  },
  'JavaScript': {
    percentage: 85,
    color: 'rgb(153, 102, 255)',
    projects: ['task-manager', 'league-tracker', 'portfolio']
  },
  'Java': {
    percentage: 75,
    color: 'rgb(255, 205, 86)',
    projects: ['inventory-system']
  }
};

let currentFilter = null;
let skillChart = null;

// Pasta grafik oluştur
function initializeSkillsChart() {
  const ctx = document.getElementById('skillsChart');
  if (!ctx) return;

  // Eğer zaten bir grafik varsa yok et
  if (skillChart) {
    skillChart.destroy();
  }

  // Toplam yüzdeyi hesapla
  const totalPercentage = Object.values(techData)
    .reduce((sum, tech) => sum + tech.percentage, 0) / Object.keys(techData).length;

  const data = {
    labels: Object.keys(techData),
    datasets: [{
      data: Object.values(techData).map(tech => tech.percentage),
      backgroundColor: Object.values(techData).map(tech => tech.color),
      hoverBackgroundColor: Object.values(techData).map(tech => tech.color.replace('rgb', 'rgba').replace(')', ', 0.9)')),
      borderWidth: 3,
      borderColor: '#0a192f',
      hoverBorderWidth: 0,
      hoverOffset: 15
    }]
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      cutout: '65%',
      radius: '90%',
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#94a3b8',
            font: {
              family: "'Space Grotesk', sans-serif",
              size: 14,
              weight: 'bold'
            },
            padding: 20,
            usePointStyle: true,
            generateLabels: function(chart) {
              const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return labels.map(label => {
                if (currentFilter === label.text) {
                  label.fillStyle = label.strokeStyle = techData[label.text].color;
                }
                return label;
              });
            }
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              if (!context.label) return '';
              const value = context.raw || 0;
              return `${context.label}: ${value}% Uzmanlık`;
            }
          },
          backgroundColor: 'rgba(10, 25, 47, 0.95)',
          titleColor: '#64ffda',
          padding: 12,
          titleFont: {
            family: "'Space Grotesk', sans-serif",
            size: 16,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 14
          },
          displayColors: true,
          boxWidth: 10,
          boxHeight: 10,
          boxPadding: 3,
          usePointStyle: true
        }
      },
      onClick: (event, elements) => {
        if (!elements || !elements.length) return;
        
        const index = elements[0].index;
        const tech = Object.keys(techData)[index];
        
        if (currentFilter === tech) {
          filterProjects(null);
          currentFilter = null;
        } else {
          filterProjects(tech);
          currentFilter = tech;
        }
        
        if (skillChart) {
          skillChart.update();
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart',
        onProgress: function(animation) {
          if (!animation.chart) return;
          
          const chart = animation.chart;
          const ctx = chart.ctx;
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          
          ctx.save();
          ctx.fillStyle = '#64ffda';
          ctx.font = 'bold 2rem "Space Grotesk"';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const progress = Math.min(animation.currentStep / animation.numSteps, 1);
          const displayPercentage = Math.round(totalPercentage);
          
          ctx.globalAlpha = progress;
          ctx.fillText(`${displayPercentage}%`, centerX, centerY);
          
          ctx.font = '1rem "Plus Jakarta Sans"';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('Ortalama Uzmanlık', centerX, centerY + 30);
          
          ctx.restore();
        }
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: 200
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: '#0a192f',
          hoverBorderColor: '#64ffda'
        }
      }
    }
  };

  skillChart = new Chart(ctx, config);
  
  // Hover efekti
  ctx.addEventListener('mousemove', (e) => {
    if (!skillChart) return;
    
    const activePoints = skillChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
    if (activePoints && activePoints.length > 0) {
      e.target.style.cursor = 'pointer';
      
      const index = activePoints[0].index;
      const dataset = skillChart.data.datasets[0];
      
      // Hover yapılan dilimi parlat, diğerlerini soldur
      dataset.backgroundColor = dataset.backgroundColor.map((color, i) => 
        i === index ? 
          color.replace('rgb', 'rgba').replace(')', ', 1)') : 
          color.replace('rgb', 'rgba').replace(')', ', 0.5)')
      );
      
      skillChart.update('none');
    } else {
      e.target.style.cursor = 'default';
      
      // Tüm dilimleri normal renklerine döndür
      const dataset = skillChart.data.datasets[0];
      dataset.backgroundColor = Object.values(techData).map(tech => tech.color);
      
      skillChart.update('none');
    }
  });
}

// Projeleri teknolojiye göre filtrele
function filterProjects(technology) {
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!technology) {
    projectCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
      card.style.pointerEvents = 'auto';
    });
    return;
  }

  const selectedProjects = techData[technology].projects;

  projectCards.forEach(card => {
    const projectId = card.getAttribute('data-project-id');
    if (selectedProjects.includes(projectId)) {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
      card.style.pointerEvents = 'auto';
    } else {
      card.style.opacity = '0.3';
      card.style.transform = 'scale(0.95)';
      card.style.pointerEvents = 'none';
    }
  });
}

// Sayfa başlatma
const init = () => {
  // Scroll olayı
  window.addEventListener('scroll', handlers.scroll);
  
  // Mobil menü olayları
  if (elements.mobileMenuBtn && elements.mobileMenuCloseBtn) {
    elements.mobileMenuBtn.addEventListener('click', () => handlers.toggleMobileMenu(true));
    elements.mobileMenuCloseBtn.addEventListener('click', () => handlers.toggleMobileMenu(false));
  }
  
  // Scroll top butonu
  if (elements.scrollTopBtn) {
    elements.scrollTopBtn.addEventListener('click', handlers.scrollTop);
  }
  
  // Navigasyon linkleri
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        utils.scrollTo(target);
        handlers.toggleMobileMenu(false);
      }
    });
  });
};

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
  initializeAnimations();
  initializeMobileMenu();
  initializeScrollEvents();
  initializeSkillsChart();
  initializeScrollAnimations();
});

// Animasyonları başlat
function initializeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-animate').forEach(element => {
    observer.observe(element);
  });
}

// Mobil menü işlemleri
function initializeMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (!menuBtn || !closeBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      mobileMenu.classList.add('opacity-100');
    });
  });

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('opacity-100');
    setTimeout(() => mobileMenu.classList.add('hidden'), 300);
  };

  closeBtn.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
}

// Scroll olayları
function initializeScrollEvents() {
  const header = document.querySelector('header');
  const scrollTopBtn = document.getElementById('scroll-top');
  let lastScroll = 0;
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
      const currentScroll = window.pageYOffset;

      // Header kontrolü
      if (header) {
        if (currentScroll > 50) {
          header.classList.add('backdrop-blur-lg', 'shadow-lg');
        } else {
          header.classList.remove('backdrop-blur-lg', 'shadow-lg');
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
      }

      // Scroll to top butonu kontrolü
      if (scrollTopBtn) {
        if (currentScroll > 500) {
          scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        } else {
          scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
        }
      }

      lastScroll = currentScroll;
    });
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Yetenek çubukları
function initializeSkillBars() {
  const skills = {
    'Python': 90,
    'C': 85,
    'C++': 80,
    'HTML': 95,
    'CSS': 90,
    'JavaScript': 85,
    'Java': 75
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector('.skill-progress-bar');
        if (progressBar) {
          const skill = entry.target.getAttribute('data-skill');
          progressBar.style.width = `${skills[skill]}%`;
        }
      }
    });
  }, { threshold: 0.1 });

  const skillsContainer = document.querySelector('.skills-container');
  if (skillsContainer) {
    Object.entries(skills).forEach(([skill, level]) => {
      const skillElement = document.createElement('div');
      skillElement.className = 'mb-4';
      skillElement.setAttribute('data-skill', skill);
      skillElement.innerHTML = `
        <div class="flex justify-between mb-1">
          <span class="text-sm font-medium text-gray-300">${skill}</span>
          <span class="text-sm font-medium text-primary">${level}%</span>
        </div>
        <div class="skill-progress">
          <div class="skill-progress-bar w-0"></div>
        </div>
      `;
      skillsContainer.appendChild(skillElement);
      observer.observe(skillElement);
    });
  }
}

// Scroll animasyonlarını başlat
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Görünür olduğunda visible sınıfını ekle
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('not-visible');
      } else {
        // Görünmez olduğunda not-visible sınıfını ekle
        entry.target.classList.remove('visible');
        entry.target.classList.add('not-visible');
      }
    });
  }, {
    threshold: 0.2, // Elementin %20'si görünür olduğunda tetikle
    rootMargin: '-50px' // Viewport'tan 50px içeride tetikle
  });

  // Her animasyonlu elementi gözlemle
  animatedElements.forEach(element => {
    // Başlangıçta not-visible sınıfını ekle
    element.classList.add('not-visible');
    observer.observe(element);
  });
}
