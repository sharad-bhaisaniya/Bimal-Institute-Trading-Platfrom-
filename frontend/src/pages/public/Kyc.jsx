import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Kyc.module.scss';

// Import assets for the steps
import otpImage from '../../assets/kyc/kyc_step_1_otp.png';
import aadharImage from '../../assets/kyc/kyc_step_2_aadhar.png';
import selfieImage from '../../assets/kyc/kyc_step_3_selfie.png';
import signatureImage from '../../assets/kyc/kyc_step_4_signature.png';
import AnimatedButton from '../../components/common/AnimatedButton';

const Kyc = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Phone & OTP Verification',
      description: 'First, we will verify your mobile number. An OTP will be sent to your registered number for verification.',
      image: otpImage,
    },
    {
      id: 2,
      title: 'Aadhar & PAN Verification via Digio',
      description: 'Verify your Aadhar and PAN details seamlessly through our Digio integration. Fast, secure, and hassle-free.',
      image: aadharImage,
    },
    {
      id: 3,
      title: 'Live Selfie & Face Match',
      description: 'Take a live selfie which will be intelligently matched against your Aadhar photo to verify your identity.',
      image: selfieImage,
    },
    {
      id: 4,
      title: 'Digital Signature',
      description: 'Upload your signature or draw on the signature board. We update your KYC on Digio and assign you a proper Digio ID.',
      image: signatureImage,
    },
  ];

  const handleStartKyc = () => {
    // Navigate to actual KYC page or show a toast if it's a dummy
    // Since it's a dummy for now, let's just log or go to a placeholder path
    navigate('/kyc-process');
  };

  return (
    <div className="user-page-container">
      <div className="user-hero-section">
        <div className="user-hero-content">
          <h1 className="user-hero-title">
            Complete Your <span>KYC</span>
          </h1>
          <p className="user-hero-subtitle">
            A simple, fast, and secure process powered by Digio. Follow the 4 easy steps to unlock all features of the platform.
          </p>
          <AnimatedButton className={styles.startBtn} onClick={handleStartKyc}>
            Start KYC Now
          </AnimatedButton>
        </div>
      </div>
      <div className="user-glowing-divider"></div>

      <div className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>How it works</h2>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.stepCard} ${activeStep === index ? styles.active : ''}`}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className={styles.stepImageWrapper}>
                <img src={step.image} alt={step.title} className={styles.stepImage} />
                <div className={styles.stepNumber}>{step.id}</div>
              </div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kyc;
