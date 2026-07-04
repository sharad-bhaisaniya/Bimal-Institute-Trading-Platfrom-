import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './UserLayout.module.scss';
import './user-shared.scss';
import UserHeader from '../components/layout/UserHeader';
import UserFooter from '../components/layout/UserFooter';

const UserLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.greenShadeLeft}></div>
      <div className={styles.greenShadeRight}></div>
      <div className={styles.greenShadeCenter}></div>
      
      <div className={styles.mainContent}>
        <UserHeader />
        
        <main className={styles.pageContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <Outlet />
          </motion.div>
        </main>

        <UserFooter />
      </div>
    </div>
  );
};

export default UserLayout;
