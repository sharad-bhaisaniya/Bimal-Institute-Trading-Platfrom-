const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  createCourse, getAllCourses, getCourse, updateCourse, deleteCourse,
  getCurriculum, addLecture, updateLecture, deleteLecture,
  addQuiz, updateQuiz, deleteQuiz
} = require('../controllers/course.controller');

// Course CRUD
router.post('/', protect, createCourse);
router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

// Curriculum
router.get('/:courseId/curriculum', protect, getCurriculum);
router.post('/:courseId/lectures', protect, addLecture);
router.put('/lectures/:lectureId', protect, updateLecture);
router.delete('/lectures/:lectureId', protect, deleteLecture);

// Quizzes
router.post('/lectures/:lectureId/quizzes', protect, addQuiz);
router.put('/quizzes/:quizId', protect, updateQuiz);
router.delete('/quizzes/:quizId', protect, deleteQuiz);

module.exports = router;
