// routes/messages.js
const express = require('express');
const Message = require('../models/Message'); // Create a Message model for storing messages
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

// Save the message to the database
router.post('/send', authenticateJWT, async (req, res) => {
  const { to, content } = req.body;
  const from = req.userId; // Get userId from JWT token

  try {
    const message = new Message({
      from,
      to,
      content,
      timestamp: new Date().toISOString(),
    });

    await message.save();

    // Emit the message to the other user
    const socket = io.sockets.connected[users[to]];
    if (socket) {
      socket.emit('receiveMessage', message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// routes/chat.js

// Fetch all messages between two users
router.get('/:userId', authenticateJWT, async (req, res) => {
  const currentUserId = req.userId;  // Get the authenticated user ID from the token
  const otherUserId = req.params.userId;

  try {
    // Find all messages between the two users
    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: otherUserId },
        { from: otherUserId, to: currentUserId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);  // Send messages back to the client
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


module.exports = router;
