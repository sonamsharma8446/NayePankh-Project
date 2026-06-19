const express = require('express');
const router = express.Router();
const { applyInternship, getAllApplications, getMyApplications, updateApplicationStatus } = require('../controllers/application.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/apply', protect, applyInternship);
router.get('/', protect, adminOnly, getAllApplications);
router.get('/my', protect, getMyApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;
