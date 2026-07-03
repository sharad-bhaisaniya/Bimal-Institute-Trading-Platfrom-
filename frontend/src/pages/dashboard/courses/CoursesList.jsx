import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiVideo, FiPlayCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { courseService } from '../../../services/api/course.service';
import { BASE_URL } from '../../../services/api/api';
import Button from '../../../components/common/Button';
import { CustomToast } from '../../../components/common/CustomToast';

const CoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await courseService.getAllCourses();
      setCourses(res.data?.data || []);
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to fetch courses" />);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course and all its curriculum?')) return;
    try {
      await courseService.deleteCourse(id);
      toast.success(<CustomToast title="Success" message="Course deleted successfully" />);
      fetchCourses();
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to delete course" />);
    }
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>Courses (LMS)</h1>
          <p style={{ color: '#888', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Manage your courses, lectures, and quizzes.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={() => navigate('/dashboard/courses/import-youtube')} style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <FiPlayCircle /> Import YouTube Playlist
          </Button>
        </div>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>No courses found. Create your first course!</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type / Price</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '0.5rem 1rem', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {course.thumbnail ? (
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#222' }}>
                          <img src={course.thumbnail.startsWith('http') ? course.thumbnail : `${BASE_URL}${course.thumbnail}`} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiVideo color="#555" size={16} />
                        </div>
                      )}
                      <div>
                        <div 
                          onClick={() => navigate(`/dashboard/courses/${course._id}`)}
                          style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', textDecoration: 'none' }}
                        >
                          {course.title}
                          {course.certificateEnabled && <span style={{ fontSize: '0.6rem', padding: '1px 4px', background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', borderRadius: '4px', fontWeight: 700 }}>CERTIFICATE</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {course.playlistId ? 'YouTube Playlist' : course.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 1rem', color: '#aaa', fontSize: '0.8rem' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                      backgroundColor: course.type === 'Paid' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: course.type === 'Paid' ? '#3b82f6' : '#10b981'
                    }}>
                      {course.type === 'Paid' ? `₹${course.price}` : 'FREE'}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                      backgroundColor: course.status === 'Published' ? 'rgba(189,255,0,0.1)' : 'rgba(255,255,255,0.1)',
                      color: course.status === 'Published' ? 'var(--primary)' : '#aaa'
                    }}>
                      {course.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => navigate(`/dashboard/courses/builder/${course._id}`)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiEdit2 size={12} />
                      </button>
                      <button onClick={() => handleDelete(course._id)} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', color: '#ff6b6b', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
