import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiSearch, FiX, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './Users.module.scss';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { userService } from '../../../services/api/user.service';
import { roleService } from '../../../services/api/role.service';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', role: '', password: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        userService.getAll(),
        roleService.getAll()
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingId(user._id);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role?._id || '',
        password: '' // empty for edit
      });
    } else {
      setEditingId(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Remove password if empty
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await userService.update(editingId, payload);
        toast.success('User updated successfully');
      } else {
        await userService.create(formData);
        toast.success('User created successfully');
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Users Management</h2>
          <p className={styles.subtitle}>Manage your team members and their account permissions here.</p>
        </div>
        <Button variant="primary" onClick={() => openModal()}>Add New User</Button>
      </div>

      <div className={`glass-panel ${styles.content}`}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search users..." className={styles.searchInput} />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
              ) : users.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td>
                    <div className={styles.userCell}>
                      {user.profileImage ? (
                        <img src={`http://localhost:5000${user.profileImage}`} alt="Avatar" className={styles.avatar} style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className={styles.avatar}>{(user.firstName || 'U').charAt(0)}</div>
                      )}
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className={styles.textMuted}>{user.email}</td>
                  <td>
                    <span className={styles.roleBadge}>{user.role?.name || 'No Role'}</span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.offline}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className={styles.actionBtn} onClick={() => navigate(`/dashboard/users/${user._id}`)} title="View Details"><FiEye /></button>
                      <button className={styles.actionBtn} onClick={() => openModal(user)} title="Edit"><FiEdit2 /></button>
                      <button className={styles.actionBtn} onClick={() => handleDelete(user._id)} title="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className={styles.modalHeader}>
                <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={closeModal} className={styles.closeBtn}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                <Input type="email" label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.875rem', color: '#a0a0a0' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map(r => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <Input type="password" label={editingId ? "Password (leave blank to keep)" : "Password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingId} />

                <div className={styles.modalActions}>
                  <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                  <Button type="submit" variant="primary">{editingId ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
