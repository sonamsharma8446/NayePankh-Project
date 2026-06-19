const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  type: {
    type: String,
    enum: ['General', 'Internship', 'Event', 'Certificate', 'Urgent'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sendEmail: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiryDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
