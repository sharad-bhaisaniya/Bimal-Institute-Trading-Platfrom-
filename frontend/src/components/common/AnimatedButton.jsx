import React from 'react';
import styles from './AnimatedButton.module.scss';

const AnimatedButton = ({ children, onClick, className = '', type = 'button', style = {} }) => {
  return (
    <button
      type={type}
      className={`${styles.animatedBtn} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
