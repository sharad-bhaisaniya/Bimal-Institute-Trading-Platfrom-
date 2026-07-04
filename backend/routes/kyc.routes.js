const express = require('express');
const {
  initiateKyc,
  digioCallback,
  checkKycStatus,
  getKycFullDetails,
} = require('../controllers/kyc.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public — Digio redirects here after user completes KYC
router.get('/callback', digioCallback);

// Protected
router.post('/initiate',     protect, initiateKyc);
router.get('/status',        protect, checkKycStatus);
router.get('/full-details',  protect, getKycFullDetails);

module.exports = router;
