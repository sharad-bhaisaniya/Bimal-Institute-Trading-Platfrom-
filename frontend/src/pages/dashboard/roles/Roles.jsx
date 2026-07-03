import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Roles.module.scss';
import Button from '../../../components/common/Button';
import { roleService } from '../../../services/api/role.service';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const rolesRes = await roleService.getAll();
      setRoles(rolesRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, isSystem) => {
    if (isSystem) {
      toast.error('System roles cannot be deleted');
      return;
    }
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleService.delete(id);
        toast.success('Role deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete role');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Roles & Permissions</h2>
          <p className={styles.subtitle}>Define access levels and assign them to users.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/dashboard/roles/create')}>Create Role</Button>
      </div>

      <div className={styles.grid}>
        {isLoading ? (
          <p style={{ color: '#fff' }}>Loading...</p>
        ) : roles.map((role, idx) => (
          <motion.div 
            key={role._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel ${styles.roleCard}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <FiShield />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {!role.isSystem && (
                  <>
                    <button className={styles.actionBtn} onClick={() => navigate(`/dashboard/roles/edit/${role._id}`)}><FiEdit2 /></button>
                    <button className={styles.actionBtn} onClick={() => handleDelete(role._id, role.isSystem)}><FiTrash2 /></button>
                  </>
                )}
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <h3 className={styles.roleName}>{role.name} {role.isSystem && <span style={{fontSize:'10px', color:'red', marginLeft:'5px'}}>(System)</span>}</h3>
              <p className={styles.roleDesc}>{role.desc}</p>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.modulesList}>
                {[...new Set(role.permissions.map(p => p.module || 'Other'))].slice(0, 3).map(mod => (
                  <span key={mod} className={styles.moduleTag}>{mod}</span>
                ))}
                {[...new Set(role.permissions.map(p => p.module || 'Other'))].length > 3 && (
                  <span className={styles.moduleTag}>+{[...new Set(role.permissions.map(p => p.module || 'Other'))].length - 3}</span>
                )}
                {role.permissions.length === 0 && <span className={styles.userCount}>0 Permissions</span>}
              </div>
              {!role.isSystem && (
                <button className={styles.editLink} onClick={() => navigate(`/dashboard/roles/edit/${role._id}`)}>Edit Permissions</button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Roles;
