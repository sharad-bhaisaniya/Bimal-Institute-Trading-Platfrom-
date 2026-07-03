import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiImage, FiPlus, FiVideo, FiEdit2, FiTrash2, FiFileText, FiList } from 'react-icons/fi';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

import { courseService } from '../../../services/api/course.service';
import { uploadService } from '../../../services/api/upload.service';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { CustomToast } from '../../../components/common/CustomToast';

const CourseBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'curriculum'
  
  // Basic Info State
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Curriculum State
  const [curriculum, setCurriculum] = useState([]);
  const [isCurriculumLoading, setIsCurriculumLoading] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  
  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      type: 'Free',
      status: 'Draft',
      price: 0,
      certificateEnabled: false
    }
  });
  
  const courseType = watch('type');

  useEffect(() => {
    if (isEditing) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const res = await courseService.getCourse(id);
      const course = res.data.data;
      reset({
        title: course.title,
        description: course.description,
        type: course.type,
        price: course.price,
        status: course.status,
        certificateEnabled: course.certificateEnabled,
      });
      if (course.thumbnail) {
        setThumbnailPreview(`http://localhost:5000${course.thumbnail}`);
        setValue('thumbnail', course.thumbnail);
      }
      fetchCurriculum();
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to load course data" />);
      navigate('/dashboard/courses');
    }
  };

  const fetchCurriculum = async () => {
    setIsCurriculumLoading(true);
    try {
      const res = await courseService.getCurriculum(id);
      setCurriculum(res.data.data || []);
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to load curriculum" />);
    } finally {
      setIsCurriculumLoading(false);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const onSubmitBasicInfo = async (data) => {
    try {
      if (thumbnailFile) {
        const res = await uploadService.uploadImage(thumbnailFile);
        data.thumbnail = res.data.image_url;
      }

      data.price = Number(data.price) || 0;

      if (isEditing) {
        await courseService.updateCourse(id, data);
        toast.success(<CustomToast title="Success" message="Course updated" />);
      } else {
        const res = await courseService.createCourse(data);
        toast.success(<CustomToast title="Success" message="Course created" />);
        navigate(`/dashboard/courses/builder/${res.data.data._id}`);
      }
    } catch (error) {
      toast.error(<CustomToast title="Error" message={error.response?.data?.message || 'Failed to save course'} />);
    }
  };

  // Lecture Actions
  const handleAddLecture = async () => {
    const title = window.prompt('Enter lecture title:');
    if (!title) return;
    try {
      await courseService.addLecture(id, { title, videoType: 'none' });
      toast.success(<CustomToast title="Success" message="Lecture added" />);
      fetchCurriculum();
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to add lecture" />);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('Delete this lecture?')) return;
    try {
      await courseService.deleteLecture(lectureId);
      toast.success(<CustomToast title="Success" message="Lecture deleted" />);
      fetchCurriculum();
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to delete lecture" />);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsVideoUploading(true);
    try {
      const res = await uploadService.uploadVideo(file);
      const url = res.data.video_url;
      await updateLectureField(editingLecture._id, 'videoFile', url);
      toast.success(<CustomToast title="Success" message="Video uploaded and saved!" />);
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to upload video" />);
    } finally {
      setIsVideoUploading(false);
      // Reset input value to allow selecting the same file again if needed
      e.target.value = '';
    }
  };

  const updateLectureField = async (lectureId, field, value) => {
    // Optimistic UI update for instant feedback
    setEditingLecture(prev => ({ ...prev, [field]: value }));
    setCurriculum(prev => prev.map(lec => lec._id === lectureId ? { ...lec, [field]: value } : lec));

    try {
      await courseService.updateLecture(lectureId, { [field]: value });
      // Silently save without spamming toast
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to save" />);
      fetchCurriculum(); // Revert to server state on failure
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/dashboard/courses')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>{isEditing ? 'Course Builder' : 'Create New Course'}</h1>
          <p style={{ color: '#888', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>{isEditing ? 'Manage content and curriculum' : 'Setup basic details first'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setActiveTab('basic')}
          style={{ padding: '1rem 0', background: 'transparent', border: 'none', color: activeTab === 'basic' ? 'var(--primary)' : '#888', borderBottom: activeTab === 'basic' ? '2px solid var(--primary)' : '2px solid transparent', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          1. Basic Information
        </button>
        <button 
          onClick={() => isEditing && setActiveTab('curriculum')}
          disabled={!isEditing}
          style={{ padding: '1rem 0', background: 'transparent', border: 'none', color: activeTab === 'curriculum' ? 'var(--primary)' : (isEditing ? '#888' : '#444'), borderBottom: activeTab === 'curriculum' ? '2px solid var(--primary)' : '2px solid transparent', fontWeight: 600, fontSize: '0.9rem', cursor: isEditing ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
        >
          2. Curriculum Builder {(!isEditing) && '(Save basic info first)'}
        </button>
      </div>

      {/* Tab Content: Basic Info */}
      {activeTab === 'basic' && (
        <form onSubmit={handleSubmit(onSubmitBasicInfo)} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Main Info */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#111', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Input label="Course Title" placeholder="Enter course title..." {...register('title', { required: 'Title is required' })} error={errors.title?.message} />
            <Input label="Course Description" placeholder="Short description..." {...register('description')} />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <Controller
                  name="type" control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select label="Course Type" value={value} onChange={onChange} options={[{ value: 'Free', label: 'Free' }, { value: 'Paid', label: 'Paid' }]} />
                  )}
                />
              </div>
              <div style={{ flex: 1, opacity: courseType === 'Paid' ? 1 : 0.3, pointerEvents: courseType === 'Paid' ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                <Input label="Price (₹)" type="number" {...register('price')} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <Controller
                  name="status" control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select label="Status" value={value} onChange={onChange} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Published', label: 'Published' }]} />
                  )}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer', marginTop: '1.5rem' }}>
                  <input type="checkbox" {...register('certificateEnabled')} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                  Enable Certificate on Completion
                </label>
              </div>
            </div>

            <Button type="submit" isLoading={isSubmitting} style={{ marginTop: '1rem', width: '200px' }}>
              {isEditing ? 'Save Changes' : 'Create & Continue'}
            </Button>
          </div>

          {/* Sidebar Info (Thumbnail) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '1rem', fontWeight: 500 }}>Course Thumbnail</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', aspectRatio: '16/9', borderRadius: '0.75rem', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative', backgroundColor: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}
              >
                {isUploading ? (
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>Uploading...</div>
                ) : thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="hover-overlay">
                      <span style={{ color: '#fff', fontSize: '0.85rem', background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '2rem' }}>Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <FiImage size={24} color="#555" style={{ marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Click to upload 16:9 image</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleThumbnailUpload} accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab Content: Curriculum */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Lecture List */}
          <div style={{ flex: 1, backgroundColor: '#111', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Lectures</h3>
              <button onClick={handleAddLecture} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiPlus /> Add Lecture
              </button>
            </div>

            {isCurriculumLoading ? (
              <div style={{ color: '#888', fontSize: '0.85rem', textAlign: 'center' }}>Loading...</div>
            ) : curriculum.length === 0 ? (
              <div style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No lectures added yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {curriculum.map((lec, index) => (
                  <div 
                    key={lec._id} 
                    onClick={() => setEditingLecture(lec)}
                    style={{ padding: '0.8rem 1rem', background: editingLecture?._id === lec._id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', cursor: 'pointer', border: editingLecture?._id === lec._id ? '1px solid var(--primary)' : '1px solid transparent', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', fontSize: '0.9rem' }}>
                      <span style={{ color: '#666', fontSize: '0.75rem' }}>{index + 1}.</span>
                      {lec.title}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {lec.videoUrl || lec.videoFile ? <FiVideo color="var(--primary)" size={14} /> : null}
                      {lec.quizzes?.length > 0 ? <FiList color="#ffc107" size={14} /> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lecture Editor */}
          {editingLecture ? (
            <div style={{ flex: 2, backgroundColor: '#111', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Editing Lecture: {editingLecture.title}</h3>
                <button onClick={() => handleDeleteLecture(editingLecture._id)} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', color: '#ff6b6b', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FiTrash2 /> Delete
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Video Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => updateLectureField(editingLecture._id, 'videoType', 'none')} style={{ flex: 1, padding: '0.5rem', background: editingLecture.videoType === 'none' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>None</button>
                  <button onClick={() => updateLectureField(editingLecture._id, 'videoType', 'url')} style={{ flex: 1, padding: '0.5rem', background: editingLecture.videoType === 'url' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Video URL</button>
                  <button onClick={() => updateLectureField(editingLecture._id, 'videoType', 'upload')} style={{ flex: 1, padding: '0.5rem', background: editingLecture.videoType === 'upload' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Upload Video</button>
                </div>
              </div>

              {editingLecture.videoType === 'url' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>YouTube / Vimeo URL</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      defaultValue={editingLecture.videoUrl} 
                      onBlur={(e) => updateLectureField(editingLecture._id, 'videoUrl', e.target.value)}
                      style={{ flex: 1, padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', outline: 'none' }}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}

              {editingLecture.videoType === 'upload' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Upload Video File (MP4/WebM)</label>
                  <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                    {isVideoUploading ? (
                      <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Uploading Video... Please wait...</span>
                    ) : editingLecture.videoFile ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <FiVideo size={24} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', color: '#fff' }}>Video Uploaded Successfully</span>
                        <a href={`http://localhost:5000${editingLecture.videoFile}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none' }}>Preview Video</a>
                        <label style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.3rem' }}>
                          Replace Video
                          <input type="file" onChange={handleVideoUpload} accept="video/*" style={{ display: 'none' }} />
                        </label>
                      </div>
                    ) : (
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <FiPlus size={24} color="#555" />
                        <span style={{ fontSize: '0.85rem' }}>Click to select a video file</span>
                        <input type="file" onChange={handleVideoUpload} accept="video/*" style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Lecture Notes</label>
                <textarea 
                  defaultValue={editingLecture.notes}
                  onBlur={(e) => updateLectureField(editingLecture._id, 'notes', e.target.value)}
                  style={{ width: '100%', height: '150px', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                  placeholder="Write study notes for this lecture here..."
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Quizzes ({editingLecture.quizzes?.length || 0})</label>
                  <button onClick={() => alert('Quiz builder modal opens here')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>+ Add Quiz</button>
                </div>
                {editingLecture.quizzes?.length === 0 && (
                  <div style={{ color: '#666', fontSize: '0.8rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', textAlign: 'center' }}>No quizzes assigned to this lecture.</div>
                )}
              </div>

            </div>
          ) : (
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '4rem 2rem', color: '#666' }}>
              <FiFileText size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Select a lecture from the list to edit its contents, video, notes, and quizzes.</p>
            </div>
          )}

        </div>
      )}

      <style>{`
        .hover-overlay:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default CourseBuilder;
