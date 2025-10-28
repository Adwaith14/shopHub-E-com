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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useContext(CartContext);

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
            ShopHub
          </Link>

          {/* Desktop Menu */}
          <div className="nav-desktop">
            <ul className="nav-menu-desktop">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>

            <div className="nav-right-desktop">
              <div className="search-container-desktop">
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

              <Link to="/cart" className="nav-icon cart-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
              </Link>

              {user ? (
                <div className="user-menu-wrapper">
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
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="admin-panel-link"
                          >
                            ⚡ Admin Panel
                          </Link>
                        )}
                        <Link to="/profile" onClick={() => setShowUserMenu(false)}>Profile</Link>
                        <Link to="/orders" onClick={() => setShowUserMenu(false)}>Orders</Link>
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={openLogin} className="btn-signin">Sign In</button>
                  <button onClick={openRegister} className="btn-signup">Sign Up</button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Right Icons */}
          <div className="nav-mobile-right">
            <Link to="/cart" className="nav-icon cart-icon-mobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </Link>

            {/* Hamburger Menu */}
            <button 
              className={`hamburger-menu ${showMobileMenu ? 'active' : ''}`}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="nav-mobile-menu">
            <ul className="nav-menu-mobile">
              <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
              <li><Link to="/products" onClick={closeMobileMenu}>Products</Link></li>
              <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
            </ul>

            <div className="nav-mobile-bottom">
              {user ? (
                <>
                  <div className="mobile-user-info">
                    <p className="mobile-user-name">{user.name}</p>
                    <p className="mobile-user-email">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="mobile-admin-link" onClick={closeMobileMenu}>
                      ⚡ Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="mobile-menu-link" onClick={closeMobileMenu}>Profile</Link>
                  <Link to="/orders" className="mobile-menu-link" onClick={closeMobileMenu}>Orders</Link>
                  <button className="mobile-logout-btn" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => { openLogin(); closeMobileMenu(); }} className="mobile-signin-btn">Sign In</button>
                  <button onClick={() => { openRegister(); closeMobileMenu(); }} className="mobile-signup-btn">Sign Up</button>
                </>
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
