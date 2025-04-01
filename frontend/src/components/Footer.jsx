import React from 'react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

function Footer() {
// Footer.jsx
return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-center py-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
  <div className="max-w-6xl mx-auto px-4 text-gray-700 dark:text-gray-300">
    <p className="font-semibold">Manipal Institute of Technology</p>
    <p className="text-sm">
      Udupi - Karkala Rd, Eshwar Nagar, Manipal, Karnataka 576104, India
    </p>
    <div className="mt-2 flex justify-center space-x-4">
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin text-xl hover:text-blue-600"></i>
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-instagram text-xl hover:text-pink-500"></i>
      </a>
    </div>
    <hr className="my-4 border-gray-300 dark:border-gray-700" />
    <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 PeerGig. All rights reserved.</p>
  </div>
</footer>

  );
  
}

export default Footer;
