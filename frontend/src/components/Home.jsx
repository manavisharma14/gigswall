import React from 'react';
import peergiglogo from '../peergiglogo.png';
import { TypeAnimation } from 'react-type-animation';

function Home() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-32
      bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
    >
      {/* 🔄 Logo with entrance & hover animation */}
      <img
        src={peergiglogo}
        alt="Peergig Logo"
        className="w-80 md:w-[30rem] h-auto mb-8 p-4 animate-bounce hover:scale-105 transition duration-500"
      />

      {/* ✍️ Typing Animation for "Welcome to" */}
      <div className="flex flex-wrap justify-center items-center text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
        <TypeAnimation
          sequence={['Welcome to']}
          speed={20}
          wrapper="span"
          repeat={0}
          className="mr-3"
        />
        <span className="text-indigo-600 dark:text-indigo-400">PeerGig</span>
      </div>

      {/* 💬 Bold Subheading */}
      <p className="mt-6 max-w-xl text-xl font-semibold text-gray-800 dark:text-gray-300">
        Campus chaos? <span className="text-indigo-600 dark:text-indigo-400">Hire a peer!</span>
      </p>
    </section>
  );
}

export default Home;
