import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPhone, FiShield, FiActivity, FiCalendar, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './UserDetails.module.scss';
import Button from '../../../components/common/Button';
import { userService } from '../../../services/api/user.service';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [kyc, setKyc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getOne(id);
      setUser(res.data);
      setKyc(res.kyc);
    } catch (error) {
      toast.error('Failed to fetch user details');
      navigate('/dashboard/users');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading user details...</div>;
  }

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>User not found</div>;
  }

  const currentKycStatus = (kyc?.status || user.kyc_status || 'NOT SUBMITTED').toLowerCase();
  const kycStatusClass =
    currentKycStatus === 'approved' ? styles.success :
      (currentKycStatus === 'pending' || currentKycStatus === 'requested' || currentKycStatus === 'initiated' || currentKycStatus === 'approval_pending') ? styles.warning :
        currentKycStatus === 'rejected' ? styles.danger : styles.neutral;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getMediaUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:5000${path}`;
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.header} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/dashboard/users')} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#fff',
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          flexShrink: 0,
          marginTop: '0.1rem'
        }}>
          <FiArrowLeft />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className={styles.title} style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>User Details</h2>
          <p className={styles.subtitle} style={{ margin: 0, fontSize: '0.9rem', color: '#888', marginTop: '0.4rem' }}>Detailed view of user profile and KYC information.</p>
        </div>
      </div> */}

      <div className={styles.grid}>
        {/* Left Column: User Basic Info */}
        <motion.div className={styles.card} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ borderBottom: '1px solid rgba(123, 244, 79, 0.38)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <FiArrowLeft style={{ marginRight: '0.4rem', cursor: 'pointer', hover: { color: '#38e35aff' } }} onClick={() => navigate('/dashboard/users')} />
            {/* <button onClick={() => navigate('/dashboard/users')} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginRight: '0.8rem',
              fontSize: '1.2rem',
              flexShrink: 0,
              marginTop: '0.1rem'
            }}> */}
            {/* <FiArrowLeft /> */}
            {/* </button> */}
            Profile Info</h3>

          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              {user.profileImage ? (
                <img src={getMediaUrl(user.profileImage)} alt="Avatar" className={styles.avatar} style={{ objectFit: 'cover' }} />
              ) : (
                <div className={styles.avatar}>{(user.firstName || 'U').charAt(0)}</div>
              )}
            </div>
            <h4>{user.firstName} {user.lastName}</h4>
            <p className={styles.emailText}>{user.email}</p>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItemRow}>
              <div className={styles.iconBox} style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' }}><FiPhone /></div>
              <div className={styles.infoContent}>
                <label>Phone Number</label>
                <span>{user.phone || 'N/A'}</span>
              </div>
            </div>

            <div className={styles.infoItemRow}>
              <div className={styles.iconBox} style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)' }}><FiShield /></div>
              <div className={styles.infoContent}>
                <label>Role</label>
                <span>{user.role?.name || 'No Role'}</span>
              </div>
            </div>

            <div className={styles.infoItemRow}>
              <div className={styles.iconBox} style={{ color: user.isActive ? '#4ade80' : '#ef4444', background: user.isActive ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)', borderColor: user.isActive ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)' }}><FiActivity /></div>
              <div className={styles.infoContent}>
                <label>Account Status</label>
                <span className={styles.statusBadge} style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem', color: user.isActive ? '#4ade80' : '#ef4444' }}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className={styles.infoItemRow}>
              <div className={styles.iconBox} style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }}><FiCalendar /></div>
              <div className={styles.infoContent}>
                <label>Joined On</label>
                <span style={{ fontSize: '0.72rem' }}>
                  {formatDate(user.createdAt)}
                </span>
              </div>
              {user.createdAt && (
                <span style={{ position: 'absolute', top: '0.4rem', right: '0.5rem', fontSize: '0.65rem', color: '#84f654d1', fontWeight: '500' }}>
                  {formatTime(user.createdAt)}
                </span>
              )}
            </div>

            <div className={styles.infoItemRow}>
              <div className={styles.iconBox} style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)' }}><FiClock /></div>
              <div className={styles.infoContent}>
                <label>Last Login</label>
                <span style={{ fontSize: '0.72rem' }}>
                  {formatDate(user.lastLogin)}
                </span>
              </div>
              {user.lastLogin && (
                <span style={{ position: 'absolute', top: '0.4rem', right: '0.5rem', fontSize: '0.65rem', color: '#84f654d1', fontWeight: '500' }}>
                  {formatTime(user.lastLogin)}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: KYC Info */}
        <motion.div className={styles.card} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0 }}>KYC Verification</h3>
            <span className={`${styles.statusBadge} ${kycStatusClass}`}>
              {currentKycStatus.toUpperCase()}
            </span>
          </div>

          {kyc ? (() => {
            // Extract from raw_response
            const raw = kyc.raw_response || {};
            const aadhaarData = raw.aadhaar || raw.aadhaar_details || kyc.aadhaar_details || {};
            const aadhaarName = aadhaarData.name || aadhaarData.full_name || kyc.customer_name || '';
            const aadhaarRelation = aadhaarData.relative_name || aadhaarData.father_name || aadhaarData.care_of || aadhaarData.co || '';
            const aadhaarAddress = aadhaarData.address || aadhaarData.current_address || (aadhaarData.house && `${aadhaarData.house}, ${aadhaarData.street || ''}, ${aadhaarData.loc || ''}, ${aadhaarData.dist || ''}, ${aadhaarData.state || ''} - ${aadhaarData.pc || ''}`.replace(/,\s*,/g, ',').trim()) || '';

            return (
              <div>
                {/* Document Numbers Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '0.75rem', border: '1px solid #84f654d1' }}>
                    <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Aadhaar No.</div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                      <span style={{ color: 'orange' }}>No: </span>{kyc.kyc_details?.aadhaar || '—'}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '0.75rem', border: '1px solid #84f654d1' }}>
                    <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>PAN No.</div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                      <span style={{ color: 'orange' }}>No: </span>{kyc.kyc_details?.pan || '—'}
                    </div>
                  </div>
                </div>

                {/* Aadhaar Details */}
                {(aadhaarName || aadhaarRelation || aadhaarAddress) && (
                  <div style={{ marginBottom: '1rem' }}>
                    {/* Row 1: Name + Relation */}
                    {(aadhaarName || aadhaarRelation) && (
                      <div style={{
                        background: 'rgba(255,255,255,0.02)', borderRadius: '8px 8px 0 0', padding: '0.75rem', border: '1px solid #84f654d1 ', borderBottom: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem'
                      }}>
                        {aadhaarName && (
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Name</div>
                            <div style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 500 }}>{aadhaarName}</div>
                          </div>
                        )
                        }
                        {aadhaarRelation && (
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Father / S/O / W/O</div>
                            <div style={{ fontSize: '0.8rem', color: '#ddd', fontWeight: 500 }}>{aadhaarRelation}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Row 2: Full Address */}
                    {aadhaarAddress && (
                      <div style={{ background: 'rgba(255,255,255,0.015)', borderRadius: (aadhaarName || aadhaarRelation) ? '0 0 8px 8px' : '8px', padding: '0.75rem', border: '1px solid #84f654d1' }}>
                        <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Address</div>
                        <div style={{ fontSize: '0.75rem', color: '#aaa', lineHeight: '1.5' }}>{aadhaarAddress}</div>
                      </div>
                    )}
                  </div>
                )
                }

                {/* 3 Images in one row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {kyc.aadhaar_image && (
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Aadhaar Photo</div>
                      <img src={getMediaUrl(kyc.aadhaar_image)} alt="Aadhaar" style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', background: '#000', display: 'block', border: '1px solid #84f654d1' }} />
                    </div>
                  )}
                  {kyc.selfie_image && (
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Selfie</div>
                      <img src={getMediaUrl(kyc.selfie_image)} alt="Selfie" style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', background: '#000', display: 'block', border: '1px solid #84f654d1' }} />
                    </div>
                  )}
                  {kyc.signature_image && (
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Signature</div>
                      <img src={getMediaUrl(kyc.signature_image)} alt="Signature" style={{ width: '100%', height: '210px', objectFit: 'contain', borderRadius: '6px', background: '#fff', display: 'block', border: '1px solid #84f654d1' }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })() : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
              <p>No KYC records found for this user.</p>
            </div >
          )}
        </motion.div >
      </div >
    </div >
  );
};

export default UserDetails;
