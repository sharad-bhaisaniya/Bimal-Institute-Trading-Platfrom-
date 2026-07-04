import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './Contact.module.scss';
import homeStyles from './Home.module.scss';

const Contact = () => {
  return (
    <div className="user-page-container">
      <section className="user-hero-section">
        <motion.div
          className="user-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="user-hero-title">Get In <span>Touch</span></h1>
          <p className="user-hero-subtitle">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>
      </section>

      <div className="user-glowing-divider"></div>

      <section className={styles.contactGrid}>
        <motion.div 
          className={styles.contactInfo}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={homeStyles.featureCard}>
            <h3>Contact Information</h3>
            <p className={styles.subtitle}>Fill up the form and our team will get back to you within 24 hours.</p>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.icon}><FiPhone /></div>
                <span>+91 98765 43210</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.icon}><FiMail /></div>
                <span>support@bimalinstitute.com</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.icon}><FiMapPin /></div>
                <span>123 Trading Street, Financial District, New Delhi, India</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={styles.contactFormContainer}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>
            <div className={styles.formGroup}>
              <label>Message</label>
              <textarea rows="5" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className={styles.submitBtn}>Send Message</button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
