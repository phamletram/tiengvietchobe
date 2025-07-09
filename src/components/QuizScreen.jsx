// components/QuizScreen.js
import React from 'react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import QuizContent from './QuizContent.jsx';
import Footer from './Footer.jsx';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';
import { useTranslation } from 'react-i18next';

const QuizScreen = ({
  currentLesson,
  currentWord,
  score,
  lives,
  lessons,
  setGameState,
  generateQuizOptions,
  handleQuizAnswer,
  selectedAnswer,
  showResult,
  isFullscreen,
  setIsFullscreen,
  resetGame
}) => {
  const { t, i18n } = useTranslation();
  const { showMenu, setShowMenu } = useResponsiveMenu();
  const { isFullscreen: headerIsFullscreen, setIsFullscreen: headerSetIsFullscreen } = useFullscreen() || {};
  const totalWords = lessons[currentLesson].words.length;
  const word = currentWord < totalWords ? lessons[currentLesson].words[currentWord] : null;
  const options = word ? generateQuizOptions(word) : [];
  let lessonTitle = lessons[currentLesson].title;
  if (i18n.language === 'en') lessonTitle = lessons[currentLesson].title_en;
  if (i18n.language === 'ja') lessonTitle = lessons[currentLesson].title_ja;
  
  const onMenuClick = (menuKey) => handleMenuClick(menuKey, setShowMenu, setGameState);
  
  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header
        title={`${t('quiz.title')} - ${lessonTitle}`}
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
        {headerIsFullscreen && headerSetIsFullscreen && (
          <button
            onClick={() => headerSetIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Thoát toàn màn hình"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 16v4h-4M4 16v4h4M20 8V4h-4" /></svg>
          </button>
        )}
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 w-full max-w-4xl">
          
            <QuizContent
              word={word}
              options={options}
              currentWord={currentWord}
              totalWords={totalWords}
              handleQuizAnswer={handleQuizAnswer}
              selectedAnswer={selectedAnswer}
              showResult={showResult}
              lives={lives}
              resetGame={resetGame}
            />
          
        </div>
      </main>
      {/* Footer đã tự động ẩn khi fullscreen nhờ context */}
      <Footer score={score} />
    </div>
  );
};

export default QuizScreen;