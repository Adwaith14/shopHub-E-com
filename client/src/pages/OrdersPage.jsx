
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

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
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/orders/${selectedOrder._id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cancelReason: cancelReason
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Order cancelled successfully!');
        setShowCancelModal(false);
        setSelectedOrder(null);
        setCancelReason('');
        fetchOrders(); // Refresh orders
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      alert('Error cancelling order');
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main>
          <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <h1>Please login to view your orders</h1>
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
        <section className="orders-page">
          <div className="container">
            <h1 style={{ marginBottom: '32px', fontSize: '42px' }}>My Orders</h1>

            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <h2>No orders yet</h2>
                <p>When you place orders, they'll appear here</p>
                <Link to="/products" className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <strong>Order #{order._id.slice(-8)}</strong>
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="order-status">
                        <span className={`status ${
                          order.isCancelled ? 'cancelled' : 
                          order.isDelivered ? 'delivered' : 
                          order.isConfirmed ? 'confirmed' : 
                          'processing'
                        }`}>
                          {order.isCancelled ? 'Cancelled' :
                           order.isDelivered ? 'Delivered' :
                           order.isConfirmed ? 'Confirmed' :
                           'Processing'}
                        </span>
                      </div>
                    </div>

                    {/* Show cancel reason if cancelled */}
                    {order.isCancelled && order.cancelReason && (
                      <div style={{
                        background: 'var(--bg-elevated)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        border: '1px solid var(--error)'
                      }}>
                        <strong style={{ color: 'var(--error)' }}>Cancellation Reason:</strong>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
                          {order.cancelReason}
                        </p>
                      </div>
                    )}

                    {/* Show estimated delivery if confirmed */}
                    {!order.isCancelled && order.estimatedDelivery && (
                      <div style={{
                        background: 'var(--bg-elevated)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        border: '1px solid var(--success)'
                      }}>
                        <strong style={{ color: 'var(--success)' }}>📦 Estimated Delivery:</strong>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}

                    <div className="order-items">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="order-item-details">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p className="order-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-summary">
                      <div className="order-total">
                        <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
                      </div>
                      <div className="order-payment">
                        <span>Payment: {order.paymentMethod.toUpperCase()}</span>
                        <span className={`payment-status ${order.isPaid ? 'paid' : 'pending'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Cancel Order Button */}
                    {!order.isCancelled && !order.isDelivered && (
                      <div style={{ marginTop: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleCancelClick(order)}
                          style={{
                            padding: '10px 24px',
                            background: 'var(--error)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--color-red-600)'}
                          onMouseLeave={(e) => e.target.style.background = 'var(--error)'}
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cancel Order #{selectedOrder._id.slice(-8)}</h2>
              <button onClick={() => setShowCancelModal(false)} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>

              <div className="form-group">
                <label>Reason for Cancellation *</label>
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
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={handleCancelOrder}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Yes, Cancel Order
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Keep Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default OrdersPage;