import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiArrowLeft, FiImage, FiUpload, FiEdit2, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Paragraph,
  Heading,
  List,
  Link,
  Font
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

import { blogService } from '../../../services/api/blog.service';
import { blogCategoryService } from '../../../services/api/blogCategory.service';
import { mediaService } from '../../../services/api/media.service';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { CustomToast } from '../../../components/common/CustomToast';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  category: yup.string().required('Category is required'),
  metaDescription: yup.string(),
  description: yup.string().required('Content description is required'),
  isFeatured: yup.boolean(),
  readTime: yup.string(),
  status: yup.string().oneOf(['Draft', 'Published']),
  featuredImage: yup.string()
});

const BlogForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isFeatured: false,
      status: 'Draft',
      description: ''
    }
  });

  const watchTitle = watch('title');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await blogCategoryService.getAllCategories();
        setCategories(res.data || []);
      } catch (error) {
        toast.error(<CustomToast title="Error" message="Failed to fetch categories" />);
      }
    };

    fetchCategories();

    if (isEditing) {
      const fetchBlog = async () => {
        try {
          const res = await blogService.getBlogById(id);
          const blog = res.data;
          if (blog) {
            setValue('title', blog.title);
            setValue('slug', blog.slug);
            setValue('category', blog.category?._id || blog.category);
            setValue('metaDescription', blog.metaDescription);
            setValue('description', blog.description);
            setValue('isFeatured', blog.isFeatured);
            setValue('readTime', blog.readTime);
            setValue('status', blog.status);
            if (blog.featuredImage) {
              setValue('featuredImage', blog.featuredImage);
              setFeaturedImagePreview(`http://localhost:5000${blog.featuredImage}`);
            }
          }
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to fetch blog post');
          navigate('/dashboard/blogs');
        }
      };
      fetchBlog();
    }
  }, [id, isEditing, setValue, navigate]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const response = await blogCategoryService.createCategory({ name: newCategoryName });
      toast.success("Category created successfully!");
      const res = await blogCategoryService.getAllCategories();
      if(res.data) setCategories(res.data);
      
      setValue('category', response.data._id);
      setIsAddingCategory(false);
      setNewCategoryName('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setValue('title', val);
    if (!isEditing && !errors.slug) {
      setValue('slug', val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFeaturedImagePreview(objectUrl);
  };

  const onSubmit = async (data) => {
    try {
      let finalImageUrl = data.featuredImage;

      // Upload image first if a new file was selected
      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        const uploadRes = await mediaService.uploadMedia(formData);
        finalImageUrl = uploadRes.data.image_url;
        data.featuredImage = finalImageUrl;
        setIsUploading(false);
      }

      if (isEditing) {
        await blogService.updateBlog(id, data);
        toast.success(<CustomToast title="Success" message="Blog updated successfully" />);
      } else {
        await blogService.createBlog(data);
        toast.success(<CustomToast title="Success" message="Blog created successfully" />);
      }
      navigate('/dashboard/blogs');
    } catch (error) {
      setIsUploading(false);
      toast.error(<CustomToast title="Error" message={error.response?.data?.message || 'Failed to save blog'} />);
    }
  };

  return (
    <div style={{ padding: '2rem', width: '100%' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="button" onClick={() => navigate('/dashboard/blogs')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#fff' }}>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
              <p style={{ color: '#888', margin: '0.25rem 0 0 0' }}>{isEditing ? 'Update your content and settings' : 'Write and publish a new article'}</p>
            </div>
          </div>
          
          <Button type="submit" isLoading={isSubmitting} style={{ padding: '0.8rem 2.5rem', fontSize: '1.05rem', borderRadius: '0.75rem' }}>
            {isEditing ? 'Save Changes' : 'Publish Blog'}
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Left Column: Title, Settings, Category & Description */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 2 }}>
                <Input label="Blog Title" placeholder="Enter an engaging title..." {...register('title')} onChange={handleTitleChange} error={errors.title?.message} />
              </div>
              <div style={{ flex: 1 }}>
                {isAddingCategory ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>New Category</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <Input 
                          placeholder="Category name..." 
                          value={newCategoryName} 
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          autoFocus 
                        />
                      </div>
                      <button type="button" onClick={handleCreateCategory} disabled={isCreatingCategory} style={{ height: '46px', padding: '0 1.25rem', background: 'var(--primary)', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                        {isCreatingCategory ? '...' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setIsAddingCategory(false)} style={{ height: '46px', width: '46px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                        <FiX />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Category</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <Controller
                          name="category"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select 
                              value={value} 
                              onChange={onChange}
                              error={errors.category?.message}
                              placeholder="Select Category"
                              options={categories.map(c => ({ value: c._id, label: c.name }))}
                            />
                          )}
                        />
                      </div>
                      <button type="button" onClick={() => setIsAddingCategory(true)} style={{ height: '46px', width: '46px', flexShrink: 0, background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select 
                      label="Status"
                      value={value} 
                      onChange={onChange}
                      placeholder="Select Status"
                      options={[
                        { value: 'Draft', label: 'Draft' },
                        { value: 'Published', label: 'Published' }
                      ]}
                    />
                  )}
                />
              </div>
            </div>

            {/* Settings Grid Section (3 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
              <Input label="Meta Description" placeholder="Short description for SEO..." {...register('metaDescription')} error={errors.metaDescription?.message} />
              <Input label="URL Slug" placeholder="e.g. my-first-blog" {...register('slug')} error={errors.slug?.message} />
              <Input label="Read Time" placeholder="e.g. 5 min read" {...register('readTime')} error={errors.readTime?.message} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Content / Description</label>
              <style>
                {`
                  .ck.ck-editor__main > .ck-editor__editable {
                    background-color: #111 !important;
                    color: #fff !important;
                    border: none !important;
                    min-height: 400px;
                    padding: 1rem 1.5rem !important;
                  }
                  .ck.ck-editor__main > .ck-editor__editable.ck-focused {
                    border: none !important;
                    box-shadow: none !important;
                  }
                  .ck.ck-toolbar {
                    background-color: rgba(255,255,255,0.03) !important;
                    border: none !important;
                    border-bottom: 1px solid rgba(255,255,255,0.1) !important;
                  }
                  .ck.ck-button, .ck.ck-icon, .ck.ck-dropdown__button .ck-button__label {
                    color: #ccc !important;
                  }
                  .ck.ck-button:hover, .ck.ck-button.ck-on {
                    background-color: rgba(255,255,255,0.1) !important;
                    color: #fff !important;
                  }
                  .ck.ck-dropdown__panel {
                    background-color: #222 !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                  }
                  .ck.ck-list__item > .ck-button {
                    color: #ccc !important;
                  }
                  .ck.ck-list__item > .ck-button:hover {
                    background-color: rgba(255,255,255,0.1) !important;
                    color: #fff !important;
                  }
                  .ck.ck-input {
                    background-color: #222 !important;
                    color: #fff !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                  }
                `}
              </style>
              <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        licenseKey: 'GPL',
                        plugins: [Essentials, Bold, Italic, Paragraph, Heading, List, Link, Font],
                        toolbar: [
                          'heading', '|',
                          'bold', 'italic', '|',
                          'fontSize', 'fontColor', '|',
                          'bulletedList', 'numberedList', '|',
                          'link', 'undo', 'redo'
                        ]
                      }}
                      data={value}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        onChange(data);
                      }}
                    />
                  )}
                />
              </div>
              {errors.description && <span style={{ color: '#ff6b6b', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.description.message}</span>}
            </div>
          </div>

          {/* Right Column: Featured Image & Actions */}
          <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Featured Image</label>
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '0.75rem', border: '1px dashed rgba(255,255,255,0.3)', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
                {featuredImagePreview ? (
                  <>
                    <img src={featuredImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                      <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiEdit2 /> Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <FiImage size={32} color="rgba(255,255,255,0.3)" style={{ marginBottom: '0.5rem' }} />
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>{isUploading ? 'Uploading...' : 'Click to Upload Image'}</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} disabled={isUploading} />
              </div>
              <input type="hidden" {...register('featuredImage')} />
              {errors.featuredImage && <span style={{ color: '#ff6b6b', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.featuredImage.message}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="isFeatured" {...register('isFeatured')} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
              <label htmlFor="isFeatured" style={{ color: '#ccc', fontSize: '0.95rem', cursor: 'pointer' }}>Mark as Featured Post</label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
