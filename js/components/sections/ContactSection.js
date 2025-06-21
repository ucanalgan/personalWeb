/**
 * Contact Section Component
 * Modular component for the contact section with form handling
 */

class ContactSection {
  constructor() {
    this.container = document.getElementById('contact-container');
    this.initialized = false;
  }

  async render() {
    if (!this.container) {
      console.error('Contact container not found');
      return;
    }

    try {
      // Load HTML content
      const response = await fetch('./components/sections/ContactSection.html');
      if (!response.ok) throw new Error('Failed to fetch contact content');
      
      const htmlContent = await response.text();
      this.container.innerHTML = htmlContent;
      
      this.initializeInteractions();
      this.initialized = true;
      
      console.log('✓ Contact section loaded successfully');
    } catch (error) {
      console.error('Failed to load contact section:', error);
      this.renderFallback();
    }
  }

  renderFallback() {
    // Immediate fallback content
    this.container.innerHTML = `
      <section id="contact" class="py-20 bg-bg-secondary">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto text-center">
            <span class="text-primary font-mono text-lg mb-2 block">What's next?</span>
            <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-6">Get In Touch</h2>
            <p class="text-text-secondary text-lg mb-12 max-w-2xl mx-auto">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, 
              I'll try my best to get back to you!
            </p>
            
            <div class="grid md:grid-cols-3 gap-8 mb-12">
              <!-- Email -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-3xl mb-4">📧</div>
                <h3 class="text-lg font-semibold text-text-primary mb-2">Email</h3>
                <a href="mailto:umutcanalgan@hotmail.com" class="text-primary hover:underline">
                  umutcanalgan@hotmail.com
                </a>
              </div>
              
              <!-- Location -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-3xl mb-4">📍</div>
                <h3 class="text-lg font-semibold text-text-primary mb-2">Location</h3>
                <p class="text-text-secondary">Istanbul, Turkey</p>
              </div>
              
              <!-- LinkedIn -->
              <div class="bg-bg-primary/50 border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <div class="text-3xl mb-4">💼</div>
                <h3 class="text-lg font-semibold text-text-primary mb-2">LinkedIn</h3>
                <a href="https://linkedin.com/in/umutcan-algan/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="text-primary hover:underline">
                  Connect with me
                </a>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="max-w-2xl mx-auto mb-12">
              <form id="contact-form" class="bg-bg-primary/50 border border-border-color rounded-xl p-8">
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label for="name" class="block text-text-primary font-medium mb-2">Name</label>
                    <input type="text" 
                           id="name" 
                           name="name" 
                           required
                           class="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
                           placeholder="Your Name">
                  </div>
                  <div>
                    <label for="email" class="block text-text-primary font-medium mb-2">Email</label>
                    <input type="email" 
                           id="email" 
                           name="email" 
                           required
                           class="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
                           placeholder="your@email.com">
                  </div>
                </div>
                
                <div class="mb-6">
                  <label for="subject" class="block text-text-primary font-medium mb-2">Subject</label>
                  <input type="text" 
                         id="subject" 
                         name="subject" 
                         required
                         class="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
                         placeholder="What's this about?">
                </div>
                
                <div class="mb-6">
                  <label for="message" class="block text-text-primary font-medium mb-2">Message</label>
                  <textarea id="message" 
                            name="message" 
                            rows="5" 
                            required
                            class="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors resize-none"
                            placeholder="Tell me about your project or just say hello!"></textarea>
                </div>
                
                <button type="submit" 
                        class="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-primary">
                  <span class="button-text">Send Message</span>
                  <span class="loading-text hidden">
                    <i class="ri-loader-line animate-spin mr-2"></i>
                    Sending...
                  </span>
                </button>
              </form>
              
              <!-- Form Status Messages -->
              <div id="form-status" class="mt-4 hidden">
                <div class="success-message hidden bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-lg">
                  <i class="ri-check-line mr-2"></i>
                  Thank you! Your message has been sent successfully. I'll get back to you soon.
                </div>
                <div class="error-message hidden bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg">
                  <i class="ri-error-warning-line mr-2"></i>
                  Sorry, there was an error sending your message. Please try again or contact me directly.
                </div>
              </div>
            </div>
            
            <div class="text-center">
              <a href="mailto:umutcanalgan@hotmail.com" 
                 class="inline-flex items-center px-8 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary rounded-xl font-medium transition-all duration-300 hover:scale-105">
                <i class="ri-mail-line mr-2"></i>
                Say Hello
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
    
    this.initializeInteractions();
  }

  initializeInteractions() {
    // Form handling
    const form = this.container.querySelector('#contact-form');
    if (form) {
      form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    // Add focus effects to form inputs
    const inputs = this.container.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
      });
    });

    // Add scroll animations if AOS is available
    if (window.AOS) {
      window.AOS.refresh();
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const loadingText = submitButton.querySelector('.loading-text');
    const statusContainer = this.container.querySelector('#form-status');
    const successMessage = statusContainer.querySelector('.success-message');
    const errorMessage = statusContainer.querySelector('.error-message');

    // Show loading state
    submitButton.disabled = true;
    buttonText.classList.add('hidden');
    loadingText.classList.remove('hidden');
    
    // Hide previous status messages
    statusContainer.classList.add('hidden');
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');

    try {
      // Simulate form submission (replace with actual endpoint)
      await this.submitForm({
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      });

      // Show success message
      statusContainer.classList.remove('hidden');
      successMessage.classList.remove('hidden');
      
      // Reset form
      form.reset();
      
      // Track successful submission
      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'contact',
          event_label: 'success'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error message
      statusContainer.classList.remove('hidden');
      errorMessage.classList.remove('hidden');
      
      // Track failed submission
      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'contact',
          event_label: 'error'
        });
      }
    } finally {
      // Reset button state
      submitButton.disabled = false;
      buttonText.classList.remove('hidden');
      loadingText.classList.add('hidden');
    }
  }

  async submitForm(data) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    console.log('Form data submitted:', data);
    
    // You can implement actual form submission here:
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    
    // if (!response.ok) {
    //   throw new Error('Form submission failed');
    // }
    
    return { success: true };
  }
}

export default ContactSection; 