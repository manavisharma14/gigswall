import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';

function Navbar({ toggleTheme, darkMode }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-black dark:text-white">
        <div className="flex items-center space-x-2">
          <img src="/peergiglogo.png" alt="logo" className="h-20" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">PeerGig</h1>
        </div>

        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <a href="#postjobs" className="hover:text-gray-600 dark:hover:text-gray-300">Post Job</a>
          <Link to="/applied" className="hover:text-gray-600 dark:hover:text-gray-300">Applied Jobs</Link>
          <Link to="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-xl hover:text-gray-500 transition"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌞' : '🌙'}
          </button>

          {/* Login Button */}
          <button
            onClick={() => setShowLogin(true)}
            className="bg-gray-700 text-white font-semibold px-4 py-1.5 rounded-full hover:bg-gray-900 transition"
          >
            🔐
          </button>
        </div>
      </div>

      {showLogin && <Login closeModal={() => setShowLogin(false)} />}
    </nav>
  );
}

export default Navbar;
