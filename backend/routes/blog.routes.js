const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blog.controller');

router.post('/', protect, createBlog);
router.get('/', protect, getAllBlogs);
router.get('/:id', protect, getBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
