import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiEdit2, FiSave, FiX, FiKey, FiVideo } from 'react-icons/fi';
import { settingService } from '../../../services/api/setting.service';

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' };
const labelStyle = { fontSize: '0.8rem', color: '#888', fontWeight: 500, letterSpacing: '0.03em' };
const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '0.6rem', padding: '0.65rem 0.85rem', color: '#fff',
  fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s',
};
const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer'
};

const emptyForm = { 
  label: 'Zoom Meeting API', 
  accountId: '', 
  clientId: '', 
  clientSecret: '', 
  credentialType: 'Normal', 
  sdkKey: '', 
  sdkSecret: '', 
  isActive: true 
};

const ZoomCredentials = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await settingService.getAllZoom();
      const list = res?.data?.zoomConfigs || [];
      setConfig(list.length > 0 ? list[0] : null);
    } catch {
      toast.error('Failed to load Zoom configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setShowForm(true);
  };

  const openEdit = () => {
    setForm({
      label: config.label || 'Zoom Meeting API',
      accountId: config.accountId || '',
      clientId: config.clientId || '',
      clientSecret: config.clientSecret || '',
      credentialType: config.credentialType || 'Normal',
      sdkKey: config.sdkKey || '',
      sdkSecret: config.sdkSecret || '',
      isActive: config.isActive !== undefined ? config.isActive : true,
    });
    setEditMode(true);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.accountId || !form.clientId || !form.clientSecret) {
      toast.error('Account ID, Client ID, and Client Secret are required');
      return;
    }
    setSaving(true);
    try {
      if (editMode && config?._id) {
        await settingService.updateZoom(config._id, form);
        toast.success('Zoom API Credentials updated successfully');
      } else {
        await settingService.createZoom(form);
        toast.success('Zoom API Credentials saved successfully');
      }
      setShowForm(false);
      fetchConfig();
    } catch {
      toast.error('Failed to save Zoom API Credentials');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!config?._id) return;
    if (!window.confirm('Delete these Zoom API Credentials?')) return;
    try {
      await settingService.deleteZoom(config._id);
      setConfig(null);
      toast.success('Zoom API Credentials deleted');
    } catch {
      toast.error('Failed to delete credentials');
    }
  };

  const maskKey = (key) => {
    if (!key || key.length < 8) return '••••••••';
    return key.slice(0, 4) + '••••••••' + key.slice(-4);
  };

  return (
    <div style={{ maxWidth: '750px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(45,140,255,0.1)', border: '1px solid rgba(45,140,255,0.2)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiVideo color="#2D8CFF" size={20} />
            </div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>Zoom API</h2>
          </div>
          <p style={{ margin: 0, color: '#888', fontSize: '0.88rem' }}>
            Store your Zoom Server-to-Server OAuth or Meeting SDK credentials securely.
          </p>
        </div>
        {!config && !showForm && (
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.1rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            <FiPlus /> Add API Key
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ color: '#888', fontSize: '0.9rem', padding: '2rem 0', textAlign: 'center' }}>Loading...</div>
      )}

      {/* Existing Config Card */}
      {!loading && config && !showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${config.isActive ? 'rgba(100,255,100,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {config.isActive
                  ? <FiCheckCircle color="#6bff6b" size={16} />
                  : <FiCircle color="#666" size={16} />}
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{config.label}</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', background: config.isActive ? 'rgba(100,255,100,0.1)' : 'rgba(255,255,255,0.05)', color: config.isActive ? '#6bff6b' : '#666', fontWeight: 700 }}>
                  {config.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(45,140,255,0.1)', color: '#2D8CFF', fontWeight: 700 }}>
                  {config.credentialType}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>Account ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{maskKey(config.accountId)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>Client ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{maskKey(config.clientId)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={openEdit} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiEdit2 size={14} />
              </button>
              <button onClick={handleDelete} style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff6b6b', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* No config empty state */}
      {!loading && !config && !showForm && (
        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '1rem', color: '#666' }}>
          <FiVideo size={32} style={{ marginBottom: '0.75rem' }} />
          <p style={{ margin: 0, fontSize: '0.9rem' }}>No Zoom API Credentials configured.</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>Add credentials to enable Zoom meetings.</p>
        </div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.75rem', marginTop: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
                {editMode ? 'Update Zoom API Credentials' : 'Add Zoom API Credentials'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                <FiX size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Label</label>
                <input style={inputStyle} name="label" value={form.label} onChange={handleChange} placeholder="Zoom API" />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Credential Type</label>
                <select style={selectStyle} name="credentialType" value={form.credentialType} onChange={handleChange}>
                  <option value="Normal">Normal (S2S OAuth)</option>
                  <option value="SDK">SDK (Meeting SDK)</option>
                </select>
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Account ID</label>
              <input style={inputStyle} name="accountId" value={form.accountId} onChange={handleChange} placeholder="Zoom Account ID" type="text" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Client ID</label>
                <input style={inputStyle} name="clientId" value={form.clientId} onChange={handleChange} placeholder="Zoom Client ID" type="text" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Client Secret</label>
                <input style={inputStyle} name="clientSecret" value={form.clientSecret} onChange={handleChange} placeholder="Zoom Client Secret" type="text" />
              </div>
            </div>

            {form.credentialType === 'SDK' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>SDK Key</label>
                  <input style={inputStyle} name="sdkKey" value={form.sdkKey} onChange={handleChange} placeholder="Zoom SDK Key" type="text" />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>SDK Secret</label>
                  <input style={inputStyle} name="sdkSecret" value={form.sdkSecret} onChange={handleChange} placeholder="Zoom SDK Secret" type="text" />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              <input type="checkbox" id="zoom-active" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
              <label htmlFor="zoom-active" style={{ color: '#aaa', fontSize: '0.85rem', cursor: 'pointer' }}>Set as active key</label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', padding: '0.6rem 1.2rem', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{ background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Credentials'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZoomCredentials;
