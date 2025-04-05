import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import person1 from '../assets/person1.png';
import person2 from '../assets/person2.png';

function PeerMeet() {
  const [inView, setInView] = useState(false); // State to trigger when section is in view

  const { ref, inView: isInView } = useInView({
    triggerOnce: true, // Triggers once when the section comes into view
    threshold: 0.1,    // Triggers when 10% of the section is in view
  });

  React.useEffect(() => {
    if (isInView) {
      setInView(true); // Set state to true when section is in view
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-20"
    >
      <div className="flex items-center gap-12 flex-wrap justify-center relative">
        {/* Person 1 - Slide from extreme left */}
        <motion.img
          src={person1}
          alt="Person 1"
          initial={{ x: '-100vw', opacity: 0 }} // Start off-screen left
          animate={inView ? { x: 0, opacity: 1 } : {}} // Trigger when in view
          transition={{ duration: 1.5, ease: 'easeOut' }} // Smooth transition
          className="w-[30rem] h-auto"
        />

        {/* Person 2 - Slide from extreme right */}
        <motion.img
          src={person2}
          alt="Person 2"
          initial={{ x: '100vw', opacity: 0 }} // Start off-screen right
          animate={inView ? { x: 0, opacity: 1 } : {}} // Trigger when in view
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }} // Delay for Person 2
          className="w-[30rem] h-auto"
        />

        {/* Speech Bubbles */}
        {/* Person 1's first message */}
        <motion.div
          className="absolute top-1/3 left-1/4 p-3 bg-blue-500 text-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <p>"I don’t know how to build a web app."</p>
        </motion.div>

        {/* Person 2's response */}
        <motion.div
          className="absolute top-1/3 right-1/4 p-3 bg-green-500 text-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <p>"I can build a web app for you! I've done it before."</p>
        </motion.div>

        {/* Person 1 asks about price */}
        <motion.div
          className="absolute top-1/2 left-1/4 p-3 bg-blue-500 text-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 4, duration: 0.5 }}
        >
          <p>"Oh, that’s great! How much would it cost?"</p>
        </motion.div>

        {/* Person 2 offers price */}
        <motion.div
          className="absolute top-1/2 right-1/4 p-3 bg-green-500 text-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 5, duration: 0.5 }}
        >
          <p>"I can do it for $20. What features do you need?"</p>
        </motion.div>
      </div>
    </section>
  );
}

export default PeerMeet;
