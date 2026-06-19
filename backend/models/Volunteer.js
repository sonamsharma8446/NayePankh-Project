const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    required: [true, 'Education is required']
  },
  skills: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Weekends', 'Flexible'],
    default: 'Flexible'
  },
  interestArea: {
    type: String,
    enum: ['Education', 'Technology', 'Healthcare', 'Environment', 'Community Development', 'Other'],
    default: 'Technology'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  recommendedRole: {
    type: String,
    default: ''
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
