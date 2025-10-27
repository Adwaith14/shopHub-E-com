import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, token, API_BASE } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (user && token) {
      fetchAddresses();
    }
  }, [user, token]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main>
          <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <h1>Please login to view your profile</h1>
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
        <section className="profile-page">
          <div className="container">
            <h1 style={{ marginBottom: '32px', fontSize: '42px' }}>My Account</h1>
            
            <div className="profile-layout">
              <div className="profile-sidebar">
                <div className="profile-nav">
                  <button 
                    className={`profile-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile Information
                  </button>
                  <button 
                    className={`profile-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                  >
                    Saved Addresses
                  </button>
                </div>
              </div>

              <div className="profile-content">
                {activeTab === 'profile' && (
                  <div className="profile-info-card">
                    <h2>Profile Information</h2>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <label>Full Name</label>
                        <p>{user.name}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Email Address</label>
                        <p>{user.email}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Role</label>
                        <p style={{ textTransform: 'capitalize' }}>{user.role}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Member Since</label>
                        <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="addresses-card">
                    <h2>Saved Addresses</h2>
                    {addresses.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)' }}>
                        No addresses saved yet. Add one during checkout.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {addresses.map((addr, index) => (
                          <div
                            key={index}
                            style={{
                              padding: '20px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: '12px'
                            }}
                          >
                            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{addr.fullName}</h3>
                            <p style={{ margin: '0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                              {addr.addressLine}<br />
                              {addr.city}, {addr.state} - {addr.pincode}<br />
                              {addr.country}<br />
                              Phone: {addr.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

export default ProfilePage;
