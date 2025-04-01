const mongoose = require('mongoose'); // ✅ Required

const JobSchema = new mongoose.Schema({
  title: String,
  desc: String,
  budget: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true });


module.exports = mongoose.model('Job', JobSchema); // ✅ Correct
