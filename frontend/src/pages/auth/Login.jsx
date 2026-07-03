import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './Login.module.scss';
import { toast } from 'react-toastify';
import BrandLogo from '../../components/common/BrandLogo';
import { CustomToast } from '../../components/common/CustomToast';
import { authService } from '../../services/api/auth.service';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const BackgroundBubbles = () => {
  const bubbles = [
    { color: 'var(--primary)', size: 300, top: '10%', left: '-10%', delay: 0 },
    { color: 'var(--primary-dark)', size: 250, top: '60%', left: '80%', delay: 2 },
    { color: 'var(--primary-light)', size: 200, top: '80%', left: '20%', delay: 4 },
    { color: 'var(--border)', size: 350, top: '-10%', left: '60%', delay: 1 },
    { color: 'var(--primary-hover)', size: 150, top: '40%', left: '40%', delay: 3 },
  ];

  return (
    <div className={styles.backgroundBubbles}>
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className={styles.bubble}
          style={{
            backgroundColor: b.color,
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 20, 0, -20, 0],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const responseData = await authService.login(data);
      
      // We would normally store user in Redux here
      toast.success(<CustomToast title="Login successful" message={responseData.message || 'Welcome back! You have been logged in successfully.'} />);
      
      const user = responseData?.data?.user;
      const accessToken = responseData?.data?.accessToken;
      const roleName = user?.role?.name;
      
      if (user) {
        // Store user WITH accessToken so the API interceptor can read it
        localStorage.setItem('user', JSON.stringify({ ...user, accessToken }));
      }
      
      // Simple routing based on role
      if (roleName === 'Super Admin') {
        navigate('/dashboard'); // Admin goes to dashboard
      } else if (roleName === 'Student') {
        navigate('/student-dashboard'); // Student dashboard route
      } else if (roleName === 'Trader') {
        navigate('/trader-dashboard'); // Trader dashboard route
      } else {
        navigate('/dashboard'); // Fallback
      }
    } catch (error) {
      toast.error(<CustomToast title="Login failed" message={error.response?.data?.message || 'Invalid email or password. Please try again.'} />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <BackgroundBubbles />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', zIndex: 10, width: '100%', maxWidth: '400px' }}>
        <BrandLogo />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`glass-panel ${styles.loginCard}`}
          style={{ width: '100%' }}
        >
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your premium dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className={styles.actions}>
            <label className={styles.remember}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className={styles.forgot}>
              Forgot password?
            </a>
          </div>

          <Button type="submit" isLoading={isLoading} className={styles.submitBtn}>
            Sign In
          </Button>

          <div className={styles.actions} style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '0.5rem' }}>
            <span className={styles.text} style={{ color: 'var(--text-secondary)' }}>Don't have an account?</span>
            <Link to="/register" className={styles.link} style={{ color: 'var(--primary)', fontWeight: 500 }}>
              Sign up
            </Link>
          </div>
        </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
