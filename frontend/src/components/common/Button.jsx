import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import styles from './Button.module.scss';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className,
  disabled,
  isLoading,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        styles.btn,
        styles[`btn-${variant}`],
        disabled && styles.disabled,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className={styles.loader}></span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
