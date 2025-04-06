const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const uploadRoutes = require('./routes/uploadResume');
const chatRoutes = require('./routes/chat');

// Models
const User = require('./models/User');  // Import User model
const Message = require('./models/Message');  // Import Message model

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',  // Update with your frontend URL (React frontend port)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/messages', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/uploads', express.static('uploads')); // Serve uploaded resume files

// Map userId to socketId
let users = {};  // This will store the mapping of userId to socketId

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register the user with their socketId
  socket.on('registerUser', (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });

  // Handle message sending
  socket.on('sendMessage', async (messageData) => {
    const { from, to, content } = messageData;

    // Create a new message and save it to the database
    const newMessage = new Message({
      from,
      to,
      content,
      timestamp: new Date().toISOString(),
    });

    try {
      await newMessage.save();  // Save message to MongoDB

      // Emit the message to the recipient if they are connected
      if (users[to]) {
        io.to(users[to]).emit('receiveMessage', newMessage);  // Send to specific user
      }

      // Optionally, broadcast to all (if needed) or just save in DB for history
      io.emit('receiveMessage', newMessage);  // Broadcast to all users

    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Remove user from the mapping when they disconnect
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // Use server.listen instead of app.listen
  })
  .catch((err) => console.error(err));