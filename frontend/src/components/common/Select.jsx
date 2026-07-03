import React, { useState, useRef, useEffect } from 'react';
import { cn } from './Button';
import styles from './Select.module.scss';
import { FiChevronDown } from 'react-icons/fi';

const Select = ({ label, error, className, options = [], value, onChange, placeholder = "Select...", ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={cn(styles.wrapper, className)} ref={containerRef}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div 
        className={cn(styles.select, error && styles.selectError, isOpen && styles.isOpen)}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
           if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen); }
        }}
      >
        <span className={!selectedOption ? styles.placeholder : styles.selectedText}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown className={cn(styles.caret, isOpen && styles.caretOpen)} />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.length === 0 ? (
            <div className={styles.noOptions}>No options found</div>
          ) : (
            options.map(option => (
              <div 
                key={option.value}
                className={cn(styles.option, value === option.value && styles.selectedOption)}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Select;
