import React from 'react';
import peergiglogo from '../peergiglogo.png'; // ✅ adjust path if needed

function Home() {
  return (
    <section
    id="home"
    className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-32
    bg-[gray-100] dark:bg-gray-900 transition-colors duration-300"
>  
    {/* 🐝 Logo with animation */}
    <img
      src={peergiglogo}
      alt="Peergig Logo"
      className="w-64 md:w-96 h-auto mb-6 p-4 animate-logoEntrance"
    />

    {/* Heading with smooth fade-in animation */}
    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 animate-fadeIn">
      Welcome to <span className="text-gray-600 dark:text-gray-200">PeerGig</span>
    </h1>

      {/* Subheading */}
      <p className="mt-4 max-w-xl text-lg text-gray-700 dark:text-gray-300 animate-slideUp">
      Campus chaos? Hire a peer!
        </p>
      {/* <p className="mt-4 max-w-xl text-gray-700 dark:text-gray-300">
      Campus chaos? Hire a peer!
      </p> */}
    </section>
  );
}

export default Home;
