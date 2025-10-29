import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const { user, token, API_BASE } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelReason('');
    setError('');
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/orders/${selectedOrder._id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cancelReason: cancelReason.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowCancelModal(false);
        setSelectedOrder(null);
        setCancelReason('');
        setSuccessMessage('Order cancelled successfully!');
        setShowSuccessModal(true);
        fetchOrders(); // Refresh orders

        // Auto hide success modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        setError(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      setError('Error cancelling order. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const getOrderStatus = (order) => {
    if (order.isCancelled) return { text: 'Cancelled', color: 'var(--error)' };
    if (order.isDelivered) return { text: 'Delivered', color: 'var(--success)' };
    if (order.isConfirmed) return { text: 'Confirmed', color: 'var(--accent)' };
    return { text: 'Processing', color: '#f59e0b' };
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main>
          <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '16px' }}>Please login to view your orders</h1>
            <Link to="/" className="btn-primary">Go to Home</Link>
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
        <section className="orders-page" style={{ padding: '80px 0', minHeight: '70vh' }}>
          <div className="container">
            <h1 style={{ marginBottom: '32px', fontSize: '42px' }}>My Orders</h1>

            {loading ? (
              <div className="loading" style={{ textAlign: 'center', padding: '60px 0' }}>
                <div className="loading-spinner" style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid var(--border)',
                  borderTop: '4px solid var(--primary)',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: 'var(--text-muted)' }}>Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'var(--bg-elevated)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h2 style={{ marginBottom: '12px', fontSize: '28px' }}>No orders yet</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  When you place orders, they'll appear here
                </p>
                <Link to="/products" className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {orders.map((order) => {
                  const status = getOrderStatus(order);
                  return (
                    <div key={order._id} style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px',
                      transition: 'var(--transition)'
                    }}>
                      {/* Order Header */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div>
                          <strong style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>
                            Order #{order._id.slice(-8)}
                          </strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <span style={{
                          padding: '8px 16px',
                          background: status.color,
                          color: 'white',
                          borderRadius: '20px',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          {status.text}
                        </span>
                      </div>

                      {/* Cancellation Reason */}
                      {order.isCancelled && order.cancelReason && (
                        <div style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          padding: '16px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                          <strong style={{ color: 'var(--error)', display: 'block', marginBottom: '6px' }}>
                            Cancellation Reason:
                          </strong>
                          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                            {order.cancelReason}
                          </p>
                        </div>
                      )}

                      {/* Delivery Information */}
                      {!order.isCancelled && order.isDelivered && order.deliveredAt && (
                        <div style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '16px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          <strong style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Delivered
                          </strong>
                          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                            {new Date(order.deliveredAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}

                      {/* Estimated Delivery */}
                      {!order.isCancelled && !order.isDelivered && order.estimatedDelivery && (
                        <div style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          padding: '16px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                          <strong style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="1" y="3" width="15" height="13"></rect>
                              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                              <circle cx="5.5" cy="18.5" r="2.5"></circle>
                              <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                            Estimated Delivery
                          </strong>
                          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                            {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}

                      {/* Order Items */}
                      <div style={{ marginBottom: '20px' }}>
                        {order.orderItems.map((item, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '12px 0',
                            borderBottom: index < order.orderItems.length - 1 ? '1px solid var(--border)' : 'none'
                          }}>
                            <img 
                              src={item.image} 
                              alt={item.name}
                              style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid var(--border)'
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>{item.name}</h4>
                              <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                Quantity: {item.quantity}
                              </p>
                              <p style={{ margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: '2px solid var(--border)',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        <div>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                            Payment: {order.paymentMethod.toUpperCase()}
                          </p>
                          <span style={{
                            padding: '4px 12px',
                            background: order.isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: order.isPaid ? 'var(--success)' : '#f59e0b',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                            Total Amount
                          </p>
                          <strong style={{ fontSize: '24px', color: 'var(--text-primary)' }}>
                            ${order.totalPrice.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      {/* Cancel Button */}
                      {!order.isCancelled && !order.isDelivered && (
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleCancelClick(order)}
                            style={{
                              padding: '12px 28px',
                              background: 'var(--error)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: '600',
                              fontSize: '15px',
                              cursor: 'pointer',
                              transition: 'var(--transition)'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid var(--border)'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>Cancel Order #{selectedOrder._id.slice(-8)}</h2>
              <button 
                onClick={() => setShowCancelModal(false)} 
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--bg-elevated)'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{ marginBottom: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>

              {error && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--error)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  color: 'var(--error)',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Reason for Cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows="4"
                  placeholder="Please tell us why you're cancelling this order..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: cancelling ? 'var(--text-muted)' : 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: cancelling ? 'not-allowed' : 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="btn-secondary"
                  style={{ 
                    flex: 1, 
                    padding: '14px',
                    cursor: cancelling ? 'not-allowed' : 'pointer'
                  }}
                >
                  Keep Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px', textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--success), var(--primary))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>{successMessage}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your order has been cancelled and will be updated shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="btn-primary"
              style={{ padding: '14px 32px' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default OrdersPage;