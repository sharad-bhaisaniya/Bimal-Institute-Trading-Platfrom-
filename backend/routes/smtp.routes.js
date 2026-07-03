const express = require('express');
const router = express.Router();
const smtpController = require('../controllers/smtp.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Apply protection and require settings management permission (Super Admin automatically passes)
router.use(protect, authorize('manage_settings'));

router.get('/', smtpController.getAllSmtp);
router.post('/', smtpController.createSmtp);
router.put('/:id', smtpController.updateSmtp);
router.delete('/:id', smtpController.deleteSmtp);

module.exports = router;
