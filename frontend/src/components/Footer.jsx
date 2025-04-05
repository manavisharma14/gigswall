import React from 'react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-center py-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 text-gray-700 dark:text-gray-300">
        <p className="font-semibold">University of Kansas</p>
        <p className="text-sm">
          1450 Jayhawk Blvd, Lawrence, KS 66045, United States
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-xl hover:text-blue-600" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-xl hover:text-pink-500" />
          </a>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2025 PeerGig @ University of Kansas. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
