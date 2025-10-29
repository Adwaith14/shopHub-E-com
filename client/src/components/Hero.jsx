import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tag">✨ New Fall Collection 2025</span>
            <h1>Redefine Your Style Statement</h1>
            <p>
              Discover curated fashion pieces that blend timeless elegance with
              contemporary trends. Premium quality, sustainable materials,
              delivered to your doorstep.
            </p>
            <div className="hero-buttons">
              <a href="/products" className="btn-primary">
                Shop Collection
              </a>
              <a href="/about" className="btn-secondary">
                View Lookbook
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg" 
              alt="Fashion Collection" 
              className="hero-img-main"
            />
          </div>
        </div>

        <div className="hero-stats-wrapper">
          <div className="hero-stats">
            <div className="stat-item">
              <h3>10k+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Products</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Brands</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
