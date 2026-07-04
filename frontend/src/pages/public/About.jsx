import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.scss';
import homeStyles from './Home.module.scss';

const About = () => {
  return (
    <div className="user-page-container">
      <section className="user-hero-section">
        <motion.div 
          className="user-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="user-hero-title">About <span>Bimal Institute</span></h1>
          <p className="user-hero-subtitle">
            We are dedicated to bridging the gap between aspiring traders and consistent profitability. With decades of combined market experience, our mission is to empower individuals with the knowledge and tools needed to conquer the financial markets.
          </p>
        </motion.div>
      </section>

      <div className="user-glowing-divider"></div>

      <section className={styles.missionSection}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Core Values
        </motion.h2>

        <div className={homeStyles.featuresGrid}>
          {[
            {
              title: "Excellence",
              desc: "We deliver premium, high-quality education that stands out in the industry."
            },
            {
              title: "Integrity",
              desc: "We believe in transparency and honest guidance, no false promises."
            },
            {
              title: "Community",
              desc: "We foster a supportive environment where traders grow together."
            }
          ].map((val, idx) => (
            <motion.div 
              key={idx}
              className={homeStyles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h3>{val.title}</h3>
              <p>{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
