const Application = require('../models/Application');
const Internship = require('../models/Internship');
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../services/email.service');

// @desc Apply for internship
const applyInternship = async (req, res) => {
  try {
    const { internshipId, coverLetter, resumeLink } = req.body;

    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.isActive) {
      return res.status(404).json({ success: false, message: 'Internship not found or closed' });
    }

    const existing = await Application.findOne({ internship: internshipId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
    }

    const volunteer = await Volunteer.findOne({ user: req.user._id });

    const application = await Application.create({
      internship: internshipId,
      applicant: req.user._id,
      volunteer: volunteer?._id,
      coverLetter,
      resumeLink
    });

    await sendEmail(req.user.email, emailTemplates.applicationSubmitted(req.user.name, internship.title));

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all applications (Admin)
const getAllApplications = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('internship', 'title category duration')
      .populate('applicant', 'name email phone')
      .populate('volunteer', 'city skills')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications: applications.filter(a => {
        if (category && a.internship?.category !== category) return false;
        if (search) {
          const s = search.toLowerCase();
          return a.applicant?.name?.toLowerCase().includes(s) ||
                 a.internship?.title?.toLowerCase().includes(s);
        }
        return true;
      }),
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get my applications (Volunteer)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('internship', 'title category duration stipend deadline')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update application status (Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('internship', 'title');

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status = status;
    application.adminNote = adminNote;
    application.statusUpdatedAt = new Date();
    await application.save();

    await sendEmail(
      application.applicant.email,
      emailTemplates.applicationStatusUpdate(application.applicant.name, application.internship.title, status, adminNote)
    );

    res.json({ success: true, message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyInternship, getAllApplications, getMyApplications, updateApplicationStatus };
