import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';
import styles from './UserFooter.module.scss';
import BrandLogo from '../common/BrandLogo';

const UserFooter = () => {
  return (
    <>
      <div className={styles.glowingDivider}></div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <BrandLogo showText={true} />
          <p>Empowering traders with knowledge and cutting-edge tools to conquer the financial markets.</p>
        </div>
        
        <div className={styles.footerLinks}>
          <div className={styles.linkGroup}>
            <h4>Platform</h4>
            <Link to="/courses">Courses</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/features">Features</Link>
          </div>
          <div className={styles.linkGroup}>
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div className={styles.linkGroup}>
            <h4>Legal</h4>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Bimal Institute. All rights reserved.</p>
        <div className={styles.socialLinks}>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FiYoutube /></a>
        </div>
      </div>
    </footer>
    </>
  );
};

export default UserFooter;
