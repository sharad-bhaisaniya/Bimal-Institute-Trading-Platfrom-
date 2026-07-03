import React from 'react';
import { motion } from 'framer-motion';

const styles = {
  backgroundBubbles: {
    position: 'fixed', // Use fixed so it covers the whole screen
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
    pointerEvents: 'none'
  },
  bubble: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(70px)',
    opacity: 0.35,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(5, 5, 8, 0.75)', /* Dark overlay */
    zIndex: 1,
    pointerEvents: 'none'
  }
};

const BackgroundBubbles = ({ withOverlay = false }) => {
  const bubbles = [
    { color: '#9dff00', size: 400, top: '10%', left: '-10%', delay: 0 },
    { color: '#7acc00', size: 350, top: '60%', left: '80%', delay: 2 },
    { color: '#a7f3d0', size: 300, top: '80%', left: '20%', delay: 4 },
    { color: '#047857', size: 450, top: '-10%', left: '60%', delay: 1 },
    { color: '#3b82f6', size: 250, top: '40%', left: '40%', delay: 3 },
  ];

  return (
    <>
      <div style={styles.backgroundBubbles}>
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            style={{
              ...styles.bubble,
              backgroundColor: b.color,
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
            }}
            animate={{
              y: [0, -40, 0, 30, 0],
              x: [0, 30, 0, -30, 0],
              scale: [1, 1.15, 1, 0.85, 1],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: b.delay,
            }}
          />
        ))}
      </div>
      {withOverlay && <div style={styles.overlay} />}
    </>
  );
};

export default BackgroundBubbles;
