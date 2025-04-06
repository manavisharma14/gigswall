const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // moved up
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const uploadRoutes = require('./routes/uploadResume');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded resume files
app.use('/uploads', express.static('uploads'));

// ✅ Your API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', uploadRoutes); 
app.use('/api/jobs', jobRoutes);

// ✅ Serve frontend static files (AFTER routes)
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connecteddd');
    console.log("🔌 Connecting to MongoDB at:", process.env.MONGO_URI);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
