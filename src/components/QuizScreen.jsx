// components/QuizScreen.js
import React from 'react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import QuizContent from './QuizContent.jsx';
import Footer from './Footer.jsx';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';

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
  showResult
}) => {
  const { showMenu, setShowMenu } = useResponsiveMenu();
  const word = lessons[currentLesson].words[currentWord];
  const options = generateQuizOptions(word);
  
  const onMenuClick = (menuKey) => handleMenuClick(menuKey, setShowMenu, setGameState);
  
  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header 
        title={`Kiểm tra - ${lessons[currentLesson].title}`}
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(show => !show)}
      />

      <Menu 
        showMenu={showMenu}
        onMenuClick={onMenuClick}
      />

      {/* Main content */}
      <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full overflow-y-auto ${showMenu ? 'pl-44' : ''}`} style={{willChange: 'transform', height: 'calc(100vh - 56px - 32px)', marginTop: '56px'}}>
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 w-full max-w-4xl">
          <QuizContent
            word={word}
            options={options}
            currentWord={currentWord}
            totalWords={lessons[currentLesson].words.length}
            handleQuizAnswer={handleQuizAnswer}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
          />
        </div>
      </main>

      <Footer score={score} lives={lives} />
    </div>
  );
};

export default QuizScreen;