require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add frontend origins
  credentials: true,
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const smtpRoutes = require('./routes/smtp.routes');
const settingsRoutes = require('./routes/settings.routes');
const youtubeRoutes = require('./routes/youtube.routes');
const uploadRoutes = require('./routes/upload.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const permissionRoutes = require('./routes/permission.routes');
const blogCategoryRoutes = require('./routes/blogCategory.routes');
const blogRoutes = require('./routes/blog.routes');
const mediaRoutes = require('./routes/media.routes');
const courseRoutes = require('./routes/course.routes');
const notificationRoutes = require('./routes/notification.routes');
const subscriptionPlanRoutes = require('./routes/subscriptionPlan.routes');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

// Serve static files from the uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/smtp', smtpRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/youtube', youtubeRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/permissions', permissionRoutes);
app.use('/api/v1/blog-categories', blogCategoryRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/subscription-plans', subscriptionPlanRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bimalinstitute';

const generatePermissions = require('./utils/permissionGenerator');

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Auto-generate permissions dynamically from Express routes
    await generatePermissions(app);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
