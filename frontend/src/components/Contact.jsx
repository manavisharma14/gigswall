// src/components/Contact.jsx
import React from 'react';

function Contact() {
  return (
    <section className="min-h-screen bg-white-50 dark:bg-gray-900 text-gray-800 dark:text-white py-20 px-4 pt-36">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">📬 Contact Us</h2>

        <p className="text-center text-lg mb-12">
          Have a question, suggestion, or just want to say hi? We'd love to hear from you!
        </p>

        <form className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-700"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-700"
            required
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-700"
            required
          />
          <button
          type="submit"
          className="bg-gray-700 text-white px-6 py-2 rounded border border-gray-700 dark:border-white hover:bg-gray-800 dark:hover:bg-white dark:hover:text-gray-900 transition"
        >
          Send Message
        </button>

        </form>
      </div>
    </section>
  );
}

export default Contact;
