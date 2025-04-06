const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const admin = require('../firebase'); // or wherever you put your firebase.js

// 🔐 Register
router.post('/register', async (req, res) => {
  console.log('Register body:', req.body);
  const { name, email, password, department, gender } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });


const newUser = await User.create({ name, email, password, department, gender });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔑 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🧑‍💼 Add this route to return profile info
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Exclude password
    if (!users) return res.status(404).json({ message: 'User not found' });

    res.json(users);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/google', async (req, res) => {
  const { idToken , displayName} = req.body;

  try {
    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, uid } = decoded;
    console.log("HELLO1", email, uid, displayName)

    // Check or create user in your DB
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, firebaseUid: uid, name:displayName }); // You can store Firebase UID too
    }
    console.log("HELLO2", user)
    // Issue your app's JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log("HELLLOOO", token)
    res.json({ token, user });
  } catch (err) {
    console.error('Error verifying Firebase token:', err);
    res.status(401).json({ message: 'Invalid Firebase ID token' });
  }
});


// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.send({ message: 'Logged out' });
  });
});

// Get current logged-in user
router.get('/current-user', (req, res) => {
  res.send(req.user || null);
});

module.exports = router;
