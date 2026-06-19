const express = require('express');
const router = express.Router();
const { getRecommendation } = require('../services/recommendation.service');
const { protect } = require('../middleware/auth');

router.post('/', protect, (req, res) => {
  try {
    const { skills } = req.body;
    const result = getRecommendation(skills);
    res.json({ success: true, recommendation: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
