import React from 'react';
import { motion } from 'framer-motion';
import { FiPlayCircle, FiClock, FiStar } from 'react-icons/fi';
import styles from './Courses.module.scss';
import homeStyles from './Home.module.scss';

const courses = [
  {
    title: "Mastering Price Action",
    desc: "Learn to read raw price charts without relying on lagging indicators. Perfect for day traders.",
    level: "Intermediate",
    duration: "4 Weeks",
    rating: "4.9",
    image: "/courses/price_action.png",
    frame: "green"
  },
  {
    title: "Options Trading Blueprint",
    desc: "From basic calls/puts to advanced multi-leg strategies to generate consistent income.",
    level: "Advanced",
    duration: "6 Weeks",
    rating: "4.8",
    image: "/courses/options.png",
    frame: "silver"
  },
  {
    title: "Crypto Fundamentals",
    desc: "Understand blockchain technology and how to safely invest in the crypto market.",
    level: "Beginner",
    duration: "2 Weeks",
    rating: "4.7",
    image: "/courses/crypto.png",
    frame: "gold"
  }
];

const Courses = () => {
  return (
    <div className="user-page-container">
      <section className="user-hero-section">
        <motion.div
          className="user-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="user-hero-title">Premium <span>Trading Courses</span></h1>
          <p className="user-hero-subtitle">Elevate your trading skills with our expertly crafted curriculums.</p>
        </motion.div>
      </section>

      <div className="user-glowing-divider"></div>

      <section className={styles.courseGridSection}>
        <div className={styles.grid}>
          {courses.map((course, idx) => (
            <motion.div 
              key={idx}
              className={`${homeStyles.featureCard} ${styles.courseCard}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={`${styles.imageFrame} ${styles[course.frame]}`}>
                <img src={course.image} alt={course.title} />
                <div className={styles.imageOverlay}></div>
              </div>
              
              <h3>{course.title}</h3>
              <p className={styles.courseDesc}>{course.desc}</p>
              
              <div className={styles.courseMeta}>
                <span><FiPlayCircle /> {course.level}</span>
                <span><FiClock /> {course.duration}</span>
                <span><FiStar /> {course.rating}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Courses;
