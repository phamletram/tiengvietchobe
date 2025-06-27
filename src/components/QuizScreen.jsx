// components/QuizScreen.js
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import HeaderBar from './HeaderBar.jsx';
import QuizContent from './QuizContent.jsx';

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
  const word = lessons[currentLesson].words[currentWord];
  const options = generateQuizOptions(word);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 font-inter">
      <HeaderBar
        title={`Kiểm tra - ${lessons[currentLesson].title}`}
        score={score}
        lives={lives}
        onHomeClick={() => setGameState('lesson')}
        homeIcon={ArrowLeft}
        homeText="Học lại"
      />

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
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
    </div>
  );
};

export default QuizScreen;