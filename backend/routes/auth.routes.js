const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register/send-otp', authController.sendOtp);
router.post('/register/verify', authController.verifyAndRegister);
router.post('/login', authController.login);
router.post('/login/send-otp', authController.sendLoginOtp);
router.post('/login/verify', authController.verifyLoginOtp);

module.exports = router;
