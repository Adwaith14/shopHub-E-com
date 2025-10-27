import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user, token, API_BASE } = useAuth();
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  
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

  // Fetch saved addresses on component mount
  useEffect(() => {
    if (user && token) {
      fetchSavedAddresses();
    }
  }, [user, token]);

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSavedAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setUseNewAddress(false);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData({
      ...formData,
      fullName: address.fullName || '',
      phone: address.phone || '',
      addressLine: address.addressLine || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || ''
    });
  };

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
        // Save address if it's new
        if (useNewAddress) {
          await saveAddress(formData);
        }
        
        alert('✅ Order placed successfully!');
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

                  {/* Saved Addresses Section */}
                  {savedAddresses.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <button
                          type="button"
                          onClick={() => setUseNewAddress(false)}
                          style={{
                            padding: '10px 20px',
                            background: !useNewAddress ? 'var(--primary)' : 'var(--bg-elevated)',
                            color: !useNewAddress ? 'white' : 'var(--text-primary)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            border: '1px solid var(--border)'
                          }}
                        >
                          Use Saved Address
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUseNewAddress(true);
                            setSelectedAddress(null);
                            setFormData({
                              ...formData,
                              fullName: user?.name || '',
                              phone: '',
                              addressLine: '',
                              city: '',
                              state: '',
                              pincode: '',
                              country: ''
                            });
                          }}
                          style={{
                            padding: '10px 20px',
                            background: useNewAddress ? 'var(--primary)' : 'var(--bg-elevated)',
                            color: useNewAddress ? 'white' : 'var(--text-primary)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            border: '1px solid var(--border)'
                          }}
                        >
                          Add New Address
                        </button>
                      </div>

                      {!useNewAddress && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {savedAddresses.map((addr, index) => (
                            <div
                              key={index}
                              onClick={() => handleAddressSelect(addr)}
                              style={{
                                padding: '16px',
                                background: selectedAddress === addr ? 'var(--primary)' : 'var(--bg-elevated)',
                                color: selectedAddress === addr ? 'white' : 'var(--text-primary)',
                                border: `2px solid ${selectedAddress === addr ? 'var(--primary)' : 'var(--border)'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                              }}
                            >
                              <strong>{addr.fullName}</strong>
                              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                              </p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                Phone: {addr.phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Address Form */}
                  {(useNewAddress || savedAddresses.length === 0) && (
                    <>
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
                    </>
                  )}
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

                <button type="submit" className="btn-place-order" disabled={loading || (!useNewAddress && !selectedAddress)}>
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
