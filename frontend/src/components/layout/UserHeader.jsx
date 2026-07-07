import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './UserHeader.module.scss';
import BrandLogo from '../common/BrandLogo';
import AnimatedButton from '../common/AnimatedButton';
import { BASE_URL } from '../../services/api/api';

const UserHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          setUser(JSON.parse(userString));
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleProfileClick = () => {
    const roleName = user?.role?.name?.toLowerCase() || '';
    if (roleName === 'super admin') {
      navigate('/dashboard');
    } else {
      navigate('/user/journal');
    }
  };

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
          <NavLink to="/contact" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} >Contact</NavLink>
          <NavLink to="/kyc" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>KYC</NavLink>
        </nav>
      </div>

      <div className={styles.headerRight}>
        {user ? (
          /* Pure dynamic block block is customized exactly to look like image_934c48.png */
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2.5 p-1.5 pr-4 bg-[#141414] border border-[#000] rounded-full transition-all hover:bg-white/5 active:scale-98"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage.startsWith('http') ? user.profileImage : `${BASE_URL}${user.profileImage}`}
                alt="Avatar"
                /* Image container updated to rounded-lg for small border radius as requested */
                className="w-8 h-8  object-cover p-0.5   border border-[#e5e7eb] rounded-full "
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-[#74b723]/20 text-[#74b723] flex items-center justify-center font-bold text-xs border border-[#74b723]/30">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </div>
            )}
            <span className="text-sm font-semibold text-white tracking-wide">
              {user?.firstName || 'User'}
            </span>
          </button>
        ) : (
          <>
            <button className={styles.loginBtn} onClick={() => navigate('/login')}>Log In</button>
            <AnimatedButton className={styles.registerBtn} onClick={() => navigate('/register')}>
              Sign Up
            </AnimatedButton>
          </>
        )}
      </div>
    </header>
  );
};

export default UserHeader;