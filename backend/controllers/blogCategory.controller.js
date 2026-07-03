const BlogCategory = require('../models/BlogCategory');

exports.createCategory = async (req, res) => {
  try {
    let { name, slug, description, status } = req.body;
    
    // Auto-generate slug if not provided
    if (!slug && name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const existing = await BlogCategory.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category slug already exists' });
    }
    const category = new BlogCategory({ name, slug, description, status });
    await category.save();
    res.status(201).json({ message: 'Category created successfully', data: category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ createdAt: -1 });
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await BlogCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category updated successfully', data: category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await BlogCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
