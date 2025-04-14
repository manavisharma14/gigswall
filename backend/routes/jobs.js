// backend/routes/jobs.js
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

  const { title, desc, budget, skills, timeline } = req.body;

  if (!title || !desc || !budget || !skills || !timeline) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const job = await Job.create({
      title,
      desc,
      budget,
      skills,
      timeline,
      createdBy: req.userId
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('Job posting error:', err);
    res.status(500).json({ message: 'Server error while posting job' });
  }
});


router.post('/:id/apply', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const jobId = req.params.id;
  const { message, portfolio, availability } = req.body;

  if (!message || !portfolio || !availability) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.applicants.some(app => app?.user?.toString?.() === userId)) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    job.applicants.push({ user: userId, message, portfolio, availability });
    await job.save();

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/applied', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ 'applicants.user': req.userId });
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Fetch applied jobs error:', err);
    res.status(500).json({ message: 'Server error while fetching applied jobs' });
  }
});


router.get('/posted/responses', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.userId }).populate({
      path: 'applicants.user',
      select: 'name email department gender'
    });

    res.json(jobs);
  } catch (err) {
    console.error('Error fetching posted job responses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/:jobId/applications/:userId/status', authMiddleware, async (req, res) => {
  const { jobId, userId } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    console.log("job.createdBy:", job.createdBy);
    console.log("req.userId (from token):", req.userId);

    if (job.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicant = job.applicants.find(app => app.user.toString() === userId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    applicant.status = status;
    await job.save();

    res.status(200).json({ message: 'Status updated successfully', applicant });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;