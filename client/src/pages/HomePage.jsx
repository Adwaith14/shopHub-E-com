import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';

const HomePage = () => {
  const { addToCart } = useContext(CartContext);

  // Featured products for homepage
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Leather Jacket',
      price: 249,
      originalPrice: 399,
      category: "Women's",
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
      badge: 'Sale'
    },
    {
      id: 2,
      name: 'Classic White Sneakers',
      price: 129,
      category: 'Footwear',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      badge: 'New'
    },
    {
      id: 3,
      name: 'Designer Sunglasses',
      price: 189,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
      badge: 'Trending'
    },
    {
      id: 4,
      name: 'Premium Sneakers',
      price: 149,
      category: 'Footwear',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'
    }
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Categories />
        
        {/* Featured Products Section */}
        <section className="products">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>Featured Products</h2>
                <p className="section-subtitle">Handpicked for you</p>
              </div>
              <a href="/products" className="link-view-all">View All Products →</a>
            </div>
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {product.badge && (
                    <span className={`product-badge ${product.badge.toLowerCase()}`}>
                      {product.badge}
                    </span>
                  )}
                  <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} />
                    <div className="product-quick-view">
                      <button className="btn-quick-view">Quick View</button>
                    </div>
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-pricing">
                      <span className="product-price">${product.price}</span>
                      {product.originalPrice && (
                        <span className="product-original-price">${product.originalPrice}</span>
                      )}
                    </div>
                    <button 
                      className="btn-add-to-cart"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
