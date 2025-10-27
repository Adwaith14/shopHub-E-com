import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main>
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="cart-page">
          <div className="container">
            <h1 style={{ marginBottom: '32px', fontSize: '42px' }}>Shopping Cart</h1>
            
            <div className="cart-container">
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item._id || item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">${item.price}</p>
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => removeFromCart(item._id || item.id)}
                        style={{
                          padding: '8px 16px',
                          background: 'var(--error)',
                          color: 'white',
                          borderRadius: '8px',
                          fontWeight: '600'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>$10.00</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="summary-total">
                  <div className="summary-row">
                    <span>Total:</span>
                    <span>${(getTotalPrice() + 10 + getTotalPrice() * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout" className="btn-checkout">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CartPage;
