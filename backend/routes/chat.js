// routes/messages.js
const express = require('express');
const Message = require('../models/Message'); 
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/send', authenticateJWT, async (req, res) => {
  const { to, content } = req.body;
  const from = req.userId; 

  try {
    const message = new Message({
      from,
      to,
      content,
      timestamp: new Date().toISOString(),
    });

    await message.save();


    const socket = io.sockets.connected[users[to]];
    if (socket) {
      socket.emit('receiveMessage', message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/:userId', authenticateJWT, async (req, res) => {
  const currentUserId = req.userId; 
  const otherUserId = req.params.userId;

  try {

    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: otherUserId },
        { from: otherUserId, to: currentUserId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);  
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


module.exports = router;
