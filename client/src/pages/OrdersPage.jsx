import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const { user, token, API_BASE } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
                        <span className={`status ${order.isDelivered ? 'delivered' : 'processing'}`}>
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </div>
                    </div>
                    
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default OrdersPage;
