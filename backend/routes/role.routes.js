const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRole);
// Assume only manage_users permission can edit roles (or Super Admin)
router.post('/', authorize('manage_users'), roleController.createRole);
router.put('/:id', authorize('manage_users'), roleController.updateRole);
router.delete('/:id', authorize('manage_users'), roleController.deleteRole);

module.exports = router;
