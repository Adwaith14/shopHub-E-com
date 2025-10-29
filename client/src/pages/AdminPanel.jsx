import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      // Try multiple possible endpoints
      let response = await fetch(`${API_BASE}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Try alternative endpoint
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
      // Set empty array instead of failing
      setUsers([]);
    }
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
        setPanelMsg(`Order confirmed! Will be delivered in ${days} days`);
        setPanelMsgType('success');
        setTimeout(() => setPanelMsg(''), 3000);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        setPanelMsg(data.message || 'Failed to confirm order');
        setPanelMsgType('error');
        setTimeout(() => setPanelMsg(''), 3000);
      }
    } catch (error) {
      setPanelMsg('Error confirming order');
      setPanelMsgType('error');
      setTimeout(() => setPanelMsg(''), 3000);
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
        setPanelMsg('Order marked as delivered!');
        setPanelMsgType('success');
        setTimeout(() => setPanelMsg(''), 3000);
        fetchOrders();
      } else {
        setPanelMsg(data.message || 'Failed to update order');
        setPanelMsgType('error');
        setTimeout(() => setPanelMsg(''), 3000);
      }
    } catch (error) {
      setPanelMsg('Error updating order');
      setPanelMsgType('error');
      setTimeout(() => setPanelMsg(''), 3000);
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
        setPanelMsg(editingProduct ? 'Product updated!' : 'Product created!');
        setPanelMsgType('success');
        setTimeout(() => setPanelMsg(''), 3000);
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
        setPanelMsg(data.message || 'Error saving product');
        setPanelMsgType('error');
        setTimeout(() => setPanelMsg(''), 3000);
      }
    } catch (error) {
      setPanelMsg('Error saving product');
      setPanelMsgType('error');
      setTimeout(() => setPanelMsg(''), 3000);
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
        setPanelMsg('Product deleted!');
        setPanelMsgType('success');
        setTimeout(() => setPanelMsg(''), 3000);
        fetchProducts();
      } else {
        setPanelMsg('Failed to delete product');
        setPanelMsgType('error');
        setTimeout(() => setPanelMsg(''), 3000);
      }
    } catch (error) {
      setPanelMsg('Error deleting product');
      setPanelMsgType('error');
      setTimeout(() => setPanelMsg(''), 3000);
    }
  };

  const toggleStock = async (product) => {
    try {
      // Toggle: if > 0, set to 0; if 0, set to 10
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
        setPanelMsg(newStock === 0 ? 'Marked Out of Stock!' : 'Marked In Stock!');
        setPanelMsgType('success');
        setTimeout(() => setPanelMsg(''), 3000);
        fetchProducts();
      } else {
        setPanelMsg('Failed to update stock');
        setPanelMsgType('error');
        setTimeout(() => setPanelMsg(''), 3000);
      }
    } catch (error) {
      setPanelMsg('Error updating stock');
      setPanelMsgType('error');
      setTimeout(() => setPanelMsg(''), 3000);
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="admin-panel">
          <div className="container">
            <h1 style={{ marginBottom: '32px', fontSize: '42px' }}>Admin Dashboard</h1>
            {panelMsg && (
              <div
                style={{
                  background: panelMsgType === 'success' ? 'var(--success)' : 'var(--error)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontWeight: 700
                }}
              >
                {panelMsg}
              </div>
            )}
            <div className="admin-tabs">
              <button
                className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Orders ({orders.length})
              </button>
              <button
                className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                Products ({products.length})
              </button>
              <button
                className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Users ({users.length})
              </button>
            </div>

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="admin-content">
                <h2 style={{ marginBottom: '24px' }}>Manage Orders</h2>
                {orders.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No orders yet
                  </p>
                ) : (
                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Delivery</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td data-label="Order ID">#{order._id.slice(-8)}</td>
                            <td data-label="Customer">{order.user?.name || 'N/A'}</td>
                            <td data-label="Total">${order.totalPrice.toFixed(2)}</td>
                            <td data-label="Payment">
                              <span style={{
                                color: order.isPaid ? 'var(--success)' : 'var(--error)',
                                fontWeight: '600'
                              }}>
                                {order.isPaid ? 'Paid' : 'Pending'}
                              </span>
                            </td>
                            <td data-label="Status">
                              <span style={{
                                color: order.isDelivered ? 'var(--success)' : order.isConfirmed ? 'var(--accent)' : 'var(--error)',
                                fontWeight: '600'
                              }}>
                                {order.isDelivered ? 'Delivered' : order.isConfirmed ? 'Confirmed' : 'Pending'}
                              </span>
                            </td>
                            <td data-label="Delivery">
                              {order.estimatedDelivery ? (
                                <span style={{ fontSize: '13px' }}>
                                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Not set</span>
                              )}
                            </td>
                            <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td data-label="Actions">
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {!order.isConfirmed && (
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'var(--primary)',
                                      color: 'white',
                                      borderRadius: '6px',
                                      fontSize: '13px',
                                      whiteSpace: 'nowrap',
                                      border: 'none',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Confirm Order
                                  </button>
                                )}
                                {order.isConfirmed && !order.isDelivered && (
                                  <button
                                    onClick={() => markAsDelivered(order._id)}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'var(--success)',
                                      color: 'white',
                                      borderRadius: '6px',
                                      fontSize: '13px',
                                      whiteSpace: 'nowrap',
                                      border: 'none',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Mark Delivered
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
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
                  <div className="modal-header">
                    <h2>Confirm Order #{selectedOrder._id.slice(-8)}</h2>
                    <button onClick={() => setSelectedOrder(null)} className="modal-close">
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
                      <label>Delivery Time (days)</label>
                      <select
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(parseInt(e.target.value))}
                        className="delivery-select"
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
                      <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>
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
                        style={{ flex: 1 }}
                      >
                        Confirm Order
                      </button>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="btn-secondary"
                        style={{ flex: 1 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="admin-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <h2>Manage Products</h2>
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
                  <div className="admin-form-wrapper">
                    <form onSubmit={handleProductSubmit} className="admin-form">
                      <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <div className="form-group">
                        <label>Product Name</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Stock Quantity</label>
                          <input
                            type="number"
                            value={productForm.countInStock}
                            onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Category</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            required
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
                          <label>Rating</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={productForm.rating}
                            onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Image URL</label>
                        <input
                          type="url"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          rows="4"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn-primary">
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                          }}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td data-label="Image">
                            <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                          </td>
                          <td data-label="Name">{product.name}</td>
                          <td data-label="Category">{product.category}</td>
                          <td data-label="Price">${product.price}</td>
                          <td data-label="Stock">
                            <span style={{
                              color: product.countInStock > 0 ? 'var(--success)' : 'var(--error)',
                              fontWeight: '600'
                            }}>
                              {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td data-label="Rating">⭐ {product.rating}</td>
                          <td data-label="Actions">
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleEditProduct(product)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--primary)',
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => toggleStock(product)}
                                style={{
                                  padding: '6px 12px',
                                  background: product.countInStock > 0 ? 'var(--error)' : 'var(--success)',
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  whiteSpace: 'nowrap',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                {product.countInStock > 0 ? 'Mark Out of Stock' : 'Mark In Stock'}
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--error)',
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  border: 'none',
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
                <h2>All Users</h2>
                {users.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No users found. This might be an API endpoint issue.
                  </p>
                ) : (
                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td data-label="Name">{u.name}</td>
                            <td data-label="Email">{u.email}</td>
                            <td data-label="Role" style={{ textTransform: 'capitalize', fontWeight: '600' }}>{u.role}</td>
                            <td data-label="Joined">{new Date(u.createdAt).toLocaleDateString()}</td>
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