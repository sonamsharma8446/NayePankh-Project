const Certificate = require('../models/Certificate');
const Volunteer = require('../models/Volunteer');
const { sendEmail, emailTemplates } = require('../services/email.service');

// @desc Request certificate
const requestCertificate = async (req, res) => {
  try {
    const { certificateType, reason } = req.body;
    const volunteer = await Volunteer.findOne({ user: req.user._id });

    const certificate = await Certificate.create({
      volunteer: req.user._id,
      volunteerProfile: volunteer?._id,
      certificateType,
      reason
    });

    res.status(201).json({ success: true, message: 'Certificate request submitted', certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get my certificate requests
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ volunteer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all certificate requests (Admin)
const getAllCertificates = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const certificates = await Certificate.find(query)
      .populate('volunteer', 'name email')
      .populate('volunteerProfile', 'fullName city skills')
      .sort({ createdAt: -1 });

    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Approve certificate (Admin)
const approveCertificate = async (req, res) => {
  try {
    const { adminNote, certificateUrl } = req.body;
    const certificate = await Certificate.findById(req.params.id).populate('volunteer', 'name email');
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate request not found' });

    certificate.status = 'Approved';
    certificate.adminNote = adminNote;
    certificate.certificateUrl = certificateUrl;
    certificate.resolvedDate = new Date();
    await certificate.save();

    await sendEmail(certificate.volunteer.email, emailTemplates.certificateApproved(certificate.volunteer.name, certificate.certificateType));

    res.json({ success: true, message: 'Certificate approved', certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Reject certificate (Admin)
const rejectCertificate = async (req, res) => {
  try {
    const { adminNote } = req.body;
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected', adminNote, resolvedDate: new Date() },
      { new: true }
    );
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, message: 'Certificate rejected', certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { requestCertificate, getMyCertificates, getAllCertificates, approveCertificate, rejectCertificate };
