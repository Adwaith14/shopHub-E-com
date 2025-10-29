import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useContext(CartContext);

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const openRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="nav-brand">ShopHub</Link>

          {/* Desktop Navigation */}
          <div className="nav-center">
            <ul>
              <li><Link to="/">Home</Link></li>
              {isAdmin ? (
                <li><Link to="/admin" style={{ color: 'var(--primary)', fontWeight: '700' }}>⚡ Admin Panel</Link></li>
              ) : (
                <>
                  <li><Link to="/products">Products</Link></li>
                  <li><Link to="/about">About</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="nav-right">
            {/* Search - Always Visible for regular users */}
            {!isAdmin && (
              <div className="search-container">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search products..."
                />
                <button className="search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
            )}

            {/* Cart Icon - Hidden for Admin */}
            {!isAdmin && (
              <Link to="/cart" className="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
              </Link>
            )}

            {/* Desktop Auth Buttons */}
            {user ? (
              <div className="user-menu-wrapper desktop-only">
                <button 
                  className="user-menu-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">{user.name.charAt(0)}</span>
                </button>
                {showUserMenu && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <p className="user-name">{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="user-menu-links">
                      {!isAdmin && (
                        <>
                          <Link to="/profile" onClick={() => setShowUserMenu(false)}>Profile</Link>
                          <Link to="/orders" onClick={() => setShowUserMenu(false)}>Orders</Link>
                        </>
                      )}
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={openLogin} className="btn-signin desktop-only">Sign In</button>
                <button onClick={openRegister} className="btn-signup desktop-only">Sign Up</button>
              </>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button 
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <div className="mobile-menu-links">
                <Link to="/" onClick={closeMobileMenu}>Home</Link>
                {isAdmin ? (
                  <Link to="/admin" onClick={closeMobileMenu} className="admin-link-mobile">
                    ⚡ Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link to="/products" onClick={closeMobileMenu}>Products</Link>
                    <Link to="/about" onClick={closeMobileMenu}>About</Link>
                  </>
                )}
              </div>

              <div className="mobile-menu-divider"></div>

              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">{user.name.charAt(0)}</div>
                    <div>
                      <p className="mobile-user-name">{user.name}</p>
                      <p className="mobile-user-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="mobile-menu-links">
                    {!isAdmin && (
                      <>
                        <Link to="/profile" onClick={closeMobileMenu}>Profile</Link>
                        <Link to="/orders" onClick={closeMobileMenu}>Orders</Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
                  </div>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <button onClick={openLogin} className="btn-signin-mobile">Sign In</button>
                  <button onClick={openRegister} className="btn-signup-mobile">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {showAuthModal && (
        <AuthModal 
          mode={authMode} 
          onClose={() => setShowAuthModal(false)} 
          onSwitch={mode => setAuthMode(mode)}
        />
      )}
    </>
  );
};

export default Navbar;