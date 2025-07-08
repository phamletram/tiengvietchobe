// components/LessonScreen.js
import React from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import WordCard from './WordCard.jsx';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';

const LessonScreen = ({
  currentLesson,
  currentWord,
  score,
  lessons,
  setCurrentWord,
  setGameState,
  setLives,
  playSound,
  isFullscreen,
  setIsFullscreen
}) => {
  const { showMenu, setShowMenu } = useResponsiveMenu();
  const { isFullscreen: headerIsFullscreen, setIsFullscreen: setHeaderIsFullscreen } = useFullscreen() || {};
  const word = lessons[currentLesson].words[currentWord];
  
  const onMenuClick = (menuKey) => handleMenuClick(menuKey, setShowMenu, setGameState);
  
  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header
        title={lessons[currentLesson].title}
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(show => !show)}
      />
      {!headerIsFullscreen && (
        <Menu 
          showMenu={showMenu}
          onMenuClick={onMenuClick}
        />
      )}
      <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full ${showMenu && !headerIsFullscreen ? 'pl-44' : ''} ${headerIsFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
        style={{willChange: 'transform', height: headerIsFullscreen ? '100vh' : 'calc(100vh - 56px - 32px)', marginTop: headerIsFullscreen ? 0 : '56px'}}>
        {headerIsFullscreen && setHeaderIsFullscreen && (
          <button
            onClick={() => setHeaderIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Thoát toàn màn hình"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 16v4h-4M4 16v4h4M20 8V4h-4" /></svg>
          </button>
        )}
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 w-full max-w-4xl">
          <WordCard
            word={word}
            onPlaySound={() => playSound(word.vietnamese)}
          />
          
          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-6 w-full max-w-lg">
            <button
              onClick={() => setCurrentWord(Math.max(0, currentWord - 1))}
              disabled={currentWord === 0}
              className="flex items-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-5 py-3 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-95 text-gray-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Trước
            </button>
            
            <span className="text-gray-700 text-lg font-medium bg-white bg-opacity-80 rounded-full px-4 py-2 shadow-md">
              {currentWord + 1} / {lessons[currentLesson].words.length}
            </span>
            
            {currentWord < lessons[currentLesson].words.length - 1 ? (
              <button
                onClick={() => setCurrentWord(currentWord + 1)}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-3 transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 font-semibold"
              >
                Tiếp
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentWord(0);
                  setGameState('quiz');
                  setLives(3);
                }}
                className="flex items-center bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-3 transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-95 font-semibold"
              >
                Kiểm tra
                <Star className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </main>
      {/* Footer đã tự động ẩn khi fullscreen nhờ context */}
    </div>
  );
};

export default LessonScreen;