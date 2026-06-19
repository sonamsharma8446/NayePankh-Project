const express = require('express');
const router = express.Router();
const { createVolunteer, getAllVolunteers, getVolunteerById, getMyProfile, updateVolunteer, deleteVolunteer } = require('../controllers/volunteer.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllVolunteers);
router.post('/', protect, createVolunteer);
router.get('/me', protect, getMyProfile);
router.get('/:id', protect, getVolunteerById);
router.put('/:id', protect, updateVolunteer);
router.delete('/:id', protect, adminOnly, deleteVolunteer);

module.exports = router;
