const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  coverLetter: {
    type: String,
    trim: true
  },
  resumeLink: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Shortlisted', 'Selected', 'Rejected'],
    default: 'Pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  statusUpdatedAt: {
    type: Date
  },
  adminNote: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
