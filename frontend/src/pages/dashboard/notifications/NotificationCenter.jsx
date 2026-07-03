import React, { useState, useEffect, useCallback } from 'react';
import { FiBell, FiPlus, FiTrash2, FiGlobe, FiUsers, FiEye, FiSend, FiFilter, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { notificationService } from '../../../services/api/notification.service';
import { userService } from '../../../services/api/user.service';
import { CustomToast } from '../../../components/common/CustomToast';

// ─── TYPE BADGE COLORS ────────────────────────────────────────────────────────
const typeColor = (type) => {
  const map = {
    general: '#888',
    system: '#f59e0b',
    announcement: '#3b82f6',
    course_update: 'var(--primary)',
    payment: '#10b981',
    warning: '#ef4444',
  };
  return map[type?.toLowerCase()] || '#a855f7';
};

// ─── COMPOSE MODAL ────────────────────────────────────────────────────────────
const ComposeModal = ({ onClose, onSent, existingTypes, allUsers }) => {
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: '',
    targetType: 'global',
    targetUsers: [],
  });
  const [saving, setSaving] = useState(false);
  const [typeInput, setTypeInput] = useState('');
  const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);

  const filtered = existingTypes.filter(t =>
    t.toLowerCase().includes(typeInput.toLowerCase()) && typeInput.length > 0
  );

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const toggleUser = (userId) => {
    setForm(f => ({
      ...f,
      targetUsers: f.targetUsers.includes(userId)
        ? f.targetUsers.filter(id => id !== userId)
        : [...f.targetUsers, userId]
    }));
  };

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim() || !form.type.trim()) {
      toast.error(<CustomToast title="Validation Error" message="Title, Message, and Type are required." />);
      return;
    }
    if (form.targetType === 'specific' && form.targetUsers.length === 0) {
      toast.error(<CustomToast title="Validation Error" message="Select at least one user for specific notification." />);
      return;
    }
    setSaving(true);
    try {
      await notificationService.createNotification(form);
      toast.success(<CustomToast title="Sent!" message="Notification dispatched successfully." />);
      onSent();
      onClose();
    } catch {
      toast.error(<CustomToast title="Error" message="Failed to send notification." />);
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.6rem',
    padding: '0.65rem 0.9rem',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiSend color="var(--primary)" /> Compose Notification
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><FiX size={20} /></button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Title *</label>
          <input style={inp} name="title" value={form.title} onChange={handleChange} placeholder="Notification title..." />
        </div>

        {/* Message */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Message *</label>
          <textarea style={{ ...inp, minHeight: '100px', resize: 'vertical', lineHeight: 1.5 }} name="message" value={form.message} onChange={handleChange} placeholder="Write the notification body..." />
        </div>

        {/* Type — with autocomplete suggestions */}
        <div style={{ marginBottom: '1rem', position: 'relative' }}>
          <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Type * <span style={{ color: '#666', fontSize: '0.7rem' }}>(e.g. system, course_update, payment)</span></label>
          <input
            style={inp}
            name="type"
            value={form.type}
            onChange={(e) => { setForm(f => ({ ...f, type: e.target.value })); setTypeInput(e.target.value); setShowTypeSuggestions(true); }}
            onBlur={() => setTimeout(() => setShowTypeSuggestions(false), 150)}
            placeholder="Type a category..."
          />
          {showTypeSuggestions && filtered.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', zIndex: 10, marginTop: '4px' }}>
              {filtered.map(t => (
                <div key={t} onMouseDown={() => { setForm(f => ({ ...f, type: t })); setShowTypeSuggestions(false); }}
                  style={{ padding: '0.6rem 0.9rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: typeColor(t), flexShrink: 0 }}></span>
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Target Type */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.6rem' }}>Send To *</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['global', 'specific'].map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, targetType: t, targetUsers: [] }))}
                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.6rem', cursor: 'pointer', border: `1px solid ${form.targetType === t ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`, background: form.targetType === t ? 'rgba(255,255,255,0.06)' : 'transparent', color: form.targetType === t ? 'var(--primary)' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
                {t === 'global' ? <><FiGlobe /> Everyone</> : <><FiUsers /> Specific Users</>}
              </button>
            ))}
          </div>
        </div>

        {/* User Selector */}
        {form.targetType === 'specific' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.6rem' }}>Select Users ({form.targetUsers.length} selected)</label>
            <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', padding: '0.5rem' }}>
              {allUsers.map(u => {
                const selected = form.targetUsers.includes(u._id);
                return (
                  <div key={u._id} onClick={() => toggleUser(u._id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', background: selected ? 'rgba(255,255,255,0.05)' : 'transparent', marginBottom: '2px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `1px solid ${selected ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, background: selected ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selected && <FiCheck size={10} color="#000" />}
                    </div>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{u.firstName} {u.lastName}</span>
                    <span style={{ color: '#666', fontSize: '0.75rem' }}>{u.email}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.65rem 1.2rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#aaa', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSend} disabled={saving}
            style={{ padding: '0.65rem 1.5rem', borderRadius: '0.6rem', border: 'none', background: 'var(--primary)', color: '#000', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiSend size={14} /> {saving ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [existingTypes, setExistingTypes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filterType, setFilterType] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [nRes, tRes] = await Promise.all([
        notificationService.getAllNotifications({ type: filterType || undefined }),
        notificationService.getNotificationTypes(),
      ]);
      setNotifications(nRes.data?.data?.notifications || []);
      setExistingTypes(tRes.data?.data?.types || []);
    } catch {
      toast.error(<CustomToast title="Error" message="Failed to load notifications" />);
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchData();
    // Fetch all users for compose modal
    userService.getAll().then(res => setAllUsers(res.data?.data || [])).catch(() => { });
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification? It will be hidden from all users.')) return;
    try {
      await notificationService.deleteNotification(id);
      toast.success(<CustomToast title="Deleted" message="Notification removed." />);
      fetchData();
    } catch {
      toast.error(<CustomToast title="Error" message="Failed to delete." />);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div style={{ padding: '0', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FiBell color="var(--primary)" /> Notification Center
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#888', fontSize: '0.85rem' }}>Create & manage all platform notifications.</p>
        </div>
        <button onClick={() => setShowCompose(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '0.7rem', padding: '0.65rem 1.25rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
          <FiPlus /> New Notification
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.85rem' }}><FiFilter size={14} /> Filter by type:</div>
        <button onClick={() => setFilterType('')}
          style={{ padding: '0.3rem 0.75rem', borderRadius: '20px', border: `1px solid ${!filterType ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`, background: !filterType ? 'rgba(255,255,255,0.05)' : 'transparent', color: !filterType ? 'var(--primary)' : '#888', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
          All
        </button>
        {existingTypes.map(t => (
          <button key={t} onClick={() => setFilterType(t === filterType ? '' : t)}
            style={{ padding: '0.3rem 0.75rem', borderRadius: '20px', border: `1px solid ${filterType === t ? typeColor(t) : 'rgba(255,255,255,0.1)'}`, background: filterType === t ? `${typeColor(t)}22` : 'transparent', color: filterType === t ? typeColor(t) : '#888', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
            {t}
          </button>
        ))}
      </div>

      {/* Notification Cards */}
      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div style={{ color: '#666', textAlign: 'center', padding: '4rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '1rem' }}>
          <FiBell size={32} style={{ marginBottom: '0.75rem' }} />
          <p style={{ margin: 0 }}>No notifications found. Create one!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => (
            <div key={n._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.9rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              {/* Type dot */}
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: typeColor(n.type), flexShrink: 0, marginTop: '5px' }}></div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{n.title}</span>
                  <span style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: '20px', background: `${typeColor(n.type)}22`, color: typeColor(n.type), fontWeight: 700, textTransform: 'uppercase' }}>{n.type}</span>
                  <span style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: '20px', background: n.targetType === 'global' ? 'rgba(59,130,246,0.1)' : 'rgba(168,85,247,0.1)', color: n.targetType === 'global' ? '#60a5fa' : '#c084fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {n.targetType === 'global' ? <><FiGlobe size={9} /> Global</> : <><FiUsers size={9} /> {n.targetUsers?.length} users</>}
                  </span>
                </div>
                <p style={{ margin: '0 0 0.5rem', color: '#aaa', fontSize: '0.85rem', lineHeight: 1.5 }}>{n.message}</p>
                <div style={{ display: 'flex', gap: '1rem', color: '#555', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                  <span>{formatDate(n.createdAt)}</span>
                  {n.createdBy && <span>by {n.createdBy.firstName} {n.createdBy.lastName}</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiEye size={11} /> {n.stats?.read || 0}/{n.stats?.total || 0} read
                  </span>
                </div>
              </div>

              <button onClick={() => handleDelete(n._id)}
                style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff6b6b', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiTrash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSent={fetchData}
          existingTypes={existingTypes}
          allUsers={allUsers}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
