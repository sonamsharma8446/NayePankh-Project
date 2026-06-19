const express = require('express');
const router = express.Router();
const { createInternship, getAllInternships, getInternshipById, updateInternship, deleteInternship } = require('../controllers/internship.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllInternships);
router.post('/', protect, adminOnly, createInternship);
router.get('/:id', protect, getInternshipById);
router.put('/:id', protect, adminOnly, updateInternship);
router.delete('/:id', protect, adminOnly, deleteInternship);

module.exports = router;
