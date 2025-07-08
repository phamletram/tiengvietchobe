// components/CompleteScreen.js
import React from 'react';
import { Star } from 'lucide-react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';

const CompleteScreen = ({
  currentLesson,
  score,
  lessons,
  setCurrentWord,
  setGameState,
  resetGame,
  isFullscreen,
  setIsFullscreen
}) => {
  const { showMenu, setShowMenu } = useResponsiveMenu();
  const { isFullscreen: headerIsFullscreen, setIsFullscreen: setHeaderIsFullscreen } = useFullscreen() || {};
  
  const onMenuClick = (menuKey) => handleMenuClick(menuKey, setShowMenu, setGameState);

  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header
        title="Hoàn thành bài học"
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(show => !show)}
      />
      {!headerIsFullscreen && (
        <Menu 
          showMenu={showMenu}
          onMenuClick={onMenuClick}
        />
      )}
      <main className={`transition-all duration-300 flex flex-col items-center justify-center w-full ${showMenu && !headerIsFullscreen ? 'pl-44' : ''} ${headerIsFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
        style={{willChange: 'transform', height: headerIsFullscreen ? '100vh' : 'calc(100vh - 56px - 32px)', marginTop: headerIsFullscreen ? 0 : '56px', paddingTop: headerIsFullscreen ? 0 : '20px', paddingBottom: headerIsFullscreen ? 0 : '20px'}}>
        {headerIsFullscreen && setIsFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Thoát toàn màn hình"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 16v4h-4M4 16v4h4M20 8V4h-4" /></svg>
          </button>
        )}
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-4xl">
          <div className="bg-white rounded-3xl p-8 sm:p-5 shadow-2xl max-w-lg w-full text-center transform transition-transform duration-300 ease-in-out hover:scale-[1.01]">
            <div className="text-8xl mb-6 animate-spin-slow">🏆</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Hoàn thành!</h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Bạn đã hoàn thành bài học "<span className="text-indigo-600 font-semibold">{lessons[currentLesson].title}</span>"
            </p>
            
            <div className="bg-yellow-100 rounded-2xl p-6 mb-8 border-2 border-yellow-200 shadow-inner">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-9 h-9 text-yellow-500 mr-3 animate-pulse" />
                <span className="text-4xl font-extrabold text-yellow-700">{score}</span>
              </div>
              <p className="text-gray-700 text-lg font-medium">Điểm số của bạn</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setCurrentWord(0);
                  setGameState('lesson');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
              >
                Học lại
              </button>
              
              <button
                onClick={() => {
                  //setCurrentLesson(0);
                  setGameState('topic');
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-3 text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
              >
                Chọn bài khác
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompleteScreen;