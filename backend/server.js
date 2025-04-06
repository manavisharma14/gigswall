const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const uploadRoutes = require('./routes/uploadResume');

const app = express();
const server = http.createServer(app); // for socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', uploadRoutes);

// 🔌 Socket.IO setup
io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.id);

  socket.on('join-room', ({ room }) => {
    socket.join(room);
    console.log(`🟢 Joined room: ${room}`);
  });

  socket.on('chat-message', ({ room, msg }) => {
    io.to(room).emit('chat-message', msg);
  });

  socket.on('leave-room', ({ room }) => {
    socket.leave(room);
    console.log(`🔴 Left room: ${room}`);
  });

  socket.on('gig-accepted', ({ jobId, userId }) => {
    io.emit('start-chat', { jobId, userId });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connecteddd');
    console.log('🔌 Connecting to MongoDB at:', process.env.MONGO_URI);
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
