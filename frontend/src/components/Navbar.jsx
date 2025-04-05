import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

function Navbar({ toggleTheme, darkMode }) {
  const [modalType, setModalType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handlePostJobClick = () => {
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
    navigate('/');
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
          <Link to="/applied" className="hover:text-gray-600 dark:hover:text-gray-300">Applied Jobs</Link>
          <Link to="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</Link>
          <Link to="/profile" className="hover:text-gray-600 dark:hover:text-gray-300">My Profile</Link>

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
