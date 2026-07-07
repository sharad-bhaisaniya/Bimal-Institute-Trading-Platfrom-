import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import styles from './Settings.module.scss';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { uploadService } from '../../services/api/upload.service';
import { userService } from '../../services/api/user.service';
import { BASE_URL } from '../../services/api/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [profileImage, setProfileImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                firstName: parsedUser.firstName || '',
                lastName: parsedUser.lastName || '',
                email: parsedUser.email || '',
                phone: parsedUser.phone || '',
            });
            setProfileImage(parsedUser.profileImage || '');
        }
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const res = await uploadService.uploadImage(file);
            const imageUrl = res.data.image_url;
            setProfileImage(imageUrl);

            // Instantly update user profile with new image
            if (user && user._id) {
                await userService.update(user._id, { profileImage: imageUrl });
                const updatedUser = { ...user, profileImage: imageUrl };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('storage')); // trigger header update
                toast.success('Profile picture updated successfully');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user || !user._id) return;
        try {
            setIsSaving(true);
            const res = await userService.update(user._id, formData);
            const updatedUser = { ...user, ...res.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage')); // trigger header update
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div style={{ color: '#fff', padding: '2rem' }}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Account Settings</h2>
                    <p className={styles.subtitle}>Manage your profile and system preferences.</p>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`glass-panel ${styles.section}`}
                >
                    <h3 className={styles.sectionTitle}>Profile Information</h3>
                    <p className={styles.sectionDesc}>Update your account's profile information and email address.</p>

                    <div className={styles.formGroup}>
                        <div className={styles.avatarSection}>
                            {profileImage ? (
                                <img src={profileImage.startsWith('http') ? profileImage : `${BASE_URL}${profileImage}`} alt="Avatar" className={styles.avatar} style={{ objectFit: 'cover' }} />
                            ) : (
                                <div className={styles.avatar}>{(user.firstName || 'U').charAt(0)}</div>
                            )}

                            <div style={{ position: 'relative' }}>
                                <Button variant="secondary" disabled={isUploading}>
                                    {isUploading ? 'Uploading...' : 'Change Avatar'}
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                />
                            </div>
                        </div>

                        <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                        <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                        <Input label="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" />
                        <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                        <div className={styles.actionRow}>
                            <Button variant="primary" onClick={handleSaveProfile} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`glass-panel ${styles.section}`}
                >
                    <h3 className={styles.sectionTitle}>Update Password</h3>
                    <p className={styles.sectionDesc}>Ensure your account is using a long, random password to stay secure.</p>

                    <div className={styles.formGroup}>
                        <Input label="Current Password" type="password" placeholder="••••••••" />
                        <Input label="New Password" type="password" placeholder="••••••••" />
                        <Input label="Confirm Password" type="password" placeholder="••••••••" />

                        <div className={styles.actionRow}>
                            <Button variant="primary">Update Password</Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
