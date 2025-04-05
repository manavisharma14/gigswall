// About.jsx
import React from 'react';
import peers from '../peers.png';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen py-24 px-6 flex items-center justify-center bg-white text-black transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Text Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 text-center md:text-left"
        >
          <h2 className="text-3xl font-bold mb-4">Wanna know more about us?</h2>
          <p className="text-gray-700 mb-4">
            We're just a bunch of college students who got tired of jumping through hoops to get stuff done.
            Whether it's finding someone to design your club poster, help you with Python, or shoot your next event —
            PeerGig makes it easy to connect with the right people on campus.
          </p>
          <p className="text-gray-700">
            No fancy algorithms. No red tape. Just students helping students. So go ahead — post a gig or grab one!
          </p>
        </motion.div>

        {/* Image Right */}
        <motion.img
          src={peers}
          alt="Peers working together"
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:w-1/2 w-full rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}

export default About;