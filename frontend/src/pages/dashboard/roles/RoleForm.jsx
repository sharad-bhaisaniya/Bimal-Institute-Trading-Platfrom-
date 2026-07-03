import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './RoleForm.module.scss';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { roleService } from '../../../services/api/role.service';
import { permissionService } from '../../../services/api/permission.service';

const RoleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', desc: '', permissions: [] });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const permRes = await permissionService.getAll();
      setPermissions(permRes.data || []);

      if (isEditing) {
        const roleRes = await roleService.getOne(id);
        const role = roleRes.data;
        setFormData({
          name: role.name || '',
          desc: role.desc || '',
          permissions: role.permissions.map(p => p._id) || []
        });
      }
    } catch (error) {
      toast.error('Failed to fetch data');
      navigate('/dashboard/roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = (permId) => {
    setFormData(prev => {
      const perms = [...prev.permissions];
      if (perms.includes(permId)) {
        return { ...prev, permissions: perms.filter(pid => pid !== permId) };
      } else {
        return { ...prev, permissions: [...perms, permId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (isEditing) {
        await roleService.update(id, formData);
        toast.success('Role updated successfully');
      } else {
        await roleService.create(formData);
        toast.success('Role created successfully');
      }
      navigate('/dashboard/roles');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSaving(false);
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    const groupName = perm.module || 'Other';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(perm);
    return acc;
  }, {});

  if (isLoading) {
    return <div style={{ color: '#fff', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard/roles')}>
            <FiArrowLeft />
          </button>
          <div>
            <h2 className={styles.title}>{isEditing ? 'Edit Role' : 'Create New Role'}</h2>
            <p className={styles.subtitle}>Define the role details and assign necessary permissions.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`glass-panel ${styles.formContainer}`}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FiShield style={{ marginRight: '8px' }} /> Role Information
          </h3>
          <div className={styles.inputGroup}>
            <Input label="Role Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <Input label="Description" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} required />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Permissions</h3>
          <p className={styles.sectionDesc}>Select the permissions this role will have.</p>
          
          <div className={styles.permissionsGrid}>
            {Object.keys(groupedPermissions).map(group => (
              <div key={group} className={`glass-panel ${styles.permissionGroup}`}>
                <h4 className={styles.groupTitle}>{group}</h4>
                <div className={styles.permissionList}>
                  {groupedPermissions[group].map(perm => (
                    <label key={perm._id} className={styles.checkboxLabel}>
                      <span style={{ textTransform: 'capitalize' }}>
                        {perm.action || perm.name.replace(/_/g, ' ')}
                      </span>
                      <div className={styles.toggleSwitch}>
                        <input 
                          type="checkbox" 
                          checked={formData.permissions.includes(perm._id)}
                          onChange={() => handlePermissionToggle(perm._id)}
                        />
                        <span className={styles.slider}></span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/roles')}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : (isEditing ? 'Update Role' : 'Create Role')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;
