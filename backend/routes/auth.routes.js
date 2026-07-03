const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register/send-otp', authController.sendOtp);
router.post('/register/verify', authController.verifyAndRegister);
router.post('/login', authController.login);

module.exports = router;
