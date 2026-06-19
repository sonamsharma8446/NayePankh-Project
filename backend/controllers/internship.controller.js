const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Volunteer = require('../models/Volunteer');
const { sendEmail, emailTemplates } = require('../services/email.service');

// @desc Create internship (Admin)
const createInternship = async (req, res) => {
  try {
    const internship = await Internship.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Internship created', internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all internships
const getAllInternships = async (req, res) => {
  try {
    const { category, isActive, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) query.title = new RegExp(search, 'i');

    const internships = await Internship.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, internships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get internship by ID
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('createdBy', 'name');
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
    res.json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update internship (Admin)
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
    res.json({ success: true, message: 'Internship updated', internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete internship (Admin)
const deleteInternship = async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Internship deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createInternship, getAllInternships, getInternshipById, updateInternship, deleteInternship };
