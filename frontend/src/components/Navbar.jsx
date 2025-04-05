import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

function Navbar({ toggleTheme, darkMode }) {
  const [modalType, setModalType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // State for login prompt
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handlePostJobClick = () => {
    if (!isLoggedIn) {
      // Show login prompt if not logged in
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000); // Hide after 3 seconds
      return;
    }

    // If logged in, proceed to create a gig
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('postjobs');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('postjobs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowLogoutToast(true);
    setTimeout(() => {
      setShowLogoutToast(false);
      navigate('/');
    }, 1500);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-black dark:text-white">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/peergiglogo.png" alt="logo" className="h-20" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">PeerGig</h1>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <button onClick={handlePostJobClick} className="hover:text-gray-600 dark:hover:text-gray-300">Post Job</button>
          <Link to="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</Link>

          {/* Conditional "My Profile" Link */}
          {isLoggedIn && (
            <Link to="/profile" className="hover:text-gray-600 dark:hover:text-gray-300">My Profile</Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-xl hover:text-gray-500 transition"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌞' : '🌙'}
          </button>

          {/* Auth Buttons */}
          {!isLoggedIn ? (
            <button
              onClick={() => setModalType('login')}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-md transition"
            >
              <span>🔐</span>
              <span>Login / Register</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-md transition"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast on Logout */}
      {showLogoutToast && (
        <div className="absolute top-24 right-6 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded-lg shadow-lg animate-slide-in-down z-50">
          👋 You’ve been logged out.
        </div>
      )}

      {/* Login Prompt Toast */}
      {showLoginPrompt && (
        <div className="absolute top-24 right-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg animate-slide-in-down z-50">
          ⚠️ Please log in to create a gig.
        </div>
      )}

      {/* Modals */}
      {modalType === 'login' && (
        <Login
          closeModal={() => setModalType(null)}
          switchToRegister={() => setModalType('register')}
          onLoginSuccess={() => {
            setModalType(null);
            setIsLoggedIn(true);
          }}
        />
      )}
      {modalType === 'register' && (
        <Register
          closeModal={() => setModalType(null)}
          switchToLogin={() => setModalType('login')}
          onRegisterSuccess={() => {
            setModalType(null);
            setIsLoggedIn(true);
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;
