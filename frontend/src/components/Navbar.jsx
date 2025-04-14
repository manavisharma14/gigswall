import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const socket = io('https://peergigbe.onrender.com'); 

function Navbar({ toggleTheme, darkMode }) {
  const url = "https://peergigbe.onrender.com"
  // const url = "http://localhost:5001"

  const [modalType, setModalType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); 
  const [jobs, setJobs] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [message, setMessage] = useState(''); 
  const [users, setUsers] = useState([]);
  const [chatWithUser, setChatWithUser] = useState(null); 
  const navigate = useNavigate();
  useEffect(() => {
    console.log("jobs", jobs)
    fetch(url + '/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error('Error fetching jobs:', err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
  
    if (token && user) {
      setIsLoggedIn(true);
      if (!currentUser) setCurrentUser(JSON.parse(user));
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, []);
  

  useEffect(() => {
    if (currentUser) {
      socket.emit('registerUser', currentUser._id);
    }

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage'); 
    };
  }, [currentUser]); 

  useEffect(() => {
    if (isChatModalOpen) {
      fetch(url + '/api/auth/users') 
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.filter(user => user._id !== currentUser._id)); 
        })
        .catch((error) => console.error('Error fetching users:', error));
    }
  }, [isChatModalOpen, currentUser]); 
  const handlePostJobClick = () => {
    if (!isLoggedIn) {

      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000); 
      return;
    }    
    
    
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('postjobs');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('postjobs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowLogoutToast(true);
    setTimeout(() => {
      setShowLogoutToast(false);
      navigate('/');
    }, 1500);
  };


  const toggleChatModal = () => {
    setIsChatModalOpen(!isChatModalOpen);
    setMessages([]); 
    setChatWithUser(null); 
  };

  const handleSendMessage = () => {
    if (message.trim() && chatWithUser) {
      const newMessage = {
        from: currentUser._id, 
        to: chatWithUser._id, 
        content: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit('sendMessage', newMessage); 
      setMessage(''); 

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setModalType(null);
  };

  const handleUserSelect = (user) => {
    setChatWithUser(user); 
    setMessages([]);

    fetch(url + `/api/messages/${user._id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error('Error fetching messages:', error));
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-black dark:text-white">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/peergiglogo.png" alt="logo" className="h-20" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">PeerGig</h1>
        </div>

        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <button onClick={handlePostJobClick} className="hover:text-gray-600 dark:hover:text-gray-300">Post Job</button>
          <Link to="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</Link>
        {isLoggedIn && (
            <Link to="/profile" className="hover:text-gray-600 dark:hover:text-gray-300">My Profile</Link>
        )}
          <button
            onClick={toggleTheme}
            className="text-xl hover:text-gray-500 transition"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌞' : '🌙'}
          </button>

          {!isLoggedIn ? (
            <button
              onClick={() => setModalType('login')}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-md transition"
            >
              <span>🔐</span>
              <span>Login / Register</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-md transition"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          )}

          
        </div>
      </div>

      {showLogoutToast && (
              <div className="absolute top-24 right-6 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded-lg shadow-lg animate-slide-in-down z-50">
                👋 You’ve been logged out.
              </div>
            )}

      {showLoginPrompt && (
        <div className="absolute top-24 right-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg animate-slide-in-down z-50">
          ⚠️ Please log in to create a gig.
        </div>
      )}

      {modalType === 'login' && (
        <Login
          closeModal={() => setModalType(null)}
          switchToRegister={() => setModalType('register')}
          onLoginSuccess={() => {
            setModalType(null);
            setIsLoggedIn(true);
          }}        
          />
      )}
      {modalType === 'register' && (
        <Register
          closeModal={() => setModalType(null)}
          switchToLogin={() => setModalType('login')}
          onRegisterSuccess={() => {
            setModalType(null);
            setIsLoggedIn(true);
          }}
        />
      )}

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div
          onClick={toggleChatModal}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-800 dark:text-white"
          >
            <h2 className="text-xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-300">
              Chat
            </h2>

            {/* User List */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-center mb-2">Select a User to Chat</h3>
              <ul className="space-y-2">
                {users.map((user) => {
                  console.log("HERE's the user", user)

                  return (
                    <li
                      key={user._id}
                      onClick={() => handleUserSelect(user)}
                      className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                    >
                      {user.name}
                    </li>
                  )
                })}
              </ul>
            </div>

            { chatWithUser && (
              <div className="h-64 overflow-auto border p-4 rounded bg-gray-100 dark:bg-gray-700">
              {
              messages.map((msg, index) => {
                return (
                <div
                  key={index}
                  className={`mb-2 flex ${msg.from === currentUser._id ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.from === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                  >
                    <strong>{msg.from === currentUser._id ? 'You' : chatWithUser.name}:</strong>
                    <div>{msg.content}</div>
                    <small className="block text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                </div>
              )})}
            </div>
            ) }
            


            {chatWithUser && (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                  placeholder={`Type your message to ${chatWithUser.name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="mt-2 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
