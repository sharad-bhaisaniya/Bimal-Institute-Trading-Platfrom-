const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Quiz = require('../models/Quiz');

// --- COURSE CRUD ---

exports.createCourse = async (req, res) => {
  try {
    let { title, description, thumbnail, type, price, status, certificateEnabled } = req.body;
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const existing = await Course.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const course = new Course({ title, slug, description, thumbnail, type, price, status, certificateEnabled });
    await course.save();
    res.status(201).json({ message: 'Course created successfully', data: course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    // In a real app we might want to attach lecture counts, but we can keep it simple.
    res.status(200).json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ data: course });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course updated successfully', data: course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    // Cleanup lectures and quizzes
    const lectures = await Lecture.find({ courseId: course._id });
    const lectureIds = lectures.map(l => l._id);
    await Quiz.deleteMany({ lectureId: { $in: lectureIds } });
    await Lecture.deleteMany({ courseId: course._id });

    res.status(200).json({ message: 'Course and its curriculum deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
};

// --- CURRICULUM (LECTURES & QUIZZES) ---

exports.getCurriculum = async (req, res) => {
  try {
    const { courseId } = req.params;
    // Fetch lectures and attach quizzes
    const lectures = await Lecture.find({ courseId }).sort({ order: 1 }).lean();
    
    for (let i = 0; i < lectures.length; i++) {
      const quizzes = await Quiz.find({ lectureId: lectures[i]._id }).lean();
      lectures[i].quizzes = quizzes;
    }
    
    res.status(200).json({ data: lectures });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching curriculum', error });
  }
};

exports.addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, videoType, videoUrl, videoFile, notes } = req.body;
    
    const count = await Lecture.countDocuments({ courseId });
    const lecture = new Lecture({
      courseId, title, order: count, videoType, videoUrl, videoFile, notes
    });
    
    await lecture.save();
    res.status(201).json({ message: 'Lecture added successfully', data: lecture });
  } catch (error) {
    res.status(500).json({ message: 'Error adding lecture', error });
  }
};

exports.updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(req.params.lectureId, req.body, { new: true });
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    res.status(200).json({ message: 'Lecture updated successfully', data: lecture });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lecture', error });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.lectureId);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    await Quiz.deleteMany({ lectureId: lecture._id });
    res.status(200).json({ message: 'Lecture and its quizzes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lecture', error });
  }
};

exports.addQuiz = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, questions } = req.body;
    
    const quiz = new Quiz({ lectureId, title, questions });
    await quiz.save();
    res.status(201).json({ message: 'Quiz added successfully', data: quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error adding quiz', error });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: 'Quiz updated successfully', data: quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error updating quiz', error });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz', error });
  }
};
