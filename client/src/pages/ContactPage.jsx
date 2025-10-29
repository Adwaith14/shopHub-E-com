
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, just show success message (not saving anywhere)
    console.log('Form submitted:', formData);

    // Show success modal
    setShowSuccess(true);

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="contact-page">
          <div className="container">
            {/* Header */}
            <div className="contact-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Get in Touch</h1>
              <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {/* Contact Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              marginBottom: '64px'
            }}>
              {/* Customer Care Info Cards */}
              <div className="contact-card" style={{
                background: 'var(--bg-card)',
                padding: '32px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                textAlign: 'center',
                transition: 'var(--transition)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, var(--primary), var(--success))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Call Us</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Mon-Fri from 8am to 6pm
                </p>
                <a href="tel:+1234567890" style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--primary)'
                }}>
                  +1 (234) 567-890
                </a>
              </div>

              <div className="contact-card" style={{
                background: 'var(--bg-card)',
                padding: '32px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                textAlign: 'center',
                transition: 'var(--transition)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, var(--primary), var(--success))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Email Us</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  We'll respond within 24 hours
                </p>
                <a href="mailto:support@shophub.com" style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--primary)'
                }}>
                  support@shophub.com
                </a>
              </div>

              <div className="contact-card" style={{
                background: 'var(--bg-card)',
                padding: '32px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                textAlign: 'center',
                transition: 'var(--transition)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, var(--primary), var(--success))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Visit Us</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Come say hello at our office
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6'
                }}>
                  123 Commerce Street<br/>
                  New York, NY 10013
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                background: 'var(--bg-card)',
                padding: '48px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)'
              }}>
                <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Send us a Message</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label>Your Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Tell us more about your inquiry..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
              <div className="modal-overlay" style={{ zIndex: 9999 }}>
                <div className="modal-content" style={{ maxWidth: '450px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, var(--success), var(--primary))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Message Sent!</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
                    Thank you for reaching out! We've received your message and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="btn-primary"
                    style={{ padding: '14px 32px' }}
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div style={{ marginTop: '96px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Frequently Asked Questions</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', fontSize: '18px' }}>
                Quick answers to common questions
              </p>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                textAlign: 'left'
              }}>
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '24px',
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--border)'
                }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: '700' }}>
                    What are your shipping times?
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  padding: '24px',
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--border)'
                }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: '700' }}>
                    What's your return policy?
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    We offer 30-day returns on most items. Products must be unused and in original packaging.
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  padding: '24px',
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--border)'
                }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: '700' }}>
                    Do you ship internationally?
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Yes! We ship to over 100 countries worldwide. International shipping takes 7-14 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;