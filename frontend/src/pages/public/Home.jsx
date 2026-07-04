import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiBookOpen, FiAward } from 'react-icons/fi';
import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className="user-page-container">
      {/* Hero Section */}
      <section className="user-hero-section">
        <motion.div
          className="user-hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="user-hero-title">Master the Markets <br /> with <span>Bimal Institute</span></h1>
          <p className="user-hero-subtitle">
            Join thousands of successful traders. Access premium courses, real-time market analysis, and a community of experts to elevate your trading journey.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.primaryBtn}>Get Started Free</Link>
            <Link to="/courses" className={styles.secondaryBtn}>Explore Courses</Link>
          </div>
        </motion.div>

        {/* <motion.div 
          className={styles.heroImage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.mockup}>
            <div className={styles.mockupHeader}>
              <span></span><span></span><span></span>
            </div>
            <div className={styles.mockupBody}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonChart}></div>
            </div>
          </div>
        </motion.div> */}
      </section>

      <div className="user-glowing-divider"></div>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Us?
        </motion.h2>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          We provide everything you need to become a consistently profitable trader in today's dynamic markets.
        </motion.p>

        <div className={styles.featuresGrid}>
          {[
            {
              icon: <FiBookOpen />,
              title: "Expert-Led Courses",
              desc: "Learn from industry veterans with decades of combined experience in stock and crypto markets."
            },
            {
              icon: <FiTrendingUp />,
              title: "Live Trading Sessions",
              desc: "Watch and learn as our experts analyze the market and take trades in real-time."
            },
            {
              icon: <FiAward />,
              title: "Certifications",
              desc: "Earn recognized certificates upon course completion to showcase your trading expertise."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
