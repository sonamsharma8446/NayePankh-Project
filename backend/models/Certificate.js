const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  certificateType: {
    type: String,
    enum: ['Volunteer Certificate', 'Internship Completion', 'Achievement Award', 'Appreciation Letter'],
    default: 'Volunteer Certificate'
  },
  reason: {
    type: String,
    required: [true, 'Reason is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminNote: {
    type: String
  },
  certificateUrl: {
    type: String
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  resolvedDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
