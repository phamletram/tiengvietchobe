/**
 * Common menu click handler for all screen components
 * @param {string} menuKey - The menu item key that was clicked
 * @param {Function} setShowMenu - Function to close the menu
 * @param {Function} setGameState - Function to change game state
 */
export const handleMenuClick = (menuKey, setShowMenu, setGameState) => {
  if (menuKey === 'home' && typeof setGameState === 'function') {
    setShowMenu(false);
    setGameState('main');
  } else if (menuKey === 'topic' && typeof setGameState === 'function') {
    setShowMenu(false);
    setGameState('topic');
  } else if (menuKey === 'flipgame' && typeof setGameState === 'function') {
    setShowMenu(false);
    setGameState('flipgame');
  } else if (menuKey === 'puzzlegame' && typeof setGameState === 'function') {
    setShowMenu(false);
    setGameState('puzzlegame');
  } else if (menuKey === 'alphabet' && typeof setGameState === 'function') {
    setShowMenu(false);
    setGameState('alphabet');
  } else if (menuKey === 'writing' && typeof setGameState === 'function') {
    setShowMenu(false);
    setGameState('writing');
  } 
}; 