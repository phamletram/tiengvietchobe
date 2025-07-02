import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive menu behavior
 * @param {boolean} showByDefaultOnDesktop - Whether to show menu by default on desktop
 * @returns {Object} { showMenu, setShowMenu }
 */
export const useResponsiveMenu = (showByDefaultOnDesktop = false) => {
  const [showMenu, setShowMenu] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      if (isDesktop) {
        setShowMenu(showByDefaultOnDesktop);
      } else {
        setShowMenu(false);
      }
    };
    // Check on mount
    checkScreenSize();
    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [showByDefaultOnDesktop]);
  
  return { showMenu, setShowMenu };
}; 