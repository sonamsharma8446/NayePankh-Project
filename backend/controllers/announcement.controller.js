const Announcement = require('../models/Announcement');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../services/email.service');

// @desc Create announcement (Admin)
const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });

    // Send bulk email if sendEmail flag is set
    if (req.body.sendEmail) {
      const volunteers = await User.find({ role: 'volunteer', isActive: true }).select('name email');
      for (const v of volunteers) {
        await sendEmail(v.email, emailTemplates.announcement(v.name, req.body.title, req.body.content));
      }
    }

    res.status(201).json({ success: true, message: 'Announcement created', announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const query = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    else query.isActive = true;

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update announcement (Admin)
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, message: 'Announcement updated', announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete announcement (Admin)
const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createAnnouncement, getAllAnnouncements, updateAnnouncement, deleteAnnouncement };
