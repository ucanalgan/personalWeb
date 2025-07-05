import { useState } from 'react';
import Button from '../common/Button';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: 'ri-mail-line',
      label: 'Email',
      value: 'umutcanalgan@gmail.com',
      link: 'mailto:umutcanalgan@gmail.com'
    },
    {
      icon: 'ri-phone-line',
      label: 'Phone',
      value: '+90 (XXX) XXX XX XX',
      link: 'tel:+90XXXXXXXXX'
    },
    {
      icon: 'ri-map-pin-line',
      label: 'Location',
      value: 'Turkey',
      link: null
    }
  ];

  const socialLinks = [
    {
      icon: 'ri-github-line',
      label: 'GitHub',
      url: 'https://github.com/ucanalgan',
      color: 'hover:text-gray-400'
    },
    {
      icon: 'ri-linkedin-line',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/umutcanalgan',
      color: 'hover:text-blue-400'
    },
    {
      icon: 'ri-twitter-line',
      label: 'Twitter',
      url: 'https://twitter.com/ucanalgan',
      color: 'hover:text-blue-500'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-surface/10">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Get In <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              I'm always open to discussing new opportunities, interesting projects,
              or just having a conversation about technology and development.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-surface/30 border border-border rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-text-primary mb-6">Send me a message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-text-primary"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-text-primary"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-text-primary resize-none"
                    placeholder="Tell me about your project or just say hello!"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  icon="ri-send-plane-line"
                  className="w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                    <i className="ri-check-line mr-2" />
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    <i className="ri-error-warning-line mr-2" />
                    Failed to send message. Please try again or contact me directly.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center group">
                      <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors duration-300">
                        <i className={`${info.icon} text-primary text-xl`} />
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary">{info.label}</div>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-text-primary hover:text-primary transition-colors duration-300"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-text-primary">{info.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Follow me</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-surface/30 border border-border rounded-lg flex items-center justify-center text-text-secondary transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 ${social.color}`}
                      aria-label={social.label}
                    >
                      <i className={`${social.icon} text-xl`} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
                <h4 className="font-semibold text-text-primary mb-2">Let's work together!</h4>
                <p className="text-text-secondary text-sm">
                  I'm always excited to take on new challenges and collaborate on interesting projects.
                  Whether you have a specific project in mind or just want to explore possibilities,
                  I'd love to hear from you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
