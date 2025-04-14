
const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const fs = require('fs');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `resume_${req.userId}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });


router.post('/upload-resume', authMiddleware, upload.single('resume'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ resumeUrl: fileUrl });
  });
  

module.exports = router;
