import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiSmartphone, FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiRefreshCw, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { settingService } from '../../../services/api/setting.service';

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' };
const labelStyle = { fontSize: '0.8rem', color: '#888', fontWeight: 500, letterSpacing: '0.03em' };
const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '0.6rem', padding: '0.65rem 0.85rem', color: '#fff',
  fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const emptyForm = {
  user: '', key: '', senderId: '', entityId: '', templateId: '',
  countryCode: '91', baseUrl: 'http://sms.smsariseworld.com/submitsms.jsp', isActive: true,
};

const SmsCredentials = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await settingService.getAllSms();
      const list = res.data?.smsConfigs || [];
      setConfig(list.length > 0 ? list[0] : null);
    } catch {
      toast.error('Failed to load SMS configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => { setForm(emptyForm); setEditMode(false); setShowForm(true); };

  const openEdit = () => {
    setForm({
      user: config.user || '',
      key: '',                        // blank for security
      senderId: config.senderId || '',
      entityId: config.entityId || '',
      templateId: config.templateId || '',
      countryCode: config.countryCode || '91',
      baseUrl: config.baseUrl || '',
      isActive: config.isActive !== undefined ? config.isActive : true,
    });
    setEditMode(true);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditMode(false); setForm(emptyForm); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.user || !form.senderId || !form.entityId || !form.templateId || !form.baseUrl) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!editMode && !form.key) {
      toast.error('API Key is required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (editMode && !payload.key) delete payload.key;

      if (editMode && config?._id) {
        await settingService.updateSms(config._id, payload);
        toast.success('SMS credential updated successfully!');
      } else {
        await settingService.createSms(payload);
        toast.success('SMS credential saved successfully!');
      }
      closeForm();
      fetchConfig();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save SMS credential');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!config) return;
    if (!window.confirm('Delete this SMS configuration?')) return;
    try {
      await settingService.deleteSms(config._id);
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
            <FiSmartphone size={22} color="var(--primary)" />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.35rem', fontWeight: 700 }}>SMS Credentials</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>SMS gateway credentials for sending OTPs to mobile numbers.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={fetchConfig} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', padding: '0.55rem 0.85rem', color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
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
          <motion.div key="sms-form" initial={{ opacity: 0, y: -12, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -12, height: 0 }} style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(189,255,0,0.15)', borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', color: '#fff', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {editMode ? <><FiEdit2 size={16} color="var(--primary)" /> Edit SMS Configuration</> : <><FiPlus size={16} color="var(--primary)" /> Add SMS Configuration</>}
              </h3>
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>SMS User / Account ID *</label>
                    <input style={inputStyle} name="user" placeholder="your_sms_user" value={form.user} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>API Key{editMode ? ' (leave blank to keep current)' : ' *'}</label>
                    <input style={inputStyle} name="key" type="password" placeholder="••••••••" value={form.key} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Sender ID *</label>
                    <input style={inputStyle} name="senderId" placeholder="BMINST" value={form.senderId} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Country Code</label>
                    <input style={inputStyle} name="countryCode" placeholder="91" value={form.countryCode} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Entity ID (DLT) *</label>
                    <input style={inputStyle} name="entityId" placeholder="1234567890" value={form.entityId} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Template ID (DLT) *</label>
                    <input style={inputStyle} name="templateId" placeholder="1234567890" value={form.templateId} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Base URL *</label>
                    <input style={inputStyle} name="baseUrl" placeholder="http://sms.smsariseworld.com/submitsms.jsp" value={form.baseUrl} onChange={handleChange} onFocus={e => e.target.style.borderColor = 'rgba(189,255,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', margin: '0.25rem 0 1.25rem' }}>
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
          <FiSmartphone size={36} color="#333" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#555', margin: 0 }}>No SMS configuration yet. Click <strong style={{ color: '#aaa' }}>Add Config</strong> to get started.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: config.isActive ? 'rgba(189,255,0,0.03)' : 'rgba(255,255,255,0.02)', border: config.isActive ? '1px solid rgba(189,255,0,0.2)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '0.85rem', padding: '1.25rem 1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: config.isActive ? 'rgba(189,255,0,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiSmartphone size={18} color={config.isActive ? 'var(--primary)' : '#555'} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                  {config.senderId}
                  <span style={{ color: '#555', marginLeft: '8px', fontSize: '0.8rem', fontWeight: 400 }}>+{config.countryCode}</span>
                </div>
                <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '3px' }}>{config.user} · {config.baseUrl}</div>
                <div style={{ color: '#444', fontSize: '0.75rem', marginTop: '2px' }}>
                  Entity: <span style={{ color: '#666' }}>{config.entityId}</span>
                  &nbsp;·&nbsp;Template: <span style={{ color: '#666' }}>{config.templateId}</span>
                </div>
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

export default SmsCredentials;
