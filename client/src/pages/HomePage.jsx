import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { addToCart, updateQuantity, isInCart, getCartItem, toast, setToast } = useContext(CartContext);
  const { API_BASE } = useAuth();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH FEATURED PRODUCTS FROM DATABASE
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products?limit=4`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFeaturedProducts(data.products.slice(0, 4));
        }
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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

            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading featured products...</p>
              </div>
            ) : (
              <div className="product-grid">
                {featuredProducts.map(product => {
                  const inCart = isInCart(product._id);
                  const cartItem = getCartItem(product._id);

                  return (
                    <div key={product._id} className="product-card">
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
                        {inCart ? (
                          <div className="quantity-controls">
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(product._id, cartItem.quantity - 1)}
                            >
                              -
                            </button>
                            <span style={{ fontSize: '16px', fontWeight: 600 }}>
                              {cartItem.quantity}
                            </span>
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn-add-to-cart"
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;