import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductsPage = () => {
  const { addToCart, updateQuantity, isInCart, getCartItem, toast, setToast } = useContext(CartContext);
  const { API_BASE } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    sortBy: 'default',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, timeLeft]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under50':
          result = result.filter(p => p.price < 50);
          break;
        case '50to100':
          result = result.filter(p => p.price >= 50 && p.price <= 100);
          break;
        case '100to200':
          result = result.filter(p => p.price > 100 && p.price <= 200);
          break;
        case 'over200':
          result = result.filter(p => p.price > 200);
          break;
      }
    }

    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      result = result.filter(p => p.rating >= minRating);
    }

    if (filters.search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, products]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      rating: 'all',
      sortBy: 'default',
      search: ''
    });
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <main>
        <section className="products-page">
          <div className="container">
            <div className="products-page-header">
              <h1>All Products</h1>
              <p>Discover our complete collection</p>
            </div>

            <div className="products-layout">
              <aside className="products-sidebar">
                <div className="filter-header">
                  <h3>Filters</h3>
                  <button onClick={clearFilters} className="btn-clear-filters">
                    Clear All
                  </button>
                </div>

                <div className="filter-group">
                  <label>Search</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="filter-search-input"
                  />
                </div>

                <div className="filter-group">
                  <label>Category</label>
                  <div className="filter-options">
                    {categories.map(cat => (
                      <label key={cat} className="filter-option">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat}
                          onChange={() => handleFilterChange('category', cat)}
                        />
                        <span>{cat === 'all' ? 'All Categories' : cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Price Range</label>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'under50', label: 'Under $50' },
                      { value: '50to100', label: '$50 - $100' },
                      { value: '100to200', label: '$100 - $200' },
                      { value: 'over200', label: 'Over $200' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange === option.value}
                          onChange={() => handleFilterChange('priceRange', option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Rating</label>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'All Ratings' },
                      { value: '4.5', label: '4.5★ & above' },
                      { value: '4.0', label: '4.0★ & above' },
                      { value: '3.5', label: '3.5★ & above' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === option.value}
                          onChange={() => handleFilterChange('rating', option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="products-main">
                <div className="products-toolbar">
                  <span className="products-count">
                    {filteredProducts.length} Products {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
                  </span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="sort-select"
                  >
                    <option value="default">Sort by: Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="rating">Rating: High to Low</option>
                  </select>
                </div>

                {loading ? (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading products from database...</p>
                    <p style={{ fontSize: '24px', fontWeight: '700', marginTop: '16px' }}>
                      {timeLeft}s
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      Please wait, fetching products...
                    </p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="empty-state">
                    <h2>No products found</h2>
                    <p>Try adjusting your filters</p>
                    <button onClick={clearFilters} className="btn-primary">
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="product-grid">
                      {currentProducts.map((product) => {
                        const inCart = isInCart(product._id);
                        const cartItem = getCartItem(product._id);

                        return (
                          <div key={product._id} className="product-card">
                            {product.countInStock === 0 && (
                              <span className="product-badge sale">Out of Stock</span>
                            )}
                            <div className="product-image-wrapper">
                              <img src={product.image} alt={product.name} />
                            </div>
                            <div className="product-info">
                              <span className="product-category">{product.category}</span>
                              <h3 className="product-title">{product.name}</h3>
                              <div className="product-rating">
                                ⭐ {product.rating.toFixed(1)}
                              </div>
                              <div className="product-pricing">
                                <span className="product-price">${product.price.toFixed(2)}</span>
                              </div>
                              
                              {inCart ? (
                                <div className="quantity-controls">
                                  <button
                                    className="qty-btn"
                                    onClick={() => updateQuantity(product._id, cartItem.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <span style={{ fontSize: '16px', fontWeight: '600' }}>
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
                                  disabled={product.countInStock === 0}
                                >
                                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="pagination-btn"
                        >
                          ← Previous
                        </button>
                        
                        <div className="pagination-numbers">
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => paginate(index + 1)}
                              className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="pagination-btn"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;
