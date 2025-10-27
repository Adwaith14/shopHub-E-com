import React, { useState } from 'react';

const Products = () => {
  const [products] = useState([
    {
      id: 1,
      name: 'Elegant Summer Dress',
      price: 129,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
      badge: 'Sale',
      category: "Women's"
    },
    {
      id: 2,
      name: 'Classic Leather Jacket',
      price: 249,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
      badge: 'New',
      category: "Men's"
    },
    {
      id: 3,
      name: 'Designer Sunglasses',
      price: 89,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
      category: 'Accessories'
    },
    {
      id: 4,
      name: 'Premium Sneakers',
      price: 149,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      badge: 'Trending',
      category: 'Footwear'
    }
  ]);

  const handleAddToCart = (productId) => {
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <section className="products">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>Featured Products</h2>
            <p className="section-subtitle">Handpicked for you</p>
          </div>
          <a href="#" className="link-view-all">View All Products →</a>
        </div>
        <div className="product-grid">
          {products.map((product) => (
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
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
