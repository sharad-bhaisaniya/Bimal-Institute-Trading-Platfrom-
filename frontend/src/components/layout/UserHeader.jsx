import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './UserHeader.module.scss';
import BrandLogo from '../common/BrandLogo';
import AnimatedButton from '../common/AnimatedButton';

const UserHeader = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <NavLink to="/" className={styles.logoWrapper}>
          <BrandLogo showText={true} />
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} end>Home</NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Courses</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>About Us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Contact</NavLink>
          <NavLink to="/kyc" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>KYC</NavLink>
        </nav>
      </div>
      <div className={styles.headerRight}>
        <button className={styles.loginBtn} onClick={() => navigate('/login')}>Log In</button>
        <AnimatedButton className={styles.registerBtn} onClick={() => navigate('/register')}>
          Sign Up
        </AnimatedButton>
      </div>
    </header>
  );
};

export default UserHeader;
