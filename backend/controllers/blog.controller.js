const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, category, metaDescription, description, featuredImage, isFeatured, readTime, status } = req.body;
    
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Blog slug already exists' });
    }

    const blog = new Blog({
      title,
      slug,
      category,
      metaDescription,
      description,
      featuredImage,
      isFeatured,
      readTime,
      status,
      author: req.user ? req.user._id : undefined
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', data: blog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('category', 'name slug')
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.status(200).json({ data: blogs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'firstName lastName');
      
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ data: blog });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog updated successfully', data: blog });
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error });
  }
};
