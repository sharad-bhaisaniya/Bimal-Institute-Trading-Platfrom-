import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiCheck, FiLoader } from 'react-icons/fi';
import styles from './KycProcess.module.scss';
import BrandLogo from '../../components/common/BrandLogo';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { kycService } from '../../services/api/kyc.service';

const KycProcess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // For callback state
  const kycCallback = searchParams.get('kyc_callback');
  const kycStatus = searchParams.get('kyc_status');
  const [callbackDone, setCallbackDone] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch (e) { setUser(null); }
    }
    setIsCheckingAuth(false);
  }, []);

  // Handle Digio callback: when user comes back after completing Digio
  useEffect(() => {
    if ((kycCallback || kycStatus === 'updated') && !callbackDone) {
      setCallbackDone(true);
      setIsLoading(true);
      toast.info('Verifying KYC status...');
      kycService.getStatus()
        .then((data) => {
          const status = data.kyc_status;
          if (['approved', 'completed', 'success'].includes(status)) {
            toast.success('KYC Approved Successfully! 🎉');
            setTimeout(() => navigate('/dashboard'), 1500);
          } else {
            toast.warn(`KYC status: ${status}. Please wait or contact support.`);
          }
        })
        .catch((err) => {
          console.error('[KycProcess] Status check error:', err);
          toast.error('Failed to verify KYC status.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [kycCallback, kycStatus, callbackDone, navigate]);

  if (isCheckingAuth) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/kyc-process' }} />;
  }

  const handleStartDigio = async () => {
    setIsLoading(true);
    try {
      toast.info('Initiating KYC request...');
      const response = await kycService.initiate({
        name: user.name,
        phone: user.phone,
      });

      if (response.success && response.redirect_url) {
        toast.success('Redirecting to Digio...');
        // Open Digio in the same tab; Digio will redirect back to our callback URL
        window.location.href = response.redirect_url;
      } else {
        toast.error(response.message || 'Could not start KYC session.');
        setIsLoading(false);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to initiate KYC.';
      toast.error(msg);
      console.error('[KycProcess] initiateKyc error:', error);
      setIsLoading(false);
    }
  };

  // Render a "processing" state while coming back from Digio
  if (kycCallback || kycStatus === 'updated') {
    return (
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <BrandLogo showText={true} />
        </div>
        <div className={styles.wizardCard}>
          <div className={styles.stepContent} style={{ textAlign: 'center', padding: '60px 30px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ color: 'var(--primary, #7ed321)', fontSize: '4rem', marginBottom: '20px' }}>
                {isLoading ? <FiLoader style={{ animation: 'spin 1s linear infinite' }} /> : <FiCheck />}
              </div>
              <h2 className={styles.stepTitle}>
                {isLoading ? 'Verifying KYC…' : 'KYC Submitted'}
              </h2>
              <p className={styles.stepDescription}>
                {isLoading
                  ? 'Please wait while we verify your documents with Digio.'
                  : 'Your KYC has been submitted. You will be redirected shortly.'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <BrandLogo showText={true} />
      </div>

      <div className={styles.wizardCard}>
        <div className={styles.stepContent} style={{ paddingBottom: '20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.formGroup}
            style={{ marginBottom: 0 }}
          >
            <div className={styles.stepHeader}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'var(--primary, #7ed321)', fontSize: '3.5rem' }}>
                <FiShield />
              </div>
              <h2 className={styles.stepTitle}>Complete Your KYC with Digio</h2>
              <div className={styles.stepDescription} style={{ marginTop: '20px', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ marginBottom: '15px' }}>
                  To ensure a secure trading environment and comply with regulatory requirements, you need to complete your KYC process. We have partnered with Digio to make this fast and paperless.
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Aadhar &amp; PAN Verification</li>
                  <li>Live Selfie &amp; Face Match</li>
                  <li>Digital Signature</li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '3px', accentColor: 'var(--primary, #7ed321)' }}
              />
              <label htmlFor="acceptTerms" style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: '1.4', cursor: 'pointer' }}>
                I hereby consent to provide my Aadhar/PAN details and authorize Digio &amp; Bimal Institute to fetch and verify my documents for KYC purposes.
              </label>
            </div>
          </motion.div>
        </div>

        <div className={styles.footer} style={{ justifyContent: 'center', padding: '30px' }}>
          <Button
            onClick={handleStartDigio}
            disabled={!acceptedTerms || isLoading}
            isLoading={isLoading}
            style={{ width: '100%', maxWidth: '350px', height: '48px', fontSize: '1.05rem' }}
          >
            Start KYC Process
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KycProcess;
