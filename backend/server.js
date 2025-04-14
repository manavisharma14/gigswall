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


const User = require('./models/User');  
const Message = require('./models/Message');  

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'https://peergigfe-59yi.onrender.com',  
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
app.use('/uploads', express.static('uploads')); 

let users = {};  

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);


  socket.on('registerUser', (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });


  socket.on('sendMessage', async (messageData) => {
    const { from, to, content } = messageData;


    const newMessage = new Message({
      from,
      to,
      content,
      timestamp: new Date().toISOString(),
    });

    try {
      await newMessage.save();  


      if (users[to]) {
        io.to(users[to]).emit('receiveMessage', newMessage); 
      }


      io.emit('receiveMessage', newMessage);  

    } catch (err) {
      console.error('Error saving message:', err);
    }
  });


  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);

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
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
  })
  .catch((err) => console.error(err));