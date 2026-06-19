const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, createAdmin } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', createAdmin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
