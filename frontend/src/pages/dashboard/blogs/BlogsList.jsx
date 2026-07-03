import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiClock, FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { blogService } from '../../../services/api/blog.service';
import Button from '../../../components/common/Button';
import { CustomToast } from '../../../components/common/CustomToast';

const BlogsList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await blogService.getAllBlogs();
      setBlogs(res.data || []);
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to fetch blogs" />);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await blogService.deleteBlog(id);
      toast.success(<CustomToast title="Success" message="Blog deleted successfully" />);
      fetchBlogs();
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to delete blog" />);
    }
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>Blogs</h1>
          <p style={{ color: '#888', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Manage all your blog posts and content.</p>
        </div>
        <Button onClick={() => navigate('/dashboard/blogs/add')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <FiPlus /> Add Blog
        </Button>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>No blogs found. Create your first post!</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metrics</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '0.5rem 1rem', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {blog.featuredImage ? (
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#222' }}>
                          <img src={`http://localhost:5000${blog.featuredImage}`} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiEye color="#555" size={16} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {blog.title}
                          {blog.isFeatured && <span style={{ fontSize: '0.6rem', padding: '1px 4px', background: 'rgba(189,255,0,0.1)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 700 }}>FEATURED</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiClock size={10} /> {blog.readTime || '5 min'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 1rem', color: '#aaa', fontSize: '0.8rem' }}>
                    {blog.category?.name || 'Uncategorized'}
                  </td>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', color: '#888', fontSize: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FiHeart size={12} /> {blog.likes}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FiMessageSquare size={12} /> {blog.commentsCount}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FiShare2 size={12} /> {blog.shareCount}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                      backgroundColor: blog.status === 'Published' ? 'rgba(189,255,0,0.1)' : 'rgba(255,255,255,0.1)',
                      color: blog.status === 'Published' ? 'var(--primary)' : '#aaa'
                    }}>
                      {blog.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiEdit2 size={12} />
                      </button>
                      <button onClick={() => handleDelete(blog._id)} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', color: '#ff6b6b', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

export default BlogsList;
