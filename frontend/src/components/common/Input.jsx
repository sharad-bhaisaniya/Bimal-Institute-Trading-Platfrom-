import React, { forwardRef } from 'react';
import { cn } from './Button'; // Reusing cn utility
import styles from './Input.module.scss';

const Input = forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        ref={ref}
        className={cn(styles.input, error && styles.inputError)}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
