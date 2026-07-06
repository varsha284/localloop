import React from 'react';
import * as FM from 'framer-motion';
const motion = FM; // alias for existing JSX usage
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDarkMode ? 180 : 0,
          scale: isDarkMode ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        🌙
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: isDarkMode ? 0 : -180,
          scale: isDarkMode ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ☀️
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
