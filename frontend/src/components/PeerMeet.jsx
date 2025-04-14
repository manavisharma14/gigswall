import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import person1 from '../assets/person1.png';
import person2 from '../assets/person2.png';

function PeerMeet() {
  const [inView, setInView] = useState(false);

  const { ref, inView: isInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (isInView) {
      setInView(true);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-32 relative"
    >
      <div className="flex items-end gap-20 flex-wrap justify-center">
        {/* Larger Person 1 */}
        <motion.img
          src={person1}
          alt="Person 1"
          initial={{ x: '-100vw', opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="w-[24rem] h-auto md:w-[28rem]"
        />

        {/* Larger Person 2 */}
        <motion.img
          src={person2}
          alt="Person 2"
          initial={{ x: '100vw', opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          className="w-[24rem] h-auto md:w-[28rem]"
        />
      </div>

      {/* Speech Bubbles */}
      <div className="absolute top-10 left-0 w-full flex flex-col items-center gap-6">
        {/* Message 1 - Left */}
        <motion.div
          className="p-3 bg-blue-500 text-white rounded-lg shadow-lg w-fit max-w-sm"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <p>"I don’t know how to build a web app."</p>
        </motion.div>

        <motion.div
          className="p-3 bg-green-500 text-white rounded-lg shadow-lg w-fit max-w-sm self-end mr-20"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <p>"I can build a web app for you! I've done it before."</p>
        </motion.div>

        <motion.div
          className="p-3 bg-blue-500 text-white rounded-lg shadow-lg w-fit max-w-sm"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 4, duration: 0.5 }}
        >
          <p>"Oh, that’s great! How much would it cost?"</p>
        </motion.div>

        <motion.div
          className="p-3 bg-green-500 text-white rounded-lg shadow-lg w-fit max-w-sm self-end mr-20"
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
