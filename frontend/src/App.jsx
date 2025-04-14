import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from './analytics'; //
import Navbar from './components/Navbar';
import Home from './components/Home';
import PostJob from './components/PostJob';
import AppliedJobs from './components/AppliedJobs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Profile from './components/Profile';
import SkillsCarousel from './components/SkillsCarousel';
import About from './components/About';
import PeerMeet from './components/PeerMeet';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);
};

function AppContent({ toggleTheme, darkMode }) {
  usePageTracking();

  return (
    <>
      <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <PeerMeet />
              <SkillsCarousel />
              <PostJob />
              <About />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/applied" element={<AppliedJobs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);

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
      <AppContent toggleTheme={toggleTheme} darkMode={darkMode} />
    </Router>
  );
}

export default App;
