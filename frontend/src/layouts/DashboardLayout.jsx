import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import styles from './DashboardLayout.module.scss';
import './dashboard-shared.scss';
import { motion } from 'framer-motion';
import BackgroundBubbles from '../components/common/BackgroundBubbles';
import { FiBell, FiSettings, FiSearch, FiLogOut, FiMenu, FiHome, FiUsers, FiShield, FiChevronDown, FiChevronRight, FiKey, FiBookOpen, FiPlayCircle, FiCreditCard, FiBriefcase, FiMessageSquare } from 'react-icons/fi';
import BrandLogo from '../components/common/BrandLogo';
import NotificationBell from '../components/common/NotificationBell';
import { BASE_URL } from '../services/api/api';

const NavItem = ({ to, icon: Icon, label, subLinks, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e) => {
    if (subLinks && !isCollapsed) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`${styles.navItemContainer} ${isCollapsed ? styles.collapsed : ''}`}>
      <NavLink
        to={to}
        end={!subLinks}
        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        onClick={handleToggle}
      >
        <div className={styles.navItemContent}>
          <Icon className={styles.navIcon} />
          {!isCollapsed && <span className={styles.navLabel}>{label}</span>}
        </div>
        {!isCollapsed && subLinks && (
          <div className={styles.chevron}>
            {isOpen ? <FiChevronDown /> : <FiChevronRight />}
          </div>
        )}
      </NavLink>

      {/* Expanded State Sublinks */}
      {!isCollapsed && subLinks && isOpen && (
        <div className={styles.subLinksContainer}>
          {subLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) => `${styles.subNavItem} ${isActive ? styles.active : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Collapsed State Hover Menu */}
      {isCollapsed && subLinks && (
        <div className={styles.floatingMenu}>
          <div className={styles.floatingMenuTitle}>{label}</div>
          {subLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) => `${styles.subNavItemFloating} ${isActive ? styles.active : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isCollapsed, toggleSidebar }) => (
  <div className={`glass-panel ${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
    <div className={styles.sidebarHeader}>
      <div
        className={styles.logoWrapper}
        onClick={toggleSidebar}
        style={{ cursor: 'pointer' }}
      >
        <BrandLogo showText={!isCollapsed} />
      </div>
      {!isCollapsed && (
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <FiMenu />
        </button>
      )}
    </div>
    <nav className={styles.nav}>
      <NavItem to="/dashboard" icon={FiHome} label="Dashboard" isCollapsed={isCollapsed} />
      <NavItem
        to="/dashboard/users"
        icon={FiUsers}
        label="Users"
        isCollapsed={isCollapsed}
        subLinks={[
          { label: 'All Users', to: '/dashboard/users' },
          { label: 'Add User', to: '/dashboard/users/add' }
        ]}
      />
      <NavItem to="/dashboard/roles" icon={FiShield} label="Roles" isCollapsed={isCollapsed} />
      <NavItem to="/dashboard/brokers" icon={FiBriefcase} label="Trade Broker" isCollapsed={isCollapsed} />

      <NavItem
        to="/dashboard/courses"
        icon={FiPlayCircle}
        label="Courses (LMS)"
        isCollapsed={isCollapsed}
        subLinks={[
          { label: 'All Courses', to: '/dashboard/courses' },
          { label: 'Create Course', to: '/dashboard/courses/builder' }
        ]}
      />
      <NavItem
        to="/dashboard/notifications"
        icon={FiBell}
        label="Notifications"
        isCollapsed={isCollapsed}
      />
      <NavItem
        to="/dashboard/blogs"
        icon={FiBookOpen}
        label="Content"
        isCollapsed={isCollapsed}
        subLinks={[
          { label: 'All Blogs', to: '/dashboard/blogs' },
          { label: 'Add Blog', to: '/dashboard/blogs/add' },
          { label: 'Categories', to: '/dashboard/blog-categories' }
        ]}
      />
      <NavItem
        to="/dashboard/credentials"
        icon={FiKey}
        label="Credentials"
        isCollapsed={isCollapsed}
        subLinks={[
          { label: 'SMTP (Email)', to: '/dashboard/credentials/smtp' },
          { label: 'SMS Gateway', to: '/dashboard/credentials/sms' },
          { label: 'Razorpay (Payments)', to: '/dashboard/credentials/razorpay' },
          { label: 'Digio (KYC)', to: '/dashboard/credentials/digio' },
          { label: 'YouTube API', to: '/dashboard/credentials/youtube' },
        ]}
      />
      <NavItem
        to="/dashboard/subscriptions"
        icon={FiCreditCard}
        label="Subscriptions"
        isCollapsed={isCollapsed}
        subLinks={[
          { label: 'Pricing Plans', to: '/dashboard/subscriptions' },
          { label: 'Create Plan', to: '/dashboard/subscriptions/new' }
        ]}
      />


      <NavItem
        to="/dashboard/settings"
        icon={FiSettings}
        label="Settings"
        isCollapsed={isCollapsed}
        subLinks={[
          { label: 'General', to: '/dashboard/settings' },
          { label: 'Security', to: '/dashboard/settings' }
        ]}
      />
    </nav>
  </div>
);


const Header = ({ user, onLogout, onSettingsClick }) => (
  <header className={`glass-panel ${styles.header}`}>
    <div className={styles.headerLeft}>
      <div className={styles.searchBar}>
        <FiSearch className={styles.searchIcon} />
        <input type="text" placeholder="Search anything..." className={styles.searchInput} />
      </div>
    </div>
    <div className={styles.headerRight}>
      <NotificationBell />

      <button
        className={styles.iconBtn} onClick={onSettingsClick}
        title="Chat"
      >
        <FiMessageSquare />
      </button>
      <button className={styles.iconBtn} onClick={onSettingsClick} title="Settings">
        <FiSettings />
      </button>
      <button className={styles.iconBtn} onClick={onLogout} title="Logout">
        <FiLogOut />
      </button>
      <div className={styles.userProfile}>
        {user?.profileImage ? (
          <img src={user.profileImage.startsWith('http') ? user.profileImage : `${BASE_URL}${user.profileImage}`} alt="Avatar" className={styles.avatar} style={{ objectFit: 'cover' }} />
        ) : (
          <div className={styles.avatar}>{user?.firstName ? user.firstName[0].toUpperCase() : 'U'}</div>
        )}
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.firstName || 'User'} {user?.lastName || ''}</span>
          <span className={styles.userRole}>{user?.role?.name || 'User'}</span>
        </div>
      </div>
    </div>
  </header>
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
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

    // Listen to our custom local storage updates
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Still checking authentication string synchronously for initial redirect
  const isAuthenticated = !!localStorage.getItem('user');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`${styles.layout} dashboardGlobal`}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className={styles.mainContent}>
        <Header user={user} onLogout={handleLogout} onSettingsClick={() => navigate('/dashboard/settings')} />
        <main className={styles.pageContent}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
