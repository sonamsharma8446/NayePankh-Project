const express = require('express');
const router = express.Router();
const { createAnnouncement, getAllAnnouncements, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcement.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllAnnouncements);
router.post('/', protect, adminOnly, createAnnouncement);
router.put('/:id', protect, adminOnly, updateAnnouncement);
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

module.exports = router;
