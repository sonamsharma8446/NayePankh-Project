const express = require('express');
const router = express.Router();
const { requestCertificate, getMyCertificates, getAllCertificates, approveCertificate, rejectCertificate } = require('../controllers/certificate.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/request', protect, requestCertificate);
router.get('/my', protect, getMyCertificates);
router.get('/', protect, adminOnly, getAllCertificates);
router.put('/:id/approve', protect, adminOnly, approveCertificate);
router.put('/:id/reject', protect, adminOnly, rejectCertificate);

module.exports = router;
