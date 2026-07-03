import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { blogCategoryService } from '../../../services/api/blogCategory.service';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { Controller } from 'react-hook-form';
import { CustomToast } from '../../../components/common/CustomToast';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  description: yup.string(),
  status: yup.string().oneOf(['Active', 'Inactive'])
});

const BlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'Active' }
  });

  const fetchCategories = async () => {
    try {
      const res = await blogCategoryService.getAllCategories();
      setCategories(res.data || []);
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to fetch categories" />);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setEditingId(category._id);
      setValue('name', category.name);
      setValue('slug', category.slug);
      setValue('description', category.description);
      setValue('status', category.status);
    } else {
      setEditingId(null);
      reset({ status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await blogCategoryService.updateCategory(editingId, data);
        toast.success(<CustomToast title="Success" message="Category updated successfully" />);
      } else {
        await blogCategoryService.createCategory(data);
        toast.success(<CustomToast title="Success" message="Category created successfully" />);
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      toast.error(<CustomToast title="Error" message={error.response?.data?.message || 'Failed to save category'} />);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await blogCategoryService.deleteCategory(id);
      toast.success(<CustomToast title="Success" message="Category deleted successfully" />);
      fetchCategories();
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to delete category" />);
    }
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>Blog Categories</h1>
          <p style={{ color: '#888', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Manage categories for your blog posts.</p>
        </div>
        <Button onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <FiPlus /> Add Category
        </Button>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>No categories found. Create one to get started.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slug</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '0.5rem 1rem', color: '#fff' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cat.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>{cat.description || 'No description'}</div>
                  </td>
                  <td style={{ padding: '0.5rem 1rem', color: '#aaa', fontFamily: 'monospace', fontSize: '0.8rem' }}>{cat.slug}</td>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                      backgroundColor: cat.status === 'Active' ? 'rgba(189,255,0,0.1)' : 'rgba(255,100,100,0.1)',
                      color: cat.status === 'Active' ? 'var(--primary)' : '#ff6b6b'
                    }}>
                      {cat.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openModal(cat)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiEdit2 size={12} />
                      </button>
                      <button onClick={() => handleDelete(cat._id)} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', color: '#ff6b6b', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }} />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '500px', background: '#111', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>{editingId ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}>
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Input label="Name" placeholder="e.g. Trading Strategies" {...register('name')} error={errors.name?.message} 
                  onChange={(e) => {
                    if(!editingId && !errors.slug) {
                      setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                />
                <Input label="Slug" placeholder="e.g. trading-strategies" {...register('slug')} error={errors.slug?.message} />
                <Input label="Description (Optional)" placeholder="Short description..." {...register('description')} error={errors.description?.message} />
                
                <div style={{ marginBottom: '1.5rem' }}>
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
                          { value: 'Active', label: 'Active' },
                          { value: 'Inactive', label: 'Inactive' }
                        ]}
                      />
                    )}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <Button type="button" onClick={closeModal} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff' }}>Cancel</Button>
                  <Button type="submit" isLoading={isSubmitting} style={{ flex: 1 }}>{editingId ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogCategories;
