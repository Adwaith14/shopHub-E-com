
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, token, API_BASE } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  const [panelMsg, setPanelMsg] = useState('');
  const [panelMsgType, setPanelMsgType] = useState('success');

  // Products state
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    countInStock: '',
    rating: 4.5
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryDays, setDeliveryDays] = useState(3);

  // Users state
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      let response = await fetch(`${API_BASE}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        response = await fetch(`${API_BASE}/users/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.users) {
          setUsers(data.users);
        } else if (Array.isArray(data)) {
          setUsers(data);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const showMessage = (message, type = 'success') => {
    setPanelMsg(message);
    setPanelMsgType(type);
    setTimeout(() => setPanelMsg(''), 3000);
  };

  const confirmOrder = async (orderId, days) => {
    try {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + days);

      const response = await fetch(`${API_BASE}/orders/${orderId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estimatedDelivery: deliveryDate.toISOString(),
          deliveryDays: days,
          isConfirmed: true
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showMessage(`Order confirmed! Will be delivered in ${days} days`, 'success');
        fetchOrders();
        setSelectedOrder(null);
      } else {
        showMessage(data.message || 'Failed to confirm order', 'error');
      }
    } catch (error) {
      showMessage('Error confirming order', 'error');
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isDelivered: true,
          deliveredAt: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showMessage('Order marked as delivered!', 'success');
        fetchOrders();
      } else {
        showMessage(data.message || 'Failed to update order', 'error');
      }
    } catch (error) {
      showMessage('Error updating order', 'error');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `${API_BASE}/products/${editingProduct._id}`
        : `${API_BASE}/products`;

      const method = editingProduct ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          countInStock: parseInt(productForm.countInStock),
          rating: parseFloat(productForm.rating)
        })
      });

      const data = await response.json();

      if (data.success) {
        showMessage(editingProduct ? 'Product updated!' : 'Product created!', 'success');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          price: '',
          category: '',
          description: '',
          image: '',
          countInStock: '',
          rating: 4.5
        });
        fetchProducts();
      } else {
        showMessage(data.message || 'Error saving product', 'error');
      }
    } catch (error) {
      showMessage('Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Product deleted!', 'success');
        fetchProducts();
      } else {
        showMessage('Failed to delete product', 'error');
      }
    } catch (error) {
      showMessage('Error deleting product', 'error');
    }
  };

  const toggleStock = async (product) => {
    try {
      const newStock = product.countInStock > 0 ? 0 : 10;

      const response = await fetch(`${API_BASE}/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...product,
          countInStock: newStock
        })
      });

      const data = await response.json();

      if (data.success) {
        showMessage(newStock === 0 ? 'Marked Out of Stock!' : 'Marked In Stock!', 'success');
        fetchProducts();
      } else {
        showMessage('Failed to update stock', 'error');
      }
    } catch (error) {
      showMessage('Error updating stock', 'error');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
      image: product.image,
      countInStock: product.countInStock,
      rating: product.rating
    });
    setShowProductForm(true);
  };

  const getOrderStatus = (order) => {
    if (order.isCancelled) return { text: 'Cancelled', color: 'var(--error)' };
    if (order.isDelivered) return { text: 'Delivered', color: 'var(--success)' };
    if (order.isConfirmed) return { text: 'Confirmed', color: 'var(--accent)' };
    return { text: 'Pending', color: '#f59e0b' };
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="admin-panel" style={{ padding: '60px 0', minHeight: '80vh' }}>
          <div className="container">
            <h1 style={{ marginBottom: '32px', fontSize: '42px' }}>Admin Dashboard</h1>

            {panelMsg && (
              <div style={{
                background: panelMsgType === 'success' ? 'var(--success)' : 'var(--error)',
                color: 'white',
                borderRadius: '8px',
                padding: '16px 24px',
                marginBottom: '24px',
                textAlign: 'center',
                fontWeight: '600',
                animation: 'slideInDown 0.3s ease'
              }}>
                {panelMsg}
              </div>
            )}

            <div className="admin-tabs" style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
              borderBottom: '2px solid var(--border)',
              overflowX: 'auto',
              paddingBottom: '0'
            }}>
              <button
                className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
                style={{
                  padding: '16px 24px',
                  background: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'orders' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap'
                }}
              >
                Orders ({orders.length})
              </button>
              <button
                className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
                style={{
                  padding: '16px 24px',
                  background: activeTab === 'products' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'products' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderBottom: activeTab === 'products' ? '3px solid var(--primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap'
                }}
              >
                Products ({products.length})
              </button>
              <button
                className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
                style={{
                  padding: '16px 24px',
                  background: activeTab === 'users' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'users' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap'
                }}
              >
                Users ({users.length})
              </button>
            </div>

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="admin-content">
                <h2 style={{ marginBottom: '24px', fontSize: '28px' }}>Manage Orders</h2>
                {orders.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No orders yet
                  </p>
                ) : (
                  <div className="admin-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-elevated)', borderBottom: '2px solid var(--border)' }}>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Order ID</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Customer</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Total</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Payment</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Status</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Delivery</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Date</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const status = getOrderStatus(order);
                          return (
                            <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '16px' }} data-label="Order ID">#{order._id.slice(-8)}</td>
                              <td style={{ padding: '16px' }} data-label="Customer">{order.user?.name || 'N/A'}</td>
                              <td style={{ padding: '16px' }} data-label="Total">${order.totalPrice.toFixed(2)}</td>
                              <td style={{ padding: '16px' }} data-label="Payment">
                                <span style={{
                                  color: order.isPaid ? 'var(--success)' : 'var(--error)',
                                  fontWeight: '600'
                                }}>
                                  {order.isPaid ? 'Paid' : 'Pending'}
                                </span>
                              </td>
                              <td style={{ padding: '16px' }} data-label="Status">
                                <span style={{
                                  color: status.color,
                                  fontWeight: '600'
                                }}>
                                  {status.text}
                                </span>
                              </td>
                              <td style={{ padding: '16px', fontSize: '13px' }} data-label="Delivery">
                                {order.estimatedDelivery ? (
                                  <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)' }}>Not set</span>
                                )}
                              </td>
                              <td style={{ padding: '16px', fontSize: '13px' }} data-label="Date">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td style={{ padding: '16px' }} data-label="Actions">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  {!order.isCancelled && !order.isConfirmed && (
                                    <button
                                      onClick={() => setSelectedOrder(order)}
                                      style={{
                                        padding: '8px 14px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      Confirm Order
                                    </button>
                                  )}
                                  {!order.isCancelled && order.isConfirmed && !order.isDelivered && (
                                    <button
                                      onClick={() => markAsDelivered(order._id)}
                                      style={{
                                        padding: '8px 14px',
                                        background: 'var(--success)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      Mark Delivered
                                    </button>
                                  )}
                                  {order.isCancelled && (
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                      Cancelled by user
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Order Confirmation Modal */}
            {selectedOrder && (
              <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '24px',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <h2 style={{ margin: 0 }}>Confirm Order #{selectedOrder._id.slice(-8)}</h2>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px'
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                      Set estimated delivery time for this order:
                    </p>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                        Delivery Time (days)
                      </label>
                      <select
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          background: 'var(--bg-elevated)',
                          fontSize: '16px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value={1}>1 day</option>
                        <option value={2}>2 days</option>
                        <option value={3}>3 days</option>
                        <option value={5}>5 days</option>
                        <option value={7}>7 days</option>
                        <option value={10}>10 days</option>
                        <option value={14}>14 days</option>
                      </select>
                    </div>
                    <div style={{
                      background: 'var(--bg-elevated)',
                      padding: '16px',
                      borderRadius: '8px',
                      marginTop: '16px',
                      border: '1px solid var(--border)'
                    }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Estimated Delivery Date:
                      </p>
                      <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>
                        {new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button
                        onClick={() => confirmOrder(selectedOrder._id, deliveryDays)}
                        className="btn-primary"
                        style={{ flex: 1, padding: '14px' }}
                      >
                        Confirm Order
                      </button>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '14px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB - Keep existing code */}
            {activeTab === 'products' && (
              <div className="admin-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <h2 style={{ fontSize: '28px' }}>Manage Products</h2>
                  <button
                    onClick={() => {
                      setShowProductForm(true);
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        price: '',
                        category: '',
                        description: '',
                        image: '',
                        countInStock: '',
                        rating: 4.5
                      });
                    }}
                    className="btn-primary"
                  >
                    + Add New Product
                  </button>
                </div>

                {showProductForm && (
                  <div className="admin-form-wrapper" style={{ marginBottom: '32px' }}>
                    <form onSubmit={handleProductSubmit} className="admin-form" style={{
                      background: 'var(--bg-card)',
                      padding: '32px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border)'
                    }}>
                      <h3 style={{ marginBottom: '24px' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Product Name</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            background: 'var(--bg-elevated)',
                            fontSize: '15px'
                          }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                        <div className="form-group">
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              background: 'var(--bg-elevated)',
                              fontSize: '15px'
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Stock Quantity</label>
                          <input
                            type="number"
                            value={productForm.countInStock}
                            onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              background: 'var(--bg-elevated)',
                              fontSize: '15px'
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                        <div className="form-group">
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Category</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              background: 'var(--bg-elevated)',
                              fontSize: '15px',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Select Category</option>
                            <option value="Men's Clothing">Men's Clothing</option>
                            <option value="Women's Clothing">Women's Clothing</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Outerwear">Outerwear</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Rating</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={productForm.rating}
                            onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              background: 'var(--bg-elevated)',
                              fontSize: '15px'
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Image URL</label>
                        <input
                          type="url"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            background: 'var(--bg-elevated)',
                            fontSize: '15px'
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                        <textarea
                          rows="4"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            background: 'var(--bg-elevated)',
                            fontSize: '15px',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '14px 24px' }}>
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                          }}
                          className="btn-secondary"
                          style={{ padding: '14px 24px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="admin-table" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-elevated)', borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Image</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Name</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Category</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Price</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Stock</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Rating</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '16px' }} data-label="Image">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{ 
                                width: '60px', 
                                height: '60px', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: '1px solid var(--border)'
                              }} 
                            />
                          </td>
                          <td style={{ padding: '16px' }} data-label="Name">{product.name}</td>
                          <td style={{ padding: '16px' }} data-label="Category">{product.category}</td>
                          <td style={{ padding: '16px' }} data-label="Price">${product.price}</td>
                          <td style={{ padding: '16px' }} data-label="Stock">
                            <span style={{
                              color: product.countInStock > 0 ? 'var(--success)' : 'var(--error)',
                              fontWeight: '600'
                            }}>
                              {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }} data-label="Rating">⭐ {product.rating}</td>
                          <td style={{ padding: '16px' }} data-label="Actions">
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleEditProduct(product)}
                                style={{
                                  padding: '8px 14px',
                                  background: 'var(--primary)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => toggleStock(product)}
                                style={{
                                  padding: '8px 14px',
                                  background: product.countInStock > 0 ? 'var(--error)' : 'var(--success)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {product.countInStock > 0 ? 'Mark Out' : 'Mark In'}
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                style={{
                                  padding: '8px 14px',
                                  background: 'var(--error)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="admin-content">
                <h2 style={{ marginBottom: '24px', fontSize: '28px' }}>All Users</h2>
                {users.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No users found
                  </p>
                ) : (
                  <div className="admin-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-elevated)', borderBottom: '2px solid var(--border)' }}>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Name</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Email</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Role</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '16px' }} data-label="Name">{u.name}</td>
                            <td style={{ padding: '16px' }} data-label="Email">{u.email}</td>
                            <td style={{ padding: '16px', textTransform: 'capitalize', fontWeight: '600' }} data-label="Role">
                              {u.role}
                            </td>
                            <td style={{ padding: '16px', fontSize: '13px' }} data-label="Joined">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AdminPanel;