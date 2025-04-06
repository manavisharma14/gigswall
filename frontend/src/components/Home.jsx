import React from 'react';
import peergiglogo from '../peergiglogo.png'; // ✅ adjust path if needed

function Home() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-32
                 bg-[gray-100] dark:bg-gray-900 transition-colors duration-300"
    >
      {/* 🐝 Logo */}
      <img src={peergiglogo} alt="Peergig Logo" className="w-100 h-auto mb-6" />

      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-400 dark:text-white">
        Welcome to <span className="text-gray-400 dark:text-white">Peergig</span>
      </h1>

      {/* Subheading */}
      <p className="mt-4 max-w-xl text-gray-700 dark:text-gray-300">
      Campus chaos? Hire a peer!
      </p>
    </section>
  );
}

export default Home;
