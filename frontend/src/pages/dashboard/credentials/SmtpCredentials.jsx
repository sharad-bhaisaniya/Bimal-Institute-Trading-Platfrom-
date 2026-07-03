import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiMail, FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiRefreshCw, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { settingService } from '../../../services/api/setting.service';

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' };
const labelStyle = { fontSize: '0.8rem', color: '#888', fontWeight: 500, letterSpacing: '0.03em' };
const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '0.6rem', padding: '0.65rem 0.85rem', color: '#fff',
  fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const emptyForm = { host: '', port: '', user: '', password: '', secure: false, isActive: true };

const SmtpCredentials = () => {
  const [config, setConfig] = useState(null);       // single config
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);  // add form visible?
  const [editMode, setEditMode] = useState(false);  // editing existing?
  const [form, setForm] = useState(emptyForm);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await settingService.getAllSmtp();
      const list = res.data?.smtpConfigs || [];
      setConfig(list.length > 0 ? list[0] : null);
    } catch {
      toast.error('Failed to load SMTP configuration');
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
    // Pre-fill form with existing data (leave password blank for security)
    setForm({
      host: config.host || '',
      port: config.port || '',
      user: config.user || '',
      password: '',        // don't pre-fill password — user must re-enter to change
      secure: config.secure || false,
      isActive: config.isActive !== undefined ? config.isActive : true,
    });
    setEditMode(true);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditMode(false); setForm(emptyForm); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.host || !form.port || !form.user) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      // Don't send blank password on update (keep existing)
      if (editMode && !payload.password) delete payload.password;

      if (editMode && config?._id) {
        await settingService.updateSmtp(config._id, payload);
        toast.success('SMTP credential updated successfully!');
      } else {
        await settingService.createSmtp(payload);
        toast.success('SMTP credential saved successfully!');
      }
      closeForm();
      fetchConfig();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save SMTP credential');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!config) return;
    if (!window.confirm('Delete this SMTP configuration?')) return;
    try {
      await settingService.deleteSmtp(config._id);
      toast.success('Deleted successfully');
      setConfig(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(189,255,0,0.08)', border: '1px solid rgba(189,255,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiMail size={22} color="var(--primary)" />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.35rem', fontWeight: 700 }}>SMTP Credentials</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>Email gateway credentials for sending OTPs.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={fetchConfig} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', padding: '0.55rem 0.85rem', color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
          {/* Only show Add if no config exists and form not open */}
          {!config && !showForm && (
            <button onClick={openAdd} style={{ background: 'var(--primary)', border: 'none', borderRadius: '0.6rem', padding: '0.55rem 1.1rem', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
              <FiPlus size={15} /> Add Config
            </button>
          )}
          {showForm && (
            <button onClick={closeForm} style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: '0.6rem', padding: '0.55rem 1rem', color: '#f66', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
              <FiX size={14} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div key="smtp-form" initial={{ opacity: 0, y: -12, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -12, height: 0 }} style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(189,255,0,0.15)', borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', color: '#fff', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {editMode ? <><FiEdit2 size={16} color="var(--primary)" /> Edit SMTP Configuration</> : <><FiPlus size={16} color="var(--primary)" /> Add SMTP Configuration</>}
              </h3>
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>SMTP Host *</label>
                    <input style={inputStyle} name="host" placeholder="smtp.gmail.com" value={form.host} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Port *</label>
                    <input style={inputStyle} name="port" type="number" placeholder="587" value={form.port} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Username / Email *</label>
                    <input style={inputStyle} name="user" placeholder="you@gmail.com" value={form.user} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Password / App Key{editMode ? ' (leave blank to keep current)' : ' *'}</label>
                    <input style={inputStyle} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', margin: '0.25rem 0 1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#aaa' }}>
                    <input type="checkbox" name="secure" checked={form.secure} onChange={handleChange} style={{ accentColor: 'var(--primary)' }} /> Use SSL/TLS (port 465)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#aaa' }}>
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: 'var(--primary)' }} /> Set as Active
                  </label>
                </div>
                <button type="submit" disabled={saving} style={{ background: 'var(--primary)', border: 'none', borderRadius: '0.6rem', padding: '0.65rem 1.5rem', color: '#000', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiSave size={15} /> {saving ? 'Saving...' : editMode ? 'Update Credential' : 'Save Credential'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Config Card */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>Loading configuration...</div>
      ) : !config ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: '1rem' }}>
          <FiMail size={36} color="#333" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#555', margin: 0 }}>No SMTP configuration yet. Click <strong style={{ color: '#aaa' }}>Add Config</strong> to get started.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: config.isActive ? 'rgba(189,255,0,0.03)' : 'rgba(255,255,255,0.02)', border: config.isActive ? '1px solid rgba(189,255,0,0.2)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '0.85rem', padding: '1.25rem 1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: config.isActive ? 'rgba(189,255,0,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiMail size={18} color={config.isActive ? 'var(--primary)' : '#555'} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                  {config.host} <span style={{ color: '#555', fontSize: '0.8rem', fontWeight: 400 }}>:{config.port}</span>
                  {config.secure && <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: 'rgba(100,200,255,0.1)', border: '1px solid rgba(100,200,255,0.2)', borderRadius: '4px', padding: '1px 6px', color: '#6cf' }}>SSL</span>}
                </div>
                <div style={{ color: '#666', fontSize: '0.82rem', marginTop: '3px' }}>{config.user}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {config.isActive
                ? <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(189,255,0,0.1)', border: '1px solid rgba(189,255,0,0.2)', borderRadius: '2rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}><FiCheckCircle size={11} /> Active</span>
                : <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: '#555' }}><FiCircle size={11} /> Inactive</span>
              }
              <button onClick={openEdit} style={{ background: 'rgba(189,255,0,0.08)', border: '1px solid rgba(189,255,0,0.2)', borderRadius: '0.5rem', padding: '0.45rem 0.75rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 600 }}>
                <FiEdit2 size={13} /> Edit
              </button>
              <button onClick={handleDelete} style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: '0.5rem', padding: '0.45rem 0.75rem', color: '#f66', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}>
                <FiTrash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SmtpCredentials;
