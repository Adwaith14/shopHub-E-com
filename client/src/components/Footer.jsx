import React from 'react';

const Footer = () => {
  const footerLinks = {
    shop: ['All Products', 'New Arrivals', 'Best Sellers', 'Collections'],
    company: ['About Us', 'Contact', 'Careers', 'Press'],
    support: ['Help Center', 'Shipping Info', 'Returns', 'FAQs']
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-column footer-brand-col">
          <a href="#" className="footer-brand">ShopHub</a>
          <p className="footer-tagline">
            Premium curation for modern living. Quality products, exceptional service.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Twitter" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-column">
          <h4>Shop</h4>
          {footerLinks.shop.map((link, index) => (
            <a href="#" key={index}>{link}</a>
          ))}
        </div>
        
        <div className="footer-column">
          <h4>Company</h4>
          {footerLinks.company.map((link, index) => (
            <a href="#" key={index}>{link}</a>
          ))}
        </div>
        
        <div className="footer-column">
          <h4>Support</h4>
          {footerLinks.support.map((link, index) => (
            <a href="#" key={index}>{link}</a>
          ))}
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 ShopHub. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <span className="dot-separator">•</span>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
