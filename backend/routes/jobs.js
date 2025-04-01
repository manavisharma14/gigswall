const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Job = require('../models/Job');

// ✅ GET all jobs (no auth needed)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});

// ✅ POST a new job (auth required)
router.post('/', authMiddleware, async (req, res) => {
  console.log('📥 POST /api/jobs hit');
  console.log('➡️  Request body:', req.body);
  console.log('🧑 User ID:', req.userId);

  const { title, desc, budget } = req.body;

  if (!title || !desc || !budget) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const job = await Job.create({
      title,
      desc,
      budget,
      createdBy: req.userId
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('Job posting error:', err);
    res.status(500).json({ message: 'Server error while posting job' });
  }
});



// POST /api/jobs/:id/apply → logged-in user applies for a job
router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // prevent duplicate applications
    if (job.applicants && job.applicants.includes(req.userId)) {
      return res.status(400).json({ message: 'You already applied to this job' });
    }

    job.applicants = job.applicants || [];
    job.applicants.push(req.userId);
    await job.save();

    res.status(200).json({ message: 'Successfully applied to job' });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error while applying' });
  }
});


// GET /api/jobs/applied → get all jobs this user has applied for
router.get('/applied', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ applicants: req.userId });
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Fetch applied jobs error:', err);
    res.status(500).json({ message: 'Server error while fetching applied jobs' });
  }
});


module.exports = router;
