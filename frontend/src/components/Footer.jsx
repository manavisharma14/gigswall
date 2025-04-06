import React, { useState } from 'react';

function Footer() {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => setShowModal(!showModal);

  return (
    <footer className="bg-gray-900 text-center text-white py-8 border-t border-gray-700 dark:bg-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Column 1: Slogan with Animation */}
        <div className="flex items-center justify-center space-y-6">
          <h4 className="text-3xl font-semibold mb-4 text-yellow-500 animate-bounce">Where Talent Meets Opportunity</h4>
        </div>

        {/* Column 2: Social Media Links */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold mb-4 text-gray-300 dark:text-gray-400">Follow Us</h4>
          <div className="flex justify-center space-x-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <i className="fab fa-linkedin text-3xl"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <i className="fab fa-instagram text-3xl"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <i className="fab fa-twitter text-3xl"></i>
            </a>
          </div>
        </div>

        {/* Column 3: Contact Us Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={handleModalToggle}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Modal for Contact Us Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={handleModalToggle}
              className="absolute top-2 right-3 text-gray-500 dark:text-gray-300 text-xl font-bold hover:text-gray-800 dark:hover:text-white"
            >
              &times; {/* Cross button */}
            </button>
            {/* Modal Content */}
            <h4 className="text-xl font-semibold mb-4 text-center text-yellow-500">Contact Us</h4>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 text-black dark:text-white"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 text-black dark:text-white"
                required
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 text-black dark:text-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Send Message
              </button>
            </form>
            {/* Cancel Button */}
            <button
              onClick={handleModalToggle}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer Bottom */}
      <div className="mt-8">
        <hr className="my-4 border-gray-600 dark:border-gray-700" />
        <p className="text-sm text-gray-400 dark:text-gray-500">
          © 2025 PeerGig. All rights reserved. <br />
          Built with ❤️ by the PeerGig Team
        </p>
      </div>
    </footer>
  );
}

export default Footer;
