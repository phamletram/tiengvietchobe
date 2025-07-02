import React from 'react';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

const Header = ({ 
  title, 
  showMenu, 
  onMenuToggle 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full flex items-center h-14 px-2 z-20 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 shadow-md">
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
      <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-lg leading-tight ml-2 text-white" style={{fontFamily:'\"Baloo 2\", Arial, sans-serif'}}>
        {title}
      </h1>
      <div className='absolute left-0 bottom-0 w-full h-[2px] pointer-events-none'>
        <div className='w-full h-full rounded-full' style={{background: 'linear-gradient(90deg, #c084fc 0%, #fbcfe8 50%, #a21caf 100%)', opacity: 0.7}}></div>
      </div>
    </header>
  );
};

export default Header; 