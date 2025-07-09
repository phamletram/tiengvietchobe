import React, { createContext, useContext } from 'react';
import { ArrowLeft, PanelLeftOpen, PanelLeftClose, Maximize, Minimize } from 'lucide-react';
import PropTypes from 'prop-types';

export const FullscreenContext = createContext();
export const useFullscreen = () => useContext(FullscreenContext);

const Header = ({ title, showMenu, onMenuToggle, onBack }) => {
  const { isFullscreen, setIsFullscreen } = useFullscreen() || {};
  if (isFullscreen) {
    return (
      <header className="fixed top-0 left-0 right-0 w-full flex items-center h-14 px-2 z-70 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 shadow-md">
        <button
          className="ml-auto p-2 rounded-full hover:bg-pink-200 transition absolute top-2 right-2"
          onClick={() => setIsFullscreen && setIsFullscreen(false)}
          aria-label="Thoát toàn màn hình"
        >
          <Minimize className="w-6 h-6 text-white" />
        </button>
      </header>
    );
  }
  return (
    <header className="fixed top-0 left-0 right-0 w-full flex items-center h-14 px-2 z-30 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 shadow-md">
      {onBack && (
        <button
          className="p-2 mr-1 rounded-full hover:bg-pink-200 transition"
          onClick={onBack}
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      )}
      <button
        className="p-2 hover:bg-pink-200 transition"
        onClick={onMenuToggle}
        aria-label={showMenu ? "Đóng menu" : "Mở menu"}
      >
        {showMenu ? (
          <PanelLeftClose className="w-7 h-7 text-white" />
        ) : (
          <PanelLeftOpen className="w-7 h-7 text-white" />
        )}
      </button>
      <h1 className="text-base sm:text-xl md:text-2xl md:text-3xl font-extrabold drop-shadow-lg leading-tight ml-2 text-white flex-1" style={{fontFamily:'Baloo 2, Arial, sans-serif'}}>
        {title}
      </h1>
      <div className='absolute left-0 bottom-0 w-full h-[2px] pointer-events-none'>
        <div className='w-full h-full rounded-full' style={{background: 'linear-gradient(90deg, #c084fc 0%, #fbcfe8 50%, #a21caf 100%)', opacity: 0.7}}></div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.node,
  showMenu: PropTypes.bool,
  onMenuToggle: PropTypes.func,
  onBack: PropTypes.func,
};

export default Header; 