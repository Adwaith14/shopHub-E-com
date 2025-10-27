import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, token, API_BASE } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  // Info message at panel top
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
    // eslint-disable-next-line
  }, [user, navigate]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      setPanelMsg('Error fetching products');
      setPanelMsgType('error');
      setTimeout(() => setPanelMsg(''), 3000);
    }
  };

  // Fetch Orders
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
      setPanelMsg('Error fetching orders');
      setPanelMsgType('error');
      setTimeout(() => setPanelMsg(''), 3000);
    }
  };

  const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      setUsers(data.users);
      setPanelMsg('');
    }
  } catch (error) {
  }
};


  // Handle Product Form
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

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    setPanelMsg('');
    setPanelMsgType('success');
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

  // Toggle Stock Status
  const toggleStock = async (product) => {
    setPanelMsg('');
    setPanelMsgType('success');
    try {
      const response = await fetch(`${API_BASE}/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...product,
          countInStock: product.countInStock > 0 ? 0 : 10
        })
      });

      const data = await response.json();

      if (data.success) {
        setPanelMsg(product.countInStock > 0 ? 'Marked Out of Stock!' : 'Marked In Stock!');
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

  // Edit Product
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
                className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                Products ({products.length})
              </button>
              <button
                className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Orders ({orders.length})
              </button>
              <button
                className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Users ({users.length})
              </button>
            </div>

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="admin-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
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
                          <td>
                            <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>${product.price}</td>
                          <td>
                            <span style={{
                              color: product.countInStock > 0 ? 'var(--success)' : 'var(--error)',
                              fontWeight: '600'
                            }}>
                              {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td>⭐ {product.rating}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleEditProduct(product)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--primary)',
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '13px'
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
                                  fontSize: '13px'
                                }}
                              >
                                {product.countInStock > 0 ? 'Out of Stock' : 'In Stock'}
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--error)',
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '13px'
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

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="admin-content">
                <h2>All Orders</h2>
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-8)}</td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td>${order.totalPrice.toFixed(2)}</td>
                          <td>
                            <span style={{
                              color: order.isDelivered ? 'var(--success)' : 'var(--accent)',
                              fontWeight: '600'
                            }}>
                              {order.isDelivered ? 'Delivered' : 'Processing'}
                            </span>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
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
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td style={{ textTransform: 'capitalize', fontWeight: '600' }}>{u.role}</td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
