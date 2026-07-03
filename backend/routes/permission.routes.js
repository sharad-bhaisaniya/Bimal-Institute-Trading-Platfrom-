const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/', permissionController.getAllPermissions);

module.exports = router;
