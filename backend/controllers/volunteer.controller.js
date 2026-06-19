const Volunteer = require('../models/Volunteer');
const { getRecommendation } = require('../services/recommendation.service');

// @desc Create volunteer profile
// @route POST /api/volunteers
const createVolunteer = async (req, res) => {
  try {
    const existing = await Volunteer.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Volunteer profile already exists' });
    }

    const { fullName, email, phone, city, address, education, skills, availability, interestArea } = req.body;

    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    const recommendation = getRecommendation(skillsArray);

    const volunteer = await Volunteer.create({
      user: req.user._id,
      fullName, email, phone, city, address, education,
      skills: skillsArray,
      availability, interestArea,
      recommendedRole: recommendation.role
    });

    res.status(201).json({ success: true, message: 'Volunteer profile created', volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all volunteers (Admin)
// @route GET /api/volunteers
const getAllVolunteers = async (req, res) => {
  try {
    const { city, availability, skills, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (city) query.city = new RegExp(city, 'i');
    if (availability) query.availability = availability;
    if (skills) query.skills = { $in: skills.split(',').map(s => s.trim()) };
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') }
      ];
    }

    const total = await Volunteer.countDocuments(query);
    const volunteers = await Volunteer.find(query)
      .populate('user', 'name email role createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      volunteers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get volunteer by ID
// @route GET /api/volunteers/:id
const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('user', 'name email role createdAt');
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }
    res.json({ success: true, volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get own volunteer profile
// @route GET /api/volunteers/me
const getMyProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }
    res.json({ success: true, volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update volunteer
// @route PUT /api/volunteers/:id
const updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    // Allow own update or admin
    if (volunteer.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.body.skills) {
      req.body.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map(s => s.trim());
      const recommendation = getRecommendation(req.body.skills);
      req.body.recommendedRole = recommendation.role;
    }

    const updated = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Volunteer updated', volunteer: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete volunteer (Admin)
// @route DELETE /api/volunteers/:id
const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }
    res.json({ success: true, message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createVolunteer, getAllVolunteers, getVolunteerById, getMyProfile, updateVolunteer, deleteVolunteer };
