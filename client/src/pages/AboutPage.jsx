import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <section className="about-page">
          <div className="container">
            <div className="about-header">
              <h1>About ShopHub</h1>
              <p>
                We're on a mission to revolutionize online shopping by providing high-quality products, 
                exceptional service, and an unmatched customer experience.
              </p>
            </div>

            <div className="about-content">
              <div className="about-text">
                <h2>Our Story</h2>
                <p>
                  Founded in 2020, ShopHub started with a simple idea: make online shopping better for everyone. 
                  What began as a small startup has grown into a trusted e-commerce platform serving thousands 
                  of customers worldwide.
                </p>
                <p>
                  We believe in quality over quantity, sustainability, and building lasting relationships with 
                  our customers. Every product in our catalog is carefully selected and tested to ensure it 
                  meets our high standards.
                </p>
                <p>
                  Today, we're proud to offer a curated selection of products across multiple categories, 
                  backed by a team dedicated to your satisfaction.
                </p>
              </div>
              <div className="about-image">
                <img 
                  src="https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80" 
                  alt="Our team" 
                />
              </div>
            </div>

            <div className="about-features">
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                </div>
                <h3>Quality Products</h3>
                <p>Every item is handpicked and tested to meet our rigorous quality standards.</p>
              </div>

              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h3>Customer First</h3>
                <p>Your satisfaction is our priority. We're here to help 24/7.</p>
              </div>

              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3>Fast Shipping</h3>
                <p>Get your orders delivered quickly and reliably, right to your door.</p>
              </div>
            </div>

            <div className="about-content" style={{ marginTop: '80px' }}>
              <div className="about-image">
                <img 
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80" 
                  alt="Shopping experience" 
                />
              </div>
              <div className="about-text">
                <h2>Why Choose Us?</h2>
                <p>
                  With thousands of satisfied customers and a 4.9-star rating, we've proven that quality 
                  and service matter. Our commitment to excellence shows in everything we do.
                </p>
                <p>
                  From our carefully curated product selection to our hassle-free returns policy, 
                  we make shopping easy and enjoyable. Join our community and experience the difference.
                </p>
                <div style={{ marginTop: '32px' }}>
                  <Link to="/products" className="btn-primary">
                    Shop Now
                  </Link>
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

export default AboutPage;
