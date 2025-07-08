// components/MainScreen.js
import React, { useRef, useEffect } from 'react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import PropTypes from 'prop-types';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';

const MainScreen = ({ score, setGameState }) => {
  const containerRef = useRef(null);
  const { showMenu, setShowMenu } = useResponsiveMenu();
  const { isFullscreen, setIsFullscreen } = useFullscreen() || {};

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // Responsive: cập nhật kích thước SVG khi resize
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        // Đảm bảo svgSize.height không vượt quá 60% viewport để tổng thể không vượt 100vh
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const onMenuClick = (menuKey) => handleMenuClick(menuKey, setShowMenu, setGameState);

  return (
    <div className={`min-h-screen flex flex-col font-inter relative overflow-x-hidden ${!isMobile ? 'overflow-y-hidden' : ''}`}
      style={{height: '100vh', maxHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      {!isFullscreen && (
        <Header 
          title="Học Tiếng Việt"
          showMenu={showMenu}
          onMenuToggle={() => setShowMenu(show => !show)}
        />
      )}
      {!isFullscreen && (
        <Menu 
          showMenu={showMenu}
          onMenuClick={onMenuClick}
        />
      )}
      <main className={`transition-all duration-300 flex-1 flex flex-col items-center justify-center min-h-0 w-full ${showMenu && !isFullscreen ? 'pl-56 scale-90 translate-x-10' : ''} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
        style={{willChange: 'transform', height: isFullscreen ? '100vh' : undefined, marginTop: isFullscreen ? 0 : undefined}}>
        {isFullscreen && setIsFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Thoát toàn màn hình"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 16v4h-4M4 16v4h4M20 8V4h-4" /></svg>
          </button>
        )}
        <div ref={containerRef} className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center flex-1 min-h-0">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="bg-white bg-opacity-80 rounded-xl shadow-lg px-8 py-6 mt-10">
              <h2 className="text-2xl font-bold text-pink-600 mb-2" style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}>Lịch sử học</h2>
              <div className="text-blue-700 text-lg opacity-80">(Chưa có dữ liệu lịch sử. Tính năng này sẽ cập nhật sau!)</div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer đã tự động ẩn khi fullscreen nhờ context */}
      <Footer score={score} isFullscreen={isFullscreen} />
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          20% { transform: rotate(8deg); }
          40% { transform: rotate(-6deg); }
          60% { transform: rotate(6deg); }
          80% { transform: rotate(-4deg); }
        }
        .group-hover\\:animate-wiggle:hover { animation: wiggle 0.7s ease-in-out; }
      `}</style>
    </div>
  );
};

MainScreen.propTypes = {
  score: PropTypes.number,
  setGameState: PropTypes.func,
};

export default MainScreen;