import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user, token, API_BASE } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    paymentMethod: 'card'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price
        })),
        shippingAddress: {
          fullName: formData.fullName,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: getTotalPrice(),
        taxPrice: getTotalPrice() * 0.1,
        shippingPrice: 10,
        totalPrice: getTotalPrice() + 10 + (getTotalPrice() * 0.1)
      };

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        // Save address to user profile
        await saveAddress(formData);
        
        alert('Order placed successfully!');
        clearCart();
        navigate('/orders');
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (addressData) => {
    try {
      await fetch(`${API_BASE}/users/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: addressData.fullName,
          addressLine: addressData.addressLine,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
          country: addressData.country,
          phone: addressData.phone
        })
      });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const total = getTotalPrice() + 10 + (getTotalPrice() * 0.1);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main>
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Add products to checkout</p>
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
        <section className="checkout-page">
          <div className="container">
            <h1 style={{ marginBottom: '32px', fontSize: '42px' }}>Checkout</h1>
            
            {error && (
              <div style={{ 
                padding: '16px', 
                background: 'var(--error)', 
                color: 'white', 
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                {error}
              </div>
            )}
            
            <div className="checkout-container">
              <form onSubmit={handleSubmit}>
                <div className="checkout-section">
                  <h2>Shipping Information</h2>
                  
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleChange}
                      required
                      placeholder="Street address, P.O. box"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="State / Province"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>PIN Code</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="PIN / ZIP code"
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout-section">
                  <h2>Payment Method</h2>
                  <div className="payment-methods">
                    <label className="payment-option" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                      />
                      <span>Credit / Debit Card</span>
                    </label>
                    <label className="payment-option" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                      />
                      <span>UPI</span>
                    </label>
                    <label className="payment-option" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                      />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-place-order" disabled={loading}>
                  {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </form>

              <div className="cart-summary">
                <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Order Summary</h2>
                {cart.map((item) => (
                  <div key={item._id || item.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
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
                    <span>${total.toFixed(2)}</span>
                  </div>
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

export default CheckoutPage;
