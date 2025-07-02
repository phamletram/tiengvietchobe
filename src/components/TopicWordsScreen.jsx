// components/TopicWordsScreen.js
import React from 'react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';

const TopicWordsScreen = ({ 
  lessons, 
  score, 
  setCurrentLesson, 
  setGameState 
}) => {
  const { showMenu, setShowMenu } = useResponsiveMenu(true);
  
  const onMenuClick = (menuKey) => handleMenuClick(menuKey, setShowMenu, setGameState);
  
  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header 
        title="Học từ vựng theo chủ đề"
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(show => !show)}
      />
      <Menu 
        showMenu={showMenu}
        onMenuClick={onMenuClick}
      />
      {/* Main content */}
      <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full overflow-y-auto ${showMenu ? 'pl-44' : ''}`} style={{willChange: 'transform', height: 'calc(100vh - 56px - 32px)', marginTop: '56px'}}>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full p-6 sm:p-8">
          {lessons.map((lesson, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentLesson(index);
                setGameState('lesson');
              }}
              className="group bg-white rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 text-center group-hover:animate-bounce-y">{lesson.icon}</div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 text-center mb-1">{lesson.title}</h3>
              <p className="text-gray-600 text-center text-xs sm:text-sm">{lesson.words.length} từ vựng</p>
            </button>
          ))}
        </div>
      </main>
      <Footer score={score} />
    </div>
  );
};

export default TopicWordsScreen;