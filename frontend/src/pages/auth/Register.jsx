import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/api/auth.service';
import styles from './Register.module.scss';
import { CustomToast } from '../../components/common/CustomToast';
import { FiBookOpen, FiTrendingUp, FiArrowLeft, FiCheckCircle, FiSmartphone } from 'react-icons/fi';

const detailsSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const OTP_LENGTH = 6;

// ─── Animated Stepper ──────────────────────────────────────────────────────
const Stepper = ({ step }) => {
  const steps = ['Choose Role', 'Your Details', 'Verify OTP'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
      {steps.map((label, i) => {
        const idx = i + 1;
        const isActive = step === idx;
        const isDone = step > idx;
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: isDone ? 'var(--primary)' : isActive ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                border: isActive ? '2px solid var(--primary)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: isDone || isActive ? '#000' : '#555',
                transition: 'all 0.3s',
                boxShadow: isActive ? '0 0 12px rgba(189,255,0,0.4)' : 'none',
              }}>
                {isDone ? <FiCheckCircle size={14} color="#000" /> : idx}
              </div>
              <span style={{ fontSize: '0.6rem', color: isActive || isDone ? 'var(--primary)' : '#444', fontWeight: isActive ? 600 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 2, height: '2px', backgroundColor: step > idx ? 'var(--primary)' : 'rgba(255,255,255,0.07)', borderRadius: '1px', transition: 'background-color 0.4s', marginBottom: '18px' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── OTP Input Boxes ───────────────────────────────────────────────────────
const OtpBoxes = ({ otp, setOtp }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const newOtp = [...otp];
    newOtp[index] = val[val.length - 1];
    setOtp(newOtp);
    if (index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    text.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputsRef.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1.5rem 0' }}>
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          style={{
            width: '44px', height: '52px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
            borderRadius: '0.6rem', border: otp[i] ? '1.5px solid var(--primary)' : '1.5px solid rgba(255,255,255,0.1)',
            background: otp[i] ? 'rgba(189,255,0,0.05)' : 'rgba(255,255,255,0.03)',
            color: '#fff', outline: 'none', transition: 'all 0.2s',
            boxShadow: otp[i] ? '0 0 10px rgba(189,255,0,0.2)' : 'none',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => { if (!otp[i]) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        />
      ))}
    </div>
  );
};

// ─── Main Register Component ────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);                    // 1=role, 2=details, 3=otp
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState('Student');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);         // stores user details for final step
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(0);          // resend cooldown

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(detailsSchema),
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Step 1 → 2: Role chosen ───────────────────────────────────────────────
  const handleRoleSelect = () => {
    setSelectedRole(activeTab);
    setStep(2);
  };

  // ── Step 2 → 3: Details submitted, OTP sent ───────────────────────────────
  const onDetailsSubmit = async (data) => {
    setIsLoading(true);
    const payload = { ...data, roleName: activeTab };
    try {
      await authService.sendOtp(payload);
      setFormData(payload);
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(60);
      setStep(3);
      toast.success(
        <CustomToast
          title="OTP Sent!"
          message={`A 6-digit OTP has been sent to your phone (${data.phone}) and email.`}
        />
      );
    } catch (error) {
      toast.error(
        <CustomToast
          title="OTP Failed"
          message={error.response?.data?.message || 'Could not send OTP. Please try again.'}
        />
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Verify OTP & Complete registration ────────────────────────────
  const onVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < OTP_LENGTH) {
      toast.error(<CustomToast title="Incomplete OTP" message="Please enter all 6 digits." />);
      return;
    }
    setIsLoading(true);
    try {
      const responseData = await authService.verifyAndRegister({ ...formData, otp: otpValue });
      
      toast.success(
        <CustomToast
          title="🎉 Registration Successful!"
          message="Your account has been verified and you are now logged in."
        />
      );
      
      // Auto-login functionality
      const user = responseData?.data?.user;
      const accessToken = responseData?.data?.accessToken;
      const roleName = user?.role?.name;
      
      if (user) {
        localStorage.setItem('user', JSON.stringify({ ...user, accessToken }));
      }
      
      setTimeout(() => {
        if (roleName === 'Super Admin') {
          navigate('/dashboard');
        } else if (roleName === 'Student') {
          navigate('/student-dashboard');
        } else if (roleName === 'Trader') {
          navigate('/trader-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 500);
    } catch (error) {
      toast.error(
        <CustomToast
          title="Verification Failed"
          message={error.response?.data?.message || 'Invalid or expired OTP.'}
        />
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (countdown > 0 || !formData) return;
    setIsLoading(true);
    try {
      await authService.sendOtp(formData);
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(60);
      toast.success(<CustomToast title="OTP Resent" message="A new OTP has been sent to your phone & email." />);
    } catch (error) {
      toast.error(<CustomToast title="Resend Failed" message={error.response?.data?.message || 'Could not resend OTP.'} />);
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className={styles.container} style={{ backgroundColor: '#050505' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingBottom: '2rem', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', backgroundColor: '#0f0f0f', borderRadius: '1.5rem', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Stepper (hidden on role selection) */}
          {step > 1 && <Stepper step={step} />}

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Role Selection ── */}
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Join As</h1>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#888' }}>Choose how you want to register — you can always switch later.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  {[{ role: 'Student', Icon: FiBookOpen, desc: "I'm here to learn trading fundamentals" }, { role: 'Trader', Icon: FiTrendingUp, desc: "I actively trade & want advanced tools" }].map(({ role, Icon, desc }) => (
                    <div
                      key={role}
                      onClick={() => setActiveTab(role)}
                      style={{
                        flex: 1, padding: '1.5rem', borderRadius: '1rem',
                        background: activeTab === role ? 'rgba(189, 255, 0, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                        border: activeTab === role ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
                        transition: 'all 0.2s',
                      }}
                    >
                      {activeTab === role && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--primary)', fontSize: '1.25rem' }}>
                          <FiCheckCircle fill="var(--primary)" color="#000" />
                        </div>
                      )}
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: activeTab === role ? 'var(--primary)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', transition: 'all 0.3s' }}>
                        <Icon size={32} color={activeTab === role ? '#000' : '#666'} />
                      </div>
                      <h3 style={{ margin: 0, color: activeTab === role ? '#fff' : '#888', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', transition: 'color 0.3s' }}>{role}</h3>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: activeTab === role ? '#666' : '#444', textAlign: 'center', lineHeight: 1.4 }}>{desc}</p>
                    </div>
                  ))}
                </div>

                <button onClick={handleRoleSelect} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--primary)', color: '#000', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Continue as {activeTab} <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
                </button>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
                  Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Registration Details ── */}
            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className={styles.header}>
                  <div onClick={() => setStep(1)} style={{ cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', width: 'fit-content' }}>
                    <FiArrowLeft /> Back to role selection
                  </div>
                  <h1 className={styles.title}>Create {selectedRole} Account</h1>
                  <p className={styles.subtitle}>An OTP will be sent to your phone & email to verify.</p>
                </div>

                <form onSubmit={handleSubmit(onDetailsSubmit)} className={styles.form}>
                  <div className={styles.row}>
                    <div className={styles.col}>
                      <Input label="First Name" type="text" placeholder="John" {...register('firstName')} error={errors.firstName?.message} />
                    </div>
                    <div className={styles.col}>
                      <Input label="Last Name" type="text" placeholder="Doe" {...register('lastName')} error={errors.lastName?.message} />
                    </div>
                  </div>

                  <Input label="Phone Number (10 digits)" type="tel" placeholder="9876543210" {...register('phone')} error={errors.phone?.message} />

                  <Input label="Email Address" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />

                  <div className={styles.row}>
                    <div className={styles.col}>
                      <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
                    </div>
                    <div className={styles.col}>
                      <Input label="Confirm Password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
                    </div>
                  </div>

                  <Button type="submit" isLoading={isLoading} className={styles.submitBtn}>
                    Send OTP
                  </Button>

                  <div className={styles.actions}>
                    <span className={styles.text}>Already have an account?</span>
                    <Link to="/login" className={styles.link}>Log in</Link>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── STEP 3: OTP Verification ── */}
            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                {/* Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(189,255,0,0.08)', border: '1px solid rgba(189,255,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(189,255,0,0.1)' }}>
                    <FiSmartphone size={32} color="var(--primary)" />
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Verify Your Phone</h2>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
                    We sent a 6-digit OTP to<br />
                    <strong style={{ color: '#aaa' }}>+91 {formData?.phone}</strong> &amp; your email.
                  </p>
                </div>

                <OtpBoxes otp={otp} setOtp={setOtp} />

                <Button
                  type="button"
                  onClick={onVerifyOtp}
                  isLoading={isLoading}
                  className={styles.submitBtn}
                  disabled={otp.join('').length < OTP_LENGTH}
                >
                  Verify &amp; Create Account
                </Button>

                {/* Resend */}
                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#555' }}>
                  Didn&apos;t receive it?{' '}
                  <span
                    onClick={countdown <= 0 ? handleResend : undefined}
                    style={{
                      color: countdown <= 0 ? 'var(--primary)' : '#444',
                      cursor: countdown <= 0 ? 'pointer' : 'not-allowed',
                      fontWeight: 600,
                      transition: 'color 0.2s',
                    }}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </span>
                </div>

                {/* Back */}
                <div
                  onClick={() => setStep(2)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '1rem', cursor: 'pointer', color: '#555', fontSize: '0.8rem' }}
                >
                  <FiArrowLeft size={12} /> Change details
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
