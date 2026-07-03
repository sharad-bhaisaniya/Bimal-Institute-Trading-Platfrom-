import React from 'react';
import styles from './BrandLogo.module.scss';

const BrandLogo = ({ className = '', showText = true }) => {
  return (
    <div className={`${styles.logoContainer} ${className}`}>
      <style>
        {`
          @keyframes fillUpBrandLogo {
            0% { clip-path: inset(100% 0 0 0); transform: scale(1); }
            71% { clip-path: inset(0 0 0 0); transform: scale(1); }
            85% { clip-path: inset(0 0 0 0); transform: scale(1.15); }
            100% { clip-path: inset(0 0 0 0); transform: scale(1); }
          }
          .brand-logo-fill {
            animation: fillUpBrandLogo 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}
      </style>
      <div className={styles.iconWrapper}>
        <div style={{ position: 'relative', width: '24px', height: '24px' }}>
          {/* Base Gray/Empty Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 2048 2048"
            fill="none"
            style={{ position: 'absolute', top: 0, left: 0 }}>
            <path fill="rgba(255, 255, 255, 0.2)" d="m1666 660-8-1-1 1h-4l-4 2-6 6-1 4-1 1v270l2 4v3l5 9 19 19v1l6 6h1l6 6v1l43 43v1l4 4 2 4v2l1 1v9l-1 1v2l-2 4-26 26v1l-6 6-2 1v1l-143 145v1l-45 45v1l-8 7v1l-34 34v1l-2 2h-1l-14 14v1l-45 45v1l-43 43v1l-14 13v1l-28 28v1l-4 4h-1l-14 14v1l-30 30v1l-2 2v2l-2 4v268l1 1v2l2 4 9 8 6 1 1 1h4l1-1h4l4-3h1l145-147v-1l52-52v-1l50-50v-1l44-44v-1l8-7v-1l34-34v-1l2-2h1l13-13v-1l28-28v-1l2-1 16-16v-1l43-43v-1l14-13v-1l28-28v-1l4-4h1l14-14v-1l43-43v-1l8-8h1l2-2v-1l31-31v-1l19-18v-1l29-29v-1l2-2h1l11-11v-1l5-5v-1l6-6v-1l3-3 3-6 4-5 2-5 2-2 4-8v-2l4-7v-2l2-3 1-6 1-1 1-6 1-1v-3l1-1v-3l1-1 1-12 1-1v-9l1-1v-22l-1-1v-10l-1-1-1-11-1-1v-3l-1-1-1-7-1-1-1-6-2-3-1-5-5-9v-2l-2-4-2-2-4-9-2-2-4-7-8-9v-1l-8-8v-1h-1l-21-21v-1l-50-50v-1l-43-43v-1h-1l-4-4v-1l-37-37v-1l-2-1-9-9v-1l-49-49v-1l-43-43v-1l-10-9ZM1010 39h-34l-1 1h-7l-1 1h-4l-1 1h-4l-1 1h-3l-1 1-7 1-1 1-5 1-3 2h-2l-3 2h-2l-4 3h-2l-6 3-2 2-3 1-2 2-8 4-3 3h-1l-3 3h-1l-8 8h-1l-17 17v1l-18 17v1l-43 43v1l-42 42v1l-19 18v1l-31 31v1l-2 1-10 10v1l-42 42v1l-12 12h-1l-4 4v1l-31 31v1l-14 13v1l-87 88v1l-12 12h-1l-4 4v1l-3 3v306l3 3h7l2-1 9-9v-1l43-43v-1l14-13v-1l28-28v-1l19-18v-1l43-43v-1l42-42v-1l19-18v-1l30-30v-1l14-13v-1l42-42v-1l14-14h1v-1l21-21 8-4h8l1 1h2l4 2 5 4v1l3 3v2l2 4v1191l-1 1v2l-2 4-4 5-10 5h-7l-1-1h-3l-4-3h-1l-14-14v-1l-8-8h-1l-5-5v-1l-42-42v-1l-46-46v-1l-13-13h-1l-3-3v-1l-86-87v-1l-49-49v-1l-102-103v-1l-51-51v-1l-47-47v-1l-5-4v-1l-37-37v-1l-3-3h-1l-9-9v-1l-49-49v-1l-13-13-2-4v-2l-1-1v-9l1-1v-2l2-4 5-5v-1l2-2h1l11-11v-1l28-28v-1l2-2h1l33-34 4-8v-2l2-4v-5l1-1V668l-1-1v-3l-2-4-3-3h-1l-4-3h-3l-1-1h-4l-1 1h-4l-2 1-52 52v1l-50 50v1l-52 52v1l-49 49v1l-80 81v1l-11 13v1l-6 8-10 20-1 5-3 5v2l-1 1v2l-2 4v3l-1 1v3l-1 1v3l-1 1v5l-1 1v5l-1 1v9l-1 1v25l1 1v8l1 1v6l1 1 1 9 1 1v3l2 4v3l1 1 1 5 3 5v2l3 5v2l7 14 4 5 3 6 4 4v1l3 3v1l6 6v1l22 22v1l17 16v1l30 30v1l15 14v1l42 42v1l12 12h1l3 3v1l29 29v1l18 17v1l85 86v1l19 18v1l85 86v1l16 16h1l2 2v1l27 27v1l13 13h1l2 2v1l35 35v1l7 6v1l146 148v1l51 51v1l51 51v1l45 45v1l6 5v1l36 36v1l3 3h1l12 12v1l18 17h1l3 3h1l11 8 14 7h93l3-2h2l12-6 2-2h1l2-2 7-4 8-7h1l13-13v-1l4-4v-1l8-10 1-3 2-2 6-12v-2l2-3v-2l1-1v-2l1-1v-2l2-4 1-8 1-1v-4l1-1 1-13 1-1V445l1-1v-2l2-4 7-7 4-2h3l1-1h5l1 1h3l4 2 48 48v1l42 42v1l12 11v1l32 32v1l3 3h1l15 15v1l42 42v1l7 7 2 1v1l33 33v1l16 15v1l31 31v1l3 3h1l11 11v1l42 42v1l10 10 4 1 1 1h3l1-1 4-1 3-5V487l-1-1v-2l-26-26v-1l-12-11v-1l-31-31v-1l-19-18v-1l-85-86v-1l-18-17v-1l-28-28v-1l-16-15v-1l-42-42v-1l-14-14-2-1v-1l-29-29v-1l-17-16v-1l-33-33v-1l-9-8v-1l-15-15h-1l-12-11h-1l-8-6-12-6-2-2-4-1-4-3h-2l-3-2h-2l-6-3h-3l-4-2h-3l-1-1h-3l-1-1h-4l-1-1h-4l-1-1h-7Z" />
          </svg>

          {/* Animated Green Logo */}
          <svg
            className="brand-logo-fill"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 2048 2048"
            fill="none"
            style={{ position: 'absolute', top: 0, left: 0 }}>
            <path fill="var(--primary)" d="m1666 660-8-1-1 1h-4l-4 2-6 6-1 4-1 1v270l2 4v3l5 9 19 19v1l6 6h1l6 6v1l43 43v1l4 4 2 4v2l1 1v9l-1 1v2l-2 4-26 26v1l-6 6-2 1v1l-143 145v1l-45 45v1l-8 7v1l-34 34v1l-2 2h-1l-14 14v1l-45 45v1l-43 43v1l-14 13v1l-28 28v1l-4 4h-1l-14 14v1l-30 30v1l-2 2v2l-2 4v268l1 1v2l2 4 9 8 6 1 1 1h4l1-1h4l4-3h1l145-147v-1l52-52v-1l50-50v-1l44-44v-1l8-7v-1l34-34v-1l2-2h1l13-13v-1l28-28v-1l2-1 16-16v-1l43-43v-1l14-13v-1l28-28v-1l4-4h1l14-14v-1l43-43v-1l8-8h1l2-2v-1l31-31v-1l19-18v-1l29-29v-1l2-2h1l11-11v-1l5-5v-1l6-6v-1l3-3 3-6 4-5 2-5 2-2 4-8v-2l4-7v-2l2-3 1-6 1-1 1-6 1-1v-3l1-1v-3l1-1 1-12 1-1v-9l1-1v-22l-1-1v-10l-1-1-1-11-1-1v-3l-1-1-1-7-1-1-1-6-2-3-1-5-5-9v-2l-2-4-2-2-4-9-2-2-4-7-8-9v-1l-8-8v-1h-1l-21-21v-1l-50-50v-1l-43-43v-1h-1l-4-4v-1l-37-37v-1l-2-1-9-9v-1l-49-49v-1l-43-43v-1l-10-9ZM1010 39h-34l-1 1h-7l-1 1h-4l-1 1h-4l-1 1h-3l-1 1-7 1-1 1-5 1-3 2h-2l-3 2h-2l-4 3h-2l-6 3-2 2-3 1-2 2-8 4-3 3h-1l-3 3h-1l-8 8h-1l-17 17v1l-18 17v1l-43 43v1l-42 42v1l-19 18v1l-31 31v1l-2 1-10 10v1l-42 42v1l-12 12h-1l-4 4v1l-31 31v1l-14 13v1l-87 88v1l-12 12h-1l-4 4v1l-3 3v306l3 3h7l2-1 9-9v-1l43-43v-1l14-13v-1l28-28v-1l19-18v-1l43-43v-1l42-42v-1l19-18v-1l30-30v-1l14-13v-1l42-42v-1l14-14h1v-1l21-21 8-4h8l1 1h2l4 2 5 4v1l3 3v2l2 4v1191l-1 1v2l-2 4-4 5-10 5h-7l-1-1h-3l-4-3h-1l-14-14v-1l-8-8h-1l-5-5v-1l-42-42v-1l-46-46v-1l-13-13h-1l-3-3v-1l-86-87v-1l-49-49v-1l-102-103v-1l-51-51v-1l-47-47v-1l-5-4v-1l-37-37v-1l-3-3h-1l-9-9v-1l-49-49v-1l-13-13-2-4v-2l-1-1v-9l1-1v-2l2-4 5-5v-1l2-2h1l11-11v-1l28-28v-1l2-2h1l33-34 4-8v-2l2-4v-5l1-1V668l-1-1v-3l-2-4-3-3h-1l-4-3h-3l-1-1h-4l-1 1h-4l-2 1-52 52v1l-50 50v1l-52 52v1l-49 49v1l-80 81v1l-11 13v1l-6 8-10 20-1 5-3 5v2l-1 1v2l-2 4v3l-1 1v3l-1 1v3l-1 1v5l-1 1v5l-1 1v9l-1 1v25l1 1v8l1 1v6l1 1 1 9 1 1v3l2 4v3l1 1 1 5 3 5v2l3 5v2l7 14 4 5 3 6 4 4v1l3 3v1l6 6v1l22 22v1l17 16v1l30 30v1l15 14v1l42 42v1l12 12h1l3 3v1l29 29v1l18 17v1l85 86v1l19 18v1l85 86v1l16 16h1l2 2v1l27 27v1l13 13h1l2 2v1l35 35v1l7 6v1l146 148v1l51 51v1l51 51v1l45 45v1l6 5v1l36 36v1l3 3h1l12 12v1l18 17h1l3 3h1l11 8 14 7h93l3-2h2l12-6 2-2h1l2-2 7-4 8-7h1l13-13v-1l4-4v-1l8-10 1-3 2-2 6-12v-2l2-3v-2l1-1v-2l1-1v-2l2-4 1-8 1-1v-4l1-1 1-13 1-1V445l1-1v-2l2-4 7-7 4-2h3l1-1h5l1 1h3l4 2 48 48v1l42 42v1l12 11v1l32 32v1l3 3h1l15 15v1l42 42v1l7 7 2 1v1l33 33v1l16 15v1l31 31v1l3 3h1l11 11v1l42 42v1l10 10 4 1 1 1h3l1-1 4-1 3-5V487l-1-1v-2l-26-26v-1l-12-11v-1l-31-31v-1l-19-18v-1l-85-86v-1l-18-17v-1l-28-28v-1l-16-15v-1l-42-42v-1l-14-14-2-1v-1l-29-29v-1l-17-16v-1l-33-33v-1l-9-8v-1l-15-15h-1l-12-11h-1l-8-6-12-6-2-2-4-1-4-3h-2l-3-2h-2l-6-3h-3l-4-2h-3l-1-1h-3l-1-1h-4l-1-1h-4l-1-1h-7Z" />
          </svg>
        </div>
      </div>
      {showText && (
        <div className={styles.textWrapper}>
          <span className={styles.brandTitle}>Bimal Institute</span>
          <span className={styles.brandSubtitle}>& Trading Platform</span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
