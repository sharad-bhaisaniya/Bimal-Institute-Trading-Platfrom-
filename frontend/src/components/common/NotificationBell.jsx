import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheck, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { notificationService } from '../../services/api/notification.service';

const typeColor = (type) => {
  const map = {
    general: '#888', system: '#f59e0b', announcement: '#3b82f6',
    course_update: 'var(--primary)', payment: '#10b981', warning: '#ef4444',
  };
  return map[type?.toLowerCase()] || '#a855f7';
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Poll unread count every 30 seconds
  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data?.data?.count || 0);
    } catch {}
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openDropdown = async () => {
    setOpen(prev => !prev);
    if (!open) {
      setLoading(true);
      try {
        const res = await notificationService.getMyNotifications(1, 10);
        setNotifications(res.data?.data?.notifications || []);
      } catch {}
      setLoading(false);
    }
  };

  const handleRead = async (notifId, e) => {
    e.stopPropagation();
    await notificationService.markAsRead(notifId).catch(() => {});
    setNotifications(prev =>
      prev.map(n => n.notificationId?._id === notifId ? { ...n, isRead: true } : n)
    );
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const handleDismiss = async (notifId, e) => {
    e.stopPropagation();
    await notificationService.dismissNotification(notifId).catch(() => {});
    setNotifications(prev => prev.filter(n => n.notificationId?._id !== notifId));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const formatTime = (d) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={openDropdown}
        style={{ position: 'relative', background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'all 0.2s' }}
      >
        <FiBell size={18} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', border: '1.5px solid #0a0a0a' }}></span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '380px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 999, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
              {unreadCount > 0 && <span style={{ marginLeft: '0.5rem', background: 'var(--primary)', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: '10px' }}>{unreadCount}</span>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiCheckCircle size={12} /> Mark all read
                </button>
              )}
              <button onClick={() => { setOpen(false); navigate('/dashboard/notifications'); }}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.75rem' }}>
                View all
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#555' }}>
                <FiBell size={28} style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>You're all caught up!</p>
              </div>
            ) : (
              notifications.map(n => {
                const notif = n.notificationId;
                if (!notif) return null;
                return (
                  <div key={n._id}
                    style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', background: n.isRead ? 'transparent' : 'rgba(255,255,255,0.02)', display: 'flex', gap: '0.9rem', alignItems: 'flex-start', transition: 'background 0.2s' }}>
                    {/* Type indicator */}
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: typeColor(notif.type), flexShrink: 0, marginTop: '5px' }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: n.isRead ? '#aaa' : '#fff', fontWeight: n.isRead ? 400 : 600, fontSize: '0.85rem' }}>{notif.title}</span>
                        {!n.isRead && <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }}></span>}
                      </div>
                      <p style={{ margin: '0 0 0.35rem', color: '#666', fontSize: '0.78rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {notif.message}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', color: typeColor(notif.type), background: `${typeColor(notif.type)}22`, padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>{notif.type}</span>
                        <span style={{ color: '#555', fontSize: '0.7rem' }}>{formatTime(n.createdAt)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                      {!n.isRead && (
                        <button onClick={(e) => handleRead(notif._id, e)} title="Mark as read"
                          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--primary)', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiCheck size={11} />
                        </button>
                      )}
                      <button onClick={(e) => handleDismiss(notif._id, e)} title="Dismiss"
                        style={{ background: 'rgba(255,80,80,0.08)', border: 'none', color: '#ff6b6b', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiTrash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
