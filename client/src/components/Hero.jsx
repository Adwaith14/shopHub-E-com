import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-tag">✨ New Fall Collection 2025</span>
          <h1>Redefine Your<br />Style Statement</h1>
          <p>
            Discover curated fashion pieces that blend timeless elegance with contemporary trends. 
            Premium quality, sustainable materials, delivered to your doorstep.
          </p>
          <div className="hero-buttons">
            <a href="#" className="btn-primary">Shop Collection</a>
            <a href="#" className="btn-secondary">View Lookbook</a>
          </div>
        </div>
        
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" 
            alt="Fashion model"
            className="hero-img-main"
          />
          <div className="hero-img-accent">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" 
              alt="Fashion accessories"
            />
          </div>
        </div>
      </div>
      
      <div className="hero-stats-wrapper">
        <div className="container">
          <div className="hero-stats">
            <div className="stat-item">
              <h3>5K+</h3>
              <p>Products</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>50K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>4.9★</h3>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
