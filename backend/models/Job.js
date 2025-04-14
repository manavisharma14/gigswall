const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  desc: String,
  budget: Number,
  skills: String,
  timeline: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    portfolio: String,
    availability: String,


    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
