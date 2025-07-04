/**
 * Contact Section Component
 * Professional contact form with validation, animations, and multiple contact methods
 */

export default function contactSection() {
  return `
    <section id="contact" class="py-20 bg-bg-primary">
      <div class="container mx-auto px-6">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              <span class="text-primary">#</span>Get In Touch
            </h2>
            <p class="text-text-secondary max-w-2xl mx-auto text-lg">
              I'm always open to discussing new opportunities, interesting projects, 
              or just having a conversation about technology. Let's create something amazing together!
            </p>
          </div>

          <div class="grid lg:grid-cols-2 gap-12 items-start">
            <!-- Contact Information -->
            <div class="space-y-8">
              <div class="fade-in-left">
                <h3 class="text-2xl font-bold text-text-primary mb-6">
                  Let's Start a Conversation
                </h3>
                <p class="text-text-secondary mb-8 leading-relaxed">
                  Whether you have a project in mind, need technical consultation, 
                  or want to discuss potential collaborations, I'd love to hear from you.
                </p>

                <!-- Contact Methods -->
                <div class="space-y-6">
                  <div class="contact-method">
                    <div class="flex items-center group">
                      <div class="contact-icon">
                        <i class="ri-mail-line"></i>
                      </div>
                      <div class="ml-4">
                        <h4 class="font-semibold text-text-primary group-hover:text-primary transition-colors">
                          Email
                        </h4>
                        <a href="mailto:umutcanalgan@gmail.com" class="text-text-secondary hover:text-primary transition-colors">
                          umutcanalgan@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-method">
                    <div class="flex items-center group">
                      <div class="contact-icon">
                        <i class="ri-linkedin-line"></i>
                      </div>
                      <div class="ml-4">
                        <h4 class="font-semibold text-text-primary group-hover:text-primary transition-colors">
                          LinkedIn
                        </h4>
                        <a href="https://linkedin.com/in/umutcanalgan" target="_blank" rel="noopener" class="text-text-secondary hover:text-primary transition-colors">
                          /in/umutcanalgan
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-method">
                    <div class="flex items-center group">
                      <div class="contact-icon">
                        <i class="ri-github-line"></i>
                      </div>
                      <div class="ml-4">
                        <h4 class="font-semibold text-text-primary group-hover:text-primary transition-colors">
                          GitHub
                        </h4>
                        <a href="https://github.com/ucanalgan" target="_blank" rel="noopener" class="text-text-secondary hover:text-primary transition-colors">
                          @ucanalgan
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="contact-method">
                    <div class="flex items-center group">
                      <div class="contact-icon">
                        <i class="ri-map-pin-line"></i>
                      </div>
                      <div class="ml-4">
                        <h4 class="font-semibold text-text-primary group-hover:text-primary transition-colors">
                          Location
                        </h4>
                        <span class="text-text-secondary">
                          Turkey (Remote Available)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Quick Response Time -->
                <div class="mt-8 p-4 bg-bg-secondary/50 border border-border-color rounded-xl">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                    <span class="text-text-secondary">
                      Typically responds within <strong class="text-primary">24 hours</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="fade-in-right">
              <div class="contact-form-container bg-bg-secondary/30 backdrop-blur-sm border border-border-color rounded-2xl p-8">
                <form id="contact-form" name="contact" method="POST" class="space-y-6" novalidate>
                  <!-- Hidden field for Netlify -->
                  <input type="hidden" name="form-name" value="contact" />
                  
                  <!-- Name Field -->
                  <div class="field-group">
                    <label for="name" class="field-label">
                      Full Name <span class="text-red-500">*</span>
                    </label>
                    <div class="field-wrapper">
                      <div class="field-icon">
                        <i class="ri-user-line"></i>
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        class="form-input"
                        placeholder="Enter your full name"
                        autocomplete="name"
                      />
                    </div>
                  </div>

                  <!-- Email Field -->
                  <div class="field-group">
                    <label for="email" class="field-label">
                      Email Address <span class="text-red-500">*</span>
                    </label>
                    <div class="field-wrapper">
                      <div class="field-icon">
                        <i class="ri-mail-line"></i>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        class="form-input"
                        placeholder="Enter your email address"
                        autocomplete="email"
                      />
                    </div>
                  </div>

                  <!-- Subject Field -->
                  <div class="field-group">
                    <label for="subject" class="field-label">
                      Subject <span class="text-red-500">*</span>
                    </label>
                    <div class="field-wrapper">
                      <div class="field-icon">
                        <i class="ri-chat-3-line"></i>
                      </div>
                      <select
                        id="subject"
                        name="subject"
                        required
                        class="form-input"
                      >
                        <option value="">Select a subject</option>
                        <option value="Project Collaboration">Project Collaboration</option>
                        <option value="Job Opportunity">Job Opportunity</option>
                        <option value="Technical Consultation">Technical Consultation</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <!-- Message Field -->
                  <div class="field-group">
                    <label for="message" class="field-label">
                      Message <span class="text-red-500">*</span>
                    </label>
                    <div class="field-wrapper">
                      <div class="field-icon field-icon-top">
                        <i class="ri-message-3-line"></i>
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="5"
                        class="form-input form-textarea"
                        placeholder="Tell me about your project, ideas, or how I can help you..."
                        style="resize: vertical;"
                      ></textarea>
                    </div>
                  </div>

                  <!-- Budget Field (Optional) -->
                  <div class="field-group">
                    <label for="budget" class="field-label">
                      Project Budget (Optional)
                    </label>
                    <div class="field-wrapper">
                      <div class="field-icon">
                        <i class="ri-money-dollar-circle-line"></i>
                      </div>
                      <select
                        id="budget"
                        name="budget"
                        class="form-input"
                      >
                        <option value="">Select budget range</option>
                        <option value="< $1,000">Less than $1,000</option>
                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000+">$10,000+</option>
                        <option value="Discuss">Let's discuss</option>
                      </select>
                    </div>
                  </div>

                  <!-- Privacy Notice -->
                  <div class="field-group">
                    <label class="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="privacy"
                        required
                        class="form-checkbox mt-1"
                      />
                      <span class="text-sm text-text-secondary">
                        I agree to the processing of my personal data and consent to being contacted about my inquiry. 
                        <a href="#privacy" class="text-primary hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    class="btn-base btn-primary w-full py-4 text-lg font-semibold"
                  >
                    <i class="ri-send-plane-line mr-2"></i>
                    Send Message
                  </button>

                  <!-- Form Status Message -->
                  <div class="form-message hidden"></div>
                </form>

                <!-- Alternative Contact -->
                <div class="mt-8 pt-6 border-t border-border-color text-center">
                  <p class="text-sm text-text-secondary mb-4">
                    Prefer to reach out directly?
                  </p>
                  <div class="flex justify-center space-x-4">
                    <a 
                      href="mailto:umutcanalgan@gmail.com" 
                      class="btn-base btn-ghost btn-sm"
                      aria-label="Send email"
                    >
                      <i class="ri-mail-line mr-2"></i>
                      Email
                    </a>
                    <a 
                      href="https://linkedin.com/in/umutcanalgan" 
                      target="_blank" 
                      rel="noopener"
                      class="btn-base btn-ghost btn-sm"
                      aria-label="Connect on LinkedIn"
                    >
                      <i class="ri-linkedin-line mr-2"></i>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Initialize contact section functionality
export function initContactSection() {
  // Import and initialize form handler
  import('../../../utils/form-handler.js').then(({ initContactForm }) => {
    if (initContactForm) {
      initContactForm();
    }
  }).catch(error => {
    console.warn('Form handler not available:', error);
  });

  // Add contact method interactions
  initContactMethods();
  
  // Add form field enhancements
  initFormEnhancements();
}

function initContactMethods() {
  const contactMethods = document.querySelectorAll('.contact-method');
  
  contactMethods.forEach(method => {
    method.addEventListener('mouseenter', () => {
      method.style.transform = 'translateX(8px)';
    });
    
    method.addEventListener('mouseleave', () => {
      method.style.transform = 'translateX(0)';
    });
  });
}

function initFormEnhancements() {
  // Add focus animations to form fields
  const formInputs = document.querySelectorAll('.form-input');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', (e) => {
      const wrapper = e.target.closest('.field-wrapper');
      if (wrapper) {
        wrapper.classList.add('focused');
      }
    });
    
    input.addEventListener('blur', (e) => {
      const wrapper = e.target.closest('.field-wrapper');
      if (wrapper) {
        wrapper.classList.remove('focused');
      }
    });
    
    // Add typing animation effect
    input.addEventListener('input', (e) => {
      const wrapper = e.target.closest('.field-wrapper');
      if (wrapper) {
        wrapper.classList.toggle('has-content', e.target.value.length > 0);
      }
    });
  });

  // Character counter for message field
  const messageField = document.getElementById('message');
  if (messageField) {
    addCharacterCounter(messageField);
  }
}

function addCharacterCounter(textarea) {
  const maxLength = 1000;
  const counter = document.createElement('div');
  counter.className = 'character-counter text-sm text-text-secondary mt-2';
  
  const updateCounter = () => {
    const remaining = maxLength - textarea.value.length;
    counter.textContent = `${textarea.value.length}/${maxLength}`;
    
    if (remaining < 50) {
      counter.classList.add('text-yellow-500');
    } else {
      counter.classList.remove('text-yellow-500');
    }
    
    if (remaining < 0) {
      counter.classList.add('text-red-500');
      counter.classList.remove('text-yellow-500');
    } else {
      counter.classList.remove('text-red-500');
    }
  };
  
  textarea.addEventListener('input', updateCounter);
  textarea.parentElement.parentElement.appendChild(counter);
  updateCounter();
}