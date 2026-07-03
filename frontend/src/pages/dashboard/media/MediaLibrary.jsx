import React, { useState, useEffect } from 'react';
import { FiUploadCloud, FiTrash2, FiCopy, FiImage, FiFile } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { mediaService } from '../../../services/api/media.service';
import Button from '../../../components/common/Button';
import { CustomToast } from '../../../components/common/CustomToast';

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await mediaService.getAllMedia();
      setMedia(res.data || []);
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to fetch media library" />);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      await mediaService.uploadMedia(formData);
      toast.success(<CustomToast title="Success" message="File uploaded to media library" />);
      fetchMedia();
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to upload file" />);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media? If it is used in a blog, it will break the image link.')) return;
    try {
      await mediaService.deleteMedia(id);
      toast.success(<CustomToast title="Success" message="Media deleted successfully" />);
      fetchMedia();
    } catch (error) {
      toast.error(<CustomToast title="Error" message="Failed to delete media" />);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(`http://localhost:5000${url}`);
    toast.success(<CustomToast title="Copied" message="URL copied to clipboard" />);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#fff' }}>Master Media Library</h1>
          <p style={{ color: '#888', margin: '0.5rem 0 0 0' }}>Manage all uploaded images and files in one place.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Button isLoading={isUploading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiUploadCloud /> Upload Media
          </Button>
          <input 
            type="file" 
            onChange={handleFileUpload}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
            disabled={isUploading}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading media...</div>
      ) : media.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#111', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <FiImage size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>Media Library is Empty</h3>
          <p style={{ color: '#888', margin: 0 }}>Upload your first image to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {media.map((item) => (
            <div key={item._id} style={{ backgroundColor: '#111', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#222', position: 'relative', group: 'true' }}>
                {item.mimeType?.startsWith('image/') ? (
                  <img src={`http://localhost:5000${item.url}`} alt={item.originalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiFile size={40} color="#555" />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                  <button onClick={() => copyToClipboard(item.url)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} title="Copy URL">
                    <FiCopy size={14} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(255,100,100,0.8)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} title="Delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.25rem' }} title={item.originalName}>
                  {item.originalName}
                </div>
                <div style={{ color: '#666', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{formatSize(item.size)}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
