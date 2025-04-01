import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PostJob from './components/PostJob';
import AppliedJobs from './components/AppliedJobs';
import Contact from './components/Contact'; // ✅ import Contact
import Footer from './components/Footer';

function App() {

  const [darkMode, setDarkMode] = useState(false);

  // toggle html class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Router>
      <Navbar toggleTheme={toggleTheme} darkMode={darkMode} /> {/* ✅ FIXED */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <PostJob />
              <Contact /> 
              <Footer />
            </>
          }
        />
        <Route path="/applied" element={<AppliedJobs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}  

export default App;
