import api from './api';

export const courseService = {
  // Course CRUD
  createCourse: (data) => api.post('/courses', data),
  getAllCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // Curriculum
  getCurriculum: (courseId) => api.get(`/courses/${courseId}/curriculum`),
  addLecture: (courseId, data) => api.post(`/courses/${courseId}/lectures`, data),
  updateLecture: (lectureId, data) => api.put(`/courses/lectures/${lectureId}`, data),
  deleteLecture: (lectureId) => api.delete(`/courses/lectures/${lectureId}`),

  // Quizzes
  addQuiz: (lectureId, data) => api.post(`/courses/lectures/${lectureId}/quizzes`, data),
  updateQuiz: (quizId, data) => api.put(`/courses/quizzes/${quizId}`, data),
  deleteQuiz: (quizId) => api.delete(`/courses/quizzes/${quizId}`),
};
