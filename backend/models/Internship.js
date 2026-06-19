const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Front End Development', 'Full Stack Development', 'Backend Development', 'Artificial Intelligence', 'Data Analytics']
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: '3 months'
  },
  stipend: {
    type: String,
    default: 'Unpaid'
  },
  requirements: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  openings: {
    type: Number,
    default: 5
  },
  deadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
